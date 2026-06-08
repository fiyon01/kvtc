import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: { padding: 40, fontFamily: 'Times-Roman', fontSize: 12, backgroundColor: '#ffffff' },
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
  noteItem: { marginBottom: 5, fontSize: 10, fontFamily: 'Times-Italic' }
});

export default function FeeStructureDocument({ courses, feeStructure, kvtcLogoUrl, cgokLogoUrl }) {
  // Use data from db.feeStructure if available, otherwise fallback to defaults
  const t1 = feeStructure?.termBreakdown?.[0]?.amount || 9000;
  const t2 = feeStructure?.termBreakdown?.[1]?.amount || 9000;
  const t3 = feeStructure?.termBreakdown?.[2]?.amount || 9000;
  const annual = feeStructure?.annualTuition || 27000;
  const adminFees = feeStructure?.admissionFees || [];
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          {kvtcLogoUrl ? <Image src={kvtcLogoUrl} style={styles.logo} /> : <View style={styles.logo} />}
          <View style={styles.headerText}>
            <Text style={styles.title}>KINOO VOCATIONAL TRAINING CENTRE</Text>
            <Text style={styles.subtitle}>COUNTY GOVERNMENT OF KIAMBU</Text>
            <Text style={styles.address}>P.O Box 123 - 00902 Kikuyu, Kenya | Tel: +254 113 582 008 | Email: info@kinoovtc.ac.ke</Text>
          </View>
          {cgokLogoUrl ? <Image src={cgokLogoUrl} style={styles.logo} /> : <View style={styles.logo} />}
        </View>

        <Text style={{ textAlign: 'center', fontSize: 16, fontFamily: 'Times-Bold', marginVertical: 10, textDecoration: 'underline' }}>
          OFFICIAL FEE STRUCTURE - 2026 INTAKE
        </Text>

        <Text style={styles.sectionTitle}>Full-Time Artisan & Craft Courses</Text>
        <View style={styles.table}>
          {/* Table Header */}
          <View style={styles.tableRow}>
            <View style={styles.tableColCourse}><Text style={styles.tableCellHeader}>Course Name</Text></View>
            <View style={styles.tableColOther}><Text style={styles.tableCellHeader}>Duration</Text></View>
            <View style={{ width: '15%', borderStyle: 'solid', borderWidth: 1, borderLeftWidth: 0, borderTopWidth: 0, backgroundColor: '#f0f0f0' }}><Text style={styles.tableCellHeader}>Term 1</Text></View>
            <View style={{ width: '15%', borderStyle: 'solid', borderWidth: 1, borderLeftWidth: 0, borderTopWidth: 0, backgroundColor: '#f0f0f0' }}><Text style={styles.tableCellHeader}>Term 2</Text></View>
            <View style={{ width: '15%', borderStyle: 'solid', borderWidth: 1, borderLeftWidth: 0, borderTopWidth: 0, backgroundColor: '#f0f0f0' }}><Text style={styles.tableCellHeader}>Term 3</Text></View>
          </View>
          
          {/* Table Rows */}
          {courses.filter(c => c.dur.toLowerCase().includes('year') || c.dur.toLowerCase().includes('months') && parseInt(c.dur)>6).map((course, idx) => (
            <View style={styles.tableRow} key={idx}>
              <View style={styles.tableColCourse}><Text style={styles.tableCell}>{course.name}</Text></View>
              <View style={styles.tableColOther}><Text style={styles.tableCell}>{course.dur}</Text></View>
              <View style={{ width: '15%', borderStyle: 'solid', borderWidth: 1, borderLeftWidth: 0, borderTopWidth: 0 }}><Text style={styles.tableCell}>KSh {t1.toLocaleString()}</Text></View>
              <View style={{ width: '15%', borderStyle: 'solid', borderWidth: 1, borderLeftWidth: 0, borderTopWidth: 0 }}><Text style={styles.tableCell}>KSh {t2.toLocaleString()}</Text></View>
              <View style={{ width: '15%', borderStyle: 'solid', borderWidth: 1, borderLeftWidth: 0, borderTopWidth: 0 }}><Text style={styles.tableCell}>KSh {t3.toLocaleString()}</Text></View>
            </View>
          ))}
        </View>

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
            <View style={{ width: '70%', borderStyle: 'solid', borderWidth: 1, borderLeftWidth: 0, borderTopWidth: 0 }}><Text style={{...styles.tableCellHeader, textAlign: 'right'}}>Total Admission Fees:</Text></View>
            <View style={{ width: '30%', borderStyle: 'solid', borderWidth: 1, borderLeftWidth: 0, borderTopWidth: 0 }}><Text style={styles.tableCellHeader}>{feeStructure?.admissionTotal?.toLocaleString() || 3450}</Text></View>
          </View>
        </View>

        {/* Short Courses Table */}
        <Text style={styles.sectionTitle}>Short Courses & Part-Time</Text>
        <View style={styles.table}>
          {/* Table Header */}
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
          
          {/* Table Rows */}
          {courses.filter(c => c.dur.toLowerCase().includes('month') && parseInt(c.dur)<=6).map((course, idx) => (
            <View style={styles.tableRow} key={idx}>
              <View style={{ width: '50%', borderStyle: 'solid', borderWidth: 1, borderLeftWidth: 0, borderTopWidth: 0 }}><Text style={styles.tableCell}>{course.name}</Text></View>
              <View style={{ width: '25%', borderStyle: 'solid', borderWidth: 1, borderLeftWidth: 0, borderTopWidth: 0 }}><Text style={styles.tableCell}>{course.dur}</Text></View>
              <View style={{ width: '25%', borderStyle: 'solid', borderWidth: 1, borderLeftWidth: 0, borderTopWidth: 0 }}><Text style={styles.tableCell}>{course.fees}</Text></View>
            </View>
          ))}
        </View>

        <View style={styles.notesContainer}>
          <Text style={{ fontFamily: 'Times-Bold', fontSize: 11, marginBottom: 5 }}>Important Notes:</Text>
          <Text style={styles.noteItem}>1. Admission Fee: A non-refundable fee of KSh 500 is payable during application.</Text>
          <Text style={styles.noteItem}>2. Government Capitation: Trainees may apply for the National Government Capitation (KSh 30,000 per year) through KUCCPS. The fees stated above are the subsidised out-of-pocket amounts payable by parents/guardians.</Text>
          <Text style={styles.noteItem}>3. Examination Fees: NITA and KNEC examination fees are NOT included in the tuition fees and vary by course.</Text>
          <Text style={styles.noteItem}>4. Payment Method: All payments should be made via M-PESA Paybill or directly to the institution's bank account. NO CASH is accepted.</Text>
        </View>

        <Text style={styles.footer}>
          This fee structure is valid for the 2026 academic year. Kinoo VTC reserves the right to revise fees without prior notice.
        </Text>
      </Page>
    </Document>
  );
}
