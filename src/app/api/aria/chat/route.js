import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const dbPath = path.join(process.cwd(), 'src', 'data', 'db.json');
const memoryPath = path.join(process.cwd(), 'src', 'data', 'aria_institutional_memory.json');
const leadsPath = path.join(process.cwd(), 'src', 'data', 'leads.json');

// ─── Build comprehensive KVTC knowledge system prompt ────────────────────────
function buildSystemPrompt(db, memoryStr) {
  const { intake, contact, feeStructure, courses = [], departments = [] } = db;

  const courseList = courses.map(c => `
  • ${c.name} (${c.cert} | ${c.dur} | ${c.fees})
    Tag: ${c.tag}
    Description: ${c.description}
    Careers: ${c.careers?.join(', ')}
    Intake: ${c.intake}
    Requirements: ${c.requirements?.join('; ')}`
  ).join('\n');

  const admissionFees = feeStructure?.admissionFees?.map(f => `${f.item}: KSh ${f.amount}`).join('\n  - ');
  const termBreakdown = feeStructure?.termBreakdown?.map(t => `${t.label}: KSh ${t.amount}`).join(', ');
  const voteHeads = feeStructure?.termVoteHeads?.map(v => `${v.head}: KSh ${v.perTerm}/term`).join(', ');

  return `You are ARIA — the Admissions & Registration Intelligence Assistant for Kinoo Vocational Training Centre (Kinoo VTC).

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
YOUR PERSONALITY & VOICE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
You are NOT an AI assistant. You are ARIA — a warm, enthusiastic, and knowledgeable human admissions officer at Kinoo VTC. You speak like a friendly person who genuinely cares about every student's future.

Your communication style:
- Greet people warmly and personally (e.g. "Hey! Welcome to Kinoo VTC 😊", "Hi there! Great to have you here!", "Hello! I'm so glad you reached out.")
- Use natural, conversational language — not robotic or stiff
- Show genuine excitement about the courses and the institution
- Use light, appropriate emojis to feel human (😊 ✅ 🎓 💪 👉)
- Ask follow-up questions to understand the student's situation
- Be encouraging — many students are anxious about their future
- Never say "As an AI..." or "I am a language model" — you are ARIA, a person
- If asked if you are AI, say: "I'm ARIA, your personal admissions guide at Kinoo VTC! Think of me as your go-to person for anything about joining us 😊"
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
Principal: Mr. James Kamau (20+ years in TVET education)
Deputy Principal: Mrs. Grace Wanjiru
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
- KCSE Certificate — minimum D plain or above (D- accepted for some courses)
- National ID or Birth Certificate (copy)
- KCSE certificate or results slip (copy)
- 2 recent passport-size photographs
- Completed application form
- KSh 500 application fee (paid at Co-op Bank Kangemi)
- No specific grades needed for short courses — open to everyone
- Minimum age: 16 years (18+ for Driving Classes)
- Each course has specific practical items the student must bring (tools, uniforms, etc.)

HOW TO APPLY (step by step):
1. Visit us at Kikuyu, Kiambu or apply online
2. Fill in the application form
3. Attach copies of: National ID, KCSE certificate, 2 passport photos
4. Pay KSh 500 application fee at Co-op Bank Kangemi (A/C: ${feeStructure?.bankCoop?.accountNumber})
5. Submit form + bank slip to our admissions office
6. Await your reporting date confirmation
7. On reporting day: bring Term 1 fees (KSh 9,000 to KCB Kikuyu A/C: ${feeStructure?.bankKCB?.accountNumber}) + all departmental requirements

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
COURSE MARKETABILITY & RECOMMENDATIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Use this when recommending courses. Match to student interests AND market demand:

🔥 HIGHEST DEMAND / BEST EARNING:
- Electrical & Electronics: Massive demand in Kenya's construction boom. Electricians earn KSh 30,000–80,000/month. Great for self-employment.
- Motor Vehicle Mechanics: Every car needs a mechanic. Self-employment potential is huge. Earn KSh 40,000–100,000/month running own garage.
- Plumbing: Construction sector is booming. Plumbers are always needed. KSh 30,000–70,000/month.
- Hair Dressing & Beauty Therapy: Fastest path to self-employment. Salon owners earn KSh 50,000–200,000/month. Low startup cost after training.
- Welding & Fabrication: High demand in manufacturing and construction. KSh 35,000–90,000/month. Great for entrepreneurship (own fabrication shop).

💻 TECH & DIGITAL (GROWING FAST):
- Computer Operator: Needed in every office in Kenya. Good for formal employment. KSh 25,000–50,000/month to start.
- Security & Network Systems: CCTV and smart security is booming. KSh 30,000–60,000/month. Quick 3-month course.
- Solar PV Installation: Kenya is going solar fast. Very high demand, especially in rural areas. KSh 30,000–60,000/month.

🍽️ HOSPITALITY & FOOD:
- Food & Beverage Production: Hotels, restaurants, catering are always hiring. Good for those who love cooking. Formal employment or self-employment.
- Barista: Kenya's coffee culture is booming — Nairobi has hundreds of new cafés. KSh 25,000–45,000/month in top cafés.
- Baking & Pastry: Home bakery business is very popular. Low investment, high returns. Great for women entrepreneurs.

👗 FASHION:
- Fashion Design & Dressmaking: Growing industry. Boutique owners earn well. Good for creative people.

🏥 CARE:
- CNA – Care Givers: High demand locally AND internationally (Middle East, Europe). Earn KSh 30,000–80,000/month locally, much more abroad.

🚗 OTHER:
- Driving Classes: NTSA-certified. Essential life skill. Opens up employment as driver, chauffeur, delivery, PSV with upgrade.

RECOMMENDATION RULES:
- If student likes hands-on/practical work → Electrical, Plumbing, Welding, Mechanics
- If student is creative → Fashion Design, Hair & Beauty, Baking
- If student is tech-minded → Computer Operator, Solar PV, Security Systems
- If student wants fastest self-employment → Hair & Beauty, Baking, Welding
- If student wants to work abroad → CNA Caregivers
- If student wants formal office employment → Computer Operator, Food & Beverage
- If student is not sure → ask about their interests first, then guide them
- Always mention the fee (KSh 27,000/year for most courses) and that it's government-subsidised and very affordable

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ALL COURSES (${courses.length} programmes)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${courseList}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
RESPONSE RULES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- Respond like a warm, helpful human — not like a bot
- Keep responses SHORT and conversational (2–5 sentences for simple questions, more for complex ones)
- Always end with a question or a clear next step
- Use bullet points for lists, but keep them short
- If someone says hello/hi/habari — greet them warmly and ask how you can help
- If asked about anything outside Kinoo VTC, politely redirect to what you know
- ⛔ STRICT FALLBACK RULE: If a user asks a specific question about KVTC (e.g. "Do you have a rugby team?", "What is the exact uniform color?", "Are there hostels?") and the answer is NOT strictly found in the text above, DO NOT guess or invent information. You must say: "That's a great question! Let me connect you with our admissions team to give you the exact details — please call ${contact?.phone1} or email ${contact?.email} 😊"
- Do NOT say "As an AI" or "I am a language model"
- You may respond in Swahili if the user writes in Swahili

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
INSTITUTIONAL INSIGHTS (LEARNED MEMORY)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Here are anonymous patterns ARIA has learned from previous students:
${memoryStr || 'No insights yet.'}

You should use these insights to give better advice. (e.g., if memory says "Students fear math in ICT", reassure them about the math if they ask about ICT).

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SYSTEM ACTIONS (IMPORTANT)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
You can trigger special actions by placing specific tags exactly as shown AT THE VERY END of your response.

1. LEARN
If you notice a recurring concern, confusion, or pattern from the user (e.g., "I'm worried about finding a job after plumbing", "I dropped out in Form 2"), you can add it to the institutional memory.
Rule: NEVER include names, phone numbers, or exact quotes. Make it a general, anonymous pattern.
Format: Append \`[LEARN: <insight>]\` to the end of your message.
Example: "It's completely normal to worry about jobs, but our plumbers are in high demand! [LEARN: Students interested in plumbing often worry about job security after graduation.]"

You may use this tag if necessary, but keep it at the very end of your output text.`;
}


