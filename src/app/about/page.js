import Link from 'next/link';
import { FadeIn } from './FadeIn';
import FacultyGrid from './FacultyGrid';

export const metadata = {
  title: "About Us | Kinoo VTC",
  description: "Learn about Kinoo Vocational Training Centre — our history, mission, leadership team, and dedicated faculty committed to transforming lives through skills training."
};

const leadership = [
  {
    name: 'Mr. James Kamau',
    title: 'Principal',
    img: '/principal.png',
    bio: 'A seasoned educator with over 20 years in technical and vocational training. Leads Kinoo VTC with a vision of excellence and community empowerment.',
    badge: '20+ Yrs Experience',
  },
  {
    name: 'Mrs. Grace Wanjiru',
    title: 'Deputy Principal',
    img: '/deputy.png',
    bio: 'Passionate about student welfare and academic quality. Oversees curriculum delivery and ensures every trainee receives the support they need to succeed.',
    badge: 'Curriculum Lead',
  },
];

const faculty = [
  { name: 'Mr. Peter Mwangi', dept: 'Head of Engineering', img: '/faculty1.png', courses: 'Electrical, Plumbing, Welding' },
  { name: 'Ms. Fatuma Otieno', dept: 'Head of Cosmetology', img: '/faculty2.png', courses: 'Hair Dressing, Beauty Therapy' },
  { name: 'Mr. Samuel Njoroge', dept: 'Head of ICT', img: '/faculty1.png', courses: 'Computer Operator, Packages, Security' },
  { name: 'Mrs. Alice Kariuki', dept: 'Head of Hospitality', img: '/faculty2.png', courses: 'Food & Beverage, Baking, Barista' },
];

