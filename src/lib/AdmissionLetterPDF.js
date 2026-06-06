import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image, Font } from '@react-pdf/renderer';

const green = '#1a6e2e';
const navyBlue = '#1a3a6e';
const dark = '#000000';
const bgFooter = '#ede9e0';

const COURSES = [
  { name: "Food & Beverage Production & Service", cert: "ARTISAN", examBody: "KNEC",       duration: "1 YEAR"   },
  { name: "Hair Dressing and Beauty Therapy",      cert: "GRADE 3", examBody: "NITA",       duration: "1 YEAR"   },
  { name: "Electrical and Electronics",            cert: "GRADE 3", examBody: "NITA",       duration: "1 YEAR"   },
  { name: "Electronic Mechanics",                  cert: "GRADE 3", examBody: "NITA",       duration: "1 YEAR"   },
  { name: "Solar PV Installation",                 cert: "GRADE 3", examBody: "NITA",       duration: "6 MONTHS" },
  { name: "Security & Network Systems",            cert: "CERT",    examBody: "(INTERNAL)", duration: "3 MONTHS" },
  { name: "Plumbing",                              cert: "GRADE 3", examBody: "NITA",       duration: "1 YEAR"   },
  { name: "Masonry",                               cert: "GRADE 3", examBody: "NITA",       duration: "1 YEAR"   },
  { name: "Fashion Design and Dressmaking",        cert: "GRADE 3", examBody: "NITA",       duration: "1 YEAR"   },
  { name: "Motor Vehicle Mechanics",               cert: "GRADE 3", examBody: "NITA",       duration: "1 YEAR"   },
  { name: "Welding & Fabrication",                 cert: "GRADE 3", examBody: "NITA",       duration: "1 YEAR"   },
  { name: "Computer Operator",                     cert: "GRADE 3", examBody: "NITA",       duration: "1 YEAR"   },
  { name: "Computer packages",                     cert: "CERT",    examBody: "INTERNAL",   duration: "2 MONTHS" },
];

const RULES = [
  "All trainees must respect Authority and Co-exist harmoniously with the entire polytechnic Community.",
  "Sneaking out of school compound is a serious offence without express permission from the Manager, deputy manager, and instructor on duty or the class Instructor.",
  "English, Kiswahili shall be the language of communication in the institution and out of school activities.",
  "Stern disciplinary action will be taken against any trainee who bullies, molests, fights or insults and other trainee or trainees. When offended seek administrative redress.",
  "Every trainee expected to exhibit good and proper behavior towards members of the teaching, Non-teaching staff, other trainees as well as school prefects. Any trainee who disregards this rule will be heavily punished.",
  "Any type of punishment administered to ANY trainee by the school authorities must be carried out satisfactorily. Failure to observe this rule may even lead to suspension, and/ or expulsion.",
  { main: "Every trainee must stick to institution programmes by:", subs: [
    "Attending all the lessons.",
    "Sitting for all examinations and doing all assignments.",
    "Being punctual at all times in class, games, general duties and meals.",
    "Note that there are no breaks between lessons UNLESS provided for in the time table.",
    "Not having any other form of entertainment other than the ones stipulated by the administration.",
    "Performing duties as allocated by any lawful authority.",
  ]},
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
    margin: 0,
    padding: 0,
    color: dark,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 10,
    paddingBottom: 8,
    paddingLeft: 14,
    paddingRight: 14,
    borderBottomWidth: 3,
    borderBottomColor: green,
  },
  logo: { width: 64, height: 64, objectFit: 'contain' },
  headerCenter: { flex: 1, alignItems: 'center', paddingLeft: 8, paddingRight: 8 },
  deptText: { fontSize: 8, fontFamily: 'Times-Bold', color: dark, marginBottom: 1, textAlign: 'center' },
  instName: { fontSize: 11, fontFamily: 'Times-Bold', color: green, letterSpacing: 0.6, textTransform: 'uppercase', marginBottom: 2, textAlign: 'center' },
  contactText: { fontSize: 7.5, color: '#444', textAlign: 'center' },
  body: { paddingTop: 14, paddingBottom: 20, paddingLeft: 30, paddingRight: 30, flex: 1 },
  title: { textAlign: 'center', fontFamily: 'Times-Bold', fontSize: 14, textDecoration: 'underline', marginBottom: 16, letterSpacing: 1 },
  inputRow: { flexDirection: 'row', alignItems: 'flex-end', marginBottom: 14 },
  label: { fontFamily: 'Times-Bold', fontSize: 10, marginRight: 6 },
  inlineInput: { borderBottomWidth: 1.5, borderBottomStyle: 'dotted', borderBottomColor: '#444', paddingBottom: 1, minWidth: 100, fontSize: 10, flex: 1 },
  paragraph: { lineHeight: 1.6, marginBottom: 10, textAlign: 'justify', fontSize: 10 },
  table: { width: '100%', borderCollapse: 'collapse', marginTop: 8, marginBottom: 12 },
  trHead: { backgroundColor: green, flexDirection: 'row' },
  th: { color: '#fff', padding: 5, fontSize: 9, fontFamily: 'Times-Bold', border: '1px solid #ccc' },
  trRow: { flexDirection: 'row' },
  td: { padding: 4, fontSize: 9, border: '1px solid #ccc', borderTopWidth: 0 },
  signatureBox: { alignItems: 'center', width: 140, marginTop: 28, alignSelf: 'flex-end' },
  signatureLine: { borderBottomWidth: 1.5, borderBottomColor: '#333', width: '100%', marginBottom: 4 },
  signatureLabel: { fontSize: 9, fontFamily: 'Times-Bold', letterSpacing: 0.5 },
  listContainer: { paddingLeft: 20 },
  listItem: { flexDirection: 'row', marginBottom: 6 },
  listDot: { width: 15, fontSize: 10, fontFamily: 'Times-Bold' },
  listText: { flex: 1, fontSize: 10, lineHeight: 1.5 },
  footer: { borderTopWidth: 2.5, borderTopColor: green, paddingTop: 8, paddingBottom: 12, paddingLeft: 14, paddingRight: 14, backgroundColor: bgFooter },
  footerRow: { flexDirection: 'row', marginBottom: 3 },
  footerLabel: { fontFamily: 'Times-Bold', fontSize: 8 },
  footerText: { fontFamily: 'Times-Roman', fontSize: 8, color: '#333', flex: 1, lineHeight: 1.5 },
  ruleList: { marginLeft: 15 },
  ruleItem: { flexDirection: 'row', marginBottom: 5 },
  ruleNum: { width: 20, fontSize: 10 },
  ruleText: { flex: 1, fontSize: 10, lineHeight: 1.4 },
  subRuleList: { marginTop: 4, marginLeft: 10 },
  subRuleItem: { flexDirection: 'row', marginBottom: 3 },
  subRuleNum: { width: 15, fontSize: 10 },
});

