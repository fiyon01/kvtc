import db from '@/data/db.json';
import ApplyClientPage from './ApplyClientPage';

export const metadata = {
  title: 'Apply Online | Kinoo VTC',
  description: 'Apply for admission online to Kinoo Vocational Training Centre.',
};

export default function ApplyPage() {
  return <ApplyClientPage dbData={db} />;
}
