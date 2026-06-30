
import { NextResponse } from 'next/server';
import crypto from 'node:crypto';
import fs from 'fs';
import path from 'path';
import { trackCourseEvent, incrementFunnel } from '@/lib/analytics';
import { buildCourseRecommendation, canHandleLocally, localEngine } from '@/lib/localEngine';
import {
  checkAriaRateLimit,
  getApprovedAriaInsights,
  recordAriaQuestion,
  saveAriaInsight,
} from '@/lib/ariaStore';
import { rateLimit, requestIp } from '@/lib/rateLimit';

const dbPath = path.join(process.cwd(), 'src', 'data', 'db.json');
const CLOUD_PROVIDER_TIMEOUT_MS = 8000;
const CLOUD_TOTAL_BUDGET_MS = 12000;

function loadDb() {
  return JSON.parse(fs.readFileSync(dbPath, 'utf8'));
}

function withTimeout(promise, timeoutMs, label) {
  let timeoutId;
  const timeout = new Promise((_, reject) => {
    timeoutId = setTimeout(() => reject(new Error(`${label} timed out after ${timeoutMs}ms`)), timeoutMs);
  });

  return Promise.race([promise, timeout]).finally(() => clearTimeout(timeoutId));
}

function humanHandoffResponse(db) {
  const phone = db.contact?.phone1 || '0113 582 008';
  return NextResponse.json({
    response_type: 'whatsapp_handoff',
    text: 'Choose how you would like to contact the Kinoo VTC admissions team.',
    contact: {
      phone,
      secondaryPhone: db.contact?.phone2 || '0748 455 116',
      email: db.contact?.email || 'kinoovtc@gmail.com',
      hours: db.contact?.hours || 'Monday-Friday, 8:00 AM-5:00 PM',
      whatsapp: phone,
    },
    provider: 'ARIA Verified Contact',
    timestamp: new Date().toISOString(),
  });
}

// ─── Analytics helpers (server-side, file-based) ──────────────────────────────

/**
 * Record a course interaction through the shared Supabase analytics layer.
 * eventType: 'view' | 'search' | 'apply_click' | 'whatsapp_click' | 'aria_mention' | 'aria_requirements' | 'aria_recommendation'
 */
function recordCourseEvent({ courseId, eventType }) {
  if (!courseId || !eventType) return;
  void trackCourseEvent(eventType, courseId);
}

/**
 * Detect which courses ARIA's response text mentions and track them.
 */
function trackMentionedCourses(text, courses) {
  if (!text || !courses?.length) return;
  const lower = text.toLowerCase();
  courses
    .filter(c => c.name && lower.includes(c.name.toLowerCase().split(' ')[0]))
    .forEach(c => {
      const courseId = c.tag || c.name;
      recordCourseEvent({ courseId, eventType: 'aria_mention' });
      // Also call the imported trackCourseEvent if it does additional work (e.g. DB writes)
      void trackCourseEvent('aria_recommendation', c.name);
    });
}

// ─── Search keyword → course mapping (for analytics tracking) ─────────────────
const SEARCH_KEYWORD_MAP = [
  { pattern: /\b(computer|ict|computing|typing|ms office)\b/i,              courseId: 'ict' },
  { pattern: /\b(electrical|wiring|electrician|electric|umeme)\b/i,         courseId: 'electrical' },
  { pattern: /\b(beauty|hair|salon|hairdress|nywele)\b/i,                   courseId: 'hairdressing' },
  { pattern: /\b(plumb|plumber|pipes|maji)\b/i,                             courseId: 'plumbing' },
  { pattern: /\b(fashion|design|tailoring|sewing|dressmaking|nguo)\b/i,     courseId: 'fashion' },
  { pattern: /\b(weld|fabricat|chuma)\b/i,                                  courseId: 'welding' },
  { pattern: /\b(mechan|garage|car repair|motor vehicle|gari)\b/i,          courseId: 'mechanics' },
  { pattern: /\b(bak|pastry|cake|mkate)\b/i,                                courseId: 'baking' },
  { pattern: /\b(solar|pv|renewable)\b/i,                                   courseId: 'solar' },
  { pattern: /\b(cctv|security|network|surveillance)\b/i,                   courseId: 'security' },
  { pattern: /\b(cna|caregiv|nursing|care)\b/i,                             courseId: 'cna' },
  { pattern: /\b(driv|ntsa|license|dereva)\b/i,                             courseId: 'driving' },
  { pattern: /\b(barist|coffee|café)\b/i,                                   courseId: 'barista' },
  { pattern: /\b(food|cater|beverage|cook|hotel|chef)\b/i,                  courseId: 'food' },
  { pattern: /\b(carpent|wood|furniture|mbao)\b/i,                          courseId: 'carpentry' },
  { pattern: /\b(mason|brick|build|construction|ujenzi)\b/i,                courseId: 'masonry' },
];

function trackSearchKeyword(message) {
  for (const { pattern, courseId } of SEARCH_KEYWORD_MAP) {
    if (pattern.test(message)) {
      const keyword = message.match(pattern)?.[0]?.toLowerCase();
      recordCourseEvent({ courseId, eventType: 'search', keyword });
      return courseId; // only track the strongest match
    }
  }
  return null;
}

function mentionedComparisonCourses(message, courses = []) {
  const normalized = message.toLowerCase();
  const matches = courses
    .map(course => {
      const name = String(course.name || '').toLowerCase();
      const importantWords = name
        .split(/\s+/)
        .filter(word => word.length >= 4 && !['and', 'with', 'classes'].includes(word));
      const exact = name && normalized.includes(name);
      const score = exact
        ? 100 + importantWords.length
        : importantWords.filter(word => normalized.includes(word)).length;
      return { course, score };
    })
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score || String(b.course.name).length - String(a.course.name).length);

  const selected = [];
  for (const match of matches) {
    if (!selected.some(course => course.name === match.course.name)) selected.push(match.course);
    if (selected.length === 2) break;
  }
  return selected;
}

