export const runtime = 'nodejs';

import React from 'react';
import { renderToBuffer } from '@react-pdf/renderer';
import { AdmissionLetterPDF } from '@/lib/AdmissionLetterPDF';
import { AdmissionDocument } from '@/lib/AdmissionDocument';

export async function POST(req) {
  try {
    const formData = await req.json();
    
    // Construct absolute URLs for the logos so react-pdf can fetch them during SSR
    const host = req.headers.get('host') || 'localhost:3000';
    const protocol = req.headers.get('x-forwarded-proto') || 'http';
    const baseUrl = `${protocol}://${host}`;

    const PdfComponent = formData.pdfType === 'form' ? AdmissionDocument : AdmissionLetterPDF;

    const buffer = await renderToBuffer(
      React.createElement(PdfComponent, {
        formData,
        kvtcLogoUrl: `${baseUrl}/logo.png`,
        cgokLogoUrl: `${baseUrl}/cgok-logo.png`,
      })
    );

    return new Response(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="Admission_Form_${(formData.name || 'Applicant').replace(/\s+/g, '_')}.pdf"`,
        'Content-Length': buffer.length.toString(),
        'Cache-Control': 'no-store',
      },
    });
  } catch (error) {
    console.error('Admission PDF generation error:', error);
    return new Response(error.stack || error.message || String(error), {
      status: 500,
      headers: { 'Content-Type': 'text/plain' },
    });
  }
}
