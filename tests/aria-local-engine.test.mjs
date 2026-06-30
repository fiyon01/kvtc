import assert from 'node:assert/strict';
import test from 'node:test';
import db from '../src/data/db.json' with { type: 'json' };
import { buildCourseRecommendation, canHandleLocally, localEngine } from '../src/lib/localEngine.js';

const clean = value => String(value).replace(/\s+/g, ' ').trim().toLowerCase();

for (const course of db.courses) {
  test(`ARIA returns verified fee data for ${course.name}`, () => {
    const answer = localEngine(`How much is ${course.name}?`, db, []);

    assert.match(clean(answer), new RegExp(escapeRegExp(clean(course.name))));
    assert.match(clean(answer), new RegExp(escapeRegExp(clean(course.fees))));
    assert.match(clean(answer), new RegExp(escapeRegExp(clean(course.dur))));
    assert.doesNotMatch(answer, /\bguaranteed\b|\bearn(?:ing)?\s+ksh|within\s+\d+\s+months/i);
  });

  test(`ARIA course overview stays grounded for ${course.name}`, () => {
    const answer = localEngine(`Tell me about ${course.name}`, db, []);

    assert.match(clean(answer), new RegExp(escapeRegExp(clean(course.name))));
    assert.match(clean(answer), new RegExp(escapeRegExp(clean(course.dur))));
    assert.match(clean(answer), new RegExp(escapeRegExp(clean(course.cert))));
    assert.doesNotMatch(answer, /jobs locally & abroad|recognized across kenya|job-ready|most popular/i);
  });
}

