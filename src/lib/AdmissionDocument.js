import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import PdfLetterhead from './PdfLetterhead';

const green   = '#1a6e2e';
const dark    = '#000000';
const bgFooter = '#ede9e0';
const dots    = '..................................................................................';

// ─── Duration corrected to 1 YEAR to match physical document ───────────────
const COURSES = [
  { name: "Food & Beverage Production & Service", cert: "ARTISAN",  examBody: "KNEC",       duration: "1YEAR"    },
  { name: "Hair Dressing and Beauty Therapy",      cert: "GRADE 3", examBody: "NITA",        duration: "1 YEAR"   },
  { name: "Electrical and Electronics",            cert: "GRADE 3", examBody: "NITA",        duration: "1 YEAR"   },
  { name: "Electronic Mechanics",                  cert: "GRADE 3", examBody: "NITA",        duration: "1 YEAR"   },
  { name: "Solar PV Installation",                 cert: "GRADE 3", examBody: "NITA",        duration: "6 MONTHS" },
  { name: "Security & Network Systems",            cert: "CERT",    examBody: "(INTERNAL)",  duration: "3 MONTHS" },
  { name: "Plumbing",                              cert: "GRADE 3", examBody: "NITA",        duration: "1 YEAR"   },
  { name: "Masonry",                               cert: "GRADE 3", examBody: "NITA",        duration: "1 YEAR"   },
  { name: "Fashion Design and Dressmaking",        cert: "GRADE 3", examBody: "NITA",        duration: "1 YEAR"   },
  { name: "Motor Vehicle Mechanics",               cert: "GRADE 3", examBody: "NITA",        duration: "1 YEAR"   },
  { name: "Welding & Fabrication",                 cert: "GRADE 3", examBody: "NITA",        duration: "1 YEAR"   },
  { name: "Computer Operator",                     cert: "GRADE 3", examBody: "NITA",        duration: "1 YEAR"   },
  { name: "Computer packages",                     cert: "CERT",    examBody: "INTERNAL",    duration: "2MONTHS"  },
];

const RULES = [
  "All trainees must respect Authority and Co-exist harmoniously with the entire polytechnic Community.",
  "Sneaking out of school compound is a serious offence without express permission from the Manager, deputy manager, and instructor on duty or the class Instructor.",
  "English, Kiswahili shall be the language of communication in the institution and out of school activities.",
  "Stern disciplinary action will be taken against any trainee who bullies, molests, fights or insults and other trainee or trainees. When offended seek administrative redress.",
  "Every trainee expected to exhibit good and proper behavior towards members of the teaching, Non-teaching staff, other trainees as well as school prefects. Any trainee who disregards this rule will be heavily punished.",
  "Any type of punishment administered to ANY trainee by the school authorities must be carried out satisfactorily. Failure to observe this rule may even lead to suspension, and/ or expulsion.",
  {
    main: "Every trainee must stick to institution programmes by:",
    subs: [
      "Attending all the lessons.",
      "Sitting for all examinations and doing all assignments.",
      "Being punctual at all times in class, clubs, games, general duties and meals.",
      "Note that there are no breaks between lessons UNLESS provided for in the time table.",
      "Not having any other form of entertainment other than the ones stipulated by the administration.",
      "Performing duties as allocated by any lawful authority.",
    ],
  },
  "Every trainee should maintain order and avoid acts of disturbing or distracting training, games, etc.",
  "It is a serious offence for ANY trainee to incite others to deviate or disobey rules and regulation. Such trainees will be expelled.",
  "No trainee should absent himself/herself from the institution without express permission from the authorities. Any absence permission will require accompaniment by a parent/guardian.",
  "Every trainee should observe personal hygiene, smartness and be in proper official uniforms at all times.",
  "Taking of harmful drugs. Alcohol or smoking by any trainee is illegal. Drastic disciplinary action will be taken against the culprit.",
  "Acts of vandalism and hooliganism will not be tolerated in the school compound. Any student who willfully destroys institutions' property will be required to immediately replace the items and subsequently receive disciplinary action.",
  "Stealing is wrong. ANY trainee caught engaging in this undesirable activity will be punished severely by the administration.",
  "The staffroom, store, kitchen are out of bounds for ALL trainees unless with special permission.",
  "The lunch programme is compulsory to all trainees.",
  "No meals will be served to late-comers.",
  "All persons, who wish to visit a trainee within the institution, must first seek official clearance from the administration. Disciplinary action will be taken against anyone found to have talked to a visitor without due authority.",
  "Co-curricular activities are compulsory unless one has an exemption letter from a government hospital.",
  "Every trainee must be a member of at least one club, society or movement.",
  "Any trainee who does not abide by these rules and regulations as set by the administration or any other statutory rule thereafter that does not uphold the institution and that of the local community will face stern action that may include expulsion.",
  "Above all, use common sense.",
];

