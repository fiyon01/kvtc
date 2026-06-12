import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import PdfLetterhead from './PdfLetterhead';

const green = '#1a6e2e';
const navyBlue = '#1a3a6e';
const gold = '#EF9F27';
const dark = '#000000';
const mid = '#333333';
const soft = '#666666';
const white = '#FFFFFF';
const bgPage = '#ffffff';
const bgFooter = '#ffffff';

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
  personalHeader: { flexDirection: 'row', alignItems: 'flex-start' },
  personalFields: { flex: 1, paddingRight: 12 },
  photoCard: {
    width: 78,
    height: 98,
    borderWidth: 1,
    borderColor: '#8a969c',
    backgroundColor: '#f7f8f8',
    padding: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  applicantPhoto: { width: 70, height: 90, objectFit: 'cover' },
  photoPlaceholder: { color: '#7a858b', fontSize: 7.5, textAlign: 'center', lineHeight: 1.3 },

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
  // FIX: Use a single Text block with inline spans — avoids the huge whitespace
  // that occurs when react-pdf tries to wrap a flex row containing mixed Text/View children.
  declarationPara: {
    fontFamily: 'Times-Roman',
    fontSize: 9.5,
    color: dark,
    marginBottom: 4,
    lineHeight: 1.6,
  },
  declarationUnderline: {
    fontFamily: 'Times-Roman',
    fontSize: 9.5,
    color: dark,
    textDecoration: 'underline',
  },

  // ── SIGNATURE ──
  sigBox: { width: 100, height: 24, borderBottomWidth: 1, borderBottomColor: '#444', borderBottomStyle: 'dotted', flexShrink: 0 },
  sigImg: { width: 100, height: 24, objectFit: 'contain', objectPosition: 'left bottom' },

  // ── OFFICIAL USE ──
  officialDivider: { marginTop: 10, paddingTop: 6 },

  // ── FOOTER ──
  footer: {
    borderTopWidth: 2.5,
    borderTopColor: navyBlue,
    paddingTop: 5,        // FIX: was 8 — reduce top padding
    paddingBottom: 6,     // FIX: was 10 — reduce bottom padding
    paddingLeft: 20,
    paddingRight: 20,
    backgroundColor: bgFooter,
  },
  footerGrid: { flexDirection: 'row' },
  footerLabel: { fontFamily: 'Times-Bold', fontSize: 8.5 },
  footerText: { fontFamily: 'Times-Roman', fontSize: 8.5, color: mid, flex: 1, lineHeight: 1.3 }, // FIX: lineHeight 11 → 1.3 (relative)
  footerRow: { flexDirection: 'row', marginBottom: 1 }, // FIX: marginBottom 3 → 1

  // ── PAYMENT CONFIRMATION ──
  paymentBox: {
    marginTop: 22,
    borderWidth: 1,
    borderColor: '#b8d8cc',
    borderRadius: 4,
    backgroundColor: '#fbfdfc',
    overflow: 'hidden',
  },
  paymentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 6,
    paddingBottom: 6,
    paddingLeft: 9,
    paddingRight: 9,
    backgroundColor: '#e7f3ee',
    borderBottomWidth: 1,
    borderBottomColor: '#c9e1d8',
  },
  paymentTitle: { fontFamily: 'Times-Bold', fontSize: 9, color: '#174f3c', letterSpacing: 0.4 },
  paymentStatus: {
    fontFamily: 'Times-Bold',
    fontSize: 7.5,
    color: white,
    backgroundColor: green,
    paddingTop: 3,
    paddingBottom: 3,
    paddingLeft: 7,
    paddingRight: 7,
    borderRadius: 8,
  },
  paymentDetails: {
    flexDirection: 'row',
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 9,
    paddingRight: 9,
  },
  paymentItem: { flex: 1, paddingRight: 8 },
  paymentItemLast: { flex: 1 },
  paymentLabel: { fontFamily: 'Times-Bold', fontSize: 7, color: '#65756f', letterSpacing: 0.35, marginBottom: 3 },
  paymentValue: { fontFamily: 'Times-Roman', fontSize: 8.7, color: '#1b2924', lineHeight: 1.2 },
  paymentReceipt: { fontFamily: 'Times-Bold', fontSize: 9.2, color: '#0f6e56', lineHeight: 1.2 },
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
    signatureData, signDate, applicantPhoto,
    paymentAmount = 500,
    paymentReference = '',
    paymentDate = '',
    paymentPhone = '',
    email = '',
    submittedAt,
  } = formData;

  const now = submittedAt ? new Date(submittedAt) : new Date();
  const dateStr = now.toLocaleDateString('en-KE', { day: '2-digit', month: 'long', year: 'numeric' });
  const paymentDateStr = paymentDate
    ? new Date(paymentDate).toLocaleString('en-KE', {
        dateStyle: 'medium',
        timeStyle: 'short',
        timeZone: 'Africa/Nairobi',
      })
    : '';

  return (
    <Document
      title={`Admission Form – ${name || 'Applicant'}`}
      author="Kinoo Vocational Training Centre"
      subject="Student Admission Form"
    >
      <Page size="A4" style={s.page}>

        {/* ── HEADER ── */}
        <PdfLetterhead kvtcLogoUrl={kvtcLogoUrl} cgokLogoUrl={cgokLogoUrl} />

        {/* ── BODY ── */}
        <View style={s.body}>
          <Text style={s.formTitle}>ADMISSION FORM</Text>

          {/* PERSONAL DETAILS */}
          <View style={s.personalHeader} wrap={false}>
            <View style={s.personalFields}>
              <Text style={s.sectionTitle}>PERSONAL DETAILS</Text>
              <Row>
                <L t="ADM NO" /><Ghost maxWidth={105} /><L t="   DATE" /><Ghost maxWidth={80} />
              </Row>
              <Row mt={2}>
                <L t="NAME  " />
                <View style={[s.field, { flex: 1 }]}><Text style={s.fieldText}>{name || ' '}</Text></View>
              </Row>
              <Row mt={2}>
                <L t="ID NO  " />
                <View style={[s.field, { maxWidth: 110 }]}><Text style={s.fieldText}>{idNo || ' '}</Text></View>
                <L t="   D.O.B  " />
                <View style={[s.field, { maxWidth: 100 }]}><Text style={s.fieldText}>{fmtDate(dob)}</Text></View>
              </Row>
              <Row mt={2}>
                <L t="TEL  " />
                <View style={[s.field, { maxWidth: 180 }]}><Text style={s.fieldText}>{tel || ' '}</Text></View>
              </Row>
              <Row mt={2}>
                <L t="HOME ADDRESS  " />
                <View style={[s.field, { maxWidth: 125 }]}><Text style={s.fieldText}>{homeAddress || ' '}</Text></View>
                <L t="  AREA  " />
                <View style={[s.field, { flex: 1 }]}><Text style={s.fieldText}>{residentialArea || ' '}</Text></View>
              </Row>
            </View>
            <View style={s.photoCard}>
              {applicantPhoto
                ? <Image src={applicantPhoto} style={s.applicantPhoto} />
                : <Text style={s.photoPlaceholder}>APPLICANT{'\n'}PHOTO</Text>}
            </View>
          </View>

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

          {/* ── DECLARATION ──
              FIX: Replaced the mixed View/Text flex-row (which caused react-pdf to
              insert large whitespace) with a single <Text> block using inline <Text>
              spans. react-pdf handles inline text wrapping correctly within a single
              Text node — the underline on the name is achieved via a nested span. */}
          <Text style={s.sectionTitle}>DECLARATION</Text>
          <Text style={s.declarationPara}>
            {'I  '}
            <Text style={s.declarationUnderline}>{name || '                                    '}</Text>
            {'  declare that I shall abide by the rules and regulations and be obedient to the management and staff in the institution.'}
          </Text>

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

          {/* ── PAYMENT CONFIRMATION ── */}
          {paymentReference ? (
            <View style={s.paymentBox} wrap={false}>
              <View style={s.paymentHeader}>
                <Text style={s.paymentTitle}>M-PESA PAYMENT CONFIRMATION</Text>
                <Text style={s.paymentStatus}>PAID</Text>
              </View>
              <View style={s.paymentDetails}>
                <View style={s.paymentItem}>
                  <Text style={s.paymentLabel}>M-PESA RECEIPT</Text>
                  <Text style={s.paymentReceipt}>{paymentReference}</Text>
                </View>
                <View style={s.paymentItem}>
                  <Text style={s.paymentLabel}>AMOUNT PAID</Text>
                  <Text style={s.paymentValue}>KSh {paymentAmount}</Text>
                </View>
                <View style={s.paymentItem}>
                  <Text style={s.paymentLabel}>DATE &amp; TIME</Text>
                  <Text style={s.paymentValue}>{paymentDateStr}</Text>
                </View>
                <View style={s.paymentItemLast}>
                  <Text style={s.paymentLabel}>M-PESA PHONE</Text>
                  <Text style={s.paymentValue}>{paymentPhone || 'N/A'}</Text>
                </View>
              </View>
            </View>
          ) : null}
        </View>

        {/* ── FOOTER ──
            FIX: lineHeight changed from absolute 11pt to relative 1.3 so it scales
            correctly with 8.5pt font. marginBottom on each row reduced from 3 to 1.
            Footer padding tightened. Together these eliminate the excessive gaps. */}
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
