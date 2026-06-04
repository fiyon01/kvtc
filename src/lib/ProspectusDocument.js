import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const green = '#0F6E56';
const gold = '#EF9F27';
const dark = '#1a1a1a';
const mid = '#555555';
const soft = '#888888';
const pale = '#E8F5F0';
const white = '#FFFFFF';
const lightGray = '#f8faf9';

const s = StyleSheet.create({
  page: { backgroundColor: white, fontFamily: 'Helvetica', fontSize: 10 },

  // ── COVER ──────────────────────────────────────────────
  cover: { backgroundColor: green, padding: 52, flex: 1 },
  logoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 48 },
  logoBox: {
    width: 52, height: 52,
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderRadius: 10,
    alignItems: 'center', justifyContent: 'center', marginRight: 14,
  },
  logoText: { color: white, fontSize: 20, fontFamily: 'Helvetica-Bold' },
  logoName: { color: white, fontSize: 16, fontFamily: 'Helvetica-Bold' },
  logoSub: { color: 'rgba(255,255,255,0.72)', fontSize: 10, marginTop: 2 },
  badge: {
    backgroundColor: gold,
    paddingLeft: 14, paddingRight: 14, paddingTop: 5, paddingBottom: 5,
    borderRadius: 100, alignSelf: 'flex-start', marginBottom: 18,
  },
  badgeText: { color: dark, fontFamily: 'Helvetica-Bold', fontSize: 9, letterSpacing: 1 },
  coverTitle: { color: white, fontSize: 34, fontFamily: 'Helvetica-Bold', lineHeight: 1.15, marginBottom: 14, maxWidth: 420 },
  coverSub: { color: 'rgba(255,255,255,0.85)', fontSize: 12, lineHeight: 1.7, maxWidth: 420, marginBottom: 40 },
  statRow: { flexDirection: 'row', marginBottom: 48 },
  statBox: {
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 10,
    padding: 16, flex: 1, marginRight: 12,
  },
  statNum: { color: gold, fontSize: 22, fontFamily: 'Helvetica-Bold', marginBottom: 2 },
  statLabel: { color: 'rgba(255,255,255,0.75)', fontSize: 9, letterSpacing: 0.5 },
  coverFooter: {
    borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.2)',
    paddingTop: 16, flexDirection: 'row', justifyContent: 'space-between', marginTop: 'auto',
  },
  coverFooterText: { color: 'rgba(255,255,255,0.65)', fontSize: 9 },

  // ── BODY ──────────────────────────────────────────────
  body: { padding: 36, paddingLeft: 44, paddingRight: 44, flex: 1 },
  sectionTitle: { fontSize: 15, fontFamily: 'Helvetica-Bold', color: green, marginBottom: 4, marginTop: 14 },
  divider: { height: 1, backgroundColor: pale, marginBottom: 10 },
  para: { fontSize: 10, color: mid, lineHeight: 1.75, marginBottom: 8 },

  // Info boxes
  infoRow: { flexDirection: 'row', marginBottom: 12 },
  infoBox: { flex: 1, backgroundColor: pale, borderRadius: 8, padding: 10, marginRight: 8 },
  infoBoxLabel: { fontSize: 8, color: soft, fontFamily: 'Helvetica-Bold', letterSpacing: 0.5, marginBottom: 3 },
  infoBoxVal: { fontSize: 10, color: dark, fontFamily: 'Helvetica-Bold' },

  // ── TABLE — no borderRadius on rows/header, avoids black corners ──
  tableWrap: { marginBottom: 8 },
  tableHeader: { flexDirection: 'row', backgroundColor: green },
  tableHeaderCell: {
    color: white, fontFamily: 'Helvetica-Bold', fontSize: 9,
    paddingTop: 7, paddingBottom: 7, paddingLeft: 8, paddingRight: 8,
    flex: 1,
    // NO borderRadius here — it causes black bleed in react-pdf
  },
  tableRow: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#eeeeee' },
  tableRowAlt: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#eeeeee', backgroundColor: lightGray },
  tableCell: { fontSize: 9, color: mid, paddingTop: 6, paddingBottom: 6, paddingLeft: 8, paddingRight: 8, flex: 1 },
  tableCellBold: { fontSize: 9, color: dark, fontFamily: 'Helvetica-Bold', paddingTop: 6, paddingBottom: 6, paddingLeft: 8, paddingRight: 8, flex: 1 },
  // wider name col
  colName: { flex: 2.2 },
  colSmall: { flex: 1 },

  // Entry requirements
  reqBox: { backgroundColor: pale, borderRadius: 8, padding: 14, marginBottom: 12 },
  reqItem: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 6 },
  reqDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: green, marginTop: 3, marginRight: 8 },
  reqText: { fontSize: 10, color: mid, flex: 1, lineHeight: 1.6 },

  // Steps row
  stepBox: {
    flex: 1, backgroundColor: pale, borderRadius: 8,
    paddingTop: 10, paddingBottom: 10, paddingLeft: 10, paddingRight: 10,
    marginRight: 8,
  },
  stepLabel: { fontSize: 8, color: green, fontFamily: 'Helvetica-Bold', letterSpacing: 0.5, marginBottom: 3 },
  stepDesc: { fontSize: 9, color: mid, lineHeight: 1.5 },

  // Contact grid — 2×2 to prevent overflow
  contactGrid: { marginBottom: 10 },
  contactGridRow: { flexDirection: 'row', marginBottom: 8 },
  contactBox: {
    flex: 1, backgroundColor: '#f8f7f4', borderRadius: 8,
    paddingTop: 10, paddingBottom: 10, paddingLeft: 12, paddingRight: 12,
    marginRight: 8,
  },
  contactLabel: { fontSize: 8, color: soft, fontFamily: 'Helvetica-Bold', letterSpacing: 0.5, marginBottom: 3 },
  contactVal: { fontSize: 10, color: dark, fontFamily: 'Helvetica-Bold' },
  // Full-width address box — separate so it never overlaps
  addressBox: {
    backgroundColor: '#f8f7f4', borderRadius: 8,
    paddingTop: 10, paddingBottom: 10, paddingLeft: 12, paddingRight: 12,
    marginBottom: 0,
  },

  // Footer strip
  footerStrip: {
    backgroundColor: green,
    paddingTop: 10, paddingBottom: 10, paddingLeft: 44, paddingRight: 44,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  footerText: { color: 'rgba(255,255,255,0.75)', fontSize: 8 },
});

