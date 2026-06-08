import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';

const green = '#1a6e2e';
const bgFooter = '#ede9e0';
const dark = '#000000';

const COURSES = [
  { name: "Food & Beverage Production & Service", cert: "ARTISAN",  examBody: "KNEC",       duration: "1 YEAR"   },
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
  { name: "Computer packages",                     cert: "CERT",    examBody: "INTERNAL",    duration: "2 MONTHS" },
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
      "Being punctual at all times in class, games, general duties and meals.",
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
  page: {
    backgroundColor: '#ffffff',
    fontFamily: 'Times-Roman',
    fontSize: 10,
    color: dark,
    paddingBottom: 30,
  },

  // ── Header ──
  headerTopBar: { backgroundColor: green, height: 5 },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 14,
    paddingRight: 14,
    borderBottomWidth: 3,
    borderBottomColor: green,
  },
  logo: { width: 60, height: 60, objectFit: 'contain' },
  headerCenter: { flex: 1, alignItems: 'center', paddingLeft: 8, paddingRight: 8 },
  deptText:   { fontSize: 7.5, fontFamily: 'Times-Bold', color: dark, marginBottom: 1, textAlign: 'center' },
  instName:   { fontSize: 11, fontFamily: 'Times-Bold', color: green, textTransform: 'uppercase', marginBottom: 2, textAlign: 'center' },
  contactTxt: { fontSize: 7, color: '#444', textAlign: 'center', marginBottom: 1 },

  // ── Body ──
  body: { paddingTop: 12, paddingBottom: 16, paddingLeft: 30, paddingRight: 30 },
  title: {
    textAlign: 'center', fontFamily: 'Times-Bold',
    fontSize: 14, textDecoration: 'underline',
    marginBottom: 14, letterSpacing: 1,
  },

  // ── Name / Department row — FIX: stack vertically so long names don't clip ──
  nameDepRow: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'flex-start',   // top-align so tall wrapped text doesn't clip
  },
  nameBlock: { flex: 2, marginRight: 12 },
  deptBlock: { flex: 2 },
  fieldLabel: { fontFamily: 'Times-Bold', fontSize: 10, marginBottom: 2 },
  // The value sits ON a bottom-border line; we use a View wrapper so long text wraps cleanly
  fieldValueWrap: {
    borderBottomWidth: 1.5,
    borderBottomColor: '#444',
    borderStyle: 'dotted',
    paddingBottom: 2,
    minHeight: 16,
  },
  fieldValue: { fontSize: 10, fontFamily: 'Times-Roman' },

  // ── Body text ──
  para: { lineHeight: 1.6, marginBottom: 8, textAlign: 'justify', fontSize: 10 },
  bold: { fontFamily: 'Times-Bold' },

  // ── Table ──
  table: { width: '100%', marginTop: 6, marginBottom: 10 },
  trHead: { backgroundColor: green, flexDirection: 'row' },
  th: { color: '#fff', padding: 5, fontSize: 8.5, fontFamily: 'Times-Bold', borderRightWidth: 0.5, borderRightColor: '#ccc' },
  trEven: { flexDirection: 'row', backgroundColor: '#f0ede6' },
  trOdd:  { flexDirection: 'row', backgroundColor: '#ffffff' },
  td: { padding: 4, fontSize: 8.5, borderBottomWidth: 0.5, borderBottomColor: '#ddd', borderRightWidth: 0.5, borderRightColor: '#ddd' },

  // ── Footer ──
  footer: {
    borderTopWidth: 2.5, borderTopColor: green,
    paddingTop: 8, paddingBottom: 10,
    paddingLeft: 14, paddingRight: 14,
    backgroundColor: bgFooter,
  },
  footerRow: { flexDirection: 'row', marginBottom: 3 },
  footerLabel: { fontFamily: 'Times-Bold', fontSize: 7.5, marginRight: 4 },
  footerText:  { fontFamily: 'Times-Roman', fontSize: 7.5, color: '#333', flex: 1, lineHeight: 1.5 },

  // ── Rules page ──
  rulesBody: { paddingLeft: 28, paddingRight: 28, paddingTop: 14, paddingBottom: 20 },
  rulesTitle: {
    textAlign: 'center', fontFamily: 'Times-Bold',
    fontSize: 14, textDecoration: 'underline',
    marginBottom: 14, letterSpacing: 1,
  },
  // FIX: removed wrap={false} — instead just use normal flow with generous margins
  ruleItem: { flexDirection: 'row', marginBottom: 6 },
  ruleNum:  { width: 22, fontSize: 10, fontFamily: 'Times-Roman' },
  ruleText: { flex: 1, fontSize: 10, lineHeight: 1.5, fontFamily: 'Times-Roman' },
  subList:  { marginTop: 3, marginLeft: 4 },
  subItem:  { flexDirection: 'row', marginBottom: 3 },
  subNum:   { width: 16, fontSize: 10 },
  subText:  { flex: 1, fontSize: 10, lineHeight: 1.45 },

  // ── Declaration / sign row ──
  declareText: { fontFamily: 'Times-Italic', fontSize: 10, marginTop: 14, marginBottom: 14 },
  signRow: { flexDirection: 'row', alignItems: 'flex-end' },
  signBlock: { flex: 1, marginRight: 10 },
  signLabel: { fontFamily: 'Times-Bold', fontSize: 9, marginBottom: 3 },
  signLine: {
    borderBottomWidth: 1.5, borderBottomColor: '#333',
    borderStyle: 'solid', paddingBottom: 2, minHeight: 18,
  },
  signValue: { fontSize: 10 },
  signImg: { width: 90, height: 22, objectFit: 'contain' },
});