test('ARIA identifies itself transparently', () => {
  const answer = localEngine('Are you human?', db, []);
  assert.match(answer, /virtual admissions assistant/i);
  assert.doesNotMatch(answer, /i am human|i'm a person/i);
});

test('ARIA does not promise salaries or employment timeframes', () => {
  const careerAnswer = localEngine('What jobs and salary can I get after plumbing?', db, []);
  const businessAnswer = localEngine('How much will I earn from my own salon?', db, []);

  for (const answer of [careerAnswer, businessAnswer]) {
    assert.doesNotMatch(answer, /ksh\s*\d[\d,]*\s*[–-]\s*\d/i);
    assert.doesNotMatch(answer, /find work within|employment within|guaranteed/i);
  }
});

test('ARIA keeps similarly named mechanics courses distinct', () => {
  const electronic = localEngine('How much is Electronic Mechanics?', db, []);
  const motor = localEngine('How much is Motor Vehicle Mechanics?', db, []);

  assert.match(electronic, /Electronic Mechanics/);
  assert.match(motor, /Motor Vehicle Mechanics/);
});

test('ARIA answers verified leadership questions', () => {
  const answer = localEngine('Who is the principal?', db, []);
  const principal = db.leadership.find(person =>
    /principal/i.test(person.title) && !/deputy/i.test(person.title)
  );

  assert.match(answer, new RegExp(escapeRegExp(principal.name)));
  assert.match(answer, /current website record/i);
});

test('standalone fees do not inherit an unrelated earlier course', () => {
  const history = [
    { role: 'user', content: 'Tell me about Electrical and Electronics' },
    { role: 'assistant', text: 'Electrical and Electronics takes 2 Years.' },
  ];
  const answer = localEngine('fees', db, history);

  assert.match(answer, /annual tuition|fee breakdown/i);
  assert.doesNotMatch(answer, /fee for electrical and electronics/i);
});

test('ARIA recommends courses from numbered preference answers', () => {
  const history = [
    { role: 'user', content: 'I want you to recommend me a course' },
    {
      role: 'assistant',
      text: 'Please answer: 1. What subjects or activities do you enjoy? 2. Do you prefer working indoors, outdoors, or both? 3. Are you interested in employment, self-employment, or both?',
    },
  ];
  const answer = localEngine('1) mathematics 2) indoors 3) yes', db, history);

  assert.match(answer, /Computer Operator/);
  assert.match(answer, /mathematics/i);
  assert.doesNotMatch(answer, /rephrase/i);
});

test('ARIA preserves recommendation state after an invalid reply', () => {
  const history = [
    { role: 'user', content: 'Help me choose a course' },
    {
      role: 'assistant',
      text: 'Please answer: 1. What subjects or activities do you enjoy? 2. Do you prefer working indoors, outdoors, or both? 3. Are you interested in employment, self-employment, or both?',
    },
    { role: 'user', content: 'v' },
    {
      role: 'assistant',
      text: 'I am still waiting for your three course preferences. Please reply in the requested format.',
    },
  ];

  const clarification = localEngine('v', db, history.slice(0, 2));
  const answer = localEngine('1) mathematics 2) indoors 3) both', db, history);

  assert.match(clarification, /could not read that/i);
  assert.match(answer, /Computer Operator/);
  assert.doesNotMatch(answer, /verified information confirming/i);
});

test('ARIA allows a budget question to interrupt course recommendations', () => {
  const history = [
    { role: 'user', content: 'I need help choosing a course.' },
    {
      role: 'assistant',
      text: 'Please answer: 1. What subjects or activities do you enjoy? 2. Do you prefer working indoors, outdoors, or both? 3. Are you interested in employment, self-employment, or both?',
    },
  ];
  const answer = localEngine('i have 10000', db, history);

  assert.match(answer, /KSh 10,000/);
  assert.match(answer, /KSh 9,000/);
  assert.doesNotMatch(answer, /waiting for your three course preferences/i);
});

test('ARIA allows greetings to interrupt course recommendations', () => {
  const history = [
    { role: 'user', content: 'I need help choosing a course.' },
    {
      role: 'assistant',
      text: 'Please answer: 1. What subjects or activities do you enjoy? 2. Do you prefer working indoors, outdoors, or both? 3. Are you interested in employment, self-employment, or both?',
    },
  ];
  const answer = localEngine('hey', db, history);

  assert.match(answer, /ARIA|Kinoo VTC/i);
  assert.doesNotMatch(answer, /waiting for your three course preferences/i);
});

test('ARIA can cancel and later restart course recommendations', () => {
  const activeHistory = [
    { role: 'user', content: 'Help me choose a course' },
    {
      role: 'assistant',
      text: 'Please answer: 1. What subjects or activities do you enjoy? 2. Do you prefer working indoors, outdoors, or both? 3. Are you interested in employment, self-employment, or both?',
    },
  ];
  const cancelled = localEngine('cancel recommendation', db, activeHistory);
  const cancelledHistory = [
    ...activeHistory,
    { role: 'user', content: 'cancel recommendation' },
    { role: 'assistant', text: cancelled },
  ];

  assert.match(cancelled, /recommendation cancelled/i);
  assert.match(localEngine('fees', db, cancelledHistory), /annual tuition|fee breakdown/i);
  assert.match(localEngine('resume recommendation', db, cancelledHistory), /three questions/i);
});

test('ARIA helps unsure students choose without repeating the rigid format', () => {
  const history = [
    { role: 'user', content: 'best course' },
    {
      role: 'assistant',
      text: 'Please answer: 1. What subjects or activities do you enjoy? 2. Do you prefer working indoors, outdoors, or both? 3. Are you interested in employment, self-employment, or both?',
    },
  ];
  const answer = localEngine("i don't know", db, history);

  assert.match(answer, /No problem/i);
  assert.match(answer, /A\. Tech/i);
  assert.match(answer, /B\. Practical/i);
  assert.match(answer, /C\. Business/i);
  assert.doesNotMatch(answer, /could not read/i);
});

test('ARIA turns an unsure-student shortcut into recommendations', () => {
  const history = [
    { role: 'user', content: 'best course' },
    {
      role: 'assistant',
      text: 'Please answer: 1. What subjects or activities do you enjoy? 2. Do you prefer working indoors, outdoors, or both? 3. Are you interested in employment, self-employment, or both?',
    },
    { role: 'user', content: "i don't know" },
    {
      role: 'assistant',
      text: 'Pick A. Tech / office work, B. Practical hands-on work, or C. Business / creative work.',
    },
  ];
  const answer = localEngine('A', db, history);

  assert.match(answer, /Computer|Security|ICT/i);
  assert.match(answer, /strongest match/i);
  assert.doesNotMatch(answer, /could not read/i);
});

test('ARIA recommends from creative interests instead of using a canned mathematics answer', () => {
  const history = [
    { role: 'user', content: 'Help me choose a course' },
    {
      role: 'assistant',
      text: 'Please answer: 1. What subjects or activities do you enjoy? 2. Do you prefer working indoors, outdoors, or both? 3. Are you interested in employment, self-employment, or both?',
    },
  ];
  const result = buildCourseRecommendation('1) fashion and drawing 2) indoors 3) self-employment', db, history);

  assert.equal(result.response_type, 'course_recommendation');
  assert.match(result.courses[0].name, /Fashion|Hair Dressing|Beauty/i);
  assert.match(result.courses[0].why_it_fits, /creative|indoor|self-employment/i);
  assert.doesNotMatch(result.text, /mathematics/i);
});

test('ARIA recommends care training for a user interested in helping patients', () => {
  const history = [
    { role: 'user', content: 'Help me choose a course' },
    {
      role: 'assistant',
      text: 'Please answer: 1. What subjects or activities do you enjoy? 2. Do you prefer working indoors, outdoors, or both? 3. Are you interested in employment, self-employment, or both?',
    },
  ];
  const result = buildCourseRecommendation('1) helping patients and health 2) indoors 3) employment', db, history);

  assert.equal(result.courses[0].name, 'CNA – Care Givers');
  assert.match(result.courses[0].why_it_fits, /care and helping people/i);
});

test('ARIA refines an existing recommendation toward shorter courses', () => {
  const history = [
    { role: 'user', content: 'Help me choose a course' },
    {
      role: 'assistant',
      text: 'Please answer: 1. What subjects or activities do you enjoy? 2. Do you prefer working indoors, outdoors, or both? 3. Are you interested in employment, self-employment, or both?',
    },
    { role: 'user', content: '1) computers 2) indoors 3) both' },
    {
      role: 'assistant',
      text: 'I weighed your preferences. My strongest match is Computer Operator, with two alternatives below.',
    },
  ];
  const result = buildCourseRecommendation('Show me shorter options instead', db, history);

  assert.equal(result.title, 'Updated course matches');
  assert.match(result.courses[0].dur, /month/i);
  assert.match(result.courses[0].why_it_fits, /completed in/i);
});

test('ARIA recognizes the sidebar course-choice wording', () => {
  const answer = localEngine('I need help choosing a course.', db, []);

  assert.match(answer, /three questions/i);
  assert.match(answer, /indoors, outdoors, or both/i);
});

test('ARIA treats singular course as a catalogue request', () => {
  const answer = localEngine('course', db, []);

  assert.match(answer, /17 programmes/i);
  assert.match(answer, /Electrical and Electronics/);
  assert.doesNotMatch(answer, /verified information confirming/i);
});

test('ARIA treats yes after a course application prompt as confirmation', () => {
  const barista = db.courses.find(course => course.name === 'Barista');
  const history = [
    { role: 'user', content: 'barista' },
    {
      role: 'assistant',
      text: `Here are the current details for ${barista.name}. Would you like the requirements or help starting an application?`,
    },
  ];
  const answer = localEngine('yes', db, history);

  assert.match(answer, /Barista/);
  assert.match(answer, /application/i);
  assert.doesNotMatch(answer, /rephrase/i);
});

test('ARIA never duplicates fee currency or adds annual labels to short courses', () => {
  const list = localEngine('What courses do you have?', db, []);
  const barista = localEngine('barista', db, []);

  assert.doesNotMatch(list, /KSh\s+KSh/i);
  assert.doesNotMatch(barista, /KSh\s+KSh/i);
  assert.match(barista, /Course fee:\*\* KSh 43,000/i);
  assert.doesNotMatch(barista, /Annual Fees?:.*43,000/i);
});

test('unrelated facility questions never fuzzy-match a course', () => {
  const answer = localEngine('Does KVTC have a swimming pool?', db, []);

  assert.doesNotMatch(answer, /Hair Dressing|Beauty Therapy|Annual fee/i);
  assert.equal(canHandleLocally('Does KVTC have a swimming pool?', db, []), false);
});

test('ARIA explains what a KSh 5,000 budget can cover without promising a plan', () => {
  const answer = localEngine('I have only 5000', db, []);

  assert.match(answer, /KSh 5,000/);
  assert.match(answer, /KSh 3,450/);
  assert.match(answer, /KSh 9,000/);
  assert.match(answer, /cannot approve a payment plan/i);
  assert.doesNotMatch(answer, /Hair Dressing|Beauty Therapy/i);
});

test('ARIA carries earlier budget context into later course advice', () => {
  const history = [
    { role: 'user', content: 'I have only 10000' },
    {
      role: 'assistant',
      text: 'You currently have KSh 10,000. ARIA cannot approve a payment plan.',
    },
  ];
  const answer = localEngine('barista', db, history);

  assert.match(answer, /Barista/);
  assert.match(answer, /Smart note/i);
  assert.match(answer, /KSh 10,000/);
  assert.match(answer, /KSh 43,000/);
  assert.match(answer, /below the listed \*\*Barista\*\* course fee/i);
  assert.match(answer, /admissions must confirm/i);
});

test('ARIA adds useful earlier-budget context to recommendations', () => {
  const history = [
    { role: 'user', content: 'I have only 10000' },
    {
      role: 'assistant',
      text: 'You currently have KSh 10,000. ARIA cannot approve a payment plan.',
    },
    { role: 'user', content: 'Help me choose a course' },
    {
      role: 'assistant',
      text: 'Please answer: 1. What subjects or activities do you enjoy? 2. Do you prefer working indoors, outdoors, or both? 3. Are you interested in employment, self-employment, or both?',
    },
  ];
  const answer = localEngine('1) mathematics 2) indoors 3) both', db, history);

  assert.match(answer, /strongest match/i);
  assert.match(answer, /Smart note/i);
  assert.match(answer, /KSh 10,000/);
  assert.match(answer, /first-term tuition|course fee/i);
  assert.match(answer, /Admissions/i);
});

test('ARIA sells credibility without making unverified claims', () => {
  const answer = localEngine('Is KVTC even good or legit?', db, []);

  assert.match(answer, /right question/i);
  assert.match(answer, /County Government of Kiambu/i);
  assert.match(answer, /verified picture|verified/i);
  assert.match(answer, /not do is oversell/i);
  assert.doesNotMatch(answer, /guaranteed|best in kenya|100% job/i);
  assert.equal(canHandleLocally('Is KVTC even good or legit?', db, []), true);
});

test('ARIA answers job-outcome doubt with reassurance and boundaries', () => {
  const answer = localEngine('Will this certificate actually get me a job after electrical?', db, []);

  assert.match(answer, /real question/i);
  assert.match(answer, /Electrical and Electronics/);
  assert.match(answer, /does not guarantee a job/i);
  assert.match(answer, /practical skill/i);
  assert.doesNotMatch(answer, /guaranteed employment/i);
});

test('ARIA answers best job opportunities without starting the chooser', () => {
  const answer = localEngine('Which course has the best job opportunities?', db, []);

  assert.match(answer, /no single course/i);
  assert.match(answer, /strong options to compare/i);
  assert.match(answer, /Electrical and Electronics|Computer Operator|Motor Vehicle Mechanics/i);
  assert.doesNotMatch(answer, /Please answer these three questions/i);
  assert.doesNotMatch(answer, /guaranteed/i);
});

test('ARIA reassures late starters without dumping requirements', () => {
  const answer = localEngine('I dropped out years ago is it too late for me?', db, []);

  assert.match(answer, /not too late/i);
  assert.match(answer, /second chance|start small/i);
  assert.match(answer, /full programme|shorter skill/i);
  assert.doesNotMatch(answer, /passport-size photos/i);
});

test('ARIA treats feeling lost as a human moment, not a fee question', () => {
  const answer = localEngine('i feel lost', db, []);

  assert.match(answer, /That is okay|feel exactly that way/i);
  assert.match(answer, /slow it down/i);
  assert.match(answer, /interest.*money.*grades|interest[\s\S]*money[\s\S]*grades/i);
  assert.doesNotMatch(answer, /Annual tuition|fee structure|KSh 27,000/i);
});

test('ARIA does not turn feel into fee when the student feels lost', () => {
  const answer = localEngine('i feel lost dont know what to do', db, []);

  assert.match(answer, /That is okay|feel exactly that way/i);
  assert.match(answer, /interest|money|grades/i);
  assert.doesNotMatch(answer, /Pick the one that feels closest/i);
  assert.doesNotMatch(answer, /Annual tuition|fee structure/i);
});

test('ARIA handles referral context by verifying what the user heard', () => {
  const answer = localEngine('My friend told me to check this out', db, []);

  assert.match(answer, /someone sent you here/i);
  assert.match(answer, /secondhand information/i);
  assert.match(answer, /verify it against the current/i);
});

test('ARIA notices repeated fee anxiety and gives practical payment references', () => {
  const history = [
    { role: 'user', content: 'how much are fees?' },
    { role: 'assistant', text: 'Annual tuition is KSh 27,000.' },
  ];
  const answer = localEngine('fees again please', db, history);

  assert.match(answer, /fees have come up more than once/i);
  assert.match(answer, /Co-operative Bank/i);
  assert.match(answer, /01141151624400/);
  assert.match(answer, /KCB/i);
  assert.match(answer, /Admissions can approve|only Admissions/i);
});

test('ARIA recognizes natural human handoff phrases without an article', () => {
  const answer = localEngine('talk to human', db, []);

  assert.match(answer, /admissions contacts/i);
  assert.match(answer, /0113 582 008/);
  assert.equal(canHandleLocally('talk to human', db, []), true);
});

test('ARIA answers who KVTC is even when a recommendation guide was left open', () => {
  const history = [
    { role: 'user', content: 'Help me choose a course' },
    {
      role: 'assistant',
      text: 'Please answer: 1. What subjects or activities do you enjoy? 2. Do you prefer working indoors, outdoors, or both? 3. Are you interested in employment, self-employment, or both?',
    },
    { role: 'user', content: 'compare electrical and barista' },
    {
      role: 'assistant',
      text: 'Here is a comparison between Electrical and Electronics and Barista.',
    },
  ];
  const answer = localEngine('who is kvtc', db, history);

  assert.match(answer, /Kinoo Vocational Training Centre/);
  assert.match(answer, /County Government of Kiambu/);
  assert.match(answer, /Kikuyu/);
  assert.doesNotMatch(answer, /three course preferences/i);
  assert.equal(canHandleLocally('who is kvtc', db, history), true);
});

test('ARIA handles family influence as advice, not just a course keyword', () => {
  const answer = localEngine('my dad is an electrician what should i study', db, []);

  assert.match(answer, /strong foundation|grow up around/i);
  assert.match(answer, /follow in your dad/i);
  assert.match(answer, /different technical path|related path/i);
  assert.match(answer, /Electrical and Electronics/);
  assert.match(answer, /Solar PV Installation|Electronic Mechanics|Motor Vehicle Mechanics/);
  assert.doesNotMatch(answer, /^Here are the current details for Electrical and Electronics/i);
});

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
