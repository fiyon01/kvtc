export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/_next/'],
      },
    ],
    sitemap: 'https://www.kinoovtc.ac.ke/sitemap.xml',
    host: 'https://www.kinoovtc.ac.ke',
  };
}