function isAdviceStyleQuestion(message) {
  return /\b(should i|what should|recommend|choose|best course|suitable|my dad|my mum|my mom|my parent|my child|my son|my daughter|i like|i enjoy|i want|career|future|good at|interested in|sijui|hajui|hajajua|mtoto|afanye nini|kozi gani|achague nini)\b/i.test(message);
}

function asksForUnverifiedOfficialFact(message) {
  return /\b(do you have|does kvtc have|is there|are there|hostels?|swimming pool|sports team|uniform colour|uniform color|boarding|exact reporting|principal phone|staff salary)\b/i.test(message);
}

function asksForVerifiedFees(message) {
  return /\b(fees?|fee structure|tuition|cost|charges|how much|pay|payment instructions?|bank account)\b/i.test(message);
}

function answerMentionsUnsupportedCourse(answer) {
  return /\b(diploma|tourism|massage therapy|nursing|hotel management|business administration|bookkeeping|graphic design|web development|digital marketing|software engineering|accounting)\b/i.test(answer);
}

function answerMentionsUnsafeInstitutionFact(answer) {
  const text = String(answer || '');
  return /kinoovtc\.ac\.tz|P\.?\s*O\.?\s*Box\s*57397|located\s+in\s+Nairobi|heart\s+of\s+Nairobi|application\s+form\]\(https?:\/\//i.test(text);
}

function llmAnswerLooksGrounded(answer, db) {
  const text = String(answer || '').toLowerCase();
  const knownCourses = db.courses || [];
  const mentionsKnownCourse = knownCourses.some(course =>
    text.includes(String(course.name || '').toLowerCase())
  );
  const mentionsVerifiedInstitutionData =
    text.includes(String(db.contact?.phone1 || '').toLowerCase()) ||
    text.includes(String(db.contact?.phone2 || '').toLowerCase()) ||
    text.includes(String(db.contact?.email || '').toLowerCase()) ||
    text.includes('ksh 27,000') ||
    text.includes('ksh 9,000') ||
    text.includes('ksh 500') ||
    text.includes('county government of kiambu') ||
    text.includes('kinoo vocational training centre');

  return mentionsKnownCourse || mentionsVerifiedInstitutionData;
}

function shouldReplaceLlmAnswer({ message, answer, db, localResponseIsReliable }) {
  if (localResponseIsReliable) return false;

  const admitsUncertainty = /\b(not listed|not available in|not verified|cannot confirm|can't confirm|do not have verified|don't have verified|contact admissions|admissions team|call us|email us)\b/i.test(answer);
  if (admitsUncertainty) return false;

  if (asksForUnverifiedOfficialFact(message)) return true;

  if (isAdviceStyleQuestion(message)) {
    return false;
  }

  return !llmAnswerLooksGrounded(answer, db);
}

