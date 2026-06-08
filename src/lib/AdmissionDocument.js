import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';

const green = '#1a6e2e';
const navyBlue = '#1a3a6e';
const gold = '#EF9F27';
const dark = '#000000';
const mid = '#333333';
const soft = '#666666';
const white = '#FFFFFF';
const bgPage = '#f4f2ee';
const bgFooter = '#ede9e0';

const s = StyleSheet.create({
  page: {
    backgroundColor: bgPage,
    fontFamily: 'Times-Roman',
    fontSize: 10,
    margin: 0,
    padding: 0,
  },

  // ── HEADER ──
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 10,
    paddingBottom: 8,
    paddingLeft: 14,
    paddingRight: 14,
    borderBottomWidth: 3,
    borderBottomColor: navyBlue,
    backgroundColor: bgPage,
  },
  logo: { width: 64, height: 64, objectFit: 'contain' },
  headerCenter: { flex: 1, alignItems: 'center', paddingLeft: 8, paddingRight: 8 },
  deptText: { fontSize: 8, fontFamily: 'Times-Bold', color: dark, marginBottom: 1, textAlign: 'center' },
  instName: { fontSize: 11, fontFamily: 'Times-Bold', color: green, letterSpacing: 0.6, textTransform: 'uppercase', marginBottom: 2, textAlign: 'center' },
  contactText: { fontSize: 7.5, color: mid, textAlign: 'center' },

  // ── BODY ──
  body: { paddingTop: 10, paddingBottom: 12, paddingLeft: 20, paddingRight: 20, flex: 1 },
  formTitle: { textAlign: 'center', fontFamily: 'Times-Bold', fontSize: 12, textDecoration: 'underline', marginBottom: 8 },

  // ── SECTION HEADERS ──
  sectionTitle: { fontFamily: 'Times-Bold', textDecoration: 'underline', marginTop: 8, marginBottom: 2, fontSize: 10 },

  // ── FIELD ROWS ──
  row: { flexDirection: 'row', alignItems: 'flex-end', flexWrap: 'wrap', marginBottom: 0, minHeight: 18 },
  label: { fontFamily: 'Times-Roman', fontSize: 9.5, color: dark, whiteSpace: 'nowrap', flexShrink: 0 },
  field: {
    flex: 1,
    minWidth: 50,
    borderBottomWidth: 1,
    borderBottomColor: '#444',
    borderBottomStyle: 'dotted',
    minHeight: 14,
    paddingBottom: 1,
    marginRight: 4,
  },
  fieldText: { fontFamily: 'Times-Roman', fontSize: 9.5, color: dark },
  fieldGhost: { borderBottomWidth: 1, borderBottomColor: '#bbb', borderBottomStyle: 'dotted', minHeight: 14, flex: 1, minWidth: 40 },

  // ── DECLARATION ──
  declarationText: { fontFamily: 'Times-Roman', fontSize: 9.5, color: dark, lineHeight: 1.9, marginBottom: 4 },
  declarationName: { borderBottomWidth: 1, borderBottomColor: '#444', borderBottomStyle: 'dotted', minWidth: 140, paddingBottom: 1 },
  declarationNameText: { fontFamily: 'Times-Roman', fontSize: 9.5, color: dark },

  // ── SIGNATURE ──
  sigBox: { width: 100, height: 24, borderBottomWidth: 1, borderBottomColor: '#444', borderBottomStyle: 'dotted', flexShrink: 0 },
  sigImg: { width: 100, height: 24, objectFit: 'contain', objectPosition: 'left bottom' },

  // ── OFFICIAL USE ──
  officialDivider: { marginTop: 10, paddingTop: 6 },

  // ── FOOTER ──
  footer: {
    borderTopWidth: 2.5,
    borderTopColor: navyBlue,
    paddingTop: 8,
    paddingBottom: 10,
    paddingLeft: 20,
    paddingRight: 20,
    backgroundColor: bgFooter,
  },
  footerGrid: { flexDirection: 'row' },
  footerLabel: { fontFamily: 'Times-Bold', fontSize: 8.5 },
  footerText: { fontFamily: 'Times-Roman', fontSize: 8.5, color: mid, flex: 1, lineHeight: 1.5 },
  footerRow: { flexDirection: 'row', marginBottom: 3 },

});

