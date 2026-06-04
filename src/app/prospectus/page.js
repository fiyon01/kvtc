import db from '@/data/db.json';
import ProspectusClient from './ProspectusClient';

export const metadata = {
  title: 'Student Prospectus | Kinoo VTC',
  description: 'Download the Kinoo VTC 2026 Student Prospectus. Full course list, fees, admission requirements, and contact details for Kinoo Vocational Training Centre, Kikuyu, Kiambu.',
};

export default function ProspectusPage() {
  return <ProspectusClient dbData={db} />;
}