function shouldUseVerifiedLocalFirst(message, db) {
  const msg = String(message || '').trim().toLowerCase();
  const courses = db.courses || [];
  const mentionsCourse = courses.some(course => {
    const name = String(course.name || '').toLowerCase();
    return name && msg.includes(name);
  });
  const asksForAdvice =
    /\b(best|better|recommend|choose|should i|what should|job opportunities|career advice|suitable|compare)\b/i.test(msg);

  if (!msg) return true;
  if (/^(hi|hello|hey|habari|sasa|niaje|mambo|hujambo|good (morning|afternoon|evening)|thanks?|thank you|ok|okay|bye)\b/i.test(msg)) return true;
  if (/\b(who|what)\s+(is|are)\s+(kvtc|kinoo vtc|kinoo vocational training centre)\b/i.test(msg)) return true;
  if (/\b(who is|who's|who)\s+(the\s+)?(principal|head|deputy)\b/i.test(msg)) return true;
  if (/\b(are you ai|are you a bot|are you human|what are you)\b/i.test(msg)) return true;
  if (/\b(where are you|where is kvtc|location|located|directions?|address|campus|visit|contacts?|phone|email|whatsapp)\b/i.test(msg)) return true;
  if (mentionsCourse && !asksForAdvice) return true;

  return false;
}

function priorAssistantAskedForComparison(history = []) {
  const lastAssistant = [...history].reverse().find(item => item.role === 'assistant');
  const text = String(lastAssistant?.text || lastAssistant?.content || '').toLowerCase();
  return text.includes('which two') && text.includes('compare');
}

function priorAssistantOfferedApplication(history = []) {
  const lastAssistant = [...history].reverse().find(item => item.role === 'assistant');
  const text = String(lastAssistant?.text || lastAssistant?.content || '').toLowerCase();
  return text.includes('help starting an application') ||
    text.includes('would you like the requirements or help') ||
    text.includes('want to apply for this course') ||
    text.includes('shall i start the application');
}

function isAffirmative(message) {
  return /^(yes|yes please|yeah|yep|sure|ndio|sawa|okay|ok|start|start now|apply|apply now)$/i.test(String(message || '').trim());
}

// ─── Build comprehensive KVTC knowledge system prompt ─────────────────────────
function buildSystemPrompt(db, memoryStr) {
  const { intake, contact, feeStructure, courses = [] } = db;

  const courseList = courses.map(c => `
  • ${c.name} (${c.cert} | ${c.dur} | ${c.fees})
    Tag: ${c.tag}
    Careers: ${c.career?.join(', ')}
    Intake: ${c.intake}
    Requirements: ${c.requirements?.join('; ')}`
  ).join('\n');

  const admissionFees = (feeStructure?.admissionFees || []).map(f => `${f.item}: KSh ${f.amount}`).join('\n  - ');
  const termBreakdown = (feeStructure?.termBreakdown || []).map(t => `${t.label}: KSh ${t.amount}`).join(', ');
  const voteHeads     = (feeStructure?.termVoteHeads || []).map(v => `${v.head}: KSh ${v.perTerm}/term`).join(', ');

  return `You are ARIA — the virtual Admissions & Registration Intelligence Assistant for Kinoo Vocational Training Centre (Kinoo VTC).

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
YOUR PERSONALITY & VOICE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
You are a virtual assistant, not a human admissions officer. Be warm, enthusiastic, knowledgeable, and clear about your role when asked.

Your communication style:
- Greet people warmly and personally (e.g. "Hey! Welcome to Kinoo VTC 😊", "Hi there! Great to have you here!", "Hello! I'm so glad you reached out.")
- Use natural, conversational language — not robotic or stiff
- Show genuine excitement about the courses and the institution
- Use light, appropriate emojis to feel human (😊 ✅ 🎓 💪 👉)
- Ask follow-up questions to understand the student's situation
- Be encouraging — many students are anxious about their future
- Never claim to be a person or a member of staff.
- If asked what you are, say: "I'm ARIA, Kinoo VTC's virtual admissions assistant. I use verified institution information and can connect you with the admissions team when needed."
- Keep responses conversational, not too long — like a real chat
- End every response with a warm, clear next step or question

GREETING EXAMPLES (use variety, don't repeat):
- "Hey! 👋 Welcome to Kinoo VTC! I'm ARIA, your admissions guide. How can I help you today?"
- "Hi there! So glad you reached out 😊 I'm ARIA — I'm here to help you find the perfect course and guide you through joining Kinoo VTC. What's on your mind?"
- "Hello! Welcome! I'm ARIA from Kinoo VTC admissions 🎓 What would you like to know?"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
INSTITUTION INFORMATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Full Name: Kinoo Vocational Training Centre (Kinoo VTC)
Location: Kikuyu, Kiambu County, Kenya
Postal Address: P.O. Box 351-00902, Kikuyu
Phone: ${contact?.phone1} | ${contact?.phone2}
Email: ${contact?.email}
Office Hours: ${contact?.hours}
Type: Public TVET institution — fees are government-subsidised

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CURRENT INTAKE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Year: ${intake?.yearText}
Status: ${intake?.isOngoing ? `✅ OPEN — We are currently accepting applications for the ${intake?.currentTerm || 'next'} intake!` : '⛔ Closed — Not currently open. Contact us for the next intake date.'}
Standard Intakes: January, May, and September every year
Deadline: ${intake?.endDate || 'Contact admissions for details'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ONLINE APPLICATION PROCESS (VERY IMPORTANT — READ CAREFULLY)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Students can apply 100% ONLINE right here in this chat. The process is:
STEP 1: I (ARIA) collect their details through a short guided chat form (name, phone, ID number, next of kin name, next of kin phone, chosen course).
STEP 2: They are sent directly to the admission form which is already pre-filled with their details — saving a lot of time.
STEP 3: They pay the KSh 500 admission fee via M-PESA (STK push is sent to their phone).
STEP 4: They instantly receive their official Admission Letter by email/download.

Documents the applicant must have ready to BRING ON REPORTING DAY (NOT needed for the online form itself):
- Two (2) passport-size photos
- Copy of National ID or Birth Certificate (for ID number only — needed during online form)
- Photocopies (set)
- Three (3) foolscap papers
- Copy of previous academic result slip (KCPE/KCSE/equivalent — if any)
- Medical certificate (can be obtained at any clinic)
- Two (2) quire counter books
- Four (4) A4 exercise books

WHAT the online form asks (so ARIA can pre-fill it via the wizard):
1. Full Name
2. Phone Number
3. National ID or Birth Certificate Number
4. Date of Birth
5. Home Address
6. Residential Area
7. Next of Kin Name (parent/guardian)
8. Next of Kin ID Number
9. Next of Kin Phone Number
10. Relationship to Applicant
11. Chosen Course
12. Course Duration (auto-filled)
13. Exam Body / Certification (auto-filled)
14. Applicant Photo (uploaded on the form)
15. Signature (drawn on the form)

⚠️ KEY RULE: When a student asks "how do I apply?" or "I want to apply", DO NOT say "visit our website" or "come to campus". They ARE on the website. Tell them you can collect the details right here and open the pre-filled form for them.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FEES & PAYMENT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Annual Tuition (NITA/KNEC courses): KSh ${feeStructure?.annualTuition?.toLocaleString()} per year
Term Breakdown: ${termBreakdown}
Fee Vote Heads: ${voteHeads}

ONE-TIME REGISTRATION FEES (paid only when you first join — before or on reporting day):
  - ${admissionFees}
  - TOTAL REGISTRATION: KSh ${feeStructure?.admissionTotal}

PAYMENT BANKS:
⚠️ IMPORTANT — Two separate banks for different purposes:
1. TUITION/SCHOOL FEES → KCB Kikuyu Branch
   Account Name: Kinoo Vocational Training Centre
   Account Number: ${feeStructure?.bankKCB?.accountNumber}
   (Use this for Term 1, Term 2, Term 3 fee payments)

2. REGISTRATION FEES → Co-operative Bank, Kangemi Branch
   Account Name: Kinoo Vocational Training Centre
   Account Number: ${feeStructure?.bankCoop?.accountNumber}
   (Use this for the one-time admission/registration fees of KSh ${feeStructure?.admissionTotal})

Always bring the original bank deposit slip as proof of payment.

Other:
- Computer Packages (short course): KSh 4,800
- Part-Time Classes: KSh 4,500/term

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ADMISSION REQUIREMENTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- No strict minimum grades. Provide a copy of previous academic result slip (KCPE/KCSE/equivalent) IF ANY.
- National ID or Birth Certificate (copy)
- 2 recent passport-size photographs
- Completed application form (online or physically at the institution)
- KSh 500 application fee (via M-PESA online, or at Co-op Bank)
- No specific grades needed for short courses — open to everyone
- Minimum age: 16 years (18+ for Driving Classes)
- Each course has specific practical items the student must bring (tools, uniforms, etc.)

HOW TO APPLY (step by step):
1. Apply online via our website OR visit us physically at Kikuyu, Kiambu
2. Fill in the application form
3. Attach/upload copies of: National ID/Birth Certificate, previous result slip (if any), 2 passport photos
4. Pay KSh 500 application fee (via M-PESA online, or at Co-op Bank Kangemi A/C: ${feeStructure?.bankCoop?.accountNumber})
5. Receive your admission letter / await reporting date confirmation
6. On reporting day: bring Term 1 fees (KSh 9,000 to KCB Kikuyu A/C: ${feeStructure?.bankKCB?.accountNumber}) + all departmental requirements

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
COURSE GUIDANCE & RECOMMENDATIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Use only the careers, fees, durations, requirements, and certifications supplied in the course records above. Do not invent salary ranges, employment rates, demand rankings, graduate outcomes, international placement claims, or guaranteed earnings.

RECOMMENDATION RULES:
- If student likes hands-on/practical work → Electrical, Plumbing, Welding, Mechanics
- If student is creative → Fashion Design, Hair & Beauty, Baking
- If student is tech-minded → Computer Operator, Solar PV, Security Systems
- If a student prioritises self-employment, explain possible business paths listed in the course record without promising income.
- If a student asks about working abroad, explain that recognition and immigration requirements vary and refer them to admissions for verified guidance.
- If a student asks about employment, list relevant career paths without guaranteeing a job or timeframe.
- If student is not sure → ask about their interests first, then guide them
- Always mention the fee (KSh 27,000/year for most courses) and that it's government-subsidised and very affordable
- If the user writes in Swahili or Sheng, interpret the meaning naturally and answer in the same language or simple bilingual English/Swahili.
- For course advice, recommend ONLY courses listed in ALL COURSES above. Do not mention diploma programmes, tourism, massage therapy, nursing, hotel management, web development, digital marketing, bookkeeping, accounting, or any course/category that is not listed.
- If a parent says their child does not know what to study, respond warmly and ask 2-3 simple questions about interests, work setting, and goals. Use only the listed KVTC courses when giving examples.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ALL COURSES (${courses.length} programmes)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${courseList}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
RESPONSE RULES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- Respond warmly and naturally while remaining clear that ARIA is a virtual assistant.
- Keep responses SHORT and conversational (2–5 sentences for simple questions, more for complex ones)
- Always end with a question or a clear next step
- Use bullet points for lists, but keep them short
- If someone says hello/hi/habari — greet them warmly and ask how you can help
- If asked about anything outside Kinoo VTC, politely redirect to what you know
- ⛔ STRICT FALLBACK RULE: If a user asks a specific question about KVTC (e.g. "Do you have a rugby team?", "What is the exact uniform color?", "Are there hostels?") and the answer is NOT strictly found in the text above, DO NOT guess or invent information. You must say: "That's a great question! Let me connect you with our admissions team to give you the exact details — please call ${contact?.phone1} or email ${contact?.email} 😊"
- Never imply that ARIA is a human or a staff member.
- You may respond in Swahili if the user writes in Swahili, but keep institutional facts grounded in the supplied records.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
INSTITUTIONAL INSIGHTS (LEARNED MEMORY)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Here are anonymous patterns ARIA has learned from previous students:
${memoryStr || 'No insights yet.'}

Use approved insights only to understand common concerns and improve how you explain verified information. Never treat an insight as proof of an institutional fact, fee, requirement, outcome, or policy.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SYSTEM ACTIONS (IMPORTANT)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
You can trigger special actions by placing specific tags exactly as shown AT THE VERY END of your response.

1. LEARN
If you notice a recurring concern, confusion, or pattern from the user (e.g., "I'm worried about finding a job after plumbing", "I dropped out in Form 2"), you can add it to the institutional memory.
Rule: NEVER include names, phone numbers, or exact quotes. Make it a general, anonymous pattern.
Format: Append \`[LEARN: <insight>]\` to the end of your message.
Example: "It is understandable to think about career options. I can show the verified course record and connect you with admissions for current guidance. [LEARN: Students interested in plumbing often ask about career options after graduation.]"

You may use this tag if necessary, but keep it at the very end of your output text.`;
}

// ─── Provider: Puter.js (GPT-4o) ──────────────────────────────────────────────
// Get your token once from puter.com → Settings → API Token
// Add to .env.local: PUTER_API_TOKEN=your_token_here
import { init as puterInit } from '@heyputer/puter.js/src/init.cjs';

async function callPuter(systemPrompt, messages) {
  const token = process.env.PUTER_API_TOKEN;
  if (!token || token === 'your_puter_auth_token_here') throw new Error('Puter auth token not set');

  const formatted = messages.map(m => ({
    role: m.role === 'assistant' ? 'assistant' : 'user',
    content: m.content || m.text || ''
  }));

  const puter = puterInit(token);

  const response = await puter.ai.chat(
    formatted[formatted.length - 1]?.content || '',
    {
      model: 'gpt-4o',
      system: systemPrompt,
      messages: formatted.slice(0, -1).map(m => ({ role: m.role, content: m.content })),
    }
  );

  const text = (
    typeof response === 'string'
      ? response
      : response?.message?.content ?? response?.content ?? ''
  ).trim();

  if (!text) throw new Error('Puter returned empty content');
  return { provider: 'Puter (GPT-4o)', text };
}

// ─── Provider: OpenRouter ──────────────────────────────────────────────────────
async function callOpenRouter(systemPrompt, messages) {
  const openRouterKey = process.env.OPENROUTER_API_KEY;
  if (!openRouterKey || openRouterKey === 'your_openrouter_api_key_here') throw new Error('OpenRouter key not set');

  const formatted = messages.map(m => ({
    role: m.role === 'assistant' ? 'assistant' : 'user',
    content: m.content || m.text || ''
  }));

  const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${openRouterKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'https://kinoovtc.ac.ke',
      'X-Title': 'KVTC ARIA',
    },
    body: JSON.stringify({
      model: 'google/gemini-2.5-flash',
      messages: [{ role: 'system', content: systemPrompt }, ...formatted],
      max_tokens: 512,
      temperature: 0.6,
    }),
    signal: AbortSignal.timeout(15000),
  });

  if (!res.ok) throw new Error(`OpenRouter error: ${res.status}`);
  const data = await res.json();
  const text = data?.choices?.[0]?.message?.content;
  if (!text) throw new Error('No content from OpenRouter');
  return { provider: 'OpenRouter (Gemini 2.5 Flash)', text };
}

