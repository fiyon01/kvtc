import { notFound } from 'next/navigation';
import db from '@/data/db.json';
import DepartmentClient from './DepartmentClient';

// ── Resolve a department + its matching courses from the database ──
function getDeptData(slug) {
  const dept = (db.departments || []).find((d) => d.slug === slug);
  if (!dept) return null;

  // Map db tag field to dept name for fuzzy matching
  const tagMap = {
    hospitality: ['Hospitality'],
    cosmetology: ['Cosmetology'],
    engineering: ['Engineering'],
    fashion: ['Fashion', 'Garment'],
    'short-course': ['Short Course', 'Short'],
  };

  const tags = tagMap[slug] || [];
  const courses = (db.courses || []).filter((c) =>
    tags.some((t) => c.tag?.toLowerCase().includes(t.toLowerCase()))
  );

  return { dept, courses };
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const data = getDeptData(slug);
  if (!data) return { title: 'Department Not Found | Kinoo VTC' };
  const { dept } = data;

  const desc = `${dept.description.substring(0, 155)}...`;
  return {
    title: `${dept.name} | Kinoo Vocational Training Centre`,
    description: desc,
    openGraph: {
      title: `${dept.name} | Kinoo VTC`,
      description: desc,
      url: `https://kinoovtc.ac.ke/departments/${slug}`,
      siteName: 'Kinoo VTC',
      images: [{ url: dept.image, width: 1200, height: 630 }],
      locale: 'en_KE',
      type: 'website',
    },
  };
}

export default async function DepartmentPage({ params }) {
  const { slug } = await params;
  const data = getDeptData(slug);
  if (!data) notFound();

  const { dept, courses } = data;

  const jsonLd = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: dept.name,
    itemListElement: courses.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'Course',
        name: c.name,
        description: c.description,
        provider: {
          '@type': 'EducationalOrganization',
          name: 'Kinoo Vocational Training Centre',
          sameAs: 'https://kinoovtc.ac.ke',
        },
      },
    })),
  });

  return <DepartmentClient dept={dept} courses={courses} jsonLd={jsonLd} />;
}
