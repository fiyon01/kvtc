import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import PdfLetterhead from './PdfLetterhead';

const green = '#1a6e2e';
const dark = '#000000';
const bgFooter = '#ede9e0';

const COURSES = [
  { name: "Food & Beverage Production & Service", cert: "ARTISAN", examBody: "KNEC", duration: "2 YEARS" },
  { name: "Hair Dressing and Beauty Therapy", cert: "GRADE 3", examBody: "NITA", duration: "2 YEARS" },
  { name: "Electrical and Electronics", cert: "GRADE 3", examBody: "NITA", duration: "2 YEARS" },
  { name: "Electronic Mechanics", cert: "GRADE 3", examBody: "NITA", duration: "2 YEARS" },
  { name: "Solar PV Installation", cert: "GRADE 3", examBody: "NITA", duration: "6 MONTHS" },
  { name: "Security & Network Systems", cert: "CERT", examBody: "(INTERNAL)", duration: "3 MONTHS" },
  { name: "Plumbing", cert: "GRADE 3", examBody: "NITA", duration: "2 YEARS" },
  { name: "Masonry", cert: "GRADE 3", examBody: "NITA", duration: "2 YEARS" },
  { name: "Fashion Design and Dressmaking", cert: "GRADE 3", examBody: "NITA", duration: "2 YEARS" },
  { name: "Motor Vehicle Mechanics", cert: "GRADE 3", examBody: "NITA", duration: "2 YEARS" },
  { name: "Welding & Fabrication", cert: "GRADE 3", examBody: "NITA", duration: "2 YEARS" },
  { name: "Computer Operator", cert: "GRADE 3", examBody: "NITA", duration: "2 YEARS" },
  { name: "Computer packages", cert: "CERT", examBody: "INTERNAL", duration: "2 MONTHS" },
];

