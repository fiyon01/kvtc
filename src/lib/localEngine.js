/**
 * KVTC Local Intelligence Engine v3.0
 *
 * Upgrades over v2.0:
 *  - Multi-intent resolution: handles compound questions in one reply
 *  - Conversation memory: tracks course, emotion, language, parent mode across turns
 *  - Adaptive response length: short answers for short questions
 *  - Levenshtein fuzzy matching: catches typos like "electrcal", "pluming"
 *  - Emotional tone tracking: detects anxiety, excitement, confusion and responds warmly
 *  - Full Swahili mode: detects Swahili messages and replies in Swahili
 *  - Anti-repetition: never re-explains what was just said
 *  - Confident unknown handler: never exposes itself as a script
 */

// ─── Helpers ──────────────────────────────────────────────────────────────────

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function normalise(text) {
  return (text || '')
    .toLowerCase()
    .replace(/[''""]/g, "'")
    .replace(/[^\w\s']/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function matches(msg, patterns) {
  return patterns.some(p =>
    typeof p === 'string' ? msg.includes(p) : p.test(msg)
  );
}

function formatCourseFee(course) {
  if (typeof course?.fees === 'number') {
    return `KSh ${course.fees.toLocaleString()}`;
  }

  const fee = String(course?.fees || '').trim();
  if (!fee) return 'Contact admissions for the current fee';
  return /^ksh\s/i.test(fee) ? fee : `KSh ${fee}`;
}

function courseFeeLabel(course) {
  return /year/i.test(String(course?.fees || '')) ? 'Annual fee' : 'Course fee';
}

function numericFee(value) {
  const amount = Number(String(value || '').replace(/[^\d]/g, ''));
  return Number.isFinite(amount) && amount > 0 ? amount : null;
}

function formatMoney(amount) {
  return `KSh ${Number(amount || 0).toLocaleString()}`;
}

// ─── Levenshtein distance — catches typos ─────────────────────────────────────
function levenshtein(a, b) {
  const m = a.length, n = b.length;
  const dp = Array.from({ length: m + 1 }, (_, i) =>
    Array.from({ length: n + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0))
  );
  for (let i = 1; i <= m; i++)
    for (let j = 1; j <= n; j++)
      dp[i][j] = a[i-1] === b[j-1]
        ? dp[i-1][j-1]
        : 1 + Math.min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]);
  return dp[m][n];
}

/**
 * Fuzzy word match — returns true if any word in the message is within
 * `threshold` edits of `target`. Skips words shorter than 4 chars.
 */
function fuzzyMatch(msg, target, threshold = 2) {
  const words = msg.split(' ').filter(w => w.length >= 4);
  const allowedDistance = target.length <= 5 ? 1 : threshold;
  return words.some(w =>
    w[0] === target[0] &&
    Math.abs(w.length - target.length) <= allowedDistance &&
    levenshtein(w, target) <= allowedDistance
  );
}

function containsAlias(msg, alias) {
  const escaped = alias.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\s+/g, '\\s+');
  return new RegExp(`(?:^|\\b)${escaped}(?:\\b|$)`, 'i').test(msg);
}

// ─── Language detection ───────────────────────────────────────────────────────
const SWAHILI_MARKERS = [
  'habari', 'sasa', 'niaje', 'mambo', 'hujambo', 'karibu', 'asante', 'tafadhali',
  'naomba', 'nataka', 'ninahitaji', 'nini', 'vipi', 'bei', 'pesa', 'shule',
  'kusoma', 'kozi', 'mwaka', 'masomo', 'cheti', 'kufanya kazi', 'kwaheri',
  'sawa', 'ndio', 'hapana', 'sijui', 'hajui', 'hajajua', 'mtoto', 'wangu',
  'afanye', 'achague', 'aende', 'naelewa', 'saidizi', 'omba',
];

function detectSwahili(msg) {
  return SWAHILI_MARKERS.filter(w => msg.includes(w)).length >= 2;
}

// ─── Emotion detection ────────────────────────────────────────────────────────
function detectEmotion(msg) {
  if (matches(msg, ['nervous', 'scared', 'worried', 'afraid', 'anxious', 'fear', 'not sure', 'confused', 'lost', 'overwhelmed', 'stress', 'stressed']))
    return 'anxious';
  if (matches(msg, ['excited', 'cant wait', "can't wait", 'happy', 'amazing', 'love it', 'great', 'awesome', 'ready', 'yes please', 'let\'s go']))
    return 'excited';
  if (matches(msg, ['dropped out', 'failed', 'bad grades', 'no certificate', 'no kcse', 'poor', 'no money', 'broke', 'cannot afford', "can't afford"]))
    return 'vulnerable';
  if (matches(msg, ['my son', 'my daughter', 'my child', 'my kid', 'my sibling', 'my brother', 'my sister']))
    return 'parent';
  return 'neutral';
}