export function ProspectusDocument({ dbData = {} }) {
  const { 
    contact = {}, 
    feeStructure = {}, 
    courses = [], 
    requirements = {},
    intake = { yearText: "2026" }
  } = dbData;

  const { admissionFees = [], admissionTotal = 3450, annualTuition = 27000, termBreakdown = [], bankKCB, bankCoop } = feeStructure;

  // Transform courses to array format
  const allCourses = courses.map(c => [
    c.name, 
    c.dur || '1 Year', 
    c.cert || 'NITA', 
    c.fees || 'KSh 27,000/yr'
  ]);

const TableHeader = () => (
  <View style={s.tableHeader}>
    <Text style={[s.tableHeaderCell, s.colName]}>Course Name</Text>
    <Text style={[s.tableHeaderCell, s.colSmall]}>Duration</Text>
    <Text style={[s.tableHeaderCell, s.colSmall]}>Cert.</Text>
    <Text style={[s.tableHeaderCell, s.colSmall]}>Fees/yr</Text>
  </View>
);

const CourseRows = ({ rows, startIdx = 0 }) =>
  rows.map(([name, dur, cert, fees], i) => (
    <View key={name} style={(startIdx + i) % 2 === 0 ? s.tableRow : s.tableRowAlt}>
      <Text style={[s.tableCellBold, s.colName]}>{name}</Text>
      <Text style={[s.tableCell, s.colSmall]}>{dur}</Text>
      <Text style={[s.tableCell, s.colSmall]}>{cert}</Text>
      <Text style={[s.tableCell, s.colSmall]}>{fees}</Text>
    </View>
  ));


  return (
    <Document
      title={`Kinoo VTC Prospectus ${intake.yearText}`}
      author="Kinoo Vocational Training Centre"
      subject={`Student Prospectus & Course Guide ${intake.yearText}`}
      keywords="vocational training, NITA, KNEC, courses, Kiambu"
    >

      {/* ══════════════════════════════════════════════════
          PAGE 1 — COVER
      ══════════════════════════════════════════════════ */}
      <Page size="A4" style={s.page}>
        <View style={s.cover}>
          <View style={s.logoRow}>
            <View style={s.logoBox}><Text style={s.logoText}>KV</Text></View>
            <View>
              <Text style={s.logoName}>Kinoo Vocational Training Centre</Text>
              <Text style={s.logoSub}>County Government of Kiambu · Department of Education</Text>
            </View>
          </View>

          <View style={s.badge}><Text style={s.badgeText}>{intake.yearText} INTAKE NOW OPEN</Text></View>

          <Text style={s.coverTitle}>Student Prospectus{'\n'}& Course Guide</Text>
          <Text style={s.coverSub}>
            Kiambu County's premier public vocational training centre offering NITA & KNEC-certified
            programmes across 13+ disciplines. Affordable, practical, and life-changing education
            for every Kenyan.
          </Text>

          <View style={s.statRow}>
            {[['13+','Courses Offered'],['KSh 27K','Annual Fees From'],['100%','Practical Training'],['2 Yrs','Full Programme']].map(([num, lbl], i) => (
              <View key={lbl} style={[s.statBox, i === 3 && { marginRight: 0 }]}>
                <Text style={s.statNum}>{num}</Text>
                <Text style={s.statLabel}>{lbl}</Text>
              </View>
            ))}
          </View>

          <View style={s.coverFooter}>
            <Text style={s.coverFooterText}>{contact.address || 'Kinoo, Along Waiyaki Way, Kiambu County, Kenya'}</Text>
            <Text style={s.coverFooterText}>{contact.phone1 || '+254 113 582 008'} · {contact.email || 'kinoovtc@gmail.com'}</Text>
          </View>
        </View>
      </Page>

      {/* ══════════════════════════════════════════════════
          PAGE 2 — ABOUT + FIRST HALF OF COURSES
      ══════════════════════════════════════════════════ */}
      <Page size="A4" style={s.page}>
        <View style={s.body}>

          {/* About */}
          <Text style={s.sectionTitle}>About Kinoo VTC</Text>
          <View style={s.divider} />
          <Text style={s.para}>
            Kinoo Vocational Training Centre (KVTC) is a public institution established under the County
            Government of Kiambu, mandated to provide quality technical and vocational education and
            training (TVET). We equip students with practical, market-ready skills that open doors to
            employment and entrepreneurship across East Africa.
          </Text>
          <Text style={s.para}>
            Our courses are accredited by NITA (National Industrial Training Authority) and KNEC
            (Kenya National Examinations Council), ensuring that every certificate we award is
            nationally and internationally recognised.
          </Text>

          {/* Quick facts */}
          <View style={s.infoRow}>
            {[['Location','Kinoo, Waiyaki Way'],['Registration','NITA & KNEC'],['Intake','Jan & Sep'],['Training','100% Practical']].map(([l, v], i) => (
              <View key={l} style={[s.infoBox, i === 3 && { marginRight: 0 }]}>
                <Text style={s.infoBoxLabel}>{l}</Text>
                <Text style={s.infoBoxVal}>{v}</Text>
              </View>
            ))}
          </View>

          {/* Courses — all 17 rows */}
          <Text style={[s.sectionTitle, { marginTop: 10 }]}>Courses Offered</Text>
          <View style={s.divider} />

          <View style={s.tableWrap}>
            <TableHeader />
            <CourseRows rows={allCourses} startIdx={0} />
          </View>

        </View>
        <View style={s.footerStrip}>
          <Text style={s.footerText}>Kinoo VTC — Student Prospectus {intake.yearText}</Text>
          <Text style={s.footerText}>{contact.email || 'kinoovtc@gmail.com'} · {contact.phone1 || '+254 113 582 008'}</Text>
        </View>
      </Page>

      {/* ══════════════════════════════════════════════════
          PAGE 3 — ADMISSIONS + CONTACT
      ══════════════════════════════════════════════════ */}
      <Page size="A4" style={s.page}>
        <View style={s.body}>

          {/* Entry Requirements */}
          <Text style={s.sectionTitle}>Entry Requirements</Text>
          <View style={s.divider} />
          <Text style={[s.para, { marginBottom: 8 }]}>
            Kinoo VTC welcomes applicants from all backgrounds. Our open-door policy ensures
            that no qualified Kenyan is turned away due to financial constraints.
          </Text>
          <View style={s.reqBox}>
            {[
              'Two (2) passport photos',
              'Copy of National ID or Birth Certificate',
              'Three (3) foolscap papers',
              'Copy of previous result slip (if any)',
              'Medical certificate',
              'Two (2) quire counter books',
              'Four (4) A4 exercise books'
            ].map((item) => (
              <View key={item} style={s.reqItem}>
                <View style={s.reqDot} />
                <Text style={s.reqText}>{item}</Text>
              </View>
            ))}
          </View>

          {/* Departmental / Course Specific Requirements */}
          <Text style={s.sectionTitle}>Course-Specific Requirements (Tools & Uniforms)</Text>
          <View style={s.divider} />
          <View style={[s.infoRow, { flexWrap: 'wrap' }]}>
            {courses.filter(c => c.requirements && c.requirements.length > 0).map((c, i) => (
              <View key={i} style={[s.infoBox, { minWidth: '45%', marginBottom: 8, marginRight: i % 2 === 0 ? 8 : 0 }]}>
                <Text style={s.infoBoxLabel}>{c.name}</Text>
                {c.requirements.map((item, idx) => (
                  <View key={idx} style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 2 }}>
                    <View style={[s.reqDot, { width: 4, height: 4, marginTop: 4, backgroundColor: '#EF9F27' }]} />
                    <Text style={[s.infoBoxVal, { fontSize: 8, fontWeight: 'normal' }]}>{item}</Text>
                  </View>
                ))}
              </View>
            ))}
          </View>

          {/* How to Apply */}
          <Text style={s.sectionTitle}>How to Apply</Text>
          <View style={s.divider} />
          <Text style={[s.para, { marginBottom: 8 }]}>
            Applications are accepted on a rolling basis. Visit our campus, call us, or apply online.
            Bring your academic certificates and a copy of your National ID or Birth Certificate.
          </Text>
          <View style={s.infoRow}>
            {[['Step 1','Choose your course & confirm intake dates'],
              ['Step 2','Visit campus or apply online'],
              ['Step 3','Pay registration fee & submit documents'],
              ['Step 4','Attend orientation & begin training'],
            ].map(([step, desc], i) => (
              <View key={step} style={[s.stepBox, i === 3 && { marginRight: 0 }]}>
                <Text style={s.stepLabel}>{step}</Text>
                <Text style={s.stepDesc}>{desc}</Text>
              </View>
            ))}
          </View>

          {/* Fees & Bursaries */}
          <Text style={s.sectionTitle}>Fees & Financial Support</Text>
          <View style={s.divider} />
          <Text style={s.para}>
            Full programme fees start from KSh 27,000 per year — one of the most affordable TVET
            institutions in Kiambu County. Short courses start from KSh 8,000. Kiambu County
            bursary funding is available for qualifying students. Contact us for details.
          </Text>

          {/* Detailed Fee Breakdowns */}
          <View style={s.contactGrid}>
            <View style={s.contactGridRow}>
              {/* Annual Tuition Breakdown */}
              <View style={[s.contactBox]}>
                <Text style={[s.contactLabel, { color: '#0F6E56', marginBottom: 6 }]}>Annual Tuition Breakdown (KSh {annualTuition?.toLocaleString()})</Text>
                {termBreakdown.map((t, i) => (
                  <View key={i} style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
                    <Text style={{ fontSize: 9, color: '#555' }}>{t.label}</Text>
                    <Text style={{ fontSize: 9, color: '#1a1a1a', fontWeight: 'bold' }}>KSh {t.amount?.toLocaleString()}</Text>
                  </View>
                ))}
              </View>

              {/* Admission Fees */}
              <View style={[s.contactBox, { marginRight: 0 }]}>
                <Text style={[s.contactLabel, { color: '#BA7517', marginBottom: 6 }]}>One-Time Admission Fees (KSh {admissionTotal?.toLocaleString()})</Text>
                {admissionFees.map((af, i) => (
                  <View key={i} style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
                    <Text style={{ fontSize: 9, color: '#555' }}>{af.item}</Text>
                    <Text style={{ fontSize: 9, color: '#1a1a1a', fontWeight: 'bold' }}>KSh {af.amount?.toLocaleString()}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>

          {/* New Bank Details Section */}
          <Text style={s.sectionTitle}>Bank Payment Details</Text>
          <View style={s.divider} />
          <View style={s.contactGrid}>
            <View style={s.contactGridRow}>
              {bankKCB && (
                <View style={[s.contactBox]}>
                  <Text style={s.contactLabel}>Bank: {bankKCB.bankName}</Text>
                  <Text style={s.contactVal}>A/C: {bankKCB.accountNumber}</Text>
                </View>
              )}
              {bankCoop && (
                <View style={[s.contactBox, { marginRight: 0 }]}>
                  <Text style={s.contactLabel}>Bank: {bankCoop.bankName}</Text>
                  <Text style={s.contactVal}>A/C: {bankCoop.accountNumber}</Text>
                </View>
              )}
            </View>
          </View>

          {/* Contact */}
          <Text style={s.sectionTitle}>Contact & Location</Text>
          <View style={s.divider} />

          {/* 2-column grid: Phone | Alt Phone in row 1, Email | Hours in row 2 */}
          <View style={s.contactGrid}>
            <View style={s.contactGridRow}>
              <View style={[s.contactBox]}>
                <Text style={s.contactLabel}>Phone</Text>
                <Text style={s.contactVal}>{contact.phone1 || '+254 113 582 008'}</Text>
              </View>
              <View style={[s.contactBox, { marginRight: 0 }]}>
                <Text style={s.contactLabel}>Alt Phone</Text>
                <Text style={s.contactVal}>{contact.phone2 || '+254 748 455 116'}</Text>
              </View>
            </View>
            <View style={s.contactGridRow}>
              <View style={[s.contactBox]}>
                <Text style={s.contactLabel}>Email</Text>
                <Text style={s.contactVal}>{contact.email || 'kinoovtc@gmail.com'}</Text>
              </View>
              <View style={[s.contactBox, { marginRight: 0 }]}>
                <Text style={s.contactLabel}>Office Hours</Text>
                <Text style={s.contactVal}>{contact.hours || 'Mon – Fri · 8am – 5pm'}</Text>
              </View>
            </View>
          </View>

          {/* Address — full width, on its own line so it never overlaps */}
          <View style={s.addressBox}>
            <Text style={s.contactLabel}>Physical Address</Text>
            <Text style={s.contactVal}>{contact.address || 'Kinoo, Along Waiyaki Way, Kiambu County, Kenya'}</Text>
          </View>

        </View>
        <View style={s.footerStrip}>
          <Text style={s.footerText}>Kinoo VTC — Student Prospectus {intake.yearText}</Text>
          <Text style={s.footerText}>© {new Date().getFullYear()} Kinoo VTC · All Rights Reserved</Text>
        </View>
      </Page>

    </Document>
  );
}