const s = StyleSheet.create({
  // ── Pages ──────────────────────────────────────────────────────────────────
  pageAdmission: {
    backgroundColor: '#ffffff',
    fontFamily: 'Times-Roman',
    fontSize: 10.5,
    color: dark,
  },
  pageRules: {
    backgroundColor: '#ffffff',
    fontFamily: 'Times-Roman',
    fontSize: 10.5,
    color: dark,
    paddingTop: 36,
    paddingBottom: 36,
    paddingLeft: 52,
    paddingRight: 52,
  },

  // ── Admission body ─────────────────────────────────────────────────────────
  body: {
    paddingTop: 10,
    paddingBottom: 20,
    paddingLeft: 42,
    paddingRight: 42,
  },

  // ── Title ──────────────────────────────────────────────────────────────────
  title: {
    textAlign: 'center',
    fontFamily: 'Times-Bold',
    fontSize: 13,
    textDecoration: 'underline',
    marginBottom: 16,
    letterSpacing: 0.5,
  },

  // ── NAME … DEPARTMENT … line ───────────────────────────────────────────────
  // Matches physical doc: "NAME............... DEPARTMENT ..............."
  // rendered as a single Text line with inline dotted segments
  nameLine: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 14,
  },
  nameLabel: {
    fontFamily: 'Times-Bold',
    fontSize: 10.5,
    marginRight: 2,
  },
  nameDots: {
    flex: 2,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    borderBottomStyle: 'dotted',
    minHeight: 14,
    paddingBottom: 1,
    marginRight: 10,
  },
  nameValue: {
    fontFamily: 'Times-Roman',
    fontSize: 10.5,
  },
  deptLabel: {
    fontFamily: 'Times-Bold',
    fontSize: 10.5,
    marginRight: 2,
  },
  deptDots: {
    flex: 1.4,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    borderBottomStyle: 'dotted',
    minHeight: 14,
    paddingBottom: 1,
  },

  // ── Body paragraphs ────────────────────────────────────────────────────────
  para: {
    lineHeight: 1.55,
    marginBottom: 10,
    textAlign: 'justify',
    fontSize: 10.5,
  },
  bold: { fontFamily: 'Times-Bold' },

  // ── Courses table — plain, no shading, matching physical doc ──────────────
  table: { width: '100%', marginTop: 4, marginBottom: 8 },

  // Header row: bold labels, no background
  trHead: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#000' },
  th: {
    fontFamily: 'Times-Bold',
    fontSize: 10.5,
    paddingBottom: 3,
    paddingTop: 0,
  },

  // Data rows: plain white, no alternating colors
  trRow: { flexDirection: 'row' },
  td: {
    fontFamily: 'Times-Roman',
    fontSize: 10,
    paddingTop: 1,
    paddingBottom: 1,
  },

  // ── Other subjects bullet ──────────────────────────────────────────────────
  otherLabel: { fontFamily: 'Times-Bold', fontSize: 10.5, marginBottom: 3 },
  bulletRow:  { flexDirection: 'row', marginLeft: 10 },
  bulletDot:  { fontSize: 10.5, marginRight: 5 },
  bulletText: { fontSize: 10.5, flex: 1, lineHeight: 1.45 },

  // ── Footer (admission page only) ──────────────────────────────────────────
  footer: {
    borderTopWidth: 2.5,
    borderTopColor: green,
    paddingTop: 5,
    paddingBottom: 6,
    paddingLeft: 20,
    paddingRight: 20,
    backgroundColor: bgFooter,
  },
  footerRow:   { flexDirection: 'row', marginBottom: 1 },
  footerLabel: { fontFamily: 'Times-Bold', fontSize: 8, marginRight: 3 },
  footerText:  { fontFamily: 'Times-Roman', fontSize: 8, color: '#333', flex: 1, lineHeight: 1.3 },

  // ── Rules page ─────────────────────────────────────────────────────────────
  rulesTitle: {
    textAlign: 'center',
    fontFamily: 'Times-Bold',
    fontSize: 13,
    textDecoration: 'underline',
    marginBottom: 10,
    letterSpacing: 0.3,
  },

  // Tight rule items — fit all 22 on one page
  ruleItem: { flexDirection: 'row', marginBottom: 4 },
  ruleNum:  { width: 22, fontSize: 10, lineHeight: 1.4, fontFamily: 'Times-Roman' },
  ruleText: { flex: 1, fontSize: 10, lineHeight: 1.4, fontFamily: 'Times-Roman', textAlign: 'justify' },

  subList: { marginTop: 2, marginLeft: 2 },
  subItem: { flexDirection: 'row', marginBottom: 2 },
  subNum:  { width: 20, fontSize: 10, lineHeight: 1.4 },
  subText: { flex: 1, fontSize: 10, lineHeight: 1.4, textAlign: 'justify' },

  // ── Declaration + sign line (rules page bottom) ───────────────────────────
  declareText: {
    fontFamily: 'Times-Italic',
    fontSize: 10.5,
    marginTop: 12,
    marginBottom: 8,
    textAlign: 'center',
  },
  // "Name: __________ Date: __________ Sign: __________" on one line
  signRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginTop: 4,
  },
  signLabel: {
    fontFamily: 'Times-Roman',
    fontSize: 10.5,
    marginRight: 2,
  },
  signLine: {
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    borderBottomStyle: 'solid',
    minHeight: 14,
    paddingBottom: 1,
    marginRight: 14,
  },
  signValue: { fontFamily: 'Times-Roman', fontSize: 10.5 },
  signImg:   { width: 80, height: 18, objectFit: 'contain' },

  // Date field (shorter)
  dateSignLine: {
    width: 90,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    borderBottomStyle: 'solid',
    minHeight: 14,
    paddingBottom: 1,
    marginRight: 14,
  },
  // Sign field (shorter)
  sigSignLine: {
    width: 70,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    borderBottomStyle: 'solid',
    minHeight: 14,
    paddingBottom: 1,
  },
});

