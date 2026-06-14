/**
 * KVTC Local Intelligence Engine v2.0
 *
 * A sophisticated NLP-inspired intent classifier and dynamic response composer.
 * Designed to be indistinguishable from a cloud LLM when all AI providers are down.
 *
 * Architecture:
 *  1. Preprocessing  — normalise, clean, detect language hints
 *  2. Entity extraction — fuzzy course matching from live db.courses[]
 *  3. Intent scoring  — weighted multi-keyword scoring across 20 intent categories
 *  4. Context resolution — use conversation history to resolve follow-up messages
 *  5. Response generation — compose varied, warm, data-driven replies from db
 */

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Pick a random item from an array — adds natural variation to responses */
function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

/** Preprocess: lowercase, strip punctuation, normalise whitespace */
function normalise(text) {
  return (text || '')
    .toLowerCase()
    .replace(/[''""]/g, "'")
    .replace(/[^\w\s']/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Check if any keyword (string or regex) matches the normalised message */
function matches(msg, patterns) {
  return patterns.some(p =>
    typeof p === 'string' ? msg.includes(p) : p.test(msg)
  );
}

// ─── Intent Definitions ───────────────────────────────────────────────────────
// Each intent has: keywords (weighted), regexes, and a minScore threshold.

const INTENTS = [
  {
    name: 'greeting',
    score: msg =>
      /^(hi|hello|hey|habari|sasa|niaje|mambo|hujambo|howdy|good (morning|afternoon|evening)|salaam)/.test(msg) ? 10 : 0,
  },
  {
    name: 'farewell',
    score: msg =>
      matches(msg, ['bye', 'goodbye', 'kwaheri', 'good night', 'see you later', 'later']) ? 8 : 0,
  },
  {
    name: 'thanks',
    score: msg => {
      let s = 0;
      if (matches(msg, ['thank', 'thanks', 'asante', 'sawa sawa', 'perfect', 'wonderful', 'helpful', 'awesome', 'great'])) s += 6;
      if (matches(msg, ['very', 'so much', 'a lot', 'sana'])) s += 2;
      return s;
    },
  },
  {
    name: 'fees',
    score: msg => {
      let s = 0;
      if (matches(msg, ['fee', 'fees', 'how much', 'cost', 'price', 'tuition', 'payment', 'pay', 'ksh', 'money', 'affordable', 'cheap', 'expensive', 'charges', 'pesa', 'bei'])) s += 5;
      if (matches(msg, ['term', 'annual', 'per year', 'semester', 'monthly', 'breakdown'])) s += 3;
      if (matches(msg, ['afford', 'poor', 'sponsor', 'bursary', 'loan', 'help'])) s += 2;
      return s;
    },
  },
  {
    name: 'requirements',
    score: msg => {
      let s = 0;
      if (matches(msg, ['requirement', 'qualification', 'eligible', 'eligibility', 'can i join', 'who can join', 'what do i need', 'documents', 'docs'])) s += 6;
      if (matches(msg, ['kcse', 'kcpe', 'grade', 'form 4', 'form four', 'certificate', 'result', 'slip'])) s += 5;
      if (matches(msg, ['minimum', 'pass', 'grade c', 'grade d', 'score'])) s += 3;
      if (matches(msg, ['national id', 'birth certificate', 'passport photo'])) s += 4;
      return s;
    },
  },
  {
    name: 'intake',
    score: msg => {
      let s = 0;
      if (matches(msg, ['intake', 'next intake', 'enrollment', 'enroll', 'registration', 'register', 'when can i join', 'when does it start'])) s += 7;
      if (matches(msg, ['january', 'may', 'september', 'deadline', 'closing date', 'open', 'closed', 'still open'])) s += 4;
      if (matches(msg, ['when', 'start', 'begin', 'opening'])) s += 2;
      return s;
    },
  },
  {
    name: 'apply',
    score: msg => {
      let s = 0;
      if (matches(msg, ['how to apply', 'how do i apply', 'apply', 'application', 'start application', 'i want to apply', 'ready to apply', 'begin application'])) s += 7;
      if (matches(msg, ['steps', 'process', 'procedure', 'online form', 'form', 'admission form'])) s += 4;
      if (/^(apply|i want to apply|ready to apply|start application|i am ready)/.test(msg)) s += 5;
      return s;
    },
  },
  {
    name: 'contact',
    score: msg => {
      let s = 0;
      if (matches(msg, ['contact', 'phone', 'call', 'email', 'whatsapp', 'location', 'where', 'address', 'find you', 'office', 'visit', 'directions', 'map', 'campus'])) s += 6;
      if (matches(msg, ['nearest', 'how far', 'bus', 'matatu', 'route', 'get there'])) s += 4;
      return s;
    },
  },
  {
    name: 'list_courses',
    score: msg => {
      let s = 0;
      if (matches(msg, ['all courses', 'list of courses', 'what courses', 'what programmes', 'what do you offer', 'what can i study', 'available courses', 'show me courses'])) s += 8;
      if (/^(courses|programmes?)$/.test(msg)) s += 8;
      return s;
    },
  },
  {
    name: 'career',
    score: msg => {
      let s = 0;
      if (matches(msg, ['job', 'career', 'employment', 'salary', 'earn', 'income', 'work', 'hired', 'prospects', 'after graduating', 'after course', 'after finishing'])) s += 6;
      if (matches(msg, ['how much do they earn', 'how much will i earn', 'monthly', 'annual salary'])) s += 4;
      return s;
    },
  },
  {
    name: 'self_employment',
    score: msg => {
      let s = 0;
      if (matches(msg, ['self employ', 'own business', 'own shop', 'own salon', 'own garage', 'own company', 'entrepreneur', 'hustle', 'freelance', 'startup', 'work for myself'])) s += 7;
      if (matches(msg, ['make money', 'side income', 'passive income', 'business idea'])) s += 4;
      return s;
    },
  },
  {
    name: 'help_choose',
    score: msg => {
      let s = 0;
      if (matches(msg, ['help me choose', 'which course', 'what course', 'recommend', 'best course', 'suitable for me', 'what should i study', 'not sure what', 'confused', 'undecided'])) s += 7;
      if (matches(msg, ['advice', 'guide me', 'suggest', 'i like', 'i enjoy', 'i am good at', 'i want to be'])) s += 4;
      if (matches(msg, ['interest', 'passion', 'talent', 'good at'])) s += 3;
      return s;
    },
  },
  {
    name: 'duration',
    score: msg => {
      let s = 0;
      if (matches(msg, ['how long', 'duration', 'how many years', 'how many months', 'period', 'takes how long', 'time to complete'])) s += 7;
      if (/\b(year|month|week|term|semester)\b/.test(msg) && matches(msg, ['long', 'take', 'complete', 'finish', 'end'])) s += 4;
      return s;
    },
  },
  {
    name: 'certification',
    score: msg => {
      let s = 0;
      if (matches(msg, ['certificate', 'certification', 'nita', 'knec', 'accredited', 'recognized', 'diploma', 'award', 'qualifies', 'government recognized', 'is it valid'])) s += 7;
      if (matches(msg, ['is it certified', 'is it accredited', 'does it count', 'widely accepted', 'government approved'])) s += 5;
      return s;
    },
  },
  {
    name: 'mpesa',
    score: msg => {
      let s = 0;
      if (matches(msg, ['mpesa', 'm-pesa', 'lipa', 'paybill', 'till', 'mobile money', 'pay online', 'online payment'])) s += 8;
      return s;
    },
  },
  {
    name: 'short_courses',
    score: msg => {
      let s = 0;
      if (matches(msg, ['short course', 'part time', 'evening class', 'weekend class', 'quick course', 'few months', '3 months', 'six months', 'evening'])) s += 7;
      if (matches(msg, ['computer package', 'driving', 'barista', 'baking', 'solar'])) s += 3;
      return s;
    },
  },
  {
    name: 'specific_course',
    // Scored dynamically after entity extraction — placeholder here
    score: () => 0,
  },
  {
    name: 'human_agent',
    score: msg => {
      let s = 0;
      if (matches(msg, ['speak to a human', 'talk to someone', 'real person', 'speak to officer', 'human agent', 'admissions officer', 'connect me', 'transfer me'])) s += 9;
      return s;
    },
  },
  {
    name: 'positive_reaction',
    score: msg => {
      let s = 0;
      if (/^(ok|okay|alright|sure|got it|noted|understood|sounds good|i see|cool|nice|perfect|great|wow|amazing|sawa|safi|poa)/.test(msg)) s += 6;
      return s;
    },
  },
];

// ─── Course Entity Extraction ─────────────────────────────────────────────────

/**
 * Maps common keywords/aliases to partial course name tokens.
 * Used for fuzzy matching — we check if any alias appears in the user's message.
 */
const COURSE_ALIASES = {
  electrical:   ['electrical', 'electric', 'electronics', 'electrician', 'wiring', 'umeme', 'fundi umeme'],
  plumbing:     ['plumbing', 'plumber', 'pipes', 'pipe', 'drainage', 'maji', 'fundi maji'],
  welding:      ['welding', 'welder', 'fabrication', 'metal work', 'chuma'],
  motor:        ['motor', 'vehicle', 'mechanic', 'automobile', 'gari', 'engine', 'mechanical', 'garage', 'auto'],
  hair:         ['hair', 'salon', 'hairdressing', 'hairdresser', 'nywele', 'beauty hair'],
  beauty:       ['beauty', 'makeup', 'cosmetic', 'skincare', 'esthetics'],
  food:         ['food', 'catering', 'cooking', 'chef', 'hotel', 'hospitality', 'nutrition', 'beverage'],
  computer:     ['computer', 'ict', 'it course', 'programming', 'software', 'coding', 'digital', 'kompyuta', 'ms office', 'office package'],
  carpentry:    ['carpentry', 'carpenter', 'woodwork', 'wood', 'furniture', 'joinery', 'mbao'],
  masonry:      ['masonry', 'mason', 'brickwork', 'bricks', 'building', 'construction', 'ujenzi', 'fundi'],
  fashion:      ['fashion', 'garment', 'tailoring', 'tailor', 'cutting', 'sewing', 'nguo', 'design clothes', 'dressmaking'],
  solar:        ['solar', 'pv', 'solar panel', 'renewable energy', 'solar installation'],
  security:     ['security', 'cctv', 'alarm', 'surveillance', 'security system', 'intruder'],
  cna:          ['cna', 'caregiver', 'nursing', 'nurse', 'care', 'healthcare', 'medical assistant', 'patient care', 'health'],
  baking:       ['baking', 'bakery', 'pastry', 'cake', 'bread', 'mkate', 'confectionery'],
  barista:      ['barista', 'coffee', 'beverage', 'drinks', 'tea making', 'mixology'],
  driving:      ['driving', 'driver', 'ntsa', 'license', 'licence', 'dereva', 'driving school', 'learner'],
};

/**
 * Extract the best matching course object from db.courses[]
 * Returns null if no match found.
 */
function extractCourse(msg, courses) {
  if (!courses || courses.length === 0) return null;

  let bestMatch = null;
  let bestScore = 0;

  for (const [key, aliases] of Object.entries(COURSE_ALIASES)) {
    const aliasScore = aliases.filter(a => msg.includes(a)).length;
    if (aliasScore > bestScore) {
      // Find the matching course in db
      const found = courses.find(c => c.name.toLowerCase().includes(key));
      if (found) {
        bestScore = aliasScore;
        bestMatch = found;
      }
    }
  }

  return bestMatch;
}

// ─── Context Resolution ───────────────────────────────────────────────────────

/**
 * Look at the last assistant message + last user message to detect follow-ups.
 * e.g., if assistant mentioned "electrical" and user says "how long does it take?",
 * we know "it" refers to electrical.
 */
function resolveContext(history) {
  if (!history || history.length < 2) return { lastCourseKeyword: null, lastIntent: null };

  // Find the most recent assistant message
  const recentAssistant = [...history].reverse().find(m => m.role === 'assistant');
  if (!recentAssistant) return { lastCourseKeyword: null, lastIntent: null };

  const assistantText = normalise(recentAssistant.text || recentAssistant.content || '');

  // Check if the assistant mentioned a course recently
  let lastCourseKeyword = null;
  for (const [key, aliases] of Object.entries(COURSE_ALIASES)) {
    if (aliases.some(a => assistantText.includes(a)) || assistantText.includes(key)) {
      lastCourseKeyword = key;
      break;
    }
  }

  return { lastCourseKeyword };
}

// ─── Response Templates ───────────────────────────────────────────────────────

function respondGreeting(contact) {
  return pick([
    `Hey there! 👋 Welcome to **Kinoo Vocational Training Centre**! I'm ARIA, your personal admissions guide.\n\nI can help you with:\n- 🎓 Exploring courses and finding the right fit\n- 💰 Understanding fees and payment options\n- 📝 Walking you through the online application\n- 📞 Connecting you with our admissions team\n\nWhat can I help you with today? 😊`,

    `Hello! 🌟 Great to have you here at Kinoo VTC! I'm ARIA.\n\nWhether you're just exploring or ready to apply — I've got you covered!\n\nSome things students usually ask me:\n- "What courses do you offer?"\n- "How much are the fees?"\n- "Can I join without KCSE?"\n\nWhat's on your mind? 👇`,

    `Karibu sana! 🇰🇪 Welcome to Kinoo VTC — I'm ARIA, your admissions assistant.\n\nI'm here to answer any question you have about our programmes, fees, requirements, or how to apply.\n\nWhat would you like to know? 😊`,
  ]);
}

function respondFarewell() {
  return pick([
    `It was great chatting with you! 👋 All the best in your studies — Kinoo VTC would love to have you!\n\nFeel free to come back anytime you have questions. Remember, you can start your online application at any time! 🎓`,
    `Goodbye! 😊 Take care, and don't hesitate to return if you have more questions. Your future starts here at Kinoo VTC! 🌟`,
    `Kwaheri! 👋 It was a pleasure helping you. Hope to see you as part of the Kinoo VTC family soon! 🎓`,
  ]);
}

function respondThanks() {
  return pick([
    `You're very welcome! 😊 That's what I'm here for. Is there anything else you'd like to know — about fees, intake dates, or starting your application? 🎓`,
    `Happy to help! 🌟 Anything else on your mind? I'm happy to walk you through the next step — whether that's applying or just learning more about a specific course.`,
    `Of course! Karibu sana. 😊 Don't hesitate to ask if you need anything else. The most important thing is getting you started on your journey at Kinoo VTC!`,
  ]);
}

function respondPositive() {
  return pick([
    `Great! 😊 What else would you like to know? I'm here to help with any questions about courses, fees, or how to apply.`,
    `Perfect! 🎓 We're making progress. Is there anything else you'd like to explore? You can ask about a specific course, our fees, or I can walk you through the application process.`,
    `Awesome! 👍 What's your next question? I'm ready when you are.`,
  ]);
}

function respondFees(feeStructure) {
  const annual = feeStructure?.annualTuition?.toLocaleString() || '27,000';
  const regTotal = feeStructure?.admissionTotal?.toLocaleString() || '6,500';
  const terms = (feeStructure?.termBreakdown || [])
    .map(t => `• **${t.label}:** KSh ${t.amount.toLocaleString()}`)
    .join('\n') || '• Term 1: KSh 9,000\n• Term 2: KSh 9,000\n• Term 3: KSh 9,000';

  return pick([
    `Great question about fees! 💳 At Kinoo VTC, our courses are **government-subsidized** — making them extremely affordable:\n\n**Annual Tuition:** KSh ${annual}/year\n\n**Paid per term:**\n${terms}\n\n**One-time registration fee:** KSh ${regTotal} (paid when joining)\n**Online application fee:** KSh 500 (M-PESA)\n\nYou don't need to pay everything at once — just **KSh 9,000 per term**! 💪 Would you like to know more about a specific course fee or how to pay?`,

    `Here's the full fee breakdown at Kinoo VTC 📊\n\n💰 **Subsidized by the County Government of Kiambu!**\n- Annual tuition: **KSh ${annual}**\n${terms}\n- One-time registration: **KSh ${regTotal}**\n- Application fee: **KSh 500** (M-PESA)\n\nMany students pay term by term — no financial stress! Want to know which payment method to use, or shall we look at a specific course? 😊`,
  ]);
}

function respondRequirements() {
  return pick([
    `Here's exactly what you need to join Kinoo VTC ✅\n\n**Documents (bring on reporting day):**\n- 📷 Two (2) passport-size photos\n- 🪪 Copy of National ID or Birth Certificate\n- 📄 Photocopies (set)\n- 📋 Three (3) foolscap papers\n- 📜 Copy of previous result slip — **KCPE or KCSE if you have any** (no strict grades!)\n- 🏥 Medical certificate (from any clinic)\n- 📔 Two (2) quire counter books\n- 📓 Four (4) A4 exercise books\n\n**Age:** 16+ years (18+ for Driving)\n\n**The most important thing to know:** We do **NOT** require top grades. If you have a result slip, great — if not, just come! 💪\n\nReady to apply? 👇`,

    `No need to stress about requirements! Kinoo VTC is open to everyone 🎓\n\n**What you need:**\n1. National ID or Birth Certificate (copy)\n2. Two (2) passport photos\n3. Previous result slip — KCPE/KCSE — **IF you have one** (no minimum grade!)\n4. Medical certificate\n5. Stationery: foolscap papers, counter books, exercise books\n\n**Short courses?** Even simpler — just your ID and a photo!\n\nThere are no strict academic barriers here. We train people who are ready to work hard and build a future. Does this help? Would you like to apply? 😊`,
  ]);
}

function respondIntake(intake) {
  const isOpen = intake?.isOngoing;
  const term = intake?.currentTerm || 'Current Intake';
  const endDate = intake?.endDate ? new Date(intake.endDate).toLocaleDateString('en-KE', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Contact us for exact date';

  const statusLine = isOpen
    ? `✅ **Applications are OPEN right now** — ${term}!`
    : `⛔ The current intake is **closed**. But don't worry, the next one opens soon!`;

  return pick([
    `📅 Kinoo VTC runs **three intakes every year:**\n- **January** Intake\n- **May** Intake\n- **September** Intake\n\n${statusLine}\nDeadline: **${endDate}**\n\nSpaces fill up fast — we recommend applying early! The online process takes less than 5 minutes. Want to start now? 🚀`,

    `Great timing to ask about the intake! 📆\n\n${statusLine}\n\nWe have **3 intakes per year** — January, May, and September.\nCurrent deadline: **${endDate}**\n\nYou can apply online right now without visiting campus. Shall I walk you through how it works? 😊`,
  ]);
}

function respondApply(contact) {
  return pick([
    `Applying to Kinoo VTC is simple — there are **3 ways** to apply:\n\n💬 **1. Chat with me (ARIA)**\nI'll collect your details right here and open a pre-filled form for you.\n\n📚 **2. From the Courses Page**\nBrowse our courses, pick one, and click **Apply** on the course card.\n\n🏫 **3. Visit us in person**\nCome to our campus in Kikuyu, Kiambu. Our team will guide you.\n\n**Online steps:**\n1. Fill your details\n2. Upload ID copy & result slip (if any)\n3. Pay KSh 500 via M-PESA\n4. Receive admission letter instantly! 📧\n\nReady to begin? Just say **"I am ready to apply"** 👇`,

    `Let me walk you through how to apply! 🎉\n\n**Option A — Online (easiest):**\n- Chat with me → Pre-filled form → Pay KSh 500 M-PESA → Done! ✅\n\n**Option B — Courses Page:**\n- Visit /courses → Choose your course → Click Apply\n\n**Option C — Come to campus:**\n- Kikuyu, Kiambu County\n- Office hours: ${contact?.hours || 'Mon–Fri: 8am–5pm'}\n\nThe whole online process takes about **3–5 minutes** and you get your admission letter the same day! 🚀\n\nShall I start the application with you right now?`,
  ]);
}

function respondContact(contact) {
  return pick([
    `Here's everything you need to reach us at Kinoo VTC 📞\n\n- **Phone 1:** ${contact?.phone1 || '0113 582 008'}\n- **Phone 2:** ${contact?.phone2 || '0748 455 116'}\n- **Email:** ${contact?.email || 'kinoovtc@gmail.com'}\n- **Location:** Kikuyu, Kiambu County, Kenya\n- **Address:** P.O. Box 351-00902, Kikuyu\n- **Office Hours:** ${contact?.hours || 'Mon–Fri: 8am – 5pm'}\n\nYou can also WhatsApp us directly at **${contact?.phone1 || '0113 582 008'}** 📱\n\nOr if you'd rather skip the visit — you can apply 100% online from your phone! Can I help with anything else? 😊`,

    `No problem — here's how to find us! 📍\n\n📞 **Call/WhatsApp:** ${contact?.phone1 || '0113 582 008'} or ${contact?.phone2 || '0748 455 116'}\n📧 **Email:** ${contact?.email || 'kinoovtc@gmail.com'}\n🏫 **Campus:** Kikuyu, Kiambu County\n🕗 **Hours:** ${contact?.hours || 'Mon–Fri: 8am – 5pm'}\n\nWe're easy to reach — our team is very friendly and will answer all your questions. Alternatively, I can answer most things right here! What else do you need? 😊`,
  ]);
}

function respondListCourses(courses) {
  const list = courses.map((c, i) => `${i + 1}. **${c.name}** — ${c.dur} | ${c.cert || 'NITA/KNEC'} | KSh ${(c.fees || 27000).toLocaleString()}/yr`).join('\n');
  return `We offer **${courses.length} programmes** at Kinoo VTC 🎓\n\n${list}\n\nAll courses are government-subsidized! Which one catches your eye? I can tell you more about the fees, career prospects, and requirements for any of them! 👉`;
}

function respondCareer(course) {
  if (course) {
    const jobs = (course.career || []).slice(0, 5);
    const jobList = jobs.length > 0
      ? jobs.map(j => `• ${j}`).join('\n')
      : `• Employment in the ${course.name} industry\n• Freelance / self-employment\n• Government and private sector roles`;
    return pick([
      `After completing **${course.name}** at Kinoo VTC, here are your career options 🚀\n\n${jobList}\n\n${course.name} graduates are in **high demand** across Kenya. Many of our graduates are self-employed and earning well within 6 months! Want to know more about the course or how to apply? 💪`,
      `Great question about careers! 💼 With a **${course.name}** qualification from Kinoo VTC:\n\n${jobList}\n\nThe best part? You can also start your **own business** immediately after graduating — the skills are practical and market-ready! Ready to take the first step? 😊`,
    ]);
  }
  return pick([
    `All our courses are designed for **immediate employment** after graduation! 🚀\n\n- ⚡ **Electrical** → Electrician, solar installer, freelance fundi\n- 🔧 **Mechanics** → Garage owner, auto technician\n- 💻 **ICT** → Tech support, data entry, office work\n- 💇 **Hair/Beauty** → Salon owner, hotel stylist\n- 🏥 **CNA/Caregiver** → Kenya & international job market (high demand!)\n- 🍽️ **Catering** → Chef, hotel, events, own catering business\n\nMost of our graduates find work or start businesses within **3–6 months** of graduating! Which course interests you? 😊`,
  ]);
}

function respondSelfEmployment(course) {
  const examples = [
    { course: 'Hair Dressing', business: 'own salon', earning: 'KSh 30,000–150,000/month' },
    { course: 'Motor Vehicle Mechanics', business: 'own garage', earning: 'KSh 40,000–120,000/month' },
    { course: 'Electrical & Electronics', business: 'freelance electrician', earning: 'KSh 30,000–90,000/month' },
    { course: 'Baking & Pastry', business: 'home/shop bakery', earning: 'KSh 20,000–80,000/month' },
    { course: 'Welding & Fabrication', business: 'own fab shop', earning: 'KSh 35,000–100,000/month' },
    { course: 'Carpentry', business: 'furniture workshop', earning: 'KSh 25,000–70,000/month' },
    { course: 'Fashion Design', business: 'tailoring business', earning: 'KSh 20,000–60,000/month' },
    { course: 'Plumbing', business: 'plumbing contractor', earning: 'KSh 30,000–80,000/month' },
  ];

  if (course) {
    const match = examples.find(e => e.course.toLowerCase().includes(course.name.toLowerCase().split(' ')[0]));
    if (match) {
      return `Absolutely! **${course.name}** is one of the best courses for self-employment! 💡\n\nAfter graduating, you can:\n- Start your **${match.business}**\n- Expected earnings: **${match.earning}**\n- Low startup cost — your skills ARE your business!\n\nAll for just **KSh 27,000/year** in training. That's an incredible return on investment! 💪\n\nWant to start your application? Let's get you enrolled! 🎓`;
    }
  }

  const exList = examples.slice(0, 5).map(e => `- **${e.course}** → ${e.business} → ${e.earning}`).join('\n');
  return `Entrepreneurship is one of the top reasons students choose Kinoo VTC! 💡\n\nHere's what our graduates are doing:\n${exList}\n\nAll our courses are **practical, skills-first** — you'll be ready to work for yourself from day one! Which of these businesses interests you? 🚀`;
}

function respondHelpChoose() {
  return pick([
    `I'd love to help you find the perfect course! 😊 Let me know about your interests:\n\n🔧 **Like hands-on/technical work?**\n→ Electrical, Plumbing, Welding, Mechanics, Masonry\n\n💻 **Interested in technology?**\n→ Computer Operator, Solar PV, Security Systems\n\n🍽️ **Enjoy food and hospitality?**\n→ Catering, Baking & Pastry, Barista\n\n💇 **Interested in fashion and beauty?**\n→ Hair Dressing, Fashion Design & Garment Making\n\n🏥 **Want to help people?**\n→ CNA / Caregiver — jobs available in Kenya & abroad!\n\n🚗 **Want to drive professionally?**\n→ NTSA-certified Driving classes\n\nWhich of these resonates with you? Or tell me your interests and I'll suggest the best match! 👉`,

    `No worries — choosing the right course is the most important decision! Let me help 🎯\n\nTell me:\n1. What activities do you **enjoy** doing?\n2. Do you prefer working **outdoors or indoors**?\n3. Are you interested in **starting your own business** one day?\n\nOnce I know a bit about you, I can recommend the course that will set you up best for life! 😊`,
  ]);
}

function respondDuration(course) {
  if (course) {
    return pick([
      `**${course.name}** takes **${course.dur || '2 years'}** to complete at Kinoo VTC. 📅\n\nIt's divided into **3 terms per year**, so you're continuously building skills throughout. The programme includes both **classroom learning and practical workshops** — giving you real-world experience before you graduate.\n\nWant to know more about the fees or career prospects for this course? 😊`,
      `Great question! **${course.name}** is a **${course.dur || '2-year'}** programme. 🎓\n\nThe training combines theory and hands-on practical sessions every term. By the end, you'll have a **${course.cert || 'NITA/KNEC'}**-certified qualification that is recognized across Kenya.\n\nAnything else you'd like to know about this course?`,
    ]);
  }
  return `Our course durations vary:\n\n- **Full NITA/KNEC programmes:** 2–3 years\n- **Short/Certificate courses:** 3–6 months (Computer, Baking, Barista, Solar, Driving)\n\nAll full programmes are split into **3 terms per year**, so you're always progressing! Which course were you asking about? I can give you the exact duration! 😊`;
}

function respondCertification(course) {
  if (course) {
    const cert = course.cert || 'NITA/KNEC';
    return pick([
      `Yes! **${course.name}** is fully certified! ✅\n\nUpon completion, you receive a **${cert}** certificate — one of the most recognized qualifications in Kenya and the East African region.\n\n${cert.includes('NITA') ? '**NITA** (National Industrial Training Authority) certificates are government-issued and required by most employers in technical fields.' : ''}\n${cert.includes('KNEC') ? '**KNEC** (Kenya National Examinations Council) is the same body that conducts KCSE — highly respected by all employers.' : ''}\n\nYour certificate opens doors across Kenya, East Africa, and even internationally! 🌍`,
      `Absolutely — and this is one of the best things about Kinoo VTC! 🏆\n\n**${course.name}** graduates receive a **${cert}** certificate — fully accredited and government-recognized.\n\nThis means employers know exactly what you can do — no guesswork. Ready to earn yours? Let's get your application started! 😊`,
    ]);
  }
  return `All Kinoo VTC programmes are officially certified! ✅\n\n- **NITA** — National Industrial Training Authority (for technical trades)\n- **KNEC** — Kenya National Examinations Council (for business/technology)\n\nThese are government-backed qualifications recognized across Kenya and internationally. Your certificate is proof of real, practical competence — not just a piece of paper! 🎓\n\nWhich course were you asking about? I can confirm the exact certification for it.`;
}

function respondMpesa(feeStructure) {
  const bank = feeStructure?.bankKCB;
  return pick([
    `Great news — M-PESA is the easiest way to pay! 📱\n\n**Application Fee (KSh 500):**\nPaid directly through the online application form — just enter your M-PESA details and it's done!\n\n**Tuition Fees (KSh 9,000/term):**\nPaid via bank to:\n- **KCB Bank** (Tuition account)\n- Account: **${bank?.accountNumber || 'Contact us for details'}**\n- Account Name: **${bank?.accountName || 'Kinoo VTC'}**\n\n**Registration Fees:**\nPaid via **Co-operative Bank, Kangemi branch** (see Admissions page for full details)\n\nAlways keep your bank slip as proof of payment! Is there anything else I can help with? 😊`,
  ]);
}

function respondShortCourses(feeStructure) {
  const others = feeStructure?.otherCharges || [];
  const list = others.length > 0
    ? others.map(o => `- **${o.item}:** KSh ${o.amount.toLocaleString()}`).join('\n')
    : `- Computer Packages: KSh 8,000\n- Driving (NTSA): KSh 15,000\n- Baking & Pastry: varies\n- Barista/Coffee: varies`;

  return pick([
    `Yes! We have short courses that take just **3–6 months** — perfect if you want to gain a skill quickly! ⚡\n\n${list}\n\n**Advantages of short courses:**\n- No strict entry requirements — just your ID\n- Completed in one intake period\n- Many offered in evening/weekend sessions\n- Very affordable compared to full programmes\n\nInterested in one of these? Want to apply? 😊`,
  ]);
}

function respondHumanAgent(contact) {
  return `Of course! I'll connect you with our human admissions team right now. 🤝\n\n**Kinoo VTC Admissions Office:**\n📞 ${contact?.phone1 || '0113 582 008'}\n📞 ${contact?.phone2 || '0748 455 116'}\n📧 ${contact?.email || 'kinoovtc@gmail.com'}\n🕗 ${contact?.hours || 'Mon–Fri: 8am – 5pm'}\n\nYou can also WhatsApp us directly — our team typically responds within a few minutes during office hours! Is there anything else I can quickly answer for you before I hand you over? 😊`;
}

function respondSpecificCourse(course, feeStructure) {
  const annual = feeStructure?.annualTuition || 27000;
  const courseFee = course.fees || annual;
  const jobs = (course.career || []).slice(0, 4).map(j => `• ${j}`).join('\n') || `• Employment in the ${course.name} industry`;

  return pick([
    `Great choice! Here's everything about **${course.name}** at Kinoo VTC 🎓\n\n**Duration:** ${course.dur || '2 years'}\n**Certification:** ${course.cert || 'NITA/KNEC Certified'}\n**Annual Fees:** KSh ${typeof courseFee === 'number' ? courseFee.toLocaleString() : courseFee} (government-subsidized!)\n\n**Career options after graduation:**\n${jobs}\n\n**Entry requirements:** No strict grades needed — just bring your result slip if you have one, your ID, and 2 passport photos.\n\nWould you like to apply for this course? 😊`,

    `**${course.name}** is one of our most popular programmes! Here are the details 📋\n\n⏱ **Duration:** ${course.dur || '2 years'}\n🏆 **Certificate:** ${course.cert || 'NITA/KNEC'} — government recognized\n💰 **Fees:** KSh ${typeof courseFee === 'number' ? courseFee.toLocaleString() : courseFee}/year (very subsidized!)\n\n**What you'll do after graduating:**\n${jobs}\n\nThe course includes both **theory and practical training** — you'll be job-ready from day one! Want to apply or know more? 👇`,
  ]);
}

// ─── Main Engine Export ───────────────────────────────────────────────────────

/**
 * Main local intelligence engine.
 * @param {string} message - The user's raw message
 * @param {object} db - Full db.json object
 * @param {Array}  history - Conversation history array (optional)
 * @returns {string} A natural, context-aware response
 */
export function localEngine(message, db, history = []) {
  const msg = normalise(message);
  const { contact, feeStructure, courses = [], intake } = db;

  // ── 1. Entity extraction ────────────────────────────────────────────────────
  let detectedCourse = extractCourse(msg, courses);

  // ── 2. Context resolution: fill in course from history if message is a follow-up ──
  if (!detectedCourse) {
    const { lastCourseKeyword } = resolveContext(history);
    if (lastCourseKeyword && matches(msg, [
      'how long', 'how much', 'fees', 'cost', 'duration', 'it', 'that', 'this',
      'tell me more', 'more about', 'career', 'job', 'certif', 'apply for it',
    ])) {
      detectedCourse = courses.find(c => c.name.toLowerCase().includes(lastCourseKeyword));
    }
  }

  // ── 3. Score all intents ────────────────────────────────────────────────────
  const scored = INTENTS.map(intent => ({
    name: intent.name,
    score: intent.score(msg),
  })).sort((a, b) => b.score - a.score);

  const topIntent = scored[0];

  // If a specific course was mentioned with a meaningful intent, boost specific_course
  if (detectedCourse && topIntent.score < 6) {
    // User is asking about a specific course — use the course responder
    return respondSpecificCourse(detectedCourse, feeStructure);
  }

  // ── 4. Route to correct responder ──────────────────────────────────────────
  if (topIntent.score >= 4) {
    switch (topIntent.name) {
      case 'greeting':        return respondGreeting(contact);
      case 'farewell':        return respondFarewell();
      case 'thanks':          return respondThanks();
      case 'positive_reaction': return respondPositive();
      case 'fees':            return respondFees(feeStructure);
      case 'requirements':    return respondRequirements();
      case 'intake':          return respondIntake(intake);
      case 'apply':           return respondApply(contact);
      case 'contact':         return respondContact(contact);
      case 'list_courses':    return respondListCourses(courses);
      case 'career':          return respondCareer(detectedCourse);
      case 'self_employment': return respondSelfEmployment(detectedCourse);
      case 'help_choose':     return respondHelpChoose();
      case 'duration':        return respondDuration(detectedCourse);
      case 'certification':   return respondCertification(detectedCourse);
      case 'mpesa':           return respondMpesa(feeStructure);
      case 'short_courses':   return respondShortCourses(feeStructure);
      case 'human_agent':     return respondHumanAgent(contact);
    }
  }

  // ── 5. Specific course with no particular sub-intent — give full course overview ─
  if (detectedCourse) {
    return respondSpecificCourse(detectedCourse, feeStructure);
  }

  // ── 6. Intelligent generic fallback — never a dead end ──────────────────────
  return pick([
    `That's a great question! 😊 I want to make sure I give you the most accurate answer.\n\nHere are the things I can help you with right now:\n- 🎓 **Explore courses** — "What courses do you offer?"\n- 💰 **Fees** — "How much does Electrical cost?"\n- 📅 **Intake dates** — "When is the next intake?"\n- 📝 **How to apply** — "How do I apply online?"\n- ✅ **Requirements** — "What documents do I need?"\n\nOr for something more specific, you can call us at **${contact?.phone1 || '0113 582 008'}** 📞\n\nWhat would you like to know? 😊`,

    `I want to help you with that! Let me make sure I understand. Could you rephrase it a little? You can also try asking:\n\n- "What courses do you have?"\n- "How much are the fees?"\n- "How do I apply?"\n- "When is the next intake?"\n\nOr type the name of a course (e.g., "Tell me about Electrical") and I'll give you all the details! 🎓`,
  ]);
}
