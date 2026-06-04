export const runtime = 'nodejs';
import React from 'react';
import { renderToBuffer } from '@react-pdf/renderer';
import { ProspectusDocument } from '@/lib/ProspectusDocument';

import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const dbPath = path.join(process.cwd(), 'src/data/db.json');
    const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    
    // renderToBuffer returns a proper Node.js Buffer — no stream conversion needed
    const buffer = await renderToBuffer(React.createElement(ProspectusDocument, { dbData }));

    return new Response(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="Kinoo_VTC_Prospectus_2026.pdf"',
        'Content-Length': buffer.length.toString(),
        'Cache-Control': 'no-cache',
      },
    });
  } catch (error) {
    console.error('PDF generation error:', error);
    return new Response(error.stack || error.message || String(error), {
      status: 500,
      headers: { 'Content-Type': 'text/plain' },
    });
  }
}