// ─── Provider 1: Mixtral via HuggingFace ──────────────────────────────────────
async function callHuggingFace(systemPrompt, messages) {
  const hfKey = process.env.HUGGINGFACE_API_KEY;
  if (!hfKey || hfKey === 'your_huggingface_api_key_here') throw new Error('HF key not set');

  const formatted = messages.map(m => ({
    role: m.role === 'assistant' ? 'assistant' : 'user',
    content: m.content || m.text || ''
  }));

  const res = await fetch(
    'https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.3/v1/chat/completions',
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${hfKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'mistralai/Mistral-7B-Instruct-v0.3',
        messages: [{ role: 'system', content: systemPrompt }, ...formatted],
        max_tokens: 512,
        temperature: 0.6,
        stream: false
      }),
      signal: AbortSignal.timeout(20000)
    }
  );

  if (!res.ok) throw new Error(`HF error: ${res.status}`);
  const data = await res.json();
  const text = data?.choices?.[0]?.message?.content;
  if (!text) throw new Error('No content from HF');
  return { provider: 'Mistral (HuggingFace)', text };
}

// ─── Provider 2: Groq ─────────────────────────────────────────────────────────
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
      temperature: 0.6
    }),
    signal: AbortSignal.timeout(15000)
  });

  if (!res.ok) throw new Error(`Groq error: ${res.status}`);
  const data = await res.json();
  const text = data?.choices?.[0]?.message?.content;
  if (!text) throw new Error('No content from Groq');
  return { provider: 'Groq (Llama 3.3)', text };
}