// ─── Provider: Gemini ──────────────────────────────────────────────────────────
async function callGemini(systemPrompt, messages) {
  const geminiKey = process.env.GEMINI_API_KEY;
  if (!geminiKey || geminiKey === 'your_gemini_api_key_here') throw new Error('Gemini key not set');

  const contents = messages.map(m => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content || m.text || '' }]
  }));

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: systemPrompt }] },
        contents,
        generationConfig: { maxOutputTokens: 512, temperature: 0.6 },
      }),
      signal: AbortSignal.timeout(15000),
    }
  );

  if (!res.ok) throw new Error(`Gemini error: ${res.status}`);
  const data = await res.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error('No content from Gemini');
  return { provider: 'Gemini 2.0 Flash', text };
}

// ─── Provider: Groq ────────────────────────────────────────────────────────────
// Provider: GitHub Models Phi
async function callGitHubModelsPhi(systemPrompt, messages) {
  const githubToken = process.env.GITHUB_MODELS_TOKEN || process.env.GITHUB_TOKEN;
  if (!githubToken || githubToken === 'your_github_models_token_here') {
    throw new Error('GitHub Models token not set');
  }

  const model = process.env.GITHUB_MODELS_PHI_MODEL || 'microsoft/Phi-4-mini-instruct';
  const formatted = messages.map(m => ({
    role: m.role === 'assistant' ? 'assistant' : 'user',
    content: m.content || m.text || ''
  }));

  const res = await fetch('https://models.github.ai/inference/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${githubToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      messages: [{ role: 'system', content: systemPrompt }, ...formatted],
      max_tokens: 512,
      temperature: 0.6,
    }),
    signal: AbortSignal.timeout(15000),
  });

  if (!res.ok) throw new Error(`GitHub Models Phi error: ${res.status}`);
  const data = await res.json();
  const text = data?.choices?.[0]?.message?.content?.trim();
  if (!text) throw new Error('No content from GitHub Models Phi');
  return { provider: `GitHub Models (${model})`, text };
}

