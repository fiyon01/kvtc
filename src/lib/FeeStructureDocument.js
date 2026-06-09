import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import PdfLetterhead from './PdfLetterhead';

const styles = StyleSheet.create({
  page: { fontFamily: 'Times-Roman', fontSize: 12, backgroundColor: '#ffffff' },
  body: { paddingTop: 18, paddingLeft: 40, paddingRight: 40, paddingBottom: 70 },
  header: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  logo: { width: 60, height: 60, objectFit: 'contain' },
  headerText: { textAlign: 'center', flex: 1, paddingHorizontal: 10 },
  title: { fontSize: 20, fontFamily: 'Times-Bold', color: '#0F6E56', marginBottom: 5 },
  subtitle: { fontSize: 14, fontFamily: 'Times-Roman', color: '#333' },
  address: { fontSize: 10, color: '#666', marginTop: 4 },
  sectionTitle: { fontSize: 16, fontFamily: 'Times-Bold', marginTop: 20, marginBottom: 10, backgroundColor: '#E1F5EE', padding: 5, color: '#0F6E56' },
  table: { display: 'table', width: 'auto', borderStyle: 'solid', borderWidth: 1, borderRightWidth: 0, borderBottomWidth: 0 },
  tableRow: { margin: 'auto', flexDirection: 'row' },
  tableColHeader: { width: '25%', borderStyle: 'solid', borderWidth: 1, borderLeftWidth: 0, borderTopWidth: 0, backgroundColor: '#f0f0f0' },
  tableColCourse: { width: '40%', borderStyle: 'solid', borderWidth: 1, borderLeftWidth: 0, borderTopWidth: 0 },
  tableColFees: { width: '20%', borderStyle: 'solid', borderWidth: 1, borderLeftWidth: 0, borderTopWidth: 0 },
  tableColOther: { width: '15%', borderStyle: 'solid', borderWidth: 1, borderLeftWidth: 0, borderTopWidth: 0 },
  tableCellHeader: { margin: 5, fontSize: 12, fontFamily: 'Times-Bold' },
  tableCell: { margin: 5, fontSize: 11 },
  footer: { position: 'absolute', bottom: 30, left: 40, right: 40, textAlign: 'center', fontSize: 10, color: '#888', borderTopWidth: 1, borderTopColor: '#eee', paddingTop: 10 },
  notesContainer: { marginTop: 20, padding: 10, border: '1pt solid #ccc', backgroundColor: '#fafafa' },
  noteItem: { marginBottom: 5, fontSize: 10, fontFamily: 'Times-Italic' },
  paymentBox: { marginTop: 10, padding: 10, borderWidth: 1.5, borderColor: '#2f79b7', backgroundColor: '#edf6fc' },
  paymentLabel: { fontFamily: 'Times-Bold', fontSize: 10, color: '#245a87', marginBottom: 3 },
  paymentText: { fontFamily: 'Times-Bold', fontSize: 11, color: '#172b3a' },
});