const RULES = [
  "All trainees must respect Authority and Co-exist harmoniously with the entire polytechnic Community.",
  "Sneaking out of school compound is a serious offence without express permission from the Manager, deputy manager, and instructor on duty or the class Instructor.",
  "English, Kiswahili shall be the language of communication in the institution and out of school activities.",
  "Stern disciplinary action will be taken against any trainee who bullies, molests, fights or insults any other trainee or trainees. When offended seek administrative redress.",
  "Every trainee expected to exhibit good and proper behavior towards members of the teaching, Non-teaching staff, other trainees as well as school prefects. Any trainee who disregards this rule will be heavily punished.",
  "Any type of punishment administered to ANY trainee by the school authorities must be carried out satisfactorily. Failure to observe this rule may even lead to suspension, and/or expulsion.",
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
  "Taking of harmful drugs, alcohol or smoking by any trainee is illegal. Drastic disciplinary action will be taken against the culprit.",
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
  // ── PAGE STYLES ──────────────────────────────────────────────
  // Page 1: letterhead + admission body + footer ONCE at the bottom
  pageAdmission: {
    backgroundColor: '#ffffff',
    fontFamily: 'Times-Roman',
    fontSize: 10.5,
    color: dark,
    // paddingBottom matches footer height so body never overlaps it
    paddingBottom: 72,
  },

  // Rules pages: no footer, clean padding
  pageRules: {
    backgroundColor: '#ffffff',
    fontFamily: 'Times-Roman',
    fontSize: 10,
    color: dark,
    paddingTop: 38,
    paddingBottom: 45,
    paddingLeft: 55,
    paddingRight: 55,
  },

  // ── BODY ─────────────────────────────────────────────────────
  body: {
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 42,
    paddingRight: 42,
    flex: 1,
  },

  // ── TITLE ────────────────────────────────────────────────────
  title: {
    textAlign: 'center',
    fontFamily: 'Times-Bold',
    fontSize: 13,
    textDecoration: 'underline',
    marginBottom: 14,
    letterSpacing: 0.5,
  },

  // ── NAME / DEPT ROW ──────────────────────────────────────────
  nameLine: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 12,
  },
  nameLabel: { fontFamily: 'Times-Bold', fontSize: 10.5, marginRight: 2 },
  nameDots: {
    flex: 2,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    borderBottomStyle: 'dotted',
    minHeight: 14,
    paddingBottom: 1,
    marginRight: 10,
  },
  nameValue: { fontFamily: 'Times-Roman', fontSize: 10.5 },
  deptLabel: { fontFamily: 'Times-Bold', fontSize: 10.5, marginRight: 2 },
  deptDots: {
    flex: 1.4,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    borderBottomStyle: 'dotted',
    minHeight: 14,
    paddingBottom: 1,
  },

  // ── BODY TEXT ────────────────────────────────────────────────
  para: {
    lineHeight: 1.55,
    marginBottom: 8,
    textAlign: 'justify',
    fontSize: 10.5,
  },
  bold: { fontFamily: 'Times-Bold' },

  // ── COURSE TABLE ─────────────────────────────────────────────
  table: { width: '100%', marginTop: 4, marginBottom: 6 },
  trHead: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
  },
  th: { fontFamily: 'Times-Bold', fontSize: 10.5, paddingBottom: 3 },
  trRow: { flexDirection: 'row' },
  td: { fontFamily: 'Times-Roman', fontSize: 10, paddingTop: 1.5, paddingBottom: 1.5 },

  // ── OTHER SUBJECTS ───────────────────────────────────────────
  otherLabel: { fontFamily: 'Times-Bold', fontSize: 10.5, marginBottom: 3 },
  bulletRow: { flexDirection: 'row', marginLeft: 10 },
  bulletDot: { fontSize: 10.5, marginRight: 5 },
  bulletText: { fontSize: 10.5, flex: 1, lineHeight: 1.5 },

  // ── FOOTER (only on page 1, NOT fixed — placed at bottom naturally) ──
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 2.5,
    borderTopColor: green,
    paddingTop: 5,
    paddingBottom: 6,
    paddingLeft: 20,
    paddingRight: 20,
    backgroundColor: bgFooter,
  },
  footerRow: { flexDirection: 'row', marginBottom: 2 },
  footerLabel: { fontFamily: 'Times-Bold', fontSize: 8, marginRight: 3 },
  footerText: {
    fontFamily: 'Times-Roman',
    fontSize: 8,
    color: '#333',
    flex: 1,
    lineHeight: 1.4,
  },

  // ── RULES ────────────────────────────────────────────────────
  rulesTitle: {
    textAlign: 'center',
    fontFamily: 'Times-Bold',
    fontSize: 14,
    textDecoration: 'underline',
    marginBottom: 18,
    letterSpacing: 0.3,
  },
  ruleItem: { flexDirection: 'row', marginBottom: 9 },
  ruleNum: {
    width: 34,
    fontSize: 10,
    fontFamily: 'Times-Roman',
    lineHeight: 1.5,
  },
  ruleBody: { flex: 1 },
  ruleText: {
    fontSize: 10,
    lineHeight: 1.5,
    fontFamily: 'Times-Roman',
    textAlign: 'justify',
  },
  subList: { marginTop: 4, marginLeft: 8 },
  subItem: { flexDirection: 'row', marginBottom: 4 },
  subNum: { width: 28, fontSize: 10, lineHeight: 1.5, fontFamily: 'Times-Roman' },
  subText: {
    flex: 1,
    fontSize: 10,
    lineHeight: 1.5,
    fontFamily: 'Times-Roman',
    textAlign: 'justify',
  },

  // ── DECLARATION ──────────────────────────────────────────────
  declareBlock: { marginTop: 20 },
  declareText: {
    fontFamily: 'Times-Italic',
    fontSize: 10.5,
    marginBottom: 14,
    textAlign: 'center',
    lineHeight: 1.5,
  },
  signRow: { flexDirection: 'row', alignItems: 'flex-end', marginTop: 6 },
  signLabel: { fontFamily: 'Times-Roman', fontSize: 10.5, marginRight: 3 },
  signLine: {
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    minHeight: 15,
    paddingBottom: 1,
    marginRight: 14,
  },
  dateSignLine: {
    width: 90,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    minHeight: 15,
    paddingBottom: 1,
    marginRight: 14,
  },
  sigSignLine: {
    width: 75,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    minHeight: 15,
    paddingBottom: 1,
  },
  signValue: { fontFamily: 'Times-Roman', fontSize: 10.5 },
  signImg: { width: 80, height: 18, objectFit: 'contain' },
});

// Footer — rendered once, absolutely positioned at the bottom of page 1 only
function AdmissionFooter() {
  return (
    <View style={s.footer}>
      <View style={s.footerRow}>
        <Text style={s.footerLabel}>MISSION: </Text>
        <Text style={s.footerText}>
          To educate and nurture our students to excel in work and in life and to equip them with skills and knowledge to enhance their employability.
        </Text>
      </View>
      <View style={s.footerRow}>
        <Text style={s.footerLabel}>VISION: </Text>
        <Text style={s.footerText}>
          A leading institution that prepares our students to be work ready, life ready and world ready.
        </Text>
      </View>
      <View style={s.footerRow}>
        <Text style={s.footerLabel}>MOTTO: </Text>
        <Text style={[s.footerText, { fontFamily: 'Times-Italic' }]}>
          "Serve with skills."
        </Text>
      </View>
    </View>
  );
}