async function callGroq(systemPrompt, messages) {
  const groqKey = process.env.GROQ_API_KEY;
  if (!groqKey || groqKey === 'your_groq_api_key_here') throw new Error('Groq key not set');

  const formatted = messages.map(m => ({
    role: m.role === 'assistant' ? 'assistant' : 'user',
    content: m.content || m.text || ''
  }));

  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${groqKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'system', content: systemPrompt }, ...formatted],
      max_tokens: 512,
      temperature: 0.6,
    }),
    signal: AbortSignal.timeout(15000),
  });

  if (!res.ok) throw new Error(`Groq error: ${res.status}`);
  const data = await res.json();
  const text = data?.choices?.[0]?.message?.content;
  if (!text) throw new Error('No content from Groq');
  return { provider: 'Groq (Llama 3.3)', text };
}

// ─── Provider: HuggingFace ─────────────────────────────────────────────────────
async function callHuggingFace(systemPrompt, messages) {
  const hfKey = process.env.HUGGINGFACE_API_KEY;
  if (!hfKey || hfKey === 'your_huggingface_api_key_here') throw new Error('HF key not set');

  const formatted = messages.map(m => ({
    role: m.role === 'assistant' ? 'assistant' : 'user',
    content: m.content || m.text || ''
  }));

  const HF_MODELS = [
    'mistralai/Mistral-7B-Instruct-v0.3',
    'HuggingFaceH4/zephyr-7b-beta',
    'microsoft/Phi-3-mini-4k-instruct',
    'Qwen/Qwen2.5-7B-Instruct',
    'TinyLlama/TinyLlama-1.1B-Chat-v1.0',
  ];

  for (const model of HF_MODELS) {
    try {
      const res = await fetch(
        `https://api-inference.huggingface.co/models/${model}/v1/chat/completions`,
        {
          method: 'POST',
          headers: { Authorization: `Bearer ${hfKey}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model,
            messages: [{ role: 'system', content: systemPrompt }, ...formatted],
            max_tokens: 512,
            temperature: 0.6,
            stream: false,
          }),
          signal: AbortSignal.timeout(25000),
        }
      );

      if (!res.ok) {
        console.warn(`HF model "${model}" HTTP ${res.status}`);
        continue;
      }

      const data = await res.json();
      const text = data?.choices?.[0]?.message?.content?.trim();
      if (!text) { console.warn(`HF model "${model}" empty content`); continue; }

      return { provider: `HuggingFace (${model.split('/')[1]})`, text };
    } catch (err) {
      console.warn(`HF model "${model}" fetch error: ${err.message}`);
    }
  }

  throw new Error('All HuggingFace models failed');
}

// ─── Main handler ──────────────────────────────────────────────────────────────
export async function POST(req) {
  try {
    const body = await req.json();
    const message = typeof body.message === 'string' ? body.message.trim() : '';
    const forceLocal = body.forceLocal === true;
    const history = Array.isArray(body.history)
      ? body.history.slice(-12).map(item => ({
          role: item?.role === 'assistant' ? 'assistant' : 'user',
          content: String(item?.content || item?.text || '').slice(0, 1200),
          text: String(item?.text || item?.content || '').slice(0, 1200),
        }))
      : [];

    if (!message || message.length > 600) {
      return NextResponse.json(
        { error: 'Please send a message between 1 and 600 characters.' },
        { status: 400 },
      );
    }

    const ip = requestIp(req);
    const rateKey = crypto
      .createHmac('sha256', process.env.ADMIN_SESSION_SECRET || 'kvtc-aria-rate-limit')
      .update(ip)
      .digest('hex');
    const distributedLimit = await checkAriaRateLimit(`chat:${rateKey}`, 20, 60);
    const localLimit = distributedLimit || rateLimit(`aria-chat:${ip}`, {
      limit: 20,
      windowMs: 60 * 1000,
    });

    if (!localLimit.allowed) {
      return NextResponse.json(
        {
          error: 'Too many messages. Please wait briefly before trying again.',
          retryAfter: localLimit.retryAfter,
        },
        {
          status: 429,
          headers: { 'Retry-After': String(localLimit.retryAfter || 60) },
        },
      );
    }

    // ── 1. Moderation ──────────────────────────────────────────────────────────
    const INAPPROPRIATE_PATTERNS = [
      /\b(sex|fuck|shit|bitch|asshole|dick|pussy|porn|nude|naked|politics|raila|ruto|uhuru)\b/i,
    ];
    if (INAPPROPRIATE_PATTERNS.some(p => p.test(message))) {
      return NextResponse.json({
        response_type: 'text',
        text: `I am an Admissions Guide for Kinoo VTC. I only assist with education, courses, and admissions. How can I help you with your studies today?`,
        provider: 'ARIA Guard',
        timestamp: new Date().toISOString(),
      });
    }

    // ── 2. Funnel tracking — count unique chat sessions ─────────────────────
    if (history.length === 0 && !forceLocal) {
      incrementFunnel('aria_chats').catch(() => {});
    }

    // ── 3. Track search keyword in this message ─────────────────────────────
    const trackedCourseId = trackSearchKeyword(message);

    // ── 4. Record the raw ARIA question ────────────────────────────────────
    await recordAriaQuestion({
      question: message,
      matchedCourse: trackedCourseId,
    });

    // ── 5. Apply intent — wizard (ready to apply) ───────────────────────────
    const READY_TO_APPLY_PATTERNS = [
      /^apply online/i,
      /^apply now/i,
      /\bi am ready to apply\b/i,
      /\bstart (my |an |the )?(application|admission|enrollment)\b/i,
      /\b(enroll|enrol|register) (me|now|online|here)\b/i,
      /\b(begin|start|complete) (my )?(application|admission|enrollment)\b/i,
      /\bapply (online|here|now|today)\b/i,
    ];

    if (READY_TO_APPLY_PATTERNS.some(p => p.test(message.trim()))) {
      recordCourseEvent({ courseId: 'general', eventType: 'apply_click' });
      return NextResponse.json({
        response_type: 'application_wizard',
        text: `I can help you start the application **right here**. 🎉\n\nI'll collect the main admission details first, then open your pre-filled official form. On the form you will attach your passport photo, draw your signature, review everything, and pay the **KSh 500** application fee via **M-PESA**.\n\nLet's go — answer the questions below 👇`,
        provider: 'ARIA',
        timestamp: new Date().toISOString(),
      });
    }

    // ── 6. Apply intent — guide (how to apply) ──────────────────────────────
    const HOW_TO_APPLY_PATTERNS = [
      /\bhow (do i|can i|to) (apply|enroll|enrol|register|join kinoo|join kvtc|get admitted)\b/i,
      /\bapplication process\b/i,
      /\bi('d| would) like to (apply|enroll|join|register)\b/i,
      /\bi want to (apply|enroll|enrol|register|join)\b/i,
    ];

    if (HOW_TO_APPLY_PATTERNS.some(p => p.test(message.trim()))) {
      return NextResponse.json({
        response_type: 'application_guide',
        text: `You can apply to Kinoo VTC either online in less than 3 minutes, or by visiting our campus in person. Here's how the online process works:`,
        provider: 'ARIA',
        timestamp: new Date().toISOString(),
      });
    }

    // ── 7. Human handoff intent ─────────────────────────────────────────────
    const HUMAN_PATTERNS = [
      /\b(talk|speak|chat)\s+(to|with)\s+(a\s+)?(human|person|agent|representative|real person|admissions)\b/i,
      /\b(i want|need)\s+(a\s+)?(human|real person|agent|representative)\b/i,
      /\b(con+ect|connect|link|join|put)\s+(me\s+)?(to|with)\s+(the\s+)?(team|office|admissions|staff|person|human)\b/i,
      /\b(con+ect|connect|link|join|put)\s+(me\s+)?(to|with)\s+(someone|somebody)\b/i,
      /\bwhatsapp(\s+(number|you|admissions|office))?\b/i,
      /\bcall\s+(you|someone|a human|human|admissions|the office)\b/i,
      /\b(speak to a human|contact admissions|admissions team|call somebody|talk to someone|human agent|call admissions)\b/i,
    ];

    if (HUMAN_PATTERNS.some(p => p.test(message.trim()))) {
      recordCourseEvent({ courseId: 'general', eventType: 'whatsapp_click' });
      return humanHandoffResponse(loadDb());
    }

    // ── 8. Load DB ──────────────────────────────────────────────────────────
    const db       = loadDb();
    const courseList = db.courses || [];

    if (asksForVerifiedFees(message)) {
      return NextResponse.json({
        response_type: 'fee_advisor',
        text: localEngine(message, db, history),
        provider: 'ARIA Verified Fees',
        timestamp: new Date().toISOString(),
      });
    }

    if (asksForUnverifiedOfficialFact(message)) {
      return NextResponse.json({
        response_type: 'text',
        text: `I don't have verified information confirming that in Kinoo VTC's current records. Please contact the admissions team on **${db.contact?.phone1 || '0113 582 008'}** or **${db.contact?.email || 'kinoovtc@gmail.com'}** for an official answer.`,
        provider: 'ARIA Verified Knowledge Guard',
        timestamp: new Date().toISOString(),
      });
    }

    if (isAffirmative(message) && priorAssistantOfferedApplication(history)) {
      return NextResponse.json({
        response_type: 'application_guide',
        text: `Absolutely. You have two clean ways to apply:\n\n**1. Apply online with ARIA** - I collect the details here, open the pre-filled form, then you pay the **KSh 500** application fee through M-PESA.\n\n**2. Apply in person** - visit the KVTC campus in Kikuyu during office hours and the admissions team will guide you.\n\nFor the fastest option, choose **Start Application Now** below and I will open the guided application flow.`,
        provider: 'ARIA Application Guide',
        timestamp: new Date().toISOString(),
      });
    }

    const comparisonCourses = mentionedComparisonCourses(message, courseList);
    if (comparisonCourses.length >= 2 && (
      priorAssistantAskedForComparison(history) ||
      /\b(compare|vs|versus|difference between|which is better)\b/i.test(message)
    )) {
      comparisonCourses.slice(0, 2).forEach(c =>
        recordCourseEvent({ courseId: c.tag || c.name, eventType: 'view' })
      );
      return NextResponse.json({
        response_type: 'course_comparison',
        text: `Here is a comparison between **${comparisonCourses[0].name}** and **${comparisonCourses[1].name}**:`,
        courses: [comparisonCourses[0], comparisonCourses[1]],
        provider: 'ARIA Course Comparison',
        timestamp: new Date().toISOString(),
      });
    }

    const recommendation = buildCourseRecommendation(message, db, history);
    if (recommendation) {
      recommendation.courses.forEach(course =>
        recordCourseEvent({ courseId: course.tag || course.name, eventType: 'aria_recommendation' })
      );
      return NextResponse.json({
        ...recommendation,
        provider: 'ARIA Decision Guide',
        timestamp: new Date().toISOString(),
      });
    }

    // ── 9. Course requirements intent ───────────────────────────────────────
    const REQUIREMENTS_PATTERNS = [
      /\b(requirements?|qualifications?|what do i need|what must i have|what's needed|needed to (join|apply|enroll|enrol)|criteria)\b/i,
      /\b(entry requirements?|admission requirements?)\b/i,
      /\bcan i (join|apply|enroll|enrol|do)\b/i,
    ];
    const COURSE_KEYWORDS = [
      'electrical','electronics','plumbing','welding','motor','vehicle','mechanics','hair','beauty','dressing',
      'food','beverage','production','computer','ict','carpentry','masonry','brickwork','garment','fashion',
      'design','cutting','tailoring','solar','pv','security','systems','cna','caregiver','nursing','baking',
      'pastry','barista','driving','building','construction','technology',
    ];

    const hasRequirementsIntent = REQUIREMENTS_PATTERNS.some(p => p.test(message.trim()));
    const mentionedKeyword      = COURSE_KEYWORDS.find(k => message.toLowerCase().includes(k));

    if (hasRequirementsIntent || (mentionedKeyword && /require|need|qualif|eligib|can i|must/i.test(message))) {
      const matchedCourse = mentionedKeyword
        ? courseList.find(c =>
            c.name.toLowerCase().includes(mentionedKeyword) ||
            mentionedKeyword.split(' ').some(w => c.name.toLowerCase().includes(w))
          )
        : null;

      if (matchedCourse) {
        const courseId = matchedCourse.tag || matchedCourse.name;
        recordCourseEvent({ courseId, eventType: 'view' });
        void trackCourseEvent('aria_requirements', matchedCourse.name);
        return NextResponse.json({
          response_type: 'course_requirements',
          text: `Here are the entry requirements for **${matchedCourse.name}** at Kinoo VTC:`,
          course: matchedCourse,
          provider: 'ARIA',
          timestamp: new Date().toISOString(),
        });
      }
    }

    // ── 10. Course comparison intent ────────────────────────────────────────
    const COMPARE_PATTERNS = [/\b(compare|vs|versus|difference between|which is better)\b/i];
    if (COMPARE_PATTERNS.some(p => p.test(message))) {
      const matchedCourses = comparisonCourses;
      if (matchedCourses.length >= 2) {
        matchedCourses.slice(0, 2).forEach(c =>
          recordCourseEvent({ courseId: c.tag || c.name, eventType: 'view' })
        );
        return NextResponse.json({
          response_type: 'course_comparison',
          text: `Here is a comparison between **${matchedCourses[0].name}** and **${matchedCourses[1].name}**:`,
          courses: [matchedCourses[0], matchedCourses[1]],
          provider: 'ARIA',
          timestamp: new Date().toISOString(),
        });
      }
    }

    // ── 11. Fee advisor intent ──────────────────────────────────────────────
    const FEE_PATTERNS = [
      /\bi have (only\s+)?(ksh|sh)?\s*(\d+[,.]?\d*)\b/i,
      /\b(i only have|my budget is|budget of)\s*(ksh|sh)?\s*(\d+[,.]?\d*)\b/i,
      /\bcan i pay in installments\b/i,
      /\bpayment plan\b/i,
    ];
    if (FEE_PATTERNS.some(p => p.test(message))) {
      const feeResponse = localEngine(message, db, history);
      const hasFeeAdvice = /\b(ksh|fee|tuition|payment|budget|admission charges)\b/i.test(feeResponse);

      return NextResponse.json({
        response_type: hasFeeAdvice ? 'fee_advisor' : 'text',
        text: feeResponse,
        provider: 'ARIA',
        timestamp: new Date().toISOString(),
      });
    }

    // ── 12. Intake alert intent ─────────────────────────────────────────────
    const INTAKE_ALERT_PATTERNS = [
      /\b(when is the next intake|notify me|alert me|september intake|january intake|may intake)\b/i,
    ];
    if (INTAKE_ALERT_PATTERNS.some(p => p.test(message))) {
      const intakeStatus = db.intake?.isOngoing
        ? `${db.intake.currentTerm || 'The current intake'} is open`
        : 'The current intake is closed';
      return NextResponse.json({
        response_type: 'intake_alert',
        text: `${intakeStatus}. The listed application deadline is **${db.intake?.endDate || 'available from admissions'}**. Contact admissions for the next confirmed intake date.`,
        provider: 'ARIA',
        timestamp: new Date().toISOString(),
      });
    }

    // ── 13. Parent mode modifier ────────────────────────────────────────────
    const isParent = /\b(my son|my daughter|my child|my kids)\b/i.test(message);
    const parentPromptModifier = isParent
      ? '\n\nPARENT MODE: The user is a parent inquiring for their child. Use a respectful, reassuring, and formal tone. Do not make unverified claims about safety, discipline, supervision, or graduate outcomes; refer the parent to admissions for current official information.'
      : '';

    // ── 14. Load institutional memory ──────────────────────────────────────
    const memoryArr = await getApprovedAriaInsights();
    const memoryStr = memoryArr.map((item, i) => `${i + 1}. ${item.insight}`).join('\n');

    const systemPrompt = buildSystemPrompt(db, memoryStr) + parentPromptModifier;

    // ── 15. Build full message history for LLM context ──────────────────────
    const allMessages = [
      ...history.map(m => ({
        role: m.role,
        content: m.role === 'user' ? (m.content || '') : (m.text || m.content || ''),
      })),
      { role: 'user', content: message },
    ];

    // ── 16. forceLocal bypass ───────────────────────────────────────────────
    const localResponseIsReliable = canHandleLocally(message, db, allMessages);
    const cloudResponsesDisabled = process.env.ARIA_DISABLE_CLOUD_RESPONSES === 'true';
    const useVerifiedLocalFirst = shouldUseVerifiedLocalFirst(message, db);
    if (forceLocal || useVerifiedLocalFirst || cloudResponsesDisabled) {
      console.log('ARIA: using verified local knowledge engine');
      return NextResponse.json({
        response_type: 'text',
        text: localEngine(message, db, allMessages),
        provider: 'ARIA Verified Knowledge',
        timestamp: new Date().toISOString(),
      });
    }

    // ── 17. Provider waterfall ──────────────────────────────────────────────
    // Order: best quality first → local engine as final safety net
    // Add/remove providers here — the waterfall handles all failures gracefully.
    let result = null;
    const errors = [];

    const cloudStartedAt = Date.now();
    for (const [name, fn] of [
      ['GitHub Models Phi', callGitHubModelsPhi],
      ['Groq',              callGroq],
      ['HuggingFace',       callHuggingFace],
      ['Gemini',            callGemini],
    ]) {
      const remainingBudget = CLOUD_TOTAL_BUDGET_MS - (Date.now() - cloudStartedAt);
      if (remainingBudget <= 0) {
        errors.push('Cloud provider budget exhausted');
        break;
      }

      try {
        result = await withTimeout(
          fn(systemPrompt, allMessages),
          Math.min(CLOUD_PROVIDER_TIMEOUT_MS, remainingBudget),
          name,
        );
        console.log(`ARIA: responded via ${result.provider}`);
        break;
      } catch (err) {
        console.warn(`ARIA: ${name} failed — ${err.message}`);
        errors.push(`${name}: ${err.message}`);
      }
    }

    // ── 18. Local engine safety net ─────────────────────────────────────────
    if (!result) {
      console.log('ARIA: All cloud providers failed — executing local intelligence engine');
      return NextResponse.json({
        response_type: 'text',
        text: localEngine(message, db, allMessages),
        provider: 'ARIA Local Intelligence',
        timestamp: new Date().toISOString(),
      });
    }

    // ── 19. Post-process LLM response ───────────────────────────────────────

    let finalResponseText = result.text;

    const hasUnverifiedOutcomeClaim =
      /ksh\s*\d[\d,]*\s*[–-]\s*\d[\d,]*\s*\/?\s*month/i.test(finalResponseText) ||
      /\b(guaranteed job|guaranteed employment|employment rate)\b/i.test(finalResponseText) ||
      /\b(find work|employed|start earning)\s+within\s+\d+\s+(days?|weeks?|months?)\b/i.test(finalResponseText) ||
      /\b(always in demand|great potential for employment|highly sought after|best job opportunities|high demand)\b/i.test(finalResponseText);

    if (hasUnverifiedOutcomeClaim) {
      console.warn(`ARIA: Replaced an unverified outcome claim from ${result.provider}`);
      finalResponseText = localEngine(message, db, allMessages);
      result = { ...result, provider: 'ARIA Verified Local Intelligence' };
    }

    if (answerMentionsUnsupportedCourse(finalResponseText)) {
      console.warn(`ARIA: Replaced unsupported course claims from ${result.provider}`);
      finalResponseText = localEngine(message, db, allMessages);
      result = { ...result, provider: 'ARIA Verified Course Catalogue' };
    }

    if (answerMentionsUnsafeInstitutionFact(finalResponseText)) {
      console.warn(`ARIA: Replaced unsafe institution/application claim from ${result.provider}`);
      finalResponseText = localEngine(message, db, allMessages);
      result = { ...result, provider: 'ARIA Verified Institution Facts' };
    }

    if (shouldReplaceLlmAnswer({
      message,
      answer: finalResponseText,
      db,
      localResponseIsReliable,
    })) {
      console.warn(`ARIA: Replaced an unsupported institutional answer from ${result.provider}`);
      if (localResponseIsReliable || asksForVerifiedFees(message)) {
        finalResponseText = localEngine(message, db, allMessages);
        result = { ...result, provider: 'ARIA Verified Local Intelligence' };
      } else {
        finalResponseText = `I don't have verified information confirming that in Kinoo VTC's current records. Please contact the admissions team on **${db.contact?.phone1 || '0113 582 008'}** or **${db.contact?.email || 'kinoovtc@gmail.com'}** for an official answer.`;
        result = { ...result, provider: 'ARIA Verified Knowledge Guard' };
      }
    }

    // New insights require review before they are used as institutional memory.
    const learnMatch = finalResponseText.match(/\[LEARN:\s*(.*?)\]/i);
    if (learnMatch) {
      const insight = learnMatch[1].trim();
      finalResponseText = finalResponseText.replace(learnMatch[0], '').trim();
      try {
        const saved = await saveAriaInsight(insight);
        if (!saved) throw new Error('Supabase insert failed');
        console.log(`ARIA: Submitted insight for review — "${insight}"`);
      } catch (e) {
        console.error('Failed to submit institutional insight:', e.message);
      }
    }

    // Track which courses the LLM mentioned in its response
    trackMentionedCourses(finalResponseText, courseList);

    // ── 20. Return final response ────────────────────────────────────────────
    return NextResponse.json({
      response_type: 'text',
      text: finalResponseText,
      provider: result.provider,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('ARIA API Error:', error);
    return NextResponse.json(
      {
        response_type: 'text',
        text: 'Something went wrong. Please try again or contact our admissions office directly.',
        provider: 'error',
      },
      { status: 500 }
    );
  }
}