export function AdmissionLetterPDF({ formData = {}, kvtcLogoUrl, cgokLogoUrl }) {
  const { name, course, signatureData, signDate } = formData;

  const currentYear = new Date().getFullYear();
  const dateStr = signDate ? signDate : new Date().toLocaleDateString('en-KE');

  return (
    <Document
      title={`Admission Letter - ${name || 'Applicant'}`}
      author="Kinoo Vocational Training Centre"
      subject="Student Admission Letter"
    >
      {/* PAGE 1: ADMISSION LETTER */}
      <Page size="A4" style={s.page}>
        <View style={s.header}>
          {kvtcLogoUrl ? <Image src={kvtcLogoUrl} style={s.logo} /> : <View style={s.logo} />}
          <View style={s.headerCenter}>
            <Text style={s.deptText}>Department of Education, Gender, Culture & Social Services</Text>
            <Text style={s.instName}>KINOO VOCATIONAL TRAINING CENTRE</Text>
            <Text style={s.contactText}>P.O BOX 351-00902, Kikuyu.   Tel: 0113582008</Text>
            <Text style={s.contactText}>Email: kinoovtc@gmail.com   www.kinoovtc.ac.ke</Text>
          </View>
          {cgokLogoUrl ? <Image src={cgokLogoUrl} style={s.logo} /> : <View style={s.logo} />}
        </View>

        <View style={s.body}>
          <Text style={s.title}>ADMISSION LETTER</Text>
          
          <View style={{ flexDirection: 'row', marginBottom: 14 }}>
            <View style={{ flexDirection: 'row', alignItems: 'flex-end', flex: 2, marginRight: 16 }}>
              <Text style={s.label}>NAME:</Text>
              <Text style={s.inlineInput}>{name || ' '}</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'flex-end', flex: 1 }}>
              <Text style={s.label}>DEPARTMENT:</Text>
              <Text style={s.inlineInput}>{course || ' '}</Text>
            </View>
          </View>

          <Text style={s.paragraph}>
            I am pleased to inform you that you have been admitted to <Text style={{ fontFamily: 'Times-Bold' }}>KINOO VOCATIONAL TRAINING CENTRE</Text> for the academic year {currentYear}.
          </Text>
          <Text style={s.paragraph}>
            <Text style={{ fontFamily: 'Times-Bold' }}>Kinoo V.T.C</Text> is a public institution under the county Government of Kiambu. The institution regards parents', students, staff and the management as partners with special roles and responsibilities in promoting learning. We are committed to working closely with our trainees to ensure that they are able to succeed in meeting the challenges of excellence and innovativeness hence preparing them for the world of work. You will therefore be joining a vibrant institution that strongly values discipline and puts good conduct and the character as its prerequisite to admission.
          </Text>
          <Text style={s.paragraph}>
            We henceforth are privileged to offer you an admission to our institution for further studies in a course of your choice.
          </Text>

          <View style={s.table}>
            <View style={s.trHead}>
              <Text style={[s.th, { flex: 2 }]}>COURSE</Text>
              <Text style={[s.th, { flex: 1 }]}>CERTIFICATION</Text>
              <Text style={[s.th, { flex: 1 }]}>EXAM BODY</Text>
              <Text style={[s.th, { flex: 1 }]}>DURATION</Text>
            </View>
            {COURSES.map((c, i) => (
              <View style={s.trRow} key={i}>
                <Text style={[s.td, { flex: 2, backgroundColor: i % 2 !== 0 ? '#f0ede6' : '#fff' }]}>{c.name}</Text>
                <Text style={[s.td, { flex: 1, backgroundColor: i % 2 !== 0 ? '#f0ede6' : '#fff' }]}>{c.cert}</Text>
                <Text style={[s.td, { flex: 1, backgroundColor: i % 2 !== 0 ? '#f0ede6' : '#fff' }]}>{c.examBody}</Text>
                <Text style={[s.td, { flex: 1, backgroundColor: i % 2 !== 0 ? '#f0ede6' : '#fff' }]}>{c.duration}</Text>
              </View>
            ))}
          </View>

          <Text style={{ marginTop: 10, fontFamily: 'Times-Bold', fontSize: 10 }}>Other general subjects taught are:</Text>
          <View style={s.listContainer}>
            <View style={s.listItem}>
              <Text style={s.listDot}>•</Text>
              <Text style={s.listText}>Communication Skills, Guidance and Counseling, Entrepreneurship, Life Skills, & ICT</Text>
            </View>
          </View>

          <View style={s.signatureBox}>
            <View style={s.signatureLine} />
            <Text style={s.signatureLabel}>PRINCIPAL'S SIGNATURE</Text>
          </View>
        </View>

        <View style={s.footer}>
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
      </Page>

      {/* PAGE 2: RULES AND REGULATIONS */}
      <Page size="A4" style={s.page}>
        <View style={s.body}>
          <Text style={s.title}>RULES AND REGULATIONS</Text>

          <View style={s.ruleList}>
            {RULES.map((rule, i) => (
              <View key={i} style={s.ruleItem}>
                <Text style={s.ruleNum}>{i + 1}.</Text>
                <View style={{ flex: 1 }}>
                  {typeof rule === 'string' ? (
                    <Text style={s.ruleText}>{rule}</Text>
                  ) : (
                    <>
                      <Text style={s.ruleText}>{rule.main}</Text>
                      <View style={s.subRuleList}>
                        {rule.subs.map((sub, j) => (
                          <View key={j} style={s.subRuleItem}>
                            <Text style={s.subRuleNum}>{String.fromCharCode(97 + j)})</Text>
                            <Text style={s.ruleText}>{sub}</Text>
                          </View>
                        ))}
                      </View>
                    </>
                  )}
                </View>
              </View>
            ))}
          </View>

          <Text style={{ fontFamily: 'Times-Italic', fontSize: 10, marginTop: 16, marginBottom: 16 }}>
            I hereby declare that I will adhere to all the rules and regulations of this institution.
          </Text>

          <View style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between' }}>
            <View style={{ flex: 2, marginRight: 16 }}>
              <Text style={s.label}>NAME:</Text>
              <Text style={{ borderBottomWidth: 1.5, borderBottomColor: '#333', paddingBottom: 2, fontSize: 10, marginTop: 4 }}>
                {name || ' '}
              </Text>
            </View>
            <View style={{ flex: 2, marginRight: 16 }}>
              <Text style={s.label}>SIGN:</Text>
              <View style={{ borderBottomWidth: 1.5, borderBottomColor: '#333', height: 24, marginTop: 4 }}>
                {signatureData ? <Image src={signatureData} style={{ width: 100, height: 24, objectFit: 'contain' }} /> : null}
              </View>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={s.label}>DATE:</Text>
              <Text style={{ borderBottomWidth: 1.5, borderBottomColor: '#333', paddingBottom: 2, fontSize: 10, marginTop: 4 }}>
                {dateStr}
              </Text>
            </View>
          </View>

        </View>
      </Page>
    </Document>
  );
}