export function AdmissionLetterPDF({ formData = {}, kvtcLogoUrl, cgokLogoUrl }) {
  const { name = '', course = '', signatureData, signDate } = formData;

  // Always format the date properly regardless of input format
  const dateStr = (() => {
    if (!signDate) {
      return new Date().toLocaleDateString('en-KE', {
        day: '2-digit', month: 'short', year: 'numeric',
      });
    }
    const d = new Date(signDate);
    return isNaN(d.getTime())
      ? signDate
      : d.toLocaleDateString('en-KE', {
          day: '2-digit', month: 'short', year: 'numeric',
        });
  })();

  const renderRules = (rules, startIndex = 0) =>
    rules.map((rule, index) => (
      <View style={s.ruleItem} key={startIndex + index} wrap={false}>
        <Text style={s.ruleNum}>{startIndex + index + 1}.</Text>
        <View style={s.ruleBody}>
          {typeof rule === 'string' ? (
            <Text style={s.ruleText}>{rule}</Text>
          ) : (
            <>
              <Text style={s.ruleText}>{rule.main}</Text>
              <View style={s.subList}>
                {rule.subs.map((sub, si) => (
                  <View style={s.subItem} key={si}>
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
      {/* ── PAGE 1: Admission Letter ── */}
      <Page size="A4" style={s.pageAdmission}>
        <PdfLetterhead kvtcLogoUrl={kvtcLogoUrl} cgokLogoUrl={cgokLogoUrl} />

        <View style={s.body}>
          <Text style={s.title}>ADMISSION LETTER</Text>

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

          <Text style={s.para}>
            {'I am pleased to inform you that you have been admitted to '}
            <Text style={s.bold}>KINOO VOCATIONAL TRAINING CENTRE</Text>
            {` for the academic year ${new Date().getFullYear()}.`}
          </Text>

          <Text style={s.para}>
            <Text style={s.bold}>Kinoo V.T.C</Text>
            {' is a public institution under the county Government of Kiambu. The institution regards parents\u2019, students, staff and the management as partners with special roles and responsibilities in promoting learning. We are committed to working closely with our trainees to ensure that they are able to succeed in meeting the challenges of excellence and innovativeness hence preparing them for the world of work. You will therefore be joining a vibrant institution that strongly values discipline and puts good conduct and the character as its prerequisite to admission.'}
          </Text>

          <Text style={s.para}>
            We henceforth are privileged to offer you an admission to our institution for further studies in a course of your choice.
          </Text>

          <View style={s.table}>
            <View style={s.trHead}>
              <Text style={[s.th, { flex: 3.2 }]}>COURSE</Text>
              <Text style={[s.th, { flex: 1.5 }]}>CERTIFICATION</Text>
              <Text style={[s.th, { flex: 1.2 }]}>EXAM BODY</Text>
              <Text style={[s.th, { flex: 1.1 }]}>DURATION</Text>
            </View>
            {COURSES.map((c, i) => (
              <View style={s.trRow} key={i}>
                <Text style={[s.td, { flex: 3.2 }]}>{c.name}</Text>
                <Text style={[s.td, { flex: 1.5 }]}>{c.cert}</Text>
                <Text style={[s.td, { flex: 1.2 }]}>{c.examBody}</Text>
                <Text style={[s.td, { flex: 1.1 }]}>{c.duration}</Text>
              </View>
            ))}
          </View>

          <Text style={s.otherLabel}>Other general subjects taught are:</Text>
          <View style={s.bulletRow}>
            <Text style={s.bulletDot}>{'\u2022'}</Text>
            <Text style={s.bulletText}>
              Communication Skills, Guidance and Counseling, Entrepreneurship, Life Skills, &amp; ICT
            </Text>
          </View>
        </View>

        {/* Footer appears ONCE, pinned to bottom of page 1 only */}
        <AdmissionFooter />
      </Page>

      {/* ── PAGE 2: Rules 1–12 ── */}
      <Page size="A4" style={s.pageRules}>
        <Text style={s.rulesTitle}>RULES AND REGULATIONS</Text>
        {renderRules(RULES.slice(0, 12), 0)}
      </Page>

      {/* ── PAGE 3: Rules 13–22 + Declaration ── */}
      <Page size="A4" style={s.pageRules}>
        <Text style={s.rulesTitle}>RULES AND REGULATIONS</Text>
        {renderRules(RULES.slice(12), 12)}

        <View style={s.declareBlock}>
          <Text style={s.declareText}>
            I hereby declare that I will adhere to all the rules and regulations of this institution.
          </Text>
          <View style={s.signRow}>
            <Text style={s.signLabel}>Name:</Text>
            <View style={s.signLine}>
              <Text style={s.signValue}>{name || ' '}</Text>
            </View>
            <Text style={s.signLabel}>Date:</Text>
            <View style={s.dateSignLine}>
              <Text style={s.signValue}>{dateStr}</Text>
            </View>
            <Text style={s.signLabel}>Sign:</Text>
            <View style={s.sigSignLine}>
              {signatureData
                ? <Image src={signatureData} style={s.signImg} />
                : <Text style={s.signValue}> </Text>
              }
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
}