export default function FeeStructureDocument({ courses, feeStructure, kvtcLogoUrl, cgokLogoUrl }) {
  const t1 = feeStructure?.termBreakdown?.[0]?.amount || 9000;
  const t2 = feeStructure?.termBreakdown?.[1]?.amount || 9000;
  const t3 = feeStructure?.termBreakdown?.[2]?.amount || 9000;
  const adminFees = feeStructure?.admissionFees || [];

  return (
    <Document>

      {/* ══════════ PAGE 1: Full-Time Courses + Admission Fees ══════════ */}
      <Page size="A4" style={styles.page}>
        <PdfLetterhead kvtcLogoUrl={kvtcLogoUrl} cgokLogoUrl={cgokLogoUrl} />
        <View style={styles.body}>

          <Text style={{ textAlign: 'center', fontSize: 16, fontFamily: 'Times-Bold', marginVertical: 10, textDecoration: 'underline' }}>
            OFFICIAL FEE STRUCTURE - 2026 INTAKE
          </Text>

          {/* ── Full-Time Artisan & Craft Courses ── */}
          <Text style={styles.sectionTitle}>Full-Time Artisan &amp; Craft Courses</Text>
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <View style={styles.tableColCourse}><Text style={styles.tableCellHeader}>Course Name</Text></View>
              <View style={styles.tableColOther}><Text style={styles.tableCellHeader}>Duration</Text></View>
              <View style={{ width: '15%', borderStyle: 'solid', borderWidth: 1, borderLeftWidth: 0, borderTopWidth: 0, backgroundColor: '#f0f0f0' }}><Text style={styles.tableCellHeader}>Term 1</Text></View>
              <View style={{ width: '15%', borderStyle: 'solid', borderWidth: 1, borderLeftWidth: 0, borderTopWidth: 0, backgroundColor: '#f0f0f0' }}><Text style={styles.tableCellHeader}>Term 2</Text></View>
              <View style={{ width: '15%', borderStyle: 'solid', borderWidth: 1, borderLeftWidth: 0, borderTopWidth: 0, backgroundColor: '#f0f0f0' }}><Text style={styles.tableCellHeader}>Term 3</Text></View>
            </View>
            {courses
              .filter(c => c.dur.toLowerCase().includes('year') || (c.dur.toLowerCase().includes('months') && parseInt(c.dur) > 6))
              .map((course, idx) => (
                <View style={styles.tableRow} key={idx}>
                  <View style={styles.tableColCourse}><Text style={styles.tableCell}>{course.name}</Text></View>
                  <View style={styles.tableColOther}><Text style={styles.tableCell}>{course.dur}</Text></View>
                  <View style={{ width: '15%', borderStyle: 'solid', borderWidth: 1, borderLeftWidth: 0, borderTopWidth: 0 }}><Text style={styles.tableCell}>KSh {t1.toLocaleString()}</Text></View>
                  <View style={{ width: '15%', borderStyle: 'solid', borderWidth: 1, borderLeftWidth: 0, borderTopWidth: 0 }}><Text style={styles.tableCell}>KSh {t2.toLocaleString()}</Text></View>
                  <View style={{ width: '15%', borderStyle: 'solid', borderWidth: 1, borderLeftWidth: 0, borderTopWidth: 0 }}><Text style={styles.tableCell}>KSh {t3.toLocaleString()}</Text></View>
                </View>
              ))}
          </View>

          {/* ── One-Time Admission Requirements ── */}
          <Text style={styles.sectionTitle}>One-Time Admission Requirements</Text>
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <View style={{ width: '70%', borderStyle: 'solid', borderWidth: 1, borderLeftWidth: 0, borderTopWidth: 0, backgroundColor: '#f0f0f0' }}><Text style={styles.tableCellHeader}>Requirement</Text></View>
              <View style={{ width: '30%', borderStyle: 'solid', borderWidth: 1, borderLeftWidth: 0, borderTopWidth: 0, backgroundColor: '#f0f0f0' }}><Text style={styles.tableCellHeader}>Amount (KSh)</Text></View>
            </View>
            {adminFees.map((fee, idx) => (
              <View style={styles.tableRow} key={idx}>
                <View style={{ width: '70%', borderStyle: 'solid', borderWidth: 1, borderLeftWidth: 0, borderTopWidth: 0 }}><Text style={styles.tableCell}>{fee.item}</Text></View>
                <View style={{ width: '30%', borderStyle: 'solid', borderWidth: 1, borderLeftWidth: 0, borderTopWidth: 0 }}><Text style={styles.tableCell}>{fee.amount.toLocaleString()}</Text></View>
              </View>
            ))}
            <View style={styles.tableRow}>
              <View style={{ width: '70%', borderStyle: 'solid', borderWidth: 1, borderLeftWidth: 0, borderTopWidth: 0 }}><Text style={{ ...styles.tableCellHeader, textAlign: 'right' }}>Total Admission Fees:</Text></View>
              <View style={{ width: '30%', borderStyle: 'solid', borderWidth: 1, borderLeftWidth: 0, borderTopWidth: 0 }}><Text style={styles.tableCellHeader}>{feeStructure?.admissionTotal?.toLocaleString() || 3450}</Text></View>
            </View>
            {/* Payment box as the last row — spans full width */}
            <View style={styles.tableRow}>
              <View style={{ width: '100%', borderStyle: 'solid', borderWidth: 1, borderLeftWidth: 0, borderTopWidth: 0, backgroundColor: '#edf6fc', padding: 8 }}>
                <Text style={styles.paymentLabel}>REGISTRATION &amp; ADMISSION PAYMENT METHOD</Text>
                <Text style={styles.paymentText}>Co-operative Bank Kangemi - Account No. 01141151624400</Text>
              </View>
            </View>
          </View>

        </View>
        <Text style={styles.footer}>
          This fee structure is valid for the 2026 academic year. Kinoo VTC reserves the right to revise fees without prior notice.
        </Text>
      </Page>

      {/* ══════════ PAGE 2: Short Courses & Notes ══════════ */}
      <Page size="A4" style={styles.page}>
        <PdfLetterhead kvtcLogoUrl={kvtcLogoUrl} cgokLogoUrl={cgokLogoUrl} />
        <View style={styles.body}>

          {/* ── Short Courses & Part-Time ── */}
          <Text style={[styles.sectionTitle, { marginTop: 10 }]}>Short Courses &amp; Part-Time</Text>
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <View style={{ width: '50%', borderStyle: 'solid', borderWidth: 1, borderLeftWidth: 0, borderTopWidth: 0, backgroundColor: '#f0f0f0' }}>
                <Text style={styles.tableCellHeader}>Course Name</Text>
              </View>
              <View style={{ width: '25%', borderStyle: 'solid', borderWidth: 1, borderLeftWidth: 0, borderTopWidth: 0, backgroundColor: '#f0f0f0' }}>
                <Text style={styles.tableCellHeader}>Duration</Text>
              </View>
              <View style={{ width: '25%', borderStyle: 'solid', borderWidth: 1, borderLeftWidth: 0, borderTopWidth: 0, backgroundColor: '#f0f0f0' }}>
                <Text style={styles.tableCellHeader}>Total Fees</Text>
              </View>
            </View>
            {courses
              .filter(c => c.dur.toLowerCase().includes('month') && parseInt(c.dur) <= 6)
              .map((course, idx) => (
                <View style={styles.tableRow} key={idx}>
                  <View style={{ width: '50%', borderStyle: 'solid', borderWidth: 1, borderLeftWidth: 0, borderTopWidth: 0 }}><Text style={styles.tableCell}>{course.name}</Text></View>
                  <View style={{ width: '25%', borderStyle: 'solid', borderWidth: 1, borderLeftWidth: 0, borderTopWidth: 0 }}><Text style={styles.tableCell}>{course.dur}</Text></View>
                  <View style={{ width: '25%', borderStyle: 'solid', borderWidth: 1, borderLeftWidth: 0, borderTopWidth: 0 }}><Text style={styles.tableCell}>{course.fees}</Text></View>
                </View>
              ))}
          </View>

          {/* ── Important Notes ── */}
          <View style={styles.notesContainer}>
            <Text style={{ fontFamily: 'Times-Bold', fontSize: 11, marginBottom: 5 }}>Important Notes:</Text>
            <Text style={styles.noteItem}>1. Admission Fee: A non-refundable fee of KSh 500 is payable during application.</Text>
            <Text style={styles.noteItem}>2. Government Capitation: Trainees may apply for the National Government Capitation (KSh 30,000 per year) through KUCCPS. The fees stated above are the subsidised out-of-pocket amounts payable by parents/guardians.</Text>
            <Text style={styles.noteItem}>3. Examination Fees: NITA and KNEC examination fees are NOT included in the tuition fees and vary by course.</Text>
            <Text style={styles.noteItem}>4. Payment Method: All payments must be made to the respective bank accounts. NO CASH is accepted.</Text>
            <Text style={[styles.noteItem, { marginLeft: 10 }]}>• Tuition Fees: KCB Kikuyu Branch (A/C: 1104169527)</Text>
            <Text style={[styles.noteItem, { marginLeft: 10 }]}>• Registration &amp; Admission: Co-operative Bank Kangemi (A/C: 01141151624400)</Text>
          </View>

        </View>
        <Text style={styles.footer}>
          This fee structure is valid for the 2026 academic year. Kinoo VTC reserves the right to revise fees without prior notice.
        </Text>
      </Page>

    </Document>
  );
}