// ─── Provider 3: Gemini ───────────────────────────────────────────────────────
async function callGemini(systemPrompt, messages) {
  const geminiKey = process.env.GEMINI_API_KEY;
  if (!geminiKey || geminiKey === 'your_gemini_api_key_here') throw new Error('Gemini key not set');

  // Convert history to Gemini format
  const contents = messages.map(m => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content || m.text || '' }]
  }));

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: systemPrompt }] },
        contents,
        generationConfig: { maxOutputTokens: 512, temperature: 0.6 }
      }),
      signal: AbortSignal.timeout(15000)
    }
  );

  if (!res.ok) throw new Error(`Gemini error: ${res.status}`);
  const data = await res.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error('No content from Gemini');
  return { provider: 'Gemini 1.5 Flash', text };
}

// ─── Main handler ─────────────────────────────────────────────────────────────
export async function POST(req) {
  try {
    const { message, history = [] } = await req.json();

    // ── 1. Moderation Interceptor ──
    const INAPPROPRIATE_PATTERNS = [
      /\b(sex|fuck|shit|bitch|asshole|dick|pussy|porn|nude|naked|politics|raila|ruto|uhuru)\b/i
    ];
    if (INAPPROPRIATE_PATTERNS.some(p => p.test(message))) {
      return NextResponse.json({
        response_type: 'text',
        text: `I am an Admissions Guide for Kinoo VTC. I only assist with education, courses, and admissions. How can I help you with your studies today?`,
        provider: 'ARIA Guard',
        timestamp: new Date().toISOString()
      });
    }

    // ── 2. Smart Apply Intent (Readiness vs Guide) ──
    const READY_TO_APPLY_PATTERNS = [
      /^apply online/i,
      /^apply now/i,
      /\bi am ready to apply\b/i,
      /\bstart (my |an |the )?(application|admission|enrollment)\b/i,
      /\b(enroll|enrol|register) (me|now|online|here)\b/i,
      /\b(begin|start|complete) (my )?(application|admission|enrollment)\b/i,
      /\bapply (online|here|now|today)\b/i,
    ];
    
    const HOW_TO_APPLY_PATTERNS = [
      /\bhow (do i|can i|to) (apply|enroll|enrol|register|join kinoo|join kvtc|get admitted)\b/i,
      /\bapplication process\b/i,
      /\bi('d| would) like to (apply|enroll|join|register)\b/i,
      /\bi want to (apply|enroll|enrol|register|join)\b/i,
    ];

    if (READY_TO_APPLY_PATTERNS.some(p => p.test(message.trim()))) {
      return NextResponse.json({
        response_type: 'application_wizard',
        text: `I can help you apply **right here** — no need to go anywhere else! 🎉\n\nI'll collect a few quick details from you, then open your pre-filled admission form. After that, you pay **KSh 500** via **M-PESA** and get your **Admission Letter instantly**.\n\nLet's go — just answer the questions below 👇`,
        provider: 'ARIA',
        timestamp: new Date().toISOString()
      });
    }

    if (HOW_TO_APPLY_PATTERNS.some(p => p.test(message.trim()))) {
      return NextResponse.json({
        response_type: 'application_guide',
        text: `Applying to Kinoo VTC is fully online and takes less than 3 minutes. Here's how it works:`,
        provider: 'ARIA',
        timestamp: new Date().toISOString()
      });
    }

    const file = fs.readFileSync(dbPath, 'utf8');
    const db = JSON.parse(file);
    const courseList = db.courses || [];

    // ── Course requirements intent detection ──
    const REQUIREMENTS_PATTERNS = [
      /\b(requirements?|qualifications?|what do i need|what must i have|what's needed|needed to (join|apply|enroll|enrol)|criteria)\b/i,
      /\b(entry requirements?|admission requirements?)\b/i,
      /\bcan i (join|apply|enroll|enrol|do)\b/i,
    ];
    const COURSE_KEYWORDS = [
      'electrical','electronics','plumbing','welding','motor','vehicle','mechanics','hair','beauty','dressing',
      'food','beverage','production','computer','ict','carpentry','masonry','brickwork','garment','fashion',
      'design','cutting','tailoring','solar','pv','security','systems','cna','caregiver','nursing','baking',
      'pastry','barista','driving','building','construction','technology'
    ];
    const hasRequirementsIntent = REQUIREMENTS_PATTERNS.some(p => p.test(message.trim()));
    const mentionedCourse = COURSE_KEYWORDS.find(k => message.toLowerCase().includes(k));

    if (hasRequirementsIntent || (mentionedCourse && /require|need|qualif|eligib|can i|must/i.test(message))) {
      let matchedCourse = null;
      if (mentionedCourse) {
        matchedCourse = courseList.find(c =>
          c.name.toLowerCase().includes(mentionedCourse) ||
          mentionedCourse.split(' ').some(word => c.name.toLowerCase().includes(word))
        );
      }

      if (matchedCourse) {
        return NextResponse.json({
          response_type: 'course_requirements',
          text: `Here are the entry requirements for **${matchedCourse.name}** at Kinoo VTC:`,
          course: matchedCourse,
          provider: 'ARIA',
          timestamp: new Date().toISOString()
        });
      }
    }

    // ── 3. Course Comparison Intent ──
    const COMPARE_PATTERNS = [
      /\b(compare|vs|versus|difference between|which is better)\b/i
    ];
    if (COMPARE_PATTERNS.some(p => p.test(message))) {
      // Find two matched courses
      const matchedCourses = courseList.filter(c => 
        message.toLowerCase().includes(c.name.toLowerCase().split(' ')[0])
      );
      if (matchedCourses.length >= 2) {
        return NextResponse.json({
          response_type: 'course_comparison',
          text: `Here is a comparison between **${matchedCourses[0].name}** and **${matchedCourses[1].name}**:`,
          courses: [matchedCourses[0], matchedCourses[1]],
          provider: 'ARIA',
          timestamp: new Date().toISOString()
        });
      }
    }

    // ── 4. Smart Fee Advisor Intent ──
    const FEE_PATTERNS = [
      /\bi have (ksh|sh)?\s*(\d+[,.]?\d*)\b/i,
      /\bcan i pay in installments\b/i,
      /\bpayment plan\b/i,
    ];
    if (FEE_PATTERNS.some(p => p.test(message))) {
      return NextResponse.json({
        response_type: 'fee_advisor',
        text: `Don't worry if you don't have the full fee right now! Because our courses are government-subsidized, we offer very flexible payment plans.`,
        provider: 'ARIA',
        timestamp: new Date().toISOString()
      });
    }

    // ── 5. WhatsApp Handoff Intent (Feature 15) ──
    const HANDOFF_PATTERNS = [
      /\b(speak to a human|contact admissions|whatsapp|call somebody|talk to someone|human agent|call admissions)\b/i
    ];
    if (HANDOFF_PATTERNS.some(p => p.test(message))) {
      return NextResponse.json({
        response_type: 'whatsapp_handoff',
        text: `I'd be happy to connect you with one of our human admissions officers. They can answer any specific questions I might have missed!`,
        provider: 'ARIA',
        timestamp: new Date().toISOString()
      });
    }

    // ── 6. Personalized Intake Alerts Intent (Feature 17) ──
    const INTAKE_ALERT_PATTERNS = [
      /\b(when is the next intake|notify me|alert me|september intake|january intake|may intake)\b/i
    ];
    if (INTAKE_ALERT_PATTERNS.some(p => p.test(message))) {
      return NextResponse.json({
        response_type: 'intake_alert',
        text: `I can send you an SMS alert as soon as the next intake opens, so you don't miss your chance to join!`,
        provider: 'ARIA',
        timestamp: new Date().toISOString()
      });
    }

    // ── 7. Parent Mode Detection ──
    const isParent = /\b(my son|my daughter|my child|my kids)\b/i.test(message);
    const parentPromptModifier = isParent ? "\n\nPARENT MODE: The user is a parent inquiring for their child. Use a highly respectful, reassuring, and formal tone. Emphasize safety, career outcomes, and that KVTC is a disciplined and excellent environment for their child." : "";
    const errors = [];

    // Load memory
    let memoryStr = '';
    try {
      const memoryRaw = fs.readFileSync(memoryPath, 'utf8');
      const memoryArr = JSON.parse(memoryRaw);
      memoryStr = memoryArr.map((item, i) => `${i + 1}. ${item.insight}`).join('\n');
    } catch (_) { }

    // Build system prompt with all KVTC knowledge + memory + parent mode
    const systemPrompt = buildSystemPrompt(db, memoryStr) + parentPromptModifier;

    // Build message history for multi-turn context
    const allMessages = [
      ...history.map(m => ({
        role: m.role,
        content: m.role === 'user' ? (m.content || '') : (m.text || m.content || '')
      })),
      { role: 'user', content: message }
    ];

    for (const [name, fn] of [
      ['Groq', callGroq],
      ['Gemini', callGemini],
      ['Mistral (HuggingFace)', callHuggingFace]
    ]) {
      try {
        result = await fn(systemPrompt, allMessages);
        console.log(`ARIA: responded via ${result.provider}`);
        break;
      } catch (err) {
        console.warn(`ARIA: ${name} failed — ${err.message}`);
        errors.push(`${name}: ${err.message}`);
      }
    }

    if (!result) {
      // All providers failed — return friendly error
      return NextResponse.json({
        response_type: 'text',
        text: `I'm having trouble connecting right now. Please call us directly on **${db.contact?.phone1}** or email **${db.contact?.email}** and our team will assist you immediately.`,
        provider: 'fallback'
      });
    }

    let finalResponseText = result.text;
    let responseType = 'text';

    // Parse [LEARN: ...]
    const learnMatch = finalResponseText.match(/\[LEARN:\s*(.*?)\]/i);
    if (learnMatch) {
      const insight = learnMatch[1].trim();
      finalResponseText = finalResponseText.replace(learnMatch[0], ''); // Strip it
      
      // Save to memory asynchronously
      try {
        const memRaw = fs.readFileSync(memoryPath, 'utf8');
        const memData = JSON.parse(memRaw);
        memData.push({ insight, timestamp: new Date().toISOString() });
        fs.writeFileSync(memoryPath, JSON.stringify(memData, null, 2));
      } catch (e) {
        console.error("Failed to save institutional memory:", e);
      }
    }

    return NextResponse.json({
      response_type: responseType,
      text: finalResponseText,
      provider: result.provider,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('ARIA API Error:', error);
    return NextResponse.json(
      { response_type: 'text', text: 'Something went wrong. Please try again or contact our admissions office directly.', provider: 'error' },
      { status: 500 }
    );
  }
}
