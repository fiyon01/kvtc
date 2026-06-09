import React from 'react';
import { Image, StyleSheet, Text, View } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 92,
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 18,
    paddingRight: 18,
    borderBottomWidth: 3,
    borderBottomColor: '#2f79b7',
    backgroundColor: '#ffffff',
  },
  logo: { width: 76, height: 76, objectFit: 'contain' },
  kvtcLogo: { width: 86, height: 86, objectFit: 'cover', objectPosition: '50% 18%', marginLeft: -5, marginRight: -5 },
  center: { flex: 1, alignItems: 'center', paddingLeft: 10, paddingRight: 10 },
  county: { fontFamily: 'Times-Bold', fontSize: 10, color: '#b59b69', letterSpacing: 0.7, marginBottom: 3, textAlign: 'center' },
  department: { fontFamily: 'Times-Bold', fontSize: 9.5, color: '#1f2f4d', marginBottom: 4, textAlign: 'center' },
  institution: { fontFamily: 'Times-Bold', fontSize: 11, color: '#4c9daa', letterSpacing: 0.7, marginBottom: 5, textAlign: 'center' },
  contactRow: { flexDirection: 'row', justifyContent: 'center', marginBottom: 2 },
  contact: { fontFamily: 'Times-Roman', fontSize: 8.5, color: '#30364b', textAlign: 'center', marginLeft: 8, marginRight: 8 },
});

export default function PdfLetterhead({ kvtcLogoUrl, cgokLogoUrl }) {
  return (
    <View style={styles.header}>
      {kvtcLogoUrl ? <Image src={kvtcLogoUrl} style={styles.kvtcLogo} /> : <View style={styles.logo} />}
      <View style={styles.center}>
        <Text style={styles.county}>COUNTY GOVERNMENT OF KIAMBU</Text>
        <Text style={styles.department}>Department Of Education, Gender, Culture &amp; Social Services</Text>
        <Text style={styles.institution}>KINOO VOCATIONAL TRAINING CENTRE</Text>
        <View style={styles.contactRow}>
          <Text style={styles.contact}>P.O BOX 351-00902, Kikuyu.</Text>
          <Text style={styles.contact}>Tel: 0113582008</Text>
        </View>
        <View style={styles.contactRow}>
          <Text style={styles.contact}>Email: kinoovtc@gmail.com</Text>
          <Text style={styles.contact}>www.kinoovtc.ac.ke</Text>
        </View>
      </View>
      {cgokLogoUrl ? <Image src={cgokLogoUrl} style={styles.logo} /> : <View style={styles.logo} />}
    </View>
  );
}