export default function About() {
  return (
    <>
      {/* Page Header */}
      <div style={{ padding: '140px 8% 70px', background: 'linear-gradient(135deg, rgba(15,110,86,0.07) 0%, #fff 100%)', borderBottom: '1px solid rgba(0,0,0,0.07)', textAlign: 'center' }}>
        <FadeIn>
          <span style={{ display: 'inline-block', fontSize: '11px', fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase', color: '#0F6E56', background: '#E1F5EE', padding: '6px 14px', borderRadius: '100px', marginBottom: '16px' }}>About Us</span>
          <h1 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(2.5rem, 5vw, 4rem)', color: '#1a1a1a', marginBottom: '16px' }}>Who We Are</h1>
          <p style={{ color: '#888', fontSize: '1.1rem', maxWidth: '560px', margin: '0 auto' }}>A public institution committed to equipping Kenya's youth with practical, marketable skills since our founding in Kikuyu, Kiambu County.</p>
        </FadeIn>
      </div>

      {/* Main About Section */}
      <section style={{ padding: '96px 8%', background: '#f8f7f4' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '64px', alignItems: 'center', maxWidth: '1200px', margin: '0 auto' }} className="about-r">
          <FadeIn style={{ position: 'relative' }}>
            <div style={{ borderRadius: '16px', overflow: 'hidden', aspectRatio: '4/3' }}>
              <img src="/kinoo_vtc_realistic.png" alt="Exterior of Kinoo VTC" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div style={{ position: 'absolute', bottom: '-20px', right: '-20px', background: '#fff', borderRadius: '14px', padding: '20px 24px', boxShadow: '0 16px 64px rgba(0,0,0,0.12)', textAlign: 'center' }}>
              <strong style={{ display: 'block', fontFamily: 'var(--serif)', fontSize: '2.2rem', color: '#0F6E56', lineHeight: 1 }}>17+</strong>
              <span style={{ fontSize: '12px', color: '#888' }}>Accredited Courses</span>
            </div>
          </FadeIn>

          <FadeIn delay={0.2}>
            <h2 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(2rem, 3.5vw, 2.8rem)', color: '#1a1a1a', lineHeight: 1.2, marginBottom: '20px' }}>
              Shaping Tomorrow's <em style={{ fontStyle: 'italic', color: '#0F6E56' }}>Skilled Workforce</em>
            </h2>
            <p style={{ color: '#888', fontSize: '15px', lineHeight: 1.8, marginBottom: '16px' }}>
              Kinoo Vocational Training Centre (Kinoo VTC) is a public institution under the <strong style={{ color: '#1a1a1a' }}>County Government of Kiambu</strong>, Department of Education, Gender, Culture &amp; Social Services. Located in Kikuyu along the Nairobi-Nakuru highway.
            </p>
            <p style={{ color: '#888', fontSize: '15px', lineHeight: 1.8, marginBottom: '28px' }}>
              We work closely with parents, students, staff, and management as partners to promote excellence and innovativeness, preparing trainees for the real world with strong values of discipline, good conduct, and character.
            </p>
            {[
              'Practical, hands-on training in fully equipped workshops',
              'Nationally recognised KNEC Artisan & NITA Grade 3 certificates',
              'Highly subsidised fees — just KSh 27,000 per year',
              'Short-term courses (1–3 months) for quick employment',
              'Part-time classes available for working adults',
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: '#E1F5EE', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px' }}>
                  <svg width="12" height="12" fill="none" stroke="#0F6E56" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7"/></svg>
                </div>
                <span style={{ fontSize: '15px', color: '#555' }}>{item}</span>
              </div>
            ))}
            <div style={{ display: 'flex', gap: '10px', marginTop: '28px', flexWrap: 'wrap' }}>
              {[['#0F6E56', 'NITA Registered'], ['#EF9F27', 'KNEC Exam Centre'], ['#378ADD', 'County Government']].map(([color, label]) => (
                <span key={label} style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '10px', padding: '8px 16px', fontSize: '13px', fontWeight: 600, color: '#1a1a1a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: color, flexShrink: 0 }} />{label}
                </span>
              ))}
            </div>
            <div style={{ marginTop: '32px' }}>
              <Link href="/admissions" style={{ background: '#0F6E56', color: '#fff', padding: '14px 28px', borderRadius: '10px', fontWeight: 600, fontSize: '14px', textDecoration: 'none', marginRight: '12px' }}>View Admissions</Link>
              <Link href="/contact" style={{ color: '#0F6E56', padding: '14px 28px', borderRadius: '10px', fontWeight: 600, fontSize: '14px', textDecoration: 'none', border: '1.5px solid #0F6E56', display: 'inline-block' }}>Contact Us</Link>
            </div>
          </FadeIn>
        </div>
        <style>{`@media(max-width:900px){.about-r{grid-template-columns:1fr !important;}}`}</style>
      </section>

      {/* Mission & Vision */}
      <section style={{ padding: '96px 8%', background: '#fff' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <FadeIn style={{ textAlign: 'center', marginBottom: '64px' }}>
            <span style={{ display: 'inline-block', fontSize: '11px', fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase', color: '#0F6E56', background: '#E1F5EE', padding: '6px 14px', borderRadius: '100px', marginBottom: '16px' }}>Our Purpose</span>
            <h2 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(2rem, 4vw, 3rem)', color: '#1a1a1a' }}>Mission, Vision & Values</h2>
          </FadeIn>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
            {[
              { icon: '🎯', title: 'Our Mission', text: 'To equip trainees with practical, market-relevant skills that promote self-reliance, employment, and entrepreneurship in Kenya.' },
              { icon: '👁️', title: 'Our Vision', text: 'To be a centre of excellence in vocational and technical training, producing skilled, disciplined, and globally competitive graduates.' },
              { icon: '💎', title: 'Our Values', text: 'Excellence, Integrity, Innovation, Discipline, and Inclusivity. We believe every student deserves access to quality education regardless of background.' },
            ].map((card, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <div style={{ background: '#f8f7f4', border: '1px solid rgba(0,0,0,0.07)', borderRadius: '16px', padding: '36px', textAlign: 'center', height: '100%', boxSizing: 'border-box' }}>
                  <div style={{ fontSize: '2.5rem', marginBottom: '20px' }}>{card.icon}</div>
                  <h3 style={{ fontFamily: 'var(--serif)', fontSize: '1.4rem', color: '#1a1a1a', marginBottom: '14px' }}>{card.title}</h3>
                  <p style={{ color: '#888', fontSize: '15px', lineHeight: 1.7 }}>{card.text}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership Team */}
      <section style={{ padding: '96px 8%', background: '#f8f7f4' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <FadeIn style={{ textAlign: 'center', marginBottom: '64px' }}>
            <span style={{ display: 'inline-block', fontSize: '11px', fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase', color: '#0F6E56', background: '#E1F5EE', padding: '6px 14px', borderRadius: '100px', marginBottom: '16px' }}>Leadership</span>
            <h2 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(2rem, 4vw, 3rem)', color: '#1a1a1a', marginBottom: '12px' }}>Our Management Team</h2>
            <p style={{ color: '#888', fontSize: '1.05rem', maxWidth: '500px', margin: '0 auto' }}>Experienced educators dedicated to your success and the growth of Kinoo VTC.</p>
          </FadeIn>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '32px' }}>
            {leadership.map((person, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <div style={{ background: '#fff', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 4px 32px rgba(0,0,0,0.07)', border: '1px solid rgba(0,0,0,0.06)', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ position: 'relative', height: '280px', overflow: 'hidden', background: 'linear-gradient(135deg, #0F6E56, #085041)' }}>
                    <img src={person.img} alt={person.name} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top', mixBlendMode: 'luminosity', opacity: 0.85 }} />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(8,80,65,0.9) 0%, transparent 60%)' }} />
                    <div style={{ position: 'absolute', bottom: '20px', left: '24px' }}>
                      <span style={{ background: '#EF9F27', color: '#1a1a1a', fontSize: '11px', fontWeight: 700, padding: '4px 12px', borderRadius: '100px', letterSpacing: '0.5px' }}>{person.badge}</span>
                    </div>
                  </div>
                  <div style={{ padding: '28px 28px 32px' }}>
                    <h3 style={{ fontFamily: 'var(--serif)', fontSize: '1.5rem', color: '#1a1a1a', marginBottom: '4px' }}>{person.name}</h3>
                    <p style={{ color: '#0F6E56', fontWeight: 600, fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '14px' }}>{person.title}</p>
                    <p style={{ color: '#666', fontSize: '14px', lineHeight: 1.7 }}>{person.bio}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Faculty / Department Heads */}
      <section style={{ padding: '96px 8%', background: '#fff' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <FadeIn style={{ textAlign: 'center', marginBottom: '64px' }}>
            <span style={{ display: 'inline-block', fontSize: '11px', fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase', color: '#0F6E56', background: '#E1F5EE', padding: '6px 14px', borderRadius: '100px', marginBottom: '16px' }}>Faculty</span>
            <h2 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(2rem, 4vw, 3rem)', color: '#1a1a1a', marginBottom: '12px' }}>Department Heads</h2>
            <p style={{ color: '#888', fontSize: '1.05rem', maxWidth: '500px', margin: '0 auto' }}>Industry-experienced trainers who bring real-world knowledge into every classroom.</p>
          </FadeIn>
          <FacultyGrid faculty={faculty} />
        </div>
      </section>

      {/* Stats Banner */}
      <section style={{ background: 'linear-gradient(135deg, #0F6E56, #085041)', padding: '64px 8%' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '32px', textAlign: 'center' }}>
          {[
            { val: '17+', label: 'Accredited Courses' },
            { val: 'KSh 27K', label: 'Annual Fees From' },
            { val: 'NITA', label: '& KNEC Certified' },
            { val: '100%', label: 'Hands-On Training' },
          ].map(({ val, label }) => (
            <div key={label}>
              <div style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 700, color: '#fff', lineHeight: 1 }}>{val}</div>
              <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)', marginTop: '8px', letterSpacing: '0.5px' }}>{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '80px 8%', background: '#f8f7f4', textAlign: 'center' }}>
        <FadeIn>
          <h2 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)', color: '#1a1a1a', marginBottom: '16px' }}>Ready to Join Our Community?</h2>
          <p style={{ color: '#888', fontSize: '1rem', marginBottom: '32px', maxWidth: '480px', margin: '0 auto 32px' }}>Applications are open for the 2026 intake. Secure your spot today.</p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/admissions" style={{ background: '#0F6E56', color: '#fff', padding: '16px 36px', borderRadius: '12px', fontWeight: 700, fontSize: '15px', textDecoration: 'none' }}>Apply Now →</Link>
            <Link href="/courses" style={{ background: '#fff', color: '#0F6E56', padding: '16px 36px', borderRadius: '12px', fontWeight: 600, fontSize: '15px', textDecoration: 'none', border: '1.5px solid #0F6E56' }}>Browse Courses</Link>
          </div>
        </FadeIn>
      </section>
    </>
  );
}
