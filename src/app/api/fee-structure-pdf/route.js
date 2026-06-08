import { renderToStream } from '@react-pdf/renderer';
import FeeStructureDocument from '@/lib/FeeStructureDocument';
import db from '@/data/db.json';
import { NextResponse } from 'next/server';

export async function GET(req) {
  try {
    const host = req.headers.get('host') || 'localhost:3000';
    const protocol = req.headers.get('x-forwarded-proto') || 'http';
    const baseUrl = `${protocol}://${host}`;

    const stream = await renderToStream(
      <FeeStructureDocument 
        courses={db.courses} 
        feeStructure={db.feeStructure} 
        kvtcLogoUrl={`${baseUrl}/logo.png`}
        cgokLogoUrl={`${baseUrl}/cgok-logo.png`}
      />
    );
    
    // Convert Node stream to web ReadableStream
    const readableStream = new ReadableStream({
      start(controller) {
        stream.on('data', (chunk) => controller.enqueue(chunk));
        stream.on('end', () => controller.close());
        stream.on('error', (err) => controller.error(err));
      }
    });

    return new NextResponse(readableStream, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="Kinoo_VTC_Fee_Structure_2026.pdf"',
      },
    });
  } catch (error) {
    console.error('Error generating PDF:', error);
    return new NextResponse('Error generating PDF', { status: 500 });
  }
}
