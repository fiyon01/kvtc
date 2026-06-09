export const metadata = {
  title: 'Fee Structure | Kinoo VTC',
  description: 'View and download the official Kinoo Vocational Training Centre fee structure.',
};

export default function FeeStructurePage() {
  return (
    <main style={{ minHeight: '100vh', background: '#f4f6f8', padding: '130px 5% 56px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 18,
          flexWrap: 'wrap',
          marginBottom: 20,
        }}>
          <div>
            <p style={{ margin: '0 0 6px', color: '#0F6E56', fontWeight: 700, fontSize: 12, letterSpacing: 1.2, textTransform: 'uppercase' }}>
              Official Document
            </p>
            <h1 style={{ margin: 0, fontFamily: 'var(--serif)', color: '#1a1a1a', fontSize: 'clamp(2rem,4vw,3rem)' }}>
              Fee Structure
            </h1>
            <p style={{ margin: '8px 0 0', color: '#666', fontFamily: 'var(--sans)', lineHeight: 1.6 }}>
              Review the document below. Download a copy only when you need one.
            </p>
          </div>
          <a
            href="/api/fee-structure-pdf?download=1"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 9,
              padding: '13px 22px',
              borderRadius: 10,
              background: '#0F6E56',
              color: '#fff',
              textDecoration: 'none',
              fontFamily: 'var(--sans)',
              fontWeight: 700,
              boxShadow: '0 6px 20px rgba(15,110,86,0.25)',
            }}
          >
            Download PDF
          </a>
        </div>

        <div style={{
          background: '#fff',
          border: '1px solid rgba(0,0,0,0.1)',
          borderRadius: 16,
          overflow: 'hidden',
          boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
        }}>
          <iframe
            src="/api/fee-structure-pdf"
            title="Kinoo VTC Fee Structure"
            style={{ display: 'block', width: '100%', height: 'min(78vh, 920px)', border: 0 }}
          />
        </div>

        <p style={{ color: '#777', fontSize: 13, textAlign: 'center', marginTop: 16, fontFamily: 'var(--sans)' }}>
          If the preview is unavailable on your device, use the Download PDF button above.
        </p>
      </div>
    </main>
  );
}