// ── Reusable admission footer ──────────────────────────────────────────────
function Footer() {
  return (
    <View style={s.footer} fixed>
      <View style={s.footerRow}>
        <Text style={s.footerLabel}>MISSION: </Text>
        <Text style={s.footerText}>To educate and nurture our students to excel in work and in life and to equip them with skills and knowledge to enhance their employability.</Text>
      </View>
      <View style={s.footerRow}>
        <Text style={s.footerLabel}>VISION: </Text>
        <Text style={s.footerText}>A leading institution that prepares our students to be work ready, life ready and world ready.</Text>
      </View>
      <View style={s.footerRow}>
        <Text style={s.footerLabel}>MOTTO: </Text>
        <Text style={[s.footerText, { fontFamily: 'Times-Italic' }]}>"Serve with skills."</Text>
      </View>
    </View>
  );
}

// ── Main export ────────────────────────────────────────────────────────────
export function AdmissionDocument({ formData = {}, kvtcLogoUrl, cgokLogoUrl }) {
  const {
    name      = '',
    course    = '',
    signatureData,
    signDate,
  } = formData;

  const dateStr = signDate
    ? signDate
    : new Date().toLocaleDateString('en-KE', { day: '2-digit', month: 'short', year: 'numeric' });

  // ── Rule renderer (all 22 rules, compact) ─────────────────────────────────
  const renderRules = (rules, startIndex = 0) =>
    rules.map((rule, index) => (
      <View style={s.ruleItem} key={startIndex + index} wrap={false}>
        <Text style={s.ruleNum}>{startIndex + index + 1}.</Text>
        <View style={{ flex: 1 }}>
          {typeof rule === 'string' ? (
            <Text style={s.ruleText}>{rule}</Text>
          ) : (
            <>
              <Text style={s.ruleText}>{rule.main}</Text>
              <View style={s.subList}>
                {rule.subs.map((sub, si) => (
                  <View style={s.subItem} key={si} wrap={false}>
                    <Text style={s.subNum}>{String.fromCharCode(97 + si)})</Text>
                    <Text style={s.subText}>{sub}</Text>
                  </View>
                ))}
              </View>
            </>
          )}
        </View>
      </View>
    ));

  return (
    <Document
      title={`Admission Letter - ${name || 'Applicant'}`}
      author="Kinoo Vocational Training Centre"
      subject="Student Admission Letter"
    >

      {/* ════════════════════════════════════════════════════════════════
          PAGE 1 — ADMISSION LETTER
          Matches Image 1 exactly:
          • PdfLetterhead (logos + centered institution name)
          • "ADMISSION LETTER" underlined title
          • NAME dotted fill … DEPARTMENT dotted fill (one inline row)
          • Three justified paragraphs
          • Plain table (no shading, no cell borders)
          • Other general subjects bullet
          • Mission/Vision/Motto footer
      ════════════════════════════════════════════════════════════════ */}
      <Page size="A4" style={s.pageAdmission}>

        <PdfLetterhead kvtcLogoUrl={kvtcLogoUrl} cgokLogoUrl={cgokLogoUrl} />

        <View style={s.body}>

          <Text style={s.title}>ADMISSION LETTER</Text>

          {/* ── NAME … DEPARTMENT … ─────────────────────────────────────
              Single flex row: bold label → dotted underline field (with
              filled value if provided) → bold label → dotted underline.
              Matches the physical doc line exactly.
          ──────────────────────────────────────────────────────────── */}
          <View style={s.nameLine}>
            <Text style={s.nameLabel}>NAME</Text>
            <View style={s.nameDots}>
              <Text style={s.nameValue}>{name || ' '}</Text>
            </View>
            <Text style={s.deptLabel}>DEPARTMENT</Text>
            <View style={s.deptDots}>
              <Text style={s.nameValue}>{course || ' '}</Text>
            </View>
          </View>

          {/* ── Paragraph 1 ──────────────────────────────────────────── */}
          <Text style={s.para}>
            {'I am pleased to inform you that you have been admitted to '}
            <Text style={s.bold}>KINOO VOCATIONAL TRAINING CENTRE</Text>
            {` for the academic year ${new Date().getFullYear()}.`}
          </Text>

          {/* ── Paragraph 2 ──────────────────────────────────────────── */}
          <Text style={s.para}>
            <Text style={s.bold}>Kinoo V.T.C</Text>
            {' is a public institution under the county Government of Kiambu. The institution regards parents\u2019, students, staff and the management as partners with special roles and responsibilities in promoting learning. We are committed to working closely with our trainees to ensure that they are able to succeed in meeting the challenges of excellence and innovativeness hence preparing them for the world of work. You will therefore be joining a vibrant institution that strongly values discipline and puts good conduct and the character as its prerequisite to admission.'}
          </Text>

          {/* ── Paragraph 3 ──────────────────────────────────────────── */}
          <Text style={s.para}>
            We henceforth are privileged to offer you an admission to our institution for further studies in a course of your choice.
          </Text>

          {/* ── Courses table ────────────────────────────────────────────
              Physical doc: plain columns, bold headers underlined by a
              single bottom border on the header row, no cell borders,
              no alternating row colors.
          ──────────────────────────────────────────────────────────── */}
          <View style={s.table}>

            {/* Header */}
            <View style={s.trHead}>
              <Text style={[s.th, { flex: 3.2 }]}>COURSE</Text>
              <Text style={[s.th, { flex: 1.5 }]}>CERTIFICATION</Text>
              <Text style={[s.th, { flex: 1.2 }]}>EXAM BODY</Text>
              <Text style={[s.th, { flex: 1.1 }]}>DURATION</Text>
            </View>

            {/* Data rows — plain, no shading */}
            {COURSES.map((c, i) => (
              <View style={s.trRow} key={i}>
                <Text style={[s.td, { flex: 3.2 }]}>{c.name}</Text>
                <Text style={[s.td, { flex: 1.5 }]}>{c.cert}</Text>
                <Text style={[s.td, { flex: 1.2 }]}>{c.examBody}</Text>
                <Text style={[s.td, { flex: 1.1 }]}>{c.duration}</Text>
              </View>
            ))}
          </View>

          {/* ── Other subjects ────────────────────────────────────────── */}
          <Text style={s.otherLabel}>Other general subjects taught are:</Text>
          <View style={s.bulletRow}>
            <Text style={s.bulletDot}>{'\u2022'}</Text>
            <Text style={s.bulletText}>
              Communication Skills, Guidance and Counseling, Entrepreneurship, Life Skills, &amp; ICT
            </Text>
          </View>

        </View>

        <Footer />
      </Page>

      {/* ════════════════════════════════════════════════════════════════
          PAGE 2 — RULES AND REGULATIONS
          Matches Image 2 exactly:
          • NO letterhead / header
          • Plain "RULES AND REGULATIONS" underlined title
          • ALL 22 rules on one page, single column, tight spacing
          • Italic declaration sentence
          • "Name: ___ Date: ___ Sign: ___" on one bottom line
          • NO footer
      ════════════════════════════════════════════════════════════════ */}
      <Page size="A4" style={s.pageRules}>

        <Text style={s.rulesTitle}>RULES AND REGULATIONS</Text>

        {renderRules(RULES)}

        {/* ── Declaration ──────────────────────────────────────────── */}
        <Text style={s.declareText}>
          I hereby declare that I will adhere to all the rules and regulations of this institution.
        </Text>

        {/* ── Name / Date / Sign — one line ────────────────────────────
            "Name: __________ Date: __________ Sign: __________"
            Exactly as in the physical document bottom line.
        ──────────────────────────────────────────────────────────── */}
        <View style={s.signRow}>
          <Text style={s.signLabel}>Name:</Text>
          <View style={s.signLine}>
            <Text style={s.signValue}>{name || ' '}</Text>
          </View>

          <Text style={s.signLabel}>Date:</Text>
          <View style={s.dateSignLine}>
            <Text style={s.signValue}>{dateStr || ' '}</Text>
          </View>

          <Text style={s.signLabel}>Sign:</Text>
          <View style={s.sigSignLine}>
            {signatureData
              ? <Image src={signatureData} style={s.signImg} />
              : <Text style={s.signValue}> </Text>}
          </View>
        </View>

      </Page>

    </Document>
  );
}