function detectStudentSignals(text) {
  return {
    familyBackground: /\b(my|our)\s+(dad|father|mum|mom|mother|parent|uncle|aunt|brother|sister|guardian)\b.*\b(electrician|electrical|wiring|mechanic|driver|chef|tailor|hairdresser|plumber|welder)\b/.test(text)
      ? text.match(/\b(electrician|electrical|wiring|mechanic|driver|chef|tailor|hairdresser|plumber|welder)\b/)?.[0]
      : null,
    trustDoubt: /\b(is kvtc good|is it good|is this good|legit|real school|genuine|trusted|trust|worth it|scam|cheat|cheated|burned|conned|fake)\b/.test(text),
    outcomeDoubt: /\b(get me a job|will.*job|job after|employment after|certificate.*job|is.*certificate.*useful|will this certificate)\b/.test(text),
    tooLate: /\b(too late|too old|older|age|i have kids|single parent|after many years|dropped out|failed|bad grades|no kcse|no certificate)\b/.test(text),
    familyPressure: /\b(parent|parents|family|dad|mum|mom|father|mother|guardian|spouse|husband|wife).*\b(think|allow|support|sent|forced|pressure|approve)\b/.test(text),
    referred: /\b(friend|parent|teacher|someone|brother|sister|relative|neighbor|neighbour).*\b(sent|told|recommended|referred|said|shared)\b/.test(text),
    comparing: /\b(compare|better than|versus|vs|another college|other college|other school|choose kvtc|why kvtc)\b/.test(text),
    researchingFor: /\b(my son|my daughter|my child|my brother|my sister|my spouse|my wife|my husband|employee|student|client|beneficiary|ngo|researching for|asking for someone|mtoto wangu)\b/.test(text),
    parentCourseUncertainty: /\b(my son|my daughter|my child|mtoto wangu)\b.*\b(does not know|doesn't know|not sure|unsure|what to do|what course|which course|sijui|hajui|hajajua|afanye nini|achague nini)\b/.test(text),
    lost: /\b(i feel lost|feel lost|i do not know what to do|i don't know what to do|dont know what to do|lost|confused|no direction|what should i do with my life|sijui)\b/.test(text),
    broke: /\b(can'?t afford|cannot afford|no money|broke|only have|i have only|my budget|too expensive)\b/.test(text),
    ready: /\b(ready to apply|i am ready|i want to apply|start application|apply now|no time|quickly|fast)\b/.test(text),
    reluctant: /\b(parent.*sent|mum.*sent|dad.*sent|forced|i don't want|i do not want|not interested|just checking)\b/.test(text),
  };
}

function mergeStudentSignals(target, signals) {
  for (const [key, value] of Object.entries(signals)) {
    if (value) target[key] = value;
  }
}

// ─── Conversation memory extraction ──────────────────────────────────────────
/**
 * Scans full history to build a memory object:
 *   { lastCourse, lastIntent, emotion, language, explainedTopics[], isParent }
 */
function buildMemory(history, courses) {
  const memory = {
    lastCourse: null,
    lastIntent: null,
    awaitingRecommendationAnswers: false,
    awaitingApplicationConfirmation: false,
    emotion: 'neutral',
    language: 'english',
    isParent: false,
    studentSignals: {},
    intentCounts: {},
    explainedTopics: [], // track what was already covered to avoid repetition
  };

  for (const msg of history) {
    const text = normalise(msg.content || msg.text || '');

    // Language
    if (detectSwahili(text)) memory.language = 'swahili';

    // Emotion
    const emo = detectEmotion(text);
    if (emo !== 'neutral') memory.emotion = emo;
    if (emo === 'parent') memory.isParent = true;

    // Course mentioned
    const course = extractCourse(text, courses);
    if (course) memory.lastCourse = course;

    if (msg.role === 'user') {
      mergeStudentSignals(memory.studentSignals, detectStudentSignals(text));
      for (const intent of scoreIntents(text, 4)) {
        memory.intentCounts[intent.name] = (memory.intentCounts[intent.name] || 0) + 1;
      }
    }

    // Topics explained (from assistant messages)
    if (msg.role === 'assistant') {
      if (text.includes('annual tuition') || text.includes('ksh 9,000')) memory.explainedTopics.push('fees');
      if (text.includes('passport photo') || text.includes('result slip')) memory.explainedTopics.push('requirements');
      if (text.includes('january') && text.includes('may') && text.includes('september')) memory.explainedTopics.push('intake');
      if (text.includes('mpesa') || text.includes('kcb') || text.includes('co-operative bank')) memory.explainedTopics.push('payment');
      if (
        (text.includes('indoors') && text.includes('outdoors') &&
          (text.includes('what do you enjoy') || text.includes('subjects or activities'))) ||
        (text.includes('which area interests you') && text.includes('describe what you enjoy'))
      ) {
        memory.awaitingRecommendationAnswers = true;
      }
      if (text.includes('want to apply for this course') || text.includes('help starting an application')) {
        memory.awaitingApplicationConfirmation = true;
      }
      if (text.includes('based on') && text.includes('suitable options')) {
        memory.awaitingRecommendationAnswers = false;
      }
      if (
        text.includes('course recommendation cancelled') ||
        text.includes('course recommendation paused') ||
        text.includes('my strongest match is')
      ) {
        memory.awaitingRecommendationAnswers = false;
      }
      if (text.includes('continue with the') && text.includes('application now')) {
        memory.awaitingApplicationConfirmation = false;
      }
    }
  }

  return memory;
}

// ─── Course Entity Extraction ─────────────────────────────────────────────────
const COURSE_ALIASES = {
  electrical:   ['electrical', 'electric', 'electronics', 'electrician', 'wiring', 'umeme', 'fundi umeme', 'electrcal', 'electical', 'electronis'],
  plumbing:     ['plumbing', 'plumber', 'pipes', 'pipe', 'drainage', 'maji', 'fundi maji', 'pluming', 'plumbin'],
  welding:      ['welding', 'welder', 'fabrication', 'metal work', 'chuma', 'wlding', 'fabication'],
  motor:        ['motor', 'vehicle', 'mechanic', 'automobile', 'gari', 'engine', 'mechanical', 'garage', 'auto', 'mechnaic', 'mechanik'],
  hair:         ['hair', 'salon', 'hairdressing', 'hairdresser', 'nywele', 'beauty hair', 'hairdresing'],
  beauty:       ['beauty', 'makeup', 'cosmetic', 'skincare', 'esthetics', 'beuty'],
  food:         ['food', 'catering', 'cooking', 'chef', 'hotel', 'hospitality', 'nutrition', 'beverage', 'cookin'],
  computer:     ['computer', 'ict', 'it course', 'programming', 'software', 'coding', 'digital', 'kompyuta', 'ms office', 'office package', 'compter', 'computr'],
  carpentry:    ['carpentry', 'carpenter', 'woodwork', 'wood', 'furniture', 'joinery', 'mbao', 'carpenty'],
  masonry:      ['masonry', 'mason', 'brickwork', 'bricks', 'building', 'construction', 'ujenzi', 'fundi', 'masonary'],
  fashion:      ['fashion', 'garment', 'tailoring', 'tailor', 'cutting', 'sewing', 'nguo', 'design clothes', 'dressmaking', 'fashon'],
  solar:        ['solar', 'pv', 'solar panel', 'renewable energy', 'solar installation', 'sola'],
  security:     ['security', 'cctv', 'alarm', 'surveillance', 'security system', 'intruder', 'securty'],
  cna:          ['cna', 'caregiver', 'nursing', 'nurse', 'care', 'healthcare', 'medical assistant', 'patient care', 'health', 'caregiving'],
  baking:       ['baking', 'bakery', 'pastry', 'cake', 'bread', 'mkate', 'confectionery', 'bakin'],
  barista:      ['barista', 'coffee', 'beverage', 'drinks', 'tea making', 'mixology', 'barister'],
  driving:      ['driving', 'driver', 'ntsa', 'license', 'licence', 'dereva', 'driving school', 'learner', 'drivng'],
};

function extractCourse(msg, courses) {
  if (!courses || courses.length === 0) return null;

  const exactCourse = courses.find(course => {
    const normalizedName = normalise(course.name);
    return normalizedName.length >= 4 && msg.includes(normalizedName);
  });
  if (exactCourse) return exactCourse;

  let bestMatch = null;
  let bestScore = 0;

  for (const [key, aliases] of Object.entries(COURSE_ALIASES)) {
    // Exact alias match
    let aliasScore = aliases.filter(alias => containsAlias(msg, alias)).length * 3;

    // Fuzzy match on the course key word itself (catches bad spelling)
    if (aliasScore === 0 && fuzzyMatch(msg, key, 2)) aliasScore = 1;

    if (aliasScore > bestScore) {
      const found = courses.find(c =>
        c.name.toLowerCase().includes(key) ||
        (c.tag && c.tag.toLowerCase().includes(key))
      );
      if (found) {
        bestScore = aliasScore;
        bestMatch = found;
      }
    }
  }

  return bestMatch;
}

// ─── Multi-intent scoring ─────────────────────────────────────────────────────
const INTENT_SCORERS = {
  greeting:     msg => /^(hi|hello|hey|habari|sasa|niaje|mambo|hujambo|howdy|good (morning|afternoon|evening)|salaam)/.test(msg) ? 10 : 0,
  farewell:     msg => matches(msg, ['bye', 'goodbye', 'kwaheri', 'good night', 'see you', 'later']) ? 8 : 0,
  thanks:       msg => matches(msg, ['thank', 'thanks', 'asante', 'sawa sawa', 'helpful', 'awesome', 'great help']) ? 6 : 0,
  positive:     msg => /^(ok|okay|alright|sure|got it|noted|understood|sounds good|i see|cool|nice|perfect|great|wow|amazing|sawa|safi|poa)/.test(msg) ? 6 : 0,
  fees: msg => {
    let s = 0;
    if (/\b(fee|fees|cost|price|tuition|payment|pay|ksh|money|affordable|charges|bei|pesa)\b/.test(msg) || matches(msg, ['how much'])) s += 5;
    if (matches(msg, ['term', 'annual', 'per year', 'breakdown', 'installment', 'afford', 'bursary', 'loan'])) s += 3;
    if (/\b(i have|my budget is|budget of|only have)\s+(only\s+)?(?:ksh|sh)?\s*\d[\d,]*/i.test(msg)) s += 8;
    return s;
  },
  requirements: msg => {
    let s = 0;
    if (matches(msg, ['requirement', 'qualification', 'eligible', 'can i join', 'what do i need', 'documents', 'docs', 'who can join'])) s += 6;
    if (matches(msg, ['kcse', 'kcpe', 'grade', 'form 4', 'certificate', 'result', 'minimum', 'id', 'national id'])) s += 5;
    return s;
  },
  intake: msg => {
    let s = 0;
    if (matches(msg, ['intake', 'enroll', 'enrollment', 'register', 'when can i join', 'when does it start', 'deadline', 'closing date', 'still open'])) s += 7;
    if (matches(msg, ['january', 'may', 'september', 'open', 'closed', 'next intake'])) s += 4;
    if (matches(msg, ['when', 'start', 'begin', 'opening'])) s += 2;
    return s;
  },
  apply: msg => {
    let s = 0;
    if (matches(msg, ['how to apply', 'apply', 'application', 'i want to apply', 'ready to apply', 'start application', 'admission form', 'online form'])) s += 7;
    if (/^(apply|i want to apply|ready to apply|i am ready)/.test(msg)) s += 5;
    return s;
  },
  contact:      msg => matches(msg, ['contact', 'phone', 'call', 'email', 'whatsapp', 'location', 'where', 'address', 'office', 'visit', 'map']) ? 6 : 0,
  list_courses: msg => matches(msg, ['all courses', 'list of courses', 'what courses', 'what do you offer', 'what can i study', 'available courses', 'show me courses']) || /^(course|courses|programme|programmes)$/.test(msg) ? 8 : 0,
  career:       msg => (
    /\b(job|jobs|career|careers|employment|salary|earn|earning|income|work|prospects)\b/.test(msg) ||
    matches(msg, ['after graduating', 'after course', 'after finishing'])
  ) ? 6 : 0,
  self_employment: msg => matches(msg, ['self employ', 'own business', 'own shop', 'own salon', 'own garage', 'entrepreneur', 'hustle', 'freelance', 'startup', 'work for myself', 'make money']) ? 7 : 0,
  help_choose:  msg => matches(msg, ['help me choose', 'help choosing', 'which course', 'what course', 'recommend', 'best course', 'suitable', 'what should i study', 'not sure', 'confused', 'undecided', 'advise me', 'guide me', 'suggest']) ? 7 : 0,
  duration:     msg => matches(msg, ['how long', 'duration', 'how many years', 'how many months', 'period', 'takes how long', 'time to complete']) ? 7 : 0,
  certification: msg => matches(msg, ['certificate', 'certification', 'nita', 'knec', 'accredited', 'recognized', 'diploma', 'is it valid', 'government approved', 'accepted']) ? 7 : 0,
  mpesa:        msg => matches(msg, ['mpesa', 'm-pesa', 'lipa', 'paybill', 'till', 'mobile money', 'pay online', 'online payment']) ? 8 : 0,
  short_courses: msg => matches(msg, ['short course', 'part time', 'evening class', 'weekend', 'quick course', 'few months', '3 months', 'six months']) ? 7 : 0,
  human_agent:  msg => (
    /\b(talk|speak|chat)\s+(to|with)\s+(a\s+)?(human|person|agent|representative|real person|admissions)\b/.test(msg) ||
    matches(msg, ['talk to someone', 'real person', 'human agent', 'admissions officer', 'connect me', 'transfer me'])
  ) ? 9 : 0,
};

/**
 * Score all intents and return those above threshold, sorted by score.
 * This enables multi-intent handling.
 */
function scoreIntents(msg, threshold = 4) {
  return Object.entries(INTENT_SCORERS)
    .map(([name, scorer]) => ({ name, score: scorer(msg) }))
    .filter(i => i.score >= threshold)
    .sort((a, b) => b.score - a.score);
}

function isSimpleGreeting(msg) {
  return /^(hi|hello|hey|habari|sasa|niaje|mambo|hujambo|howdy|good (morning|afternoon|evening)|salaam)\s*$/.test(msg);
}

// ─── Response composers ───────────────────────────────────────────────────────

function emotionPrefix(emotion) {
  switch (emotion) {
    case 'anxious':    return pick(['Take a deep breath — you\'ve got this! 💪 ', 'No need to worry at all — I\'m here to guide you every step! 😊 ', 'Many students feel unsure at first, and that\'s completely okay. Let me help! 🌟 ']);
    case 'excited':    return pick(['Love the energy! 🔥 ', 'That enthusiasm is going to take you far! 🚀 ', 'Amazing attitude — let\'s go! 🎉 ']);
    case 'vulnerable': return pick(['I want you to know that Kinoo VTC welcomes students from many backgrounds. 🤝 ', 'Your past doesn\'t define your future. Here\'s what you need to know: 💙 ', 'Don\'t let your situation hold you back. Let me help you understand the available options. 🌱 ']);
    case 'parent':     return pick(['Thank you for looking out for your child\'s future — that means everything. 🙏 ', 'What a caring parent! Let me give you all the information you need to make the best decision. 👨‍👩‍👧 ']);
    default:           return '';
  }
}

function respondGreeting(contact, memory) {
  if (memory.language === 'swahili') {
    return `Karibu sana! 🇰🇪 Mimi ni ARIA, msaidizi wako wa masomo hapa Kinoo VTC.\n\nNaweza kukusaidia na:\n- 🎓 Kuchagua kozi inayokufaa\n- 💰 Bei za masomo\n- 📝 Jinsi ya kuomba\n- 📞 Kuwasiliana na timu yetu\n\nUnahitaji msaada gani leo? 😊`;
  }
  const prefix = memory.isParent
    ? 'Welcome! Thank you for reaching out on behalf of your child. 👨‍👩‍👧 I\'m ARIA, Kinoo VTC\'s virtual admissions assistant.\n\nI\'ll make sure you have everything you need to help them make a great decision!\n\nWhat would you like to know?'
    : pick([
        `Hey there! 👋 Welcome to **Kinoo Vocational Training Centre**! I'm ARIA, the virtual admissions assistant.\n\nI can help you with:\n- 🎓 Exploring courses and finding the right fit\n- 💰 Understanding fees and payment options\n- 📝 Walking you through the online application\n- 📞 Connecting you with our team\n\nWhat can I help you with today? 😊`,
        `Hello! 🌟 Great to have you here at Kinoo VTC! I'm ARIA.\n\nSome things students usually ask me:\n- "What courses do you offer?"\n- "How much are the fees?"\n- "Can I join without top grades?"\n\nWhat's on your mind? 👇`,
        `Karibu! 🎓 I'm ARIA from Kinoo VTC — your guide to starting your vocational training journey.\n\nWhere would you like to begin? I can tell you about our courses, fees, how to apply, or anything else! 😊`,
      ]);
  return prefix;
}

function respondFees(feeStructure, memory, short = false) {
  const annual   = feeStructure?.annualTuition?.toLocaleString() || '27,000';
  const regTotal = feeStructure?.admissionTotal?.toLocaleString() || '6,500';
  const terms    = (feeStructure?.termBreakdown || [])
    .map(t => `• **${t.label}:** KSh ${t.amount.toLocaleString()}`).join('\n')
    || '• Term 1: KSh 9,000\n• Term 2: KSh 9,000\n• Term 3: KSh 9,000';

  if (short) return `Annual tuition is **KSh ${annual}**, paid in three terms. The listed one-time registration charges total **KSh ${regTotal}**.`;

  if (memory.language === 'swahili') {
    return `Bei ya masomo hapa Kinoo VTC ni nafuu sana kwa sababu inasaidiwa na serikali! 💳\n\n- **Ada ya kila mwaka:** KSh ${annual}\n${terms}\n- **Ada ya usajili (mara moja):** KSh ${regTotal}\n- **Ada ya ombi:** KSh 500 (M-PESA)\n\nUnalipa kila muhula — sio lazima ulipe yote mara moja! Je, unataka kujua zaidi? 😊`;
  }

  return `Here is the current general fee structure:\n\n**Annual tuition:** KSh ${annual}\n${terms}\n**Listed one-time registration charges:** KSh ${regTotal}\n**Online application fee:** KSh 500\n\nShort-course fees differ by programme. Tell me the course name and I will show its listed fee.`;
}

function respondCourseFees(course, memory, short = false) {
  const fee = formatCourseFee(course);
  const duration = course.dur || 'Contact admissions for the duration';

  if (memory?.language === 'swahili') {
    return `Ada ya **${course.name}** ni **${fee}**.\n\n**Muda:** ${duration}\n**Cheti:** ${course.cert || 'Wasiliana na ofisi ya usajili'}\n\nUnataka kujua mahitaji ya kujiunga au nikusaidie kuomba?`;
  }

  if (short) {
    return `**${course.name}** costs **${fee}** and takes **${duration}**.`;
  }

  return `The fee for **${course.name}** is **${fee}**.\n\n**Duration:** ${duration}\n**Certification:** ${course.cert || 'Contact admissions for details'}\n\nWould you like the entry requirements or help applying for this course?`;
}

function respondBudget(msg, feeStructure, course = null) {
  const amountMatch = msg.match(/\d[\d,]*/);
  const amount = amountMatch ? Number(amountMatch[0].replace(/,/g, '')) : null;
  const applicationFee = feeStructure?.admissionFees?.find(item =>
    /admission fee|application/i.test(item.item)
  )?.amount || 500;
  const registrationTotal = feeStructure?.admissionTotal || 3450;
  const firstTerm = feeStructure?.termBreakdown?.[0]?.amount || 9000;

  if (!amount) return respondFees(feeStructure, { language: 'english' }, true);

  const courseLine = course
    ? `The listed fee for **${course.name}** is **${formatCourseFee(course)}**.`
    : `Full-programme tuition is currently listed as **KSh ${firstTerm.toLocaleString()} per term**.`;

  const coverage = amount >= firstTerm
    ? `That amount can cover the listed first-term tuition for a full programme.`
    : amount >= registrationTotal
      ? `That amount can cover the listed one-time admission charges of **KSh ${registrationTotal.toLocaleString()}**, but it is below the **KSh ${firstTerm.toLocaleString()}** first-term tuition.`
      : amount >= applicationFee
        ? `That amount can cover the **KSh ${applicationFee.toLocaleString()}** online application fee, but it is below the listed admission charges and first-term tuition.`
        : `That amount is below the **KSh ${applicationFee.toLocaleString()}** online application fee.`;

  return `You currently have **KSh ${amount.toLocaleString()}**. ${courseLine}\n\n${coverage}\n\nFor any payment arrangement or bursary guidance, please confirm directly with admissions because ARIA cannot approve a payment plan.`;
}

function latestBudgetAmount(history) {
  const budgetMessage = [...history].reverse().find(item => {
    if (item.role && item.role !== 'user') return false;
    return /\b(i have|my budget is|budget of|only have|i only have)\s+(only\s+)?(?:ksh|sh)?\s*\d[\d,]*/i
      .test(item.content || item.text || '');
  });
  const match = (budgetMessage?.content || budgetMessage?.text || '').match(/\d[\d,]*/);
  return match ? Number(match[0].replace(/,/g, '')) : null;
}

function budgetContextNote(feeStructure, history, course = null) {
  const amount = latestBudgetAmount(history);
  if (!amount) return '';

  const firstTerm = feeStructure?.termBreakdown?.[0]?.amount || 9000;
  const admissionTotal = feeStructure?.admissionTotal || 3450;
  const applicationFee = feeStructure?.admissionFees?.find(item =>
    /admission fee|application/i.test(item.item)
  )?.amount || 500;
  const courseAmount = numericFee(course?.fees);
  const annualCourse = /year/i.test(String(course?.fees || ''));

  if (course && courseAmount && !annualCourse) {
    const shortCourseLine = amount >= courseAmount
      ? `that can cover the listed **${course.name}** course fee of **${formatMoney(courseAmount)}**.`
      : `that is below the listed **${course.name}** course fee of **${formatMoney(courseAmount)}**.`;
    return `\n\n**Smart note:** You mentioned **${formatMoney(amount)}** earlier; ${shortCourseLine} ARIA can explain the figures, but admissions must confirm any payment arrangement.`;
  }

  const fullProgrammeLine = amount >= firstTerm
    ? `that can cover the listed first-term tuition of **${formatMoney(firstTerm)}** for a full programme.`
    : amount >= admissionTotal
      ? `that can cover the listed admission charges of **${formatMoney(admissionTotal)}**, but it is below first-term tuition of **${formatMoney(firstTerm)}**.`
      : amount >= applicationFee
        ? `that can cover the **${formatMoney(applicationFee)}** online application fee, but not the listed admission charges or first-term tuition.`
        : `that is below the **${formatMoney(applicationFee)}** online application fee.`;

  return `\n\n**Smart note:** You mentioned **${formatMoney(amount)}** earlier; ${fullProgrammeLine} Admissions should confirm any special arrangement or bursary guidance.`;
}

function intakeContextNote(intake, history) {
  if (!intake?.isOngoing || !intake?.endDate) return '';

  const alreadyDiscussed = history.some(item =>
    /intake|deadline|january|may|september/i.test(item.content || item.text || '')
  );
  if (alreadyDiscussed) return '';

  const endDate = new Date(intake.endDate);
  if (Number.isNaN(endDate.getTime())) return '';

  const today = new Date();
  const daysLeft = Math.ceil((endDate.getTime() - today.getTime()) / 86400000);
  if (daysLeft < 0 || daysLeft > 45) return '';

  const formattedDate = endDate.toLocaleDateString('en-KE', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  const timing = daysLeft === 0 ? 'today' : `in about ${daysLeft} day${daysLeft === 1 ? '' : 's'}`;

  return `\n\n**Heads-up:** applications are currently open for **${intake.currentTerm || 'the current intake'}**, with the listed deadline **${formattedDate}** (${timing}).`;
}

function proactiveContextNote(db, history, course = null) {
  return [
    budgetContextNote(db.feeStructure, history, course),
    intakeContextNote(db.intake, history),
  ].filter(Boolean).join('');
}

function respondTrustDoubt(db) {
  const courseCount = db.courses?.length || 0;
  const principal = db.leadership?.find(person => /principal/i.test(person.title) && !/deputy/i.test(person.title));
  return `That is the right question to ask before choosing any institution.\n\nHere is the verified picture I can give you: **Kinoo Vocational Training Centre** is listed as a public vocational training centre under the **County Government of Kiambu**. The current website records show **${courseCount} programmes**, practical departments, NITA/KNEC/internal certification depending on the course, and a campus in Kikuyu.\n\nWhat I will not do is oversell it. The smart next step is to verify the course you want, the exam body, fees, and reporting requirements before paying. ${principal ? `The current website record lists **${principal.name}** as Principal.` : ''}\n\nWould you like me to help you verify a specific course, or compare KVTC with another institution?`;
}

function respondOutcomeDoubt(course) {
  if (course) {
    const careers = (course.careers || []).slice(0, 4).map(item => `- ${item}`).join('\n') || '- Ask admissions for current career guidance';
    return `That is the real question behind most course choices: **will this skill help me move forward?**\n\nFor **${course.name}**, the verified course record lists these career paths:\n${careers}\n\nA certificate alone does not guarantee a job. What helps is practical skill, attendance, portfolio/work samples where relevant, discipline, and applying early for attachments or entry-level work.\n\nIf you want, I can help you compare this course with one that may be stronger for self-employment.`;
  }

  return `You are right to think beyond the certificate. A good course should give you a practical skill, not just a paper.\n\nAt KVTC, I can help you compare courses by:\n- practical skill learned\n- duration\n- listed certificate body\n- self-employment potential\n- fee level\n\nTell me one course you are considering, or say **help me choose** and I will narrow it down.`;
}

function respondTooLateConcern() {
  return `No, it is not too late to start. Many vocational students are not coming straight from school: some paused, worked, raised children, changed direction, or simply needed a second chance.\n\nFor KVTC, the key practical questions are simpler:\n- Are you ready to attend training consistently?\n- Do you have your ID or birth certificate documents?\n- Do you want a full programme or a shorter skill course first?\n\nIf you feel unsure, start small: tell me your age range, budget, and whether you prefer indoors or hands-on work.`;
}

function respondFamilyPressure() {
  return `That matters. Course choice is not only about fees and duration; family support can affect whether you stay motivated.\n\nA good way to handle it is to separate two things:\n1. **What your family wants for you**\n2. **What you can actually see yourself doing every day**\n\nIf you tell me what they are pushing you toward and what you personally like, I will help you compare both options calmly.`;
}

function respondBurnedBefore(contact) {
  return `I understand why you would be careful. If someone has paid fees before and been disappointed, every school starts from zero trust.\n\nBefore paying anything, verify these four things:\n- the exact course name and certificate body\n- official fees and bank/payment instructions\n- reporting requirements\n- admissions contacts and physical location\n\nFor KVTC, the verified contacts I have are **${contact?.phone1 || '0113 582 008'}**, **${contact?.phone2 || '0748 455 116'}**, and **${contact?.email || 'kinoovtc@gmail.com'}**. I can also show the current fee structure before you make any decision.`;
}

function respondReferralContext() {
  return `Good to know. If someone sent you here, let us first check what they told you so you do not make a decision from secondhand information.\n\nWhat did they say KVTC is good for: affordable fees, a specific course, practical training, or quick admission?\n\nTell me that, and I will verify it against the current course and fee records.`;
}

function respondComparisonShopper() {
  return `Smart move. Do not choose a college only because it looks good online.\n\nCompare KVTC against the other institution using five things:\n- total cost, not just application fee\n- certificate body for your course\n- practical training setup\n- distance/transport cost\n- how clearly they explain admission requirements\n\nTell me the other institution or course you are comparing with, and I will help you build a clean comparison using verified KVTC data.`;
}

function respondResearchingForSomeone(contact) {
  return `That changes the kind of information you need. If you are researching for someone else, focus on decision safety: fees, requirements, course fit, reporting date, and who to call for confirmation.\n\nI can prepare a short summary for a parent, spouse, employer, or sponsor. For official confirmation, use **${contact?.phone1 || '0113 582 008'}** or **${contact?.email || 'kinoovtc@gmail.com'}**.\n\nWho are you researching for, and what course are they considering?`;
}

function respondParentCourseUncertainty(db, memory) {
  if (memory.language === 'swahili') {
    return `Naelewa kabisa. Mtoto akimaliza shule na bado hajajua afanye nini, si vizuri kumlazimisha kozi haraka.\n\nTuanzie kwa maswali matatu rahisi:\n1. Anapenda vitu vya **mikono/practical**, **kompyuta/ofisi**, au **ubunifu/biashara**?\n2. Anapendelea kazi ya **ndani**, **nje**, au zote mbili?\n3. Mnataka kozi ya muda mfupi kwanza, au programme ya miaka 2?\n\nUkinijibu hayo, nitapendekeza kozi zilizopo KVTC pekee, kama Electrical, Computer, Fashion, Hair & Beauty, Food & Beverage, Plumbing, Mechanics, Barista au Baking.`;
  }

  return `I understand. When a child has finished school but still does not know what to do, the best move is not to force a course immediately.\n\nLet us narrow it gently:\n1. Do they enjoy **hands-on work**, **computer/office work**, or **creative/business work**?\n2. Would they prefer working **indoors**, **outdoors**, or both?\n3. Do you want a short course first, or a full 2-year programme?\n\nReply with those answers and I will suggest only courses currently listed by Kinoo VTC.`;
}

function respondLostStudent() {
  return `That is okay. A lot of people feel exactly that way before they find a path that finally makes sense.\n\nLet us slow it down. Is the biggest issue that you **do not know what you are interested in**, or that you are worried about whether you can make it work **financially or academically**?\n\nReply with just one word if you want: **interest**, **money**, or **grades**.`;
}

function repeatedFeesNudge(feeStructure) {
  const firstTerm = feeStructure?.termBreakdown?.[0]?.amount || 9000;
  const admissionTotal = feeStructure?.admissionTotal || 3450;
  const coop = feeStructure?.bankCoop;
  const kcb = feeStructure?.bankKCB;

  return `\n\nSince fees have come up more than once, here is the practical payment picture:\n- Online application fee: **KSh 500**\n- Listed one-time admission charges: **${formatMoney(admissionTotal)}**\n- Full programme tuition per term: **${formatMoney(firstTerm)}**\n- Registration/admission bank: **${coop?.bankName || 'Co-operative Bank, Kangemi Branch'}**, A/C **${coop?.accountNumber || '01141151624400'}**\n- Tuition bank: **${kcb?.bankName || 'KCB Kikuyu'}**, A/C **${kcb?.accountNumber || '1104169527'}**\n\nARIA can explain the figures, but only Admissions can approve or confirm any special arrangement.`;
}

function conversationArcResponse(msg, db, memory, course) {
  const currentSignals = detectStudentSignals(msg);
  const signals = { ...memory.studentSignals, ...Object.fromEntries(Object.entries(currentSignals).filter(([, value]) => value)) };

  if (currentSignals.parentCourseUncertainty) return respondParentCourseUncertainty(db, memory);
  if (isSimpleGreeting(msg)) return null;

  if (signals.trustDoubt && /\b(good|legit|real|trusted|trust|worth|scam|fake|cheat|cheated|burned|conned)\b/.test(msg)) {
    return /burned|cheated|conned|scam/.test(msg) ? respondBurnedBefore(db.contact) : respondTrustDoubt(db);
  }
  if (signals.outcomeDoubt) return respondOutcomeDoubt(course || memory.lastCourse);
  if (signals.tooLate) return respondTooLateConcern();
  if (signals.familyPressure) return respondFamilyPressure();
  if (signals.referred) return respondReferralContext();
  if (signals.comparing) return respondComparisonShopper();
  if (signals.researchingFor) return respondResearchingForSomeone(db.contact);
  if (signals.lost && !memory.awaitingRecommendationAnswers) return respondLostStudent();
  if (signals.reluctant) {
    return `Fair enough. You do not have to choose anything today.\n\nLet us make this low-pressure: tell me one thing you do **not** want in a course, and I will avoid that direction while showing options that might actually interest you.`;
  }
  if ((memory.intentCounts.fees || 0) >= 1 && scoreIntents(msg).some(intent => intent.name === 'fees') && !course) {
    return respondFees(db.feeStructure, memory) + repeatedFeesNudge(db.feeStructure);
  }

  return null;
}

function respondRequirements(memory, short = false) {
  if (short) {
    return `You need: ID copy, 2 passport photos, result slip (if any), medical cert, and stationery. No strict grades needed! 💪`;
  }

  if (memory.language === 'swahili') {
    return `Huhitaji daraja kubwa kujiunga na Kinoo VTC! ✅\n\nUnachohitaji:\n- 🪪 Nakala ya kitambulisho au cheti cha kuzaliwa\n- 📷 Picha 2 za pasipoti\n- 📜 Matokeo ya KCSE/KCPE — **kama una** (hakuna daraja la chini!)\n- 🏥 Cheti cha afya (kutoka kliniki yoyote)\n- 📔 Vitabu: quire counter books 2, exercise books 4, folio papers 3\n\nKozi fupi? Kitambulisho na picha tu! Je, uko tayari kuomba? 😊`;
  }

  return pick([
    `Here's exactly what you need to join Kinoo VTC ✅\n\n**Bring on reporting day:**\n- 📷 Two (2) passport-size photos\n- 🪪 Copy of National ID or Birth Certificate\n- 📄 Photocopies (set)\n- 📋 Three (3) foolscap papers\n- 📜 Copy of previous result slip — **KCPE or KCSE if you have one** (no strict grade!)\n- 🏥 Medical certificate (any clinic)\n- 📔 Two (2) quire counter books\n- 📓 Four (4) A4 exercise books\n\n**Age:** 16+ years (18+ for Driving)\n\n⭐ **Key point:** No minimum grade required! We accept everyone with the drive to succeed. Ready to apply? 💪`,

    `No need to stress about requirements! Kinoo VTC is open to everyone 🎓\n\n**What you need:**\n1. National ID or Birth Certificate (copy)\n2. Two (2) passport photos\n3. Previous result slip — IF you have one (no minimum grade!)\n4. Medical certificate\n5. Basic stationery (foolscap, counter books, exercise books)\n\n**Short courses?** Even simpler — just your ID and a photo!\n\nNo academic barriers here. We train people who are ready to work hard and build a future. Want to start now? 😊`,
  ]);
}

function respondIntake(intake, short = false) {
  const isOpen  = intake?.isOngoing;
  const term    = intake?.currentTerm || 'Current Intake';
  const endDate = intake?.endDate
    ? new Date(intake.endDate).toLocaleDateString('en-KE', { day: 'numeric', month: 'long', year: 'numeric' })
    : 'Contact us for exact date';

  const statusLine = isOpen
    ? `✅ **Applications are OPEN right now** — ${term}!`
    : `⛔ The current intake is **closed**, but the next one opens soon!`;

  if (short) return `${statusLine} Intakes run in January, May, and September. Deadline: **${endDate}**.`;

  return pick([
    `📅 Kinoo VTC runs **three intakes every year:**\n- **January** Intake\n- **May** Intake\n- **September** Intake\n\n${statusLine}\nDeadline: **${endDate}**\n\nSpaces fill up fast — I recommend applying early! The online process takes less than 5 minutes. Want to start now? 🚀`,
    `Great timing to ask! 📆\n\n${statusLine}\n\nWe have **3 intakes per year** — January, May, and September.\nCurrent deadline: **${endDate}**\n\nYou can apply online right now without visiting campus. Shall I walk you through it? 😊`,
  ]);
}

function respondApply(contact, short = false) {
  if (short) return `Applying is 100% online — just say **"I am ready to apply"** and I'll collect your details right here! Takes about 3 minutes. 🚀`;

  return pick([
    `Applying to Kinoo VTC is simple — **3 ways** to do it:\n\n💬 **1. Right here with me (ARIA)**\nI'll collect your details and open a pre-filled form — fastest option!\n\n📚 **2. From the Courses Page**\nBrowse courses → pick one → click Apply.\n\n🏫 **3. Visit us in person**\nKikuyu, Kiambu County — our team will guide you.\n\n**What happens after you apply:**\n1. Submit your details\n2. Pay KSh 500 via M-PESA\n3. Receive your Admission Letter instantly! 📧\n\nReady to begin? Just say **"I am ready to apply"** 👇`,

    `Let me walk you through how to apply! 🎉\n\n**Option A — Chat with me (easiest):**\nI collect your info → Pre-filled form → Pay KSh 500 M-PESA → Done! ✅\n\n**Option B — Courses Page:**\nVisit /courses → Choose your course → Click Apply\n\n**Option C — Come to campus:**\nKikuyu, Kiambu · Hours: ${contact?.hours || 'Mon–Fri: 8am–5pm'}\n\nThe whole online process takes about **3–5 minutes** and you get your admission letter the same day! 🚀\n\nShall I start the application with you right now?`,
  ]);
}

function respondContact(contact) {
  return pick([
    `Here's everything you need to reach us at Kinoo VTC 📞\n\n- **Phone 1:** ${contact?.phone1 || '0113 582 008'}\n- **Phone 2:** ${contact?.phone2 || '0748 455 116'}\n- **Email:** ${contact?.email || 'kinoovtc@gmail.com'}\n- **Location:** Kikuyu, Kiambu County, Kenya\n- **Address:** P.O. Box 351-00902, Kikuyu\n- **Office Hours:** ${contact?.hours || 'Mon–Fri: 8am – 5pm'}\n\nYou can also **WhatsApp** us at **${contact?.phone1 || '0113 582 008'}** 📱\n\nOr skip the visit entirely and apply 100% online here! Can I help with anything else? 😊`,
    `No problem — here's how to find us! 📍\n\n📞 **Call/WhatsApp:** ${contact?.phone1 || '0113 582 008'} or ${contact?.phone2 || '0748 455 116'}\n📧 **Email:** ${contact?.email || 'kinoovtc@gmail.com'}\n🏫 **Campus:** Kikuyu, Kiambu County\n🕗 **Hours:** ${contact?.hours || 'Mon–Fri: 8am – 5pm'}\n\nOur team is friendly and will answer everything. Or I can answer most things right here! What else do you need? 😊`,
  ]);
}

function respondListCourses(courses) {
  const list = courses
    .map((c, i) => `${i + 1}. **${c.name}** — ${c.dur || 'Duration on request'} | ${c.cert || 'Certification on request'} | ${formatCourseFee(c)}`)
    .join('\n');
  return `Kinoo VTC currently lists **${courses.length} programmes** 🎓\n\n${list}\n\nWhich course would you like to explore? I can show its fee, duration, requirements, and listed career paths.`;
}

function respondCareer(course) {
  if (course) {
    const jobs    = (course.careers || []).slice(0, 5);
    const jobList = jobs.length > 0
      ? jobs.map(j => `• ${j}`).join('\n')
      : `• Employment in ${course.name}\n• Freelance / self-employment\n• Government and private sector roles`;
    return pick([
      `After completing **${course.name}** at Kinoo VTC, these are some relevant career paths:\n\n${jobList}\n\nActual opportunities and earnings vary by experience, location, and employer. Would you like the course requirements or application steps?`,
      `Great question about careers! 💼 With training in **${course.name}**, these are some relevant paths:\n\n${jobList}\n\nSelf-employment may also be possible depending on your experience, equipment, licensing, and local demand. Would you like the course requirements?`,
    ]);
  }
  return `Our programmes teach practical skills connected to several career paths:\n\n- **Electrical** → Electrician, solar installer, self-employment\n- **Mechanics** → Garage work, vehicle technician\n- **ICT** → Technical support, data entry, office work\n- **Hair/Beauty** → Salon work or salon business\n- **CNA** → Caregiving roles, subject to employer requirements\n- **Catering** → Kitchen, hospitality, or catering work\n\nEmployment and earnings are not guaranteed and vary by employer and experience. Which course interests you?`;
}

function respondJobOpportunityGuidance(courses = []) {
  const find = name => courses.find(course => course.name === name);
  const options = [
    ['Electrical and Electronics', 'broad hands-on work in wiring, maintenance, electronics and related solar paths'],
    ['Motor Vehicle Mechanics', 'practical repair skills connected to garages, maintenance and self-employment'],
    ['Computer Operator', 'office and ICT support skills used across many workplaces'],
    ['Hair Dressing and Beauty Therapy', 'salon employment and self-employment service paths'],
    ['Food & Beverage Production & Service Artisan', 'hospitality, kitchen, catering and restaurant service paths'],
  ]
    .map(([name, reason]) => ({ course: find(name), reason }))
    .filter(item => item.course);

  const list = options.map(({ course, reason }, index) => {
    const careers = (course.careers || []).slice(0, 2).join(', ') || 'listed career paths available';
    return `${index + 1}. **${course.name}** - ${course.dur}; ${formatCourseFee(course)}. ${reason}. Career examples: ${careers}.`;
  }).join('\n');

  return `There is no single course I should call "the best" for jobs, because employment depends on skill, effort, location and available openings. But from KVTC's listed programmes, these are strong options to compare:\n\n${list}\n\nFor faster entry, compare short courses like **Computer Packages**, **Barista**, **Baking & Pastry**, or **Security & Network Systems**. For deeper training, compare **Electrical**, **Motor Vehicle Mechanics**, **Computer Operator**, or **Food & Beverage**.\n\nWhich two would you like me to compare?`;
}

function respondSelfEmployment(course) {
  const examples = [
    { key: 'hair',       label: 'Hair Dressing',           business: 'salon services' },
    { key: 'motor',      label: 'Motor Vehicle Mechanics', business: 'garage services' },
    { key: 'electrical', label: 'Electrical',              business: 'electrical installation services' },
    { key: 'baking',     label: 'Baking & Pastry',         business: 'home or retail bakery' },
    { key: 'welding',    label: 'Welding & Fabrication',   business: 'fabrication workshop' },
    { key: 'carpentry',  label: 'Carpentry',               business: 'furniture workshop' },
    { key: 'fashion',    label: 'Fashion Design',          business: 'tailoring business' },
    { key: 'plumbing',   label: 'Plumbing',                business: 'plumbing services' },
  ];
  if (course) {
    const match = examples.find(e => course.name.toLowerCase().includes(e.key));
    if (match) {
      return `**${course.name}** can support a self-employment path such as **${match.business}**.\n\nIncome depends on experience, location, pricing, equipment, and customer demand, so ARIA does not promise an earning figure. Would you like the course fee and requirements?`;
    }
  }
  const list = examples.slice(0, 5).map(e => `- **${e.label}** → ${e.business}`).join('\n');
  return `Several courses can support self-employment:\n${list}\n\nStarting a business still requires planning, equipment, licensing where applicable, and customer development. Which path interests you?`;
}

function respondHelpChoose() {
  return `I can narrow the catalogue down for you. Please answer these three questions:\n\n1. What subjects or activities do you **enjoy**?\n2. Do you prefer working **indoors, outdoors, or both**?\n3. Are you interested in **employment, self-employment, or both**?\n\nReply briefly, for example: **1) mathematics 2) indoors 3) both**.\n\nYou can ask me something else at any time. Say **resume recommendation** to return here or **cancel recommendation** to close this guide.`;
}

function looksLikeRecommendationAnswers(msg) {
  const hasNumberedAnswers =
    /\b1\b/.test(msg) &&
    /\b2\b/.test(msg) &&
    /\b3\b/.test(msg);
  const hasWorkSetting = /\b(indoors?|outdoors?|inside|office|both)\b/.test(msg);
  const hasCareerGoal = /\b(employment|employed|job|self[\s-]?employment|business|entrepreneur|both)\b/.test(msg);

  return hasNumberedAnswers || (hasWorkSetting && hasCareerGoal);
}

function isUnsureCourseChoice(msg) {
  return /\b(i do not know|i don't know|dont know|don't know|no idea|not sure|unsure|confused|sijui|help me decide)\b/.test(msg);
}

function shortcutRecommendationAnswer(msg) {
  if (/^(a|option a|tech|technology|computer|office|digital)\b/.test(msg)) {
    return '1) computers and technology 2) indoors 3) employment';
  }
  if (/^(b|option b|hands on|tools|practical|outdoor|technical)\b/.test(msg)) {
    return '1) hands-on building work and tools 2) outdoors 3) both';
  }
  if (/^(c|option c|business|beauty|food|creative|self employment)\b/.test(msg)) {
    return '1) creative work food beauty and business 2) indoors 3) self-employment';
  }
  return null;
}

function respondUnsureCourseChoice() {
  return `No problem. Many good students start there, so let us make it easy.\n\nPick the one that feels closest:\n\n**A. Tech / office work** - computers, records, typing, systems\n**B. Practical hands-on work** - tools, wiring, repairs, building\n**C. Business / creative work** - beauty, fashion, food, baking\n\nReply with **A**, **B**, or **C** and I will recommend courses immediately. If none fits, say **ask me simple questions** and I will guide you gently.`;
}

const RECOMMENDATION_SIGNALS = [
  {
    label: 'mathematics and problem-solving',
    pattern: /\b(math|mathematics|numbers?|calculation|problem solving)\b/,
    match: course => /\bICT\b/i.test(course.tag) || /electrical|electronic|security|computer/i.test(course.name),
  },
  {
    label: 'computers and technology',
    pattern: /\b(computer|technology|tech|ict|network|digital|coding)\b/,
    match: course => /\bICT\b/i.test(course.tag) || /electronic|security|computer/i.test(course.name),
  },
  {
    label: 'creative work',
    pattern: /\b(creative|design|drawing|fashion|sewing|clothes|art)\b/,
    match: course => /fashion|beauty|hair/i.test(course.name),
  },
  {
    label: 'food and hospitality',
    pattern: /\b(cook|cooking|food|baking|cake|coffee|hospitality|hotel)\b/,
    match: course => /food|beverage|baking|barista/i.test(course.name),
  },
  {
    label: 'care and helping people',
    pattern: /\b(care|helping people|health|nursing|patient)\b/,
    match: course => /care giver|cna/i.test(course.name),
  },
  {
    label: 'vehicles and machines',
    pattern: /\b(car|cars|vehicle|engine|machine|driving|mechanic)\b/,
    match: course => /motor vehicle|driving|mechanic/i.test(course.name),
  },
  {
    label: 'hands-on building work',
    pattern: /\b(build|building|construction|repair|hands on|practical|tools|welding|plumbing)\b/,
    match: course => /construction/i.test(course.tag) || /welding|plumbing|masonry|electrical|mechanic/i.test(course.name),
  },
  {
    label: 'beauty and personal care',
    pattern: /\b(beauty|hair|salon|makeup|nails)\b/,
    match: course => /hair dressing|beauty/i.test(course.name),
  },
];

function courseDurationMonths(course) {
  const value = String(course.dur || '').toLowerCase();
  const amount = Number(value.match(/\d+/)?.[0] || 0);
  return value.includes('year') ? amount * 12 : amount;
}

function recommendationContext(message, history) {
  const current = normalise(message);
  const isRefinement = /\b(shorter|faster|quicker|cheaper|another|different|instead|prefer|do not want|don't want|not interested)\b/.test(current);
  if (!isRefinement) return current;

  const earlierPreference = [...history].reverse().find(item =>
    item.role === 'user' && looksLikeRecommendationAnswers(normalise(item.content || item.text || ''))
  );
  let earlier = normalise(earlierPreference?.content || earlierPreference?.text || '');
  if (/\b(indoors?|inside|office|outdoors?|outside|field work)\b/.test(current)) {
    earlier = earlier.replace(/\b(indoors?|inside|office|outdoors?|outside|field work|both)\b/g, ' ');
  }
  if (/\b(employment|job|self[\s-]?employment|business|entrepreneur)\b/.test(current)) {
    earlier = earlier.replace(/\b(employment|job|self[\s-]?employment|business|entrepreneur|both)\b/g, ' ');
  }
  return `${earlier} ${current}`.replace(/\s+/g, ' ').trim();
}

function rankCourseRecommendations(message, courses) {
  const signals = RECOMMENDATION_SIGNALS.filter(signal => signal.pattern.test(message));
  const wantsIndoor = /\b(indoors?|inside|office)\b/.test(message);
  const wantsOutdoor = /\b(outdoors?|outside|field work)\b/.test(message);
  const wantsBoth = /\bboth\b/.test(message);
  const wantsSelfEmployment = /\b(self[\s-]?employment|business|entrepreneur|own|yes)\b/.test(message);
  const wantsShort = /\b(short|shorter|fast|faster|quick|quicker|few months)\b/.test(message);
  const wantsCheaper = /\b(cheap|cheaper|affordable|low budget)\b/.test(message);
  const eligibleCourses = wantsShort
    ? courses.filter(course => {
        const months = courseDurationMonths(course);
        return months > 0 && months <= 6;
      })
    : courses;

  const rejectedPreference = message.match(/\b(?:do not want|don't want|not interested in|avoid)\s+([a-z &-]+)/)?.[1]?.trim();

  return eligibleCourses
    .filter(course => {
      const name = normalise(course.name);
      return !message.includes(`not ${name}`) &&
        !message.includes(`don't want ${name}`) &&
        !message.includes(`do not want ${name}`) &&
        !(rejectedPreference && name.includes(rejectedPreference));
    })
    .map((course, order) => {
      let score = 1;
      const reasons = [];
      const matchedSignals = signals.filter(signal => signal.match(course));
      const directInterest = normalise(course.name)
        .split(' ')
        .filter(word => word.length >= 5 && !['production', 'service', 'artisan', 'classes'].includes(word))
        .find(word => message.includes(word));

      if (directInterest) {
        score += 6;
        reasons.push(`directly matches your interest in ${directInterest}`);
      }

      if (matchedSignals.length) {
        score += matchedSignals.length * 5;
        reasons.push(`matches your interest in ${matchedSignals.map(signal => signal.label).join(' and ')}`);
      }
      if (wantsIndoor && /ICT|Cosmetology|Fashion|Hospitality|Short Course/i.test(course.tag)) {
        score += 3;
        reasons.push('fits an indoor work preference');
      }
      if (wantsIndoor && (/Construction|Engineering/i.test(course.tag) || /solar|driving|motor vehicle|welding|plumbing|masonry/i.test(course.name))) {
        score -= 2;
      }
      if (wantsOutdoor && (/Construction|Engineering/i.test(course.tag) || /solar|driving/i.test(course.name))) {
        score += 3;
        reasons.push('includes practical or field-based work');
      }
      if (wantsOutdoor && /ICT|Cosmetology|Fashion|Hospitality/i.test(course.tag)) {
        score -= 2;
      }
      if (wantsBoth) score += 1;

      const careers = (course.careers || []).join(' ');
      if (wantsSelfEmployment && /owner|contractor|caterer|designer|tailor|plumber|welder|mechanic/i.test(careers)) {
        score += 3;
        reasons.push('has a listed self-employment path');
      }

      const durationMonths = courseDurationMonths(course);
      if (wantsShort && durationMonths > 0 && durationMonths <= 6) {
        score += 5;
        reasons.push(`can be completed in ${course.dur}`);
      }

      const numericFee = Number(String(course.fees || '').replace(/[^\d]/g, '')) || Infinity;
      if (wantsCheaper && numericFee <= 15000) {
        score += 4;
        reasons.push('is among the lower-cost listed options');
      }

      return { course, score, reasons, order };
    })
    .sort((a, b) => b.score - a.score || (wantsShort
      ? courseDurationMonths(a.course) - courseDurationMonths(b.course)
      : a.order - b.order))
    .slice(0, 3);
}

export function buildCourseRecommendation(message, db, history = []) {
  const memory = buildMemory(history, db.courses || []);
  const current = normalise(message);
  const hasPriorRecommendation = history.some(item =>
    item.role === 'assistant' && /strongest (starting )?(suggestion|match)|recommended options/i.test(item.text || item.content || '')
  );
  const isRefinement = hasPriorRecommendation &&
    /\b(shorter|faster|quicker|cheaper|another|different|instead|prefer|do not want|don't want|not interested)\b/.test(current);

  if (!(memory.awaitingRecommendationAnswers && looksLikeRecommendationAnswers(current)) && !isRefinement) {
    return null;
  }

  const ranked = rankCourseRecommendations(recommendationContext(message, history), db.courses || []);
  if (!ranked.length) return null;

  const labels = ['Best match', 'Strong alternative', 'Also consider'];
  const courses = ranked.map(({ course, reasons }, index) => ({
    ...course,
    match_label: labels[index],
    why_it_fits: reasons.length
      ? `This ${reasons.join(', ')}.`
      : 'This is a broad option worth comparing with your other matches.',
    rail_items: [
      { icon: 'Clock3', title: 'Duration', content: course.dur },
      { icon: 'Banknote', title: 'Listed fee', content: formatCourseFee(course) },
      { icon: 'BriefcaseBusiness', title: 'Career examples', content: (course.careers || []).slice(0, 2).join(', ') || 'Ask Admissions' },
    ],
    actions: [
      { label: 'View requirements', action: 'send_message', payload: `What are the requirements for ${course.name}?`, type: index === 0 ? 'primary' : 'secondary' },
      { label: 'More details', action: 'send_message', payload: `Tell me more about ${course.name}`, type: 'secondary' },
    ],
  }));

  return {
    response_type: 'course_recommendation',
    text: `I weighed your interests, preferred work setting, and career goal against the current Kinoo VTC course catalogue. My strongest match is **${courses[0].name}**, with two alternatives below.`,
    title: isRefinement ? 'Updated course matches' : 'Your course matches',
    intro: 'These are recommendations, not guarantees. You stay in control and can refine them.',
    courses,
    actions: [
      { label: 'Compare top two', action: 'send_message', payload: `Compare ${courses[0].name} vs ${courses[1].name}`, type: 'primary' },
      { label: 'Show shorter options', action: 'send_message', payload: 'Show me shorter options instead', type: 'secondary' },
      { label: 'Start over', action: 'send_message', payload: 'Help me choose a course', type: 'tertiary' },
    ],
  };
}

function respondRecommendationAnswers(msg, db, history) {
  const result = buildCourseRecommendation(msg, db, history);
  if (!result) return respondHelpChoose();

  const list = result.courses.map((course, index) =>
    `${index + 1}. **${course.name}** - ${course.dur}; ${formatCourseFee(course)}. ${course.why_it_fits}`
  ).join('\n');

  return `${result.text}\n\n${list}${proactiveContextNote(db, history, result.courses[0])}\n\nAsk for requirements, compare the options, or tell me what you want changed.`;
}

function respondLeadership(db, msg) {
  const leaders = db.leadership || [];
  const principal = leaders.find(person => /principal/i.test(person.title) && !/deputy/i.test(person.title));
  const deputy = leaders.find(person => /deputy principal/i.test(person.title));

  if (/deputy/.test(msg)) {
    return deputy
      ? `The institution's current website record lists **${deputy.name}** as **${deputy.title}**.`
      : `I don't have a verified Deputy Principal record. Please contact admissions for confirmation.`;
  }

  if (/principal|head|leader|in charge/.test(msg)) {
    return principal
      ? `The institution's current website record lists **${principal.name}** as **${principal.title}**.`
      : `I don't have a verified Principal record. Please contact admissions for confirmation.`;
  }

  return null;
}

function respondInstitutionIdentity() {
  return `**KVTC** stands for **Kinoo Vocational Training Centre**. It is a public vocational training institution under the **County Government of Kiambu**, located in **Kikuyu along the Nairobi-Nakuru Highway**.\n\nKVTC offers practical certificate and short courses in areas such as engineering, ICT, hospitality, fashion, cosmetology, construction, caregiving, and driving.\n\nWould you like to explore the courses, view fees, or get directions?`;
}

function respondDuration(course, short = false) {
  if (course) {
    if (short) return `**${course.name}** takes **${course.dur || '2 years'}** to complete. Anything else?`;
    return pick([
      `**${course.name}** takes **${course.dur || '2 years'}** to complete at Kinoo VTC. 📅\n\nThe course record lists **${course.cert || 'NITA/KNEC'}** certification. Admissions can confirm the latest examination and recognition details.\n\nWant to know about fees or requirements? 😊`,
      `Great question! **${course.name}** is a **${course.dur || '2-year'}** programme. 🎓\n\nEvery term you build more practical skills — hands-on from day one. Want to know what careers it opens up? 💼`,
    ]);
  }
  return `Our durations vary by course:\n\n- **Full NITA/KNEC programmes:** 2–3 years\n- **Short/Certificate courses:** 3–6 months (Computer, Baking, Barista, Solar, Driving)\n\nAll split into **3 terms per year** so you're always progressing! Which course were you asking about? 😊`;
}

function respondCertification(course) {
  const cert = course?.cert || 'NITA/KNEC';
  const name = course?.name || 'our programmes';
  return pick([
    `The course record lists **${cert}** as the certification for **${name}**. Recognition and employer requirements can differ by role, so admissions can confirm the latest examination and certification details. Would you like their contact information?`,
    `**${name}** is listed with **${cert}** certification. I can explain the course duration and requirements, or connect you with admissions for official verification.`,
  ]);
}

function respondMpesa(feeStructure) {
  const bank = feeStructure?.bankKCB;
  return `Great news — M-PESA is the easiest way to pay! 📱\n\n**Application Fee (KSh 500):** Paid directly through the online form — enter your number, confirm on your phone, done!\n\n**Tuition Fees (KSh 9,000/term):** Bank deposit to:\n- **KCB Bank, Kikuyu Branch**\n- Account: **${bank?.accountNumber || 'Contact us for details'}**\n- Name: **${bank?.accountName || 'Kinoo VTC'}**\n\n**Registration Fees:** Co-operative Bank, Kangemi branch (see Admissions page for details)\n\nAlways keep your bank slip as proof! Anything else? 😊`;
}

function respondShortCourses(feeStructure) {
  const others = feeStructure?.otherCharges || [];
  const list   = others.length > 0
    ? others.map(o => `- **${o.item}:** KSh ${o.amount.toLocaleString()}`).join('\n')
    : `- Computer Packages: KSh 8,000\n- Driving (NTSA): contact us\n- Baking & Pastry: contact us\n- Barista/Coffee: contact us`;
  return `Yes! Kinoo VTC offers short courses listed in the current course catalogue. ⚡\n\n${list}\n\nCourse duration, schedules, requirements, and current fees can differ by programme. Which short course interests you? I can show its verified record or connect you with admissions.`;
}

function respondHumanAgent(contact) {
  return `Of course! Here are the verified admissions contacts. 🤝\n\n📞 **${contact?.phone1 || '0113 582 008'}**\n📞 **${contact?.phone2 || '0748 455 116'}**\n📧 **${contact?.email || 'kinoovtc@gmail.com'}**\n🕗 **${contact?.hours || 'Mon–Fri: 8am – 5pm'}**\n\nYou can also use the institution's WhatsApp contact. Is there anything I can answer before you contact the team? 😊`;
}

function respondSpecificCourse(course, feeStructure, memory, short = false) {
  const courseFee = formatCourseFee(course);
  const feeLabel = courseFeeLabel(course);
  const jobs = (course.careers || []).slice(0, 4).map(j => `• ${j}`).join('\n')
    || `• Ask admissions for the current career guidance for this course`;

  if (short) {
    return `**${course.name}** — ${course.dur || 'Duration on request'} | ${course.cert || 'Certification on request'} | ${courseFee}. Want full details? 😊`;
  }

  const parentExtra = memory?.isParent
    ? `\n\n**For parents:** Please ask admissions about supervision, student welfare, discipline policies, and verified graduate outcomes so you receive the institution's current official information.`
    : '';

  return pick([
    `Here's the current record for **${course.name}** at Kinoo VTC 🎓\n\n**Duration:** ${course.dur || 'Contact admissions'}\n**Certification:** ${course.cert || 'Contact admissions'}\n**${feeLabel}:** ${courseFee}\n\n**Listed career paths:**\n${jobs}${parentExtra}\n\nWould you like the requirements or help starting an application? 😊`,
    `Here are the current details for **${course.name}**. 📋\n\n⏱ **Duration:** ${course.dur || 'Contact admissions'}\n🏆 **Certificate:** ${course.cert || 'Contact admissions'}\n💰 **${feeLabel}:** ${courseFee}\n\n**Listed career paths:**\n${jobs}${parentExtra}\n\nWould you like the requirements or help starting an application? 👇`,
  ]);
}

function isFamilyInfluenceQuestion(msg) {
  return /\b(my|our)\s+(dad|father|mum|mom|mother|parent|uncle|aunt|brother|sister|guardian)\s+(is|was|works as|does|studied|knows)\b/.test(msg) &&
    /\b(what should i study|what course|which course|should i study|recommend|advise|follow|same|different)\b/.test(msg);
}

function respondFamilyInfluenceQuestion(course, db) {
  const courses = db.courses || [];
  const electrical = courses.find(item => item.name === 'Electrical and Electronics');
  const solar = courses.find(item => item.name === 'Solar PV Installation');
  const electronic = courses.find(item => item.name === 'Electronic Mechanics');
  const motor = courses.find(item => item.name === 'Motor Vehicle Mechanics');
  const primary = course || electrical;
  const related = [solar, electronic, motor].filter(Boolean).filter(item => item.name !== primary?.name).slice(0, 3);
  const relatedText = related.length
    ? related.map(item => `- **${item.name}** - ${item.dur}; ${formatCourseFee(item)}`).join('\n')
    : '- Ask admissions to help you compare related technical courses.';

  if (/electrician|electrical|wiring|electric/.test(normalise(primary?.name || '') + ' electrical electrician wiring')) {
    return `That is a strong foundation to grow up around. If your dad is an electrician, you may already understand the tools, discipline and real work environment better than many beginners.\n\nYou have two good paths:\n\n**1. Follow that path:** **Electrical and Electronics** - ${electrical?.dur || primary?.dur || 'duration on request'}; ${formatCourseFee(electrical || primary)}. This builds directly on what your dad does.\n\n**2. Branch into a related path:**\n${relatedText}\n\nThe smart question is: do you want to **follow in your dad's footsteps**, or use that exposure to choose a **different technical path**?`;
  }

  return `That family exposure can be useful. Before choosing, I would ask one thing: do you want to follow that same path, or explore something different but related?\n\nThe closest listed course I can see is **${primary?.name || 'a related practical course'}**. I can compare it with other options if you want.`;
}

function respondFallback(contact) {
  return pick([
    `That's a great question! 😊 I want to make sure I give you the most accurate answer.\n\nHere's what I can help you with right now:\n- 🎓 **Courses** — "What courses do you offer?"\n- 💰 **Fees** — "How much does Electrical cost?"\n- 📅 **Intake** — "When is the next intake?"\n- 📝 **Apply** — "How do I apply online?"\n- ✅ **Requirements** — "What documents do I need?"\n\nOr call us: **${contact?.phone1 || '0113 582 008'}** 📞\n\nWhat would you like to know? 😊`,
    `I want to help with that! Could you rephrase it slightly? You could try:\n\n- "What courses do you have?"\n- "How much are the fees?"\n- "How do I apply?"\n- "Tell me about Electrical" (or any course name)\n\nOr I can connect you with our admissions team at **${contact?.phone1 || '0113 582 008'}** — they'll answer anything! 😊`,
  ]);
}

// ─── Multi-intent composer ────────────────────────────────────────────────────
/**
 * When multiple intents fire, compose a combined reply that addresses all of them.
 * This is what makes the engine feel like an LLM — it doesn't miss parts of a question.
 */
function composeMultiIntent(intents, course, db, memory) {
  const { contact, feeStructure, courses, intake } = db;
  const parts = [];

  // If there's a specific course mentioned, lead with it
  if (course && intents.length === 1 && intents[0].name !== 'specific_course') {
    // Single intent about a course — handle inline
  }

  for (const intent of intents.slice(0, 3)) { // cap at 3 combined answers
    const short = intents.length > 1; // use short mode when combining
    switch (intent.name) {
      case 'fees':          parts.push(course ? respondCourseFees(course, memory, short) : respondFees(feeStructure, memory, short)); break;
      case 'requirements':  parts.push(respondRequirements(memory, short)); break;
      case 'intake':        parts.push(respondIntake(intake, short)); break;
      case 'apply':         parts.push(respondApply(contact, short)); break;
      case 'duration':      parts.push(respondDuration(course, short)); break;
      case 'career':        parts.push(respondCareer(course)); break;
      case 'certification': parts.push(respondCertification(course)); break;
      case 'contact':       parts.push(respondContact(contact)); break;
      case 'mpesa':         parts.push(respondMpesa(feeStructure)); break;
      case 'short_courses': parts.push(respondShortCourses(feeStructure)); break;
    }
  }

  if (parts.length === 0) return null;
  if (parts.length === 1) return parts[0];

  // Combine naturally
  return parts.join('\n\n---\n\n');
}

// ─── Main Export ──────────────────────────────────────────────────────────────
/**
 * @param {string} message   - Raw user message
 * @param {object} db        - Full db.json
 * @param {Array}  history   - Full conversation history
 * @returns {string}         - Natural, context-aware response
 */
export function localEngine(message, db, history = []) {
  const msg = normalise(message);
  const { contact, feeStructure, courses = [], intake } = db;

  // ── 1. Build conversation memory ─────────────────────────────────────────
  const memory = buildMemory(history, courses);

  // ── 2. Detect language and emotion from current message ──────────────────
  const isSwahili = detectSwahili(msg) || memory.language === 'swahili';
  const emotion   = detectEmotion(msg);
  if (isSwahili) memory.language = 'swahili';
  if (isSimpleGreeting(msg) && !detectSwahili(msg)) memory.language = 'english';
  if (emotion === 'parent') memory.isParent = true;

  // ── 3. Extract course entity ─────────────────────────────────────────────
  let course = extractCourse(msg, courses);

  // Fill course from memory only when the user clearly refers to that course.
  if (!course && memory.lastCourse && matches(msg, [
    'how long is it', 'how much is it', 'cost of it', 'duration of it', 'it', 'that course', 'this course',
    'tell me more', 'more about', 'career', 'job', 'certif', 'apply for it', 'requirements for it',
  ])) {
    course = memory.lastCourse;
  }

  // ── 4. Handle simple / social intents first (no multi-intent needed) ─────
  if (matches(msg, ['are you ai', 'are you a bot', 'are you human', 'what are you'])) {
    return `I'm ARIA, Kinoo VTC's virtual admissions assistant. I use verified institution information and can connect you with the admissions team whenever human assistance is needed.`;
  }

  if (
    /\b(who|what)\s+(is|are)\s+(kvtc|kinoo vtc|kinoo vocational training centre)\b/.test(msg) ||
    matches(msg, ['about kvtc', 'about kinoo vtc', 'tell me about kvtc', 'tell me about kinoo vtc'])
  ) {
    return respondInstitutionIdentity();
  }

  const leadershipResponse = respondLeadership(db, msg);
  if (leadershipResponse) return leadershipResponse;

  if (isFamilyInfluenceQuestion(msg)) {
    return respondFamilyInfluenceQuestion(course, db);
  }

  const shapedResponse = conversationArcResponse(msg, db, memory, course);
  if (shapedResponse) return shapedResponse;

  if (
    memory.awaitingRecommendationAnswers &&
    matches(msg, ['cancel recommendation', 'stop recommendation', 'cancel course choice', 'never mind', 'nevermind', 'not now'])
  ) {
    return `Course recommendation cancelled. You can ask about courses, fees, requirements, applications, or contact Admissions whenever you are ready.`;
  }

  if (matches(msg, ['resume recommendation', 'continue recommendation', 'resume course choice'])) {
    return respondHelpChoose();
  }

  if (memory.awaitingRecommendationAnswers && isUnsureCourseChoice(msg)) {
    return respondUnsureCourseChoice();
  }

  if (/^(yes|yes please|yeah|yep|sure|ndio)$/.test(msg) && memory.lastCourse && memory.awaitingApplicationConfirmation) {
    return `Great — you can continue with the **${memory.lastCourse.name}** application now. Select **Apply for Admission**, confirm the course details, complete the required fields, and submit the application fee.`;
  }

  if (/\b(i have|my budget is|budget of|only have)\s+(only\s+)?(?:ksh|sh)?\s*\d[\d,]*/i.test(msg)) {
    return respondBudget(msg, feeStructure, course);
  }

  if (/^(hi|hello|hey|habari|sasa|niaje|mambo|hujambo|howdy|good (morning|afternoon|evening)|salaam)/.test(msg))
    return respondGreeting(contact, memory);

  if (matches(msg, ['bye', 'goodbye', 'kwaheri', 'good night', 'see you']))
    return pick([`Goodbye! 👋 Come back anytime — Kinoo VTC would love to have you as a student! 🎓`, `Kwaheri! 😊 All the best — feel free to return whenever you have more questions. Your future starts here! 🌟`]);

  if (matches(msg, ['thank', 'thanks', 'asante', 'sawa sawa', 'very helpful', 'helpful', 'great help']))
    return pick([`You're very welcome! 😊 Is there anything else you'd like to know — about fees, intake, or starting your application?`, `Happy to help! 🌟 Anything else on your mind? I'm here for any other questions you have. 🎓`]);

  if (/^(ok|okay|alright|sure|got it|noted|understood|sounds good|i see|cool|nice|perfect|great|wow|amazing|sawa|safi|poa)$/.test(msg))
    return pick([`Great! 😊 What else would you like to know?`, `Perfect! 👍 What's your next question? I'm ready.`, `Awesome! What else can I help with? 🎓`]);

  if (
    /\b(talk|speak|chat)\s+(to|with)\s+(a\s+)?(human|person|agent|representative|real person|admissions)\b/.test(msg) ||
    matches(msg, ['talk to someone', 'real person', 'human agent', 'admissions officer'])
  )
    return respondHumanAgent(contact);

  if (matches(msg, ['all courses', 'list of courses', 'what courses', 'what do you offer', 'available courses']) || /^(course|courses|programme|programmes)$/.test(msg))
    return respondListCourses(courses);

  if (/\b(best|which|what)\b.*\b(job opportunities|jobs|career opportunities|employment opportunities)\b/.test(msg))
    return respondJobOpportunityGuidance(courses);

  if (matches(msg, ['help me choose', 'help choosing', 'which course', 'what course', 'recommend', 'best course', 'not sure', 'confused', 'undecided', 'advise me', 'suggest']))
    return respondHelpChoose();

  if (matches(msg, ['self employ', 'own business', 'own shop', 'own salon', 'own garage', 'entrepreneur', 'hustle', 'freelance', 'work for myself', 'make money']))
    return emotionPrefix(emotion) + respondSelfEmployment(course);

  if (matches(msg, ['contact', 'phone', 'call', 'email', 'location', 'where are you', 'address', 'office', 'visit', 'whatsapp']))
    return respondContact(contact);

  // ── 5. Score multi-intents ───────────────────────────────────────────────
  const intents = scoreIntents(msg);

  if (memory.awaitingRecommendationAnswers) {
    const shortcutAnswer = shortcutRecommendationAnswer(msg);
    if (shortcutAnswer) {
      return respondRecommendationAnswers(shortcutAnswer, db, history);
    }

    if (looksLikeRecommendationAnswers(msg)) {
      return respondRecommendationAnswers(msg, db, history);
    }

    if (!course && intents.length === 0) {
      return `I could not read that as your three course preferences. Reply in this format:\n\n**1) subject or activity 2) indoors/outdoors/both 3) employment/self-employment/both**\n\nYou can also ask another question, say **resume recommendation**, or **cancel recommendation**.`;
    }
  }

  // ── 6. If a course was mentioned and no strong intent — show course overview
  if (course && intents.length === 0) {
    return emotionPrefix(emotion) + respondSpecificCourse(course, feeStructure, memory) + proactiveContextNote(db, history, course);
  }

  // ── 7. Multi-intent composition ──────────────────────────────────────────
  if (intents.length > 0) {
    // Check for anti-repetition — don't re-explain topics already covered
    const filteredIntents = intents.filter(i => !memory.explainedTopics.includes(i.name));

    const composed = composeMultiIntent(
      filteredIntents.length > 0 ? filteredIntents : intents,
      course, db, memory
    );

    if (composed) {
      return emotionPrefix(emotion) + composed;
    }
  }

  // ── 8. Course + single intent (e.g., "how long is electrical?") ──────────
  if (course && intents.length > 0) {
    switch (intents[0].name) {
      case 'fees':          return emotionPrefix(emotion) + respondCourseFees(course, memory);
      case 'duration':      return emotionPrefix(emotion) + respondDuration(course);
      case 'career':        return emotionPrefix(emotion) + respondCareer(course);
      case 'certification': return emotionPrefix(emotion) + respondCertification(course);
      case 'requirements':  return emotionPrefix(emotion) + respondRequirements(memory);
      default:              return emotionPrefix(emotion) + respondSpecificCourse(course, feeStructure, memory) + proactiveContextNote(db, history, course);
    }
  }

  // ── 9. Intelligent fallback — never a dead end ───────────────────────────
  return respondFallback(contact);
}

export function canHandleLocally(message, db, history = []) {
  const msg = normalise(message);
  const courses = db.courses || [];
  const memory = buildMemory(history, courses);

  if (!msg) return false;
  if (extractCourse(msg, courses)) return true;
  if (
    /\b(who|what)\s+(is|are)\s+(kvtc|kinoo vtc|kinoo vocational training centre)\b/.test(msg) ||
    matches(msg, ['about kvtc', 'about kinoo vtc', 'tell me about kvtc', 'tell me about kinoo vtc'])
  ) return true;
  if (respondLeadership(db, msg)) return true;
  if (Object.values(detectStudentSignals(msg)).some(Boolean)) return true;
  if (memory.awaitingRecommendationAnswers) return true;
  if (/^(yes|yes please|yeah|yep|sure|ndio)$/.test(msg) && memory.lastCourse && memory.awaitingApplicationConfirmation) return true;
  if (/\b(i have|my budget is|budget of|only have)\s+(only\s+)?(?:ksh|sh)?\s*\d[\d,]*/i.test(msg)) return true;

  return Boolean(
    matches(msg, [
      'are you ai', 'are you a bot', 'are you human', 'what are you',
      'speak to a human', 'talk to someone', 'real person', 'human agent',
      'course', 'courses', 'all courses', 'list of courses', 'what courses', 'what do you offer', 'available courses',
      'help me choose', 'help choosing', 'which course', 'what course', 'recommend', 'best course',
      'self employ', 'own business', 'contact', 'phone', 'email', 'location', 'whatsapp',
    ]) ||
    /^(hi|hello|hey|habari|sasa|niaje|mambo|hujambo|howdy|good (morning|afternoon|evening)|salaam|bye|goodbye|thank|thanks|ok|okay|alright|sure|yes|no)\b/.test(msg) ||
    scoreIntents(msg).some(intent => [
      'fees', 'requirements', 'intake', 'apply', 'contact', 'career',
      'self_employment', 'help_choose', 'duration', 'certification',
      'mpesa', 'short_courses', 'human_agent',
    ].includes(intent.name))
  );
}