// Thin helper: label + dotted field value
const Field = ({ label, value, flex = 1, maxWidth }) => (
  <View style={[s.field, maxWidth ? { maxWidth, flex: undefined } : { flex }]}>
    {label ? <Text style={[s.label, { position: 'absolute', top: -10, fontSize: 8.5, color: soft }]}>{label}</Text> : null}
    <Text style={s.fieldText}>{value || ' '}</Text>
  </View>
);

const Row = ({ children, mt = 0 }) => (
  <View style={[s.row, { marginTop: mt }]}>{children}</View>
);

const L = ({ t }) => <Text style={s.label}>{t}</Text>;

const Ghost = ({ flex = 1, maxWidth }) => (
  <View style={[s.fieldGhost, maxWidth ? { maxWidth, flex: undefined } : { flex }]} />
);

// Helper for date formatting
function fmtDate(iso) {
  if (!iso) return '';
  const [y, m, d] = iso.split('-');
  const mnames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return `${d} ${mnames[+m - 1]} ${y}`;
}

export function AdmissionDocument({ formData = {}, kvtcLogoUrl, cgokLogoUrl }) {
  const {
    name, idNo, dob, tel, homeAddress, residentialArea,
    kinName, kinIdNo, kinTel, relationship,
    course, duration, examBody, startDate,
    signatureData, signDate,
    paymentAmount = 500,
    email = '',
    submittedAt,
  } = formData;

  const now = submittedAt ? new Date(submittedAt) : new Date();
  const dateStr = now.toLocaleDateString('en-KE', { day: '2-digit', month: 'long', year: 'numeric' });

  return (
    <Document
      title={`Admission Form – ${name || 'Applicant'}`}
      author="Kinoo Vocational Training Centre"
      subject="Student Admission Form"
    >
      <Page size="A4" style={s.page}>

        {/* ── HEADER ── */}
        <View style={s.header}>
          {kvtcLogoUrl
            ? <Image src={kvtcLogoUrl} style={s.logo} />
            : <View style={[s.logo, { backgroundColor: green, alignItems: 'center', justifyContent: 'center' }]}><Text style={{ color: white, fontSize: 18, fontFamily: 'Times-Bold' }}>KV</Text></View>
          }
          <View style={s.headerCenter}>
            <Text style={s.deptText}>Department Of Education, Gender, Culture & Social Services</Text>
            <Text style={s.instName}>KINOO VOCATIONAL TRAINING CENTRE</Text>
            <Text style={s.contactText}>P.O BOX 351-00902, Kikuyu.   Tel: 0113582008</Text>
            <Text style={s.contactText}>Email: kinoovtc@gmail.com   www.kinoovtc.ac.ke</Text>
          </View>
          {cgokLogoUrl
            ? <Image src={cgokLogoUrl} style={s.logo} />
            : <View style={[s.logo, { backgroundColor: '#c8a020', alignItems: 'center', justifyContent: 'center' }]}><Text style={{ color: white, fontSize: 10, fontFamily: 'Times-Bold', textAlign: 'center' }}>COUNTY{'\n'}GOVT</Text></View>
          }
        </View>

        {/* ── BODY ── */}
        <View style={s.body}>
          <Text style={s.formTitle}>ADMISSION FORM</Text>

          {/* PERSONAL DETAILS */}
          <Text style={s.sectionTitle}>PERSONAL DETAILS</Text>
          <Row>
            <L t="ADM NO" /><Ghost maxWidth={140} /><L t="   DATE" /><Ghost maxWidth={110} />
          </Row>
          <Row mt={2}>
            <L t="NAME  " />
            <View style={[s.field, { flex: 1 }]}><Text style={s.fieldText}>{name || ' '}</Text></View>
          </Row>
          <Row mt={2}>
            <L t="ID NO  " />
            <View style={[s.field, { maxWidth: 140 }]}><Text style={s.fieldText}>{idNo || ' '}</Text></View>
            <L t="   DATE OF BIRTH  " />
            <View style={[s.field, { maxWidth: 140 }]}><Text style={s.fieldText}>{fmtDate(dob)}</Text></View>
          </Row>
          <Row mt={2}>
            <L t="TEL  " />
            <View style={[s.field, { maxWidth: 200 }]}><Text style={s.fieldText}>{tel || ' '}</Text></View>
          </Row>
          <Row mt={2}>
            <L t="HOME ADDRESS  " />
            <View style={[s.field, { maxWidth: 160 }]}><Text style={s.fieldText}>{homeAddress || ' '}</Text></View>
            <L t="  RESIDENTIAL AREA  " />
            <View style={[s.field, { flex: 1 }]}><Text style={s.fieldText}>{residentialArea || ' '}</Text></View>
          </Row>

          {/* NEXT OF KIN */}
          <Text style={s.sectionTitle}>NEXT OF KIN</Text>
          <Row>
            <L t="NAME  " />
            <View style={[s.field, { flex: 1 }]}><Text style={s.fieldText}>{kinName || ' '}</Text></View>
          </Row>
          <Row mt={2}>
            <L t="ID NO  " />
            <View style={[s.field, { maxWidth: 140 }]}><Text style={s.fieldText}>{kinIdNo || ' '}</Text></View>
            <L t="   TEL  " />
            <View style={[s.field, { maxWidth: 160 }]}><Text style={s.fieldText}>{kinTel || ' '}</Text></View>
          </Row>
          <Row mt={2}>
            <L t="RELATIONSHIP  " />
            <View style={[s.field, { maxWidth: 280 }]}><Text style={s.fieldText}>{relationship || ' '}</Text></View>
          </Row>

          {/* ADMISSION DETAILS */}
          <Text style={s.sectionTitle}>ADMISSION DETAILS</Text>
          <Row>
            <L t="COURSE  " />
            <View style={[s.field, { flex: 1 }]}><Text style={s.fieldText}>{course || ' '}</Text></View>
          </Row>
          <Row mt={2}>
            <L t="DURATION  " />
            <View style={[s.field, { maxWidth: 180 }]}><Text style={s.fieldText}>{duration || ' '}</Text></View>
          </Row>
          <Row mt={2}>
            <L t="EXAM BODY  " />
            <View style={[s.field, { maxWidth: 180 }]}><Text style={s.fieldText}>{examBody || ' '}</Text></View>
          </Row>
          <Row mt={2}>
            <L t="START DATE  " />
            <View style={[s.field, { maxWidth: 180 }]}><Text style={s.fieldText}>{fmtDate(startDate)}</Text></View>
          </Row>

          {/* DECLARATION */}
          <Text style={s.sectionTitle}>DECLARATION</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'flex-end', lineHeight: 1.9, marginBottom: 4 }}>
            <Text style={s.declarationText}>I  </Text>
            <View style={s.declarationName}><Text style={s.declarationNameText}>{name || '                                    '}</Text></View>
            <Text style={s.declarationText}>  declare that I shall abide by the rules and regulations and be obedient to the management and staff in the institution.</Text>
          </View>

          <Row mt={2}>
            <L t="SIGN  " />
            {signatureData
              ? <View style={s.sigBox}><Image src={signatureData} style={s.sigImg} /></View>
              : <View style={s.sigBox} />
            }
            <L t="   DATE  " />
            <View style={[s.field, { maxWidth: 130 }]}><Text style={s.fieldText}>{fmtDate(signDate)}</Text></View>
          </Row>

          {/* OFFICIAL USE */}
          <View style={s.officialDivider}>
            <Text style={s.sectionTitle}>OFFICIAL USE</Text>
            <Row>
              <L t="NAME OF STUDENT  " />
              <View style={[s.field, { maxWidth: 200 }]}><Text style={s.fieldText}>{name || ' '}</Text></View>
              <L t="   ADMISSION NO  " />
              <Ghost maxWidth={100} />
            </Row>
            <Row mt={4}>
              <L t="ADMISSION DATE  " />
              <Ghost maxWidth={170} />
              <L t="   SIGN  " />
              <View style={{ width: 100, height: 24, borderBottomWidth: 1, borderBottomColor: '#444', borderBottomStyle: 'dotted' }}>
                {signatureData ? <Image src={signatureData} style={{ width: 100, height: 24, objectFit: 'contain' }} /> : null}
              </View>
            </Row>
          </View>
        </View>

        {/* ── FOOTER ── */}
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
    </Document>
  );
}