// ── Reusable header ────────────────────────────────────────────────────────
function Header({ kvtcLogoUrl, cgokLogoUrl }) {
  return (
    <>
      <View style={s.headerTopBar} />
      <View style={s.headerRow}>
        {kvtcLogoUrl
          ? <Image src={kvtcLogoUrl} style={s.logo} />
          : <View style={s.logo} />}
        <View style={s.headerCenter}>
          <Text style={s.deptText}>Department of Education, Gender, Culture &amp; Social Services</Text>
          <Text style={s.instName}>KINOO VOCATIONAL TRAINING CENTRE</Text>
          <Text style={s.contactTxt}>P.O BOX 351-00902, Kikuyu.   Tel: 0113582008</Text>
          <Text style={s.contactTxt}>Email: kinoovtc@gmail.com   www.kinoovtc.ac.ke</Text>
        </View>
        {cgokLogoUrl
          ? <Image src={cgokLogoUrl} style={s.logo} />
          : <View style={s.logo} />}
      </View>
    </>
  );
}

// ── Reusable footer ────────────────────────────────────────────────────────
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
export function AdmissionLetterPDF({ formData = {}, kvtcLogoUrl, cgokLogoUrl }) {
  const { name = '', course = '', signatureData, signDate } = formData;
  const dateStr = signDate ? signDate : new Date().toLocaleDateString('en-KE');

  return (
    <Document
      title={`Admission Letter - ${name || 'Applicant'}`}
      author="Kinoo Vocational Training Centre"
      subject="Student Admission Letter"
    >
      {/* ══════════ PAGE 1: ADMISSION LETTER ══════════ */}
      <Page size="A4" style={s.page}>
        <Header kvtcLogoUrl={kvtcLogoUrl} cgokLogoUrl={cgokLogoUrl} />

        <View style={s.body}>
          <Text style={s.title}>ADMISSION LETTER</Text>

          {/*
            FIX: NAME + DEPARTMENT — each field is a labelled block with a
            bordered wrapper so long course names wrap inside the box instead
            of overflowing or pushing text off-screen.
          */}
          <View style={s.nameDepRow}>
            <View style={s.nameBlock}>
              <Text style={s.fieldLabel}>NAME:</Text>
              <View style={s.fieldValueWrap}>
                <Text style={s.fieldValue}>{name || ' '}</Text>
              </View>
            </View>
            <View style={s.deptBlock}>
              <Text style={s.fieldLabel}>DEPARTMENT:</Text>
              <View style={s.fieldValueWrap}>
                {/* FIX: Text wraps naturally; no fixed width forcing overflow */}
                <Text style={s.fieldValue}>{course || ' '}</Text>
              </View>
            </View>
          </View>

          <Text style={s.para}>
            I am pleased to inform you that you have been admitted to{' '}
            <Text style={s.bold}>KINOO VOCATIONAL TRAINING CENTRE</Text>{' '}
            for the academic year {new Date().getFullYear()}.
          </Text>

          <Text style={s.para}>
            <Text style={s.bold}>Kinoo V.T.C</Text> is a public institution under the county Government of Kiambu. The institution regards parents', students, staff and the management as partners with special roles and responsibilities in promoting learning. We are committed to working closely with our trainees to ensure that they are able to succeed in meeting the challenges of excellence and innovativeness hence preparing them for the world of work. You will therefore be joining a vibrant institution that strongly values discipline and puts good conduct and the character as its prerequisite to admission.
          </Text>

          <Text style={s.para}>
            We henceforth are privileged to offer you an admission to our institution for further studies in a course of your choice.
          </Text>

          {/* Courses table */}
          <View style={s.table}>
            <View style={s.trHead}>
              <Text style={[s.th, { flex: 3 }]}>COURSE</Text>
              <Text style={[s.th, { flex: 1.4 }]}>CERTIFICATION</Text>
              <Text style={[s.th, { flex: 1.2 }]}>EXAM BODY</Text>
              <Text style={[s.th, { flex: 1.2 }]}>DURATION</Text>
            </View>
            {COURSES.map((c, i) => (
              <View style={i % 2 === 0 ? s.trOdd : s.trEven} key={i}>
                <Text style={[s.td, { flex: 3 }]}>{c.name}</Text>
                <Text style={[s.td, { flex: 1.4 }]}>{c.cert}</Text>
                <Text style={[s.td, { flex: 1.2 }]}>{c.examBody}</Text>
                <Text style={[s.td, { flex: 1.2 }]}>{c.duration}</Text>
              </View>
            ))}
          </View>

          <Text style={[s.bold, { fontSize: 10, marginBottom: 4 }]}>Other general subjects taught are:</Text>
          <View style={{ flexDirection: 'row', marginLeft: 12 }}>
            <Text style={{ fontSize: 10, marginRight: 4 }}>•</Text>
            <Text style={{ fontSize: 10, flex: 1, lineHeight: 1.5 }}>
              Communication Skills, Guidance and Counseling, Entrepreneurship, Life Skills, &amp; ICT
            </Text>
          </View>

          {/*
            FIX: Principal signature section REMOVED entirely as requested.
            The physical printed copy will have the blank line signed by hand.
          */}
        </View>

        <Footer />
      </Page>

      {/* ══════════ PAGE 2: RULES AND REGULATIONS ══════════ */}
      <Page size="A4" style={s.page}>
        <View style={s.rulesBody}>
          <Text style={s.rulesTitle}>RULES AND REGULATIONS</Text>

          {RULES.map((rule, i) => (
            <View style={s.ruleItem} key={i} wrap={false}>
              <Text style={s.ruleNum}>{i + 1}.</Text>
              <View style={{ flex: 1 }}>
                {typeof rule === 'string' ? (
                  <Text style={s.ruleText}>{rule}</Text>
                ) : (
                  <>
                    <Text style={s.ruleText}>{rule.main}</Text>
                    <View style={s.subList}>
                      {rule.subs.map((sub, j) => (
                        <View style={s.subItem} key={j}>
                          <Text style={s.subNum}>{String.fromCharCode(97 + j)})</Text>
                          <Text style={s.subText}>{sub}</Text>
                        </View>
                      ))}
                    </View>
                  </>
                )}
              </View>
            </View>
          ))}

          <Text style={s.declareText}>
            I hereby declare that I will adhere to all the rules and regulations of this institution.
          </Text>

          {/* Sign row */}
          <View style={s.signRow}>
            <View style={s.signBlock}>
              <Text style={s.signLabel}>NAME:</Text>
              <View style={s.signLine}>
                <Text style={s.signValue}>{name || ' '}</Text>
              </View>
            </View>
            <View style={s.signBlock}>
              <Text style={s.signLabel}>SIGN:</Text>
              <View style={s.signLine}>
                {signatureData
                  ? <Image src={signatureData} style={s.signImg} />
                  : <Text style={s.signValue}> </Text>}
              </View>
            </View>
            <View style={[s.signBlock, { marginRight: 0 }]}>
              <Text style={s.signLabel}>DATE:</Text>
              <View style={s.signLine}>
                <Text style={s.signValue}>{dateStr}</Text>
              </View>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
}