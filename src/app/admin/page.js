"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';

const COURSES_PER_PAGE = 6;

export default function AdminDashboard() {
  const [db, setDb] = useState(null);
  const [activeTab, setActiveTab] = useState('general');
  const [saving, setSaving] = useState(false);
  const [auth, setAuth] = useState({ authenticated: false, password: '', error: '', loading: false });
  const [coursePage, setCoursePage] = useState(1);
  const [courseModal, setCourseModal] = useState(null); // null | 'add' | {index}
  const [newCourse, setNewCourse] = useState({ name: '', tag: '', cert: 'NITA', dur: '2 Years', fees: 'KSh 27,000/yr', img: '', description: '', outcomes: '', careers: '', intake: 'January & September' });
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem('adminAuth') === 'true') {
      setAuth(a => ({ ...a, authenticated: true }));
    }
    fetch('/api/data')
      .then(res => res.json())
      .then(data => setDb(data))
      .catch(err => console.error("Failed to load db", err));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await fetch('/api/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(db)
      });
      alert('✅ Changes saved successfully!');
    } catch (e) {
      alert('❌ Failed to save changes.');
    }
    setSaving(false);
  };

  const handleFileUpload = async (e, callback) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      if (res.ok) {
        const data = await res.json();
        callback(data.url);
      } else {
        alert('Upload failed.');
      }
    } catch (err) {
      alert('Upload error.');
    }
    setUploading(false);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setAuth(a => ({ ...a, loading: true, error: '' }));
    try {
      const res = await fetch('/api/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'login', password: auth.password })
      });
      if (res.ok) {
        sessionStorage.setItem('adminAuth', 'true');
        setAuth(a => ({ ...a, authenticated: true, loading: false }));
      } else {
        setAuth(a => ({ ...a, error: 'Incorrect password.', loading: false }));
      }
    } catch (e) {
      setAuth(a => ({ ...a, error: 'Connection error.', loading: false }));
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('adminAuth');
    setAuth({ authenticated: false, password: '', error: '', loading: false });
  };

  // ── Login Screen ──
  if (!auth.authenticated) {
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg,#0F6E56,#085041)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
        <form onSubmit={handleLogin} style={{ background: '#fff', padding: '40px', borderRadius: '20px', boxShadow: '0 24px 80px rgba(0,0,0,0.2)', width: '100%', maxWidth: '400px', textAlign: 'center' }}>
          <img src="/kvtc_logo.png" alt="KVTC" className="kvtc-logo-crop" style={{ width: '64px', height: '64px', margin: '0 auto 24px' }} />
          <h1 style={{ fontFamily: 'var(--serif)', fontSize: '26px', marginBottom: '8px', color: '#1a1a1a' }}>Admin Login</h1>
          <p style={{ color: '#888', fontSize: '14px', marginBottom: '28px' }}>Enter your administrator password to manage the website.</p>
          <input type="password" placeholder="Password" value={auth.password} onChange={e => setAuth({...auth, password: e.target.value})}
            style={{ width: '100%', padding: '14px', border: '1.5px solid #ddd', borderRadius: '10px', marginBottom: '16px', fontFamily: 'inherit', fontSize: '15px', boxSizing: 'border-box' }} autoFocus />
          {auth.error && <div style={{ color: '#ff4444', fontSize: '13px', marginBottom: '16px', padding: '10px', background: '#fff5f5', borderRadius: '8px' }}>{auth.error}</div>}
          <button type="submit" disabled={auth.loading}
            style={{ width: '100%', background: '#0F6E56', color: '#fff', border: 'none', padding: '15px', borderRadius: '10px', fontWeight: 700, cursor: 'pointer', fontSize: '15px' }}>
            {auth.loading ? 'Verifying...' : '🔑 Login'}
          </button>
          <Link href="/" style={{ display: 'block', marginTop: '24px', fontSize: '13px', color: '#888', textDecoration: 'none' }}>← Return to Website</Link>
        </form>
      </div>
    );
  }

  if (!db) return <div style={{ padding: '100px', textAlign: 'center', fontFamily: 'var(--sans)' }}>Loading Admin Panel...</div>;

  const btnStyle = { background: '#0F6E56', color: '#fff', border: 'none', padding: '10px 18px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '13px', whiteSpace: 'nowrap' };
  const inputStyle = { width: '100%', padding: '10px 12px', border: '1.5px solid #e0e0e0', borderRadius: '8px', marginBottom: '12px', fontFamily: 'inherit', fontSize: '14px', boxSizing: 'border-box' };
  const labelStyle = { display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px', color: '#555', textTransform: 'uppercase', letterSpacing: '0.5px' };

  const tabs = [
    { id: 'general', label: '⚙️ General Settings' },
    { id: 'fees', label: '💰 Fee Structure' },
    { id: 'about', label: '🏫 About Page' },
    { id: 'departments', label: '🏛️ Departments' },
    { id: 'courses', label: '🎓 Course Manager' },
    { id: 'events', label: '📅 Events Manager' },
    { id: 'blog', label: '📝 Blog Manager' },
    { id: 'faqs', label: '❓ FAQ Manager' },
    { id: 'gallery', label: '🖼️ Gallery Manager' },
    { id: 'contact', label: '📞 Contact Info' },
    { id: 'letter', label: '✉️ Admission Letter' },
    { id: 'applications', label: '📄 Applications & Payments' },
    { id: 'security', label: '🔒 Security' },
  ];

  // Paginated courses
  const totalCoursePages = Math.ceil(db.courses.length / COURSES_PER_PAGE);
  const pagedCourses = db.courses.slice((coursePage - 1) * COURSES_PER_PAGE, coursePage * COURSES_PER_PAGE);

  const addCourse = () => {
    if (!newCourse.name) return alert('Name required');
    const slug = newCourse.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    setDb({
      ...db,
      courses: [
        {
          id: 'c' + Date.now(),
          slug,
          ...newCourse,
          outcomes: (newCourse.outcomes || '').split('\n').filter(Boolean),
          careers: (newCourse.careers || '').split('\n').filter(Boolean),
        },
        ...db.courses
      ]
    });
    setCourseModal(null);
    setNewCourse({ name: '', tag: '', cert: 'NITA', dur: '2 Years', fees: 'KSh 27,000/yr', img: '', description: '', outcomes: '', careers: '', intake: 'January & September' });
    setCoursePage(Math.ceil((db.courses.length + 1) / COURSES_PER_PAGE));
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f0f2f5', fontFamily: 'var(--sans)' }}>
      <style>{`
        @media (max-width: 768px) {
          .admin-layout { flex-direction: column !important; padding: 0 !important; gap: 0 !important; }
          .admin-sidebar { width: 100% !important; flex-direction: row !important; overflow-x: auto !important; padding: 8px !important; display: ${sidebarOpen ? 'flex' : 'none'} !important; flex-wrap: wrap !important; }
          .admin-sidebar button { white-space: nowrap !important; font-size: 12px !important; padding: 8px 12px !important; }
          .admin-content { border-radius: 0 !important; margin: 0 !important; }
          .admin-header-title { font-size: 16px !important; }
          .course-grid { grid-template-columns: 1fr 1fr !important; }
          .contact-grid { grid-template-columns: 1fr !important; }
          .modal-content { width: calc(100vw - 40px) !important; max-width: 100% !important; }
          .blog-grid { grid-template-columns: 1fr !important; }
        }
        .admin-sidebar button:hover { background: rgba(15,110,86,0.1) !important; color: #0F6E56 !important; }
      `}</style>

      {/* Header */}
      <div style={{ background: '#fff', borderBottom: '1px solid rgba(0,0,0,0.08)', padding: '0 24px', position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1300px', margin: '0 auto', height: '64px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ display: 'none', background: 'none', border: 'none', cursor: 'pointer', fontSize: '22px' }} className="menu-btn">☰</button>
            <img src="/kvtc_logo.png" alt="KVTC" className="kvtc-logo-crop" style={{ width: '40px', height: '40px' }} />
            <h1 className="admin-header-title" style={{ fontFamily: 'var(--serif)', fontSize: '20px', margin: 0, color: '#1a1a1a' }}>Admin Dashboard</h1>
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <Link href="/" style={{ color: '#666', textDecoration: 'none', fontWeight: 500, fontSize: '13px', padding: '8px 12px', borderRadius: '8px', border: '1px solid #eee' }}>View Site</Link>
            <button onClick={handleLogout} style={{ background: '#fff', border: '1px solid #ffccc7', color: '#ff4444', cursor: 'pointer', fontWeight: 600, fontSize: '13px', padding: '8px 12px', borderRadius: '8px' }}>Logout</button>
            <button onClick={handleSave} style={{ ...btnStyle, padding: '10px 20px' }} disabled={saving}>{saving ? 'Saving...' : '💾 Save All'}</button>
          </div>
        </div>
        <style>{`@media(max-width:768px){.menu-btn{display:block !important;}.admin-header-title{font-size:16px!important;}}`}</style>
      </div>

      <div className="admin-layout" style={{ display: 'flex', maxWidth: '1300px', margin: '0 auto', gap: '24px', padding: '24px', alignItems: 'flex-start' }}>

        {/* Sidebar */}
        <div className="admin-sidebar" style={{ width: '220px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '4px', background: '#fff', borderRadius: '14px', padding: '16px', boxShadow: '0 2px 12px rgba(0,0,0,0.04)', position: 'sticky', top: '88px' }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => { setActiveTab(t.id); setSidebarOpen(false); }} style={{
              textAlign: 'left', padding: '11px 14px', borderRadius: '8px', border: 'none', cursor: 'pointer',
              background: activeTab === t.id ? '#0F6E56' : 'transparent',
              color: activeTab === t.id ? '#fff' : '#555',
              fontWeight: activeTab === t.id ? 700 : 500,
              fontSize: '13px', transition: '0.2s',
            }}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="admin-content" style={{ flex: 1, background: '#fff', padding: '32px', borderRadius: '14px', boxShadow: '0 2px 12px rgba(0,0,0,0.04)', minWidth: 0 }}>

          {/* ── GENERAL SETTINGS ── */}
          {activeTab === 'general' && (
            <div>
              <h2 style={{ fontFamily: 'var(--serif)', marginBottom: '24px', fontSize: '22px' }}>General Settings</h2>
              <div style={{ padding: '24px', background: '#f8f7f4', borderRadius: '12px' }}>
                <h3 style={{ fontSize: '16px', marginBottom: '16px', fontWeight: 600 }}>Intake Banner Control</h3>
                <label style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px', cursor: 'pointer' }}>
                  <input type="checkbox" checked={db.intake.isOngoing} onChange={e => setDb({...db, intake: {...db.intake, isOngoing: e.target.checked}})} style={{ width: '20px', height: '20px', accentColor: '#0F6E56' }} />
                  <span style={{ fontWeight: 500 }}>Show "Intake Ongoing" Banner on Homepage</span>
                </label>
                <label style={labelStyle}>Intake Year / Term Text</label>
                <input type="text" value={db.intake.yearText} onChange={e => setDb({...db, intake: {...db.intake, yearText: e.target.value}})} style={inputStyle} placeholder="e.g. 2026 or May 2026" />
                <p style={{ fontSize: '12px', color: '#888', marginTop: '-4px', marginBottom: '20px' }}>This text appears in the hero banner and prospectus.</p>
                <label style={labelStyle}>Intake End Date (For Countdown & Auto-hide)</label>
                <input type="date" value={db.intake.endDate || ''} onChange={e => setDb({...db, intake: {...db.intake, endDate: e.target.value}})} style={inputStyle} />
                <p style={{ fontSize: '12px', color: '#888', marginTop: '-4px' }}>The website will compute a countdown. When this date passes, the intake banners will automatically disappear from the site (unless you manually disable them earlier).</p>
              </div>
            </div>
          )}

          {/* ── FEE STRUCTURE ── */}
          {activeTab === 'fees' && db.feeStructure && (
            <div>
              <h2 style={{ fontFamily: 'var(--serif)', marginBottom: '8px', fontSize: '22px' }}>Fee Structure Manager</h2>
              <p style={{ color: '#888', marginBottom: '28px', fontSize: '14px' }}>Changes here update the fee sections on the homepage, admissions page, and apply page.</p>

              {/* Year Label */}
              <div style={{ background: '#f8f7f4', borderRadius: '12px', padding: '24px', marginBottom: '20px' }}>
                <h3 style={{ fontWeight: 700, fontSize: '15px', marginBottom: '16px' }}>Fee Structure Year Label</h3>
                <label style={labelStyle}>Year / Session Label</label>
                <input type="text" value={db.feeStructure.year} onChange={e => setDb({...db, feeStructure: {...db.feeStructure, year: e.target.value}})} style={inputStyle} placeholder="e.g. 2026" />
                <p style={{ fontSize: '12px', color: '#888', marginTop: '4px' }}>Displayed as: "Subsidised Fee Structure – {db.feeStructure.year}"</p>
              </div>

              {/* Term Vote Heads */}
              <div style={{ background: '#f8f7f4', borderRadius: '12px', padding: '24px', marginBottom: '20px' }}>
                <h3 style={{ fontWeight: 700, fontSize: '15px', marginBottom: '16px' }}>Annual Tuition Breakdown (Vote Heads)</h3>
                {(db.feeStructure.termVoteHeads || []).map((vh, i) => (
                  <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '12px', alignItems: 'end' }}>
                    <div>
                      {i === 0 && <label style={labelStyle}>Vote Head</label>}
                      <input type="text" value={vh.head} onChange={e => { const n=[...db.feeStructure.termVoteHeads]; n[i]={...n[i], head: e.target.value}; setDb({...db, feeStructure: {...db.feeStructure, termVoteHeads: n}}); }} style={inputStyle} />
                    </div>
                    <div>
                      {i === 0 && <label style={labelStyle}>Per Term (KSh)</label>}
                      <input type="number" value={vh.perTerm} onChange={e => { const n=[...db.feeStructure.termVoteHeads]; n[i]={...n[i], perTerm: Number(e.target.value), annual: Number(e.target.value)*3}; setDb({...db, feeStructure: {...db.feeStructure, termVoteHeads: n, annualTuition: n.reduce((s,v)=>s+v.annual,0)}}); }} style={inputStyle} />
                    </div>
                    <div>
                      {i === 0 && <label style={labelStyle}>Annual (KSh)</label>}
                      <input type="number" value={vh.annual} readOnly style={{...inputStyle, background: '#eee', color: '#888'}} />
                    </div>
                  </div>
                ))}
                <div style={{ marginTop: '12px', padding: '12px 16px', background: '#E1F5EE', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', fontWeight: 700, color: '#0F6E56', fontSize: '15px' }}>
                  <span>Total Annual Tuition</span>
                  <span>KSh {(db.feeStructure.annualTuition || 0).toLocaleString()}</span>
                </div>
              </div>

              {/* Admission Fees */}
              <div style={{ background: '#f8f7f4', borderRadius: '12px', padding: '24px', marginBottom: '20px' }}>
                <h3 style={{ fontWeight: 700, fontSize: '15px', marginBottom: '16px' }}>One-Time Admission Fees</h3>
                {(db.feeStructure.admissionFees || []).map((af, i) => (
                  <div key={i} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '12px', marginBottom: '12px' }}>
                    <div>
                      {i === 0 && <label style={labelStyle}>Item</label>}
                      <input type="text" value={af.item} onChange={e => { const n=[...db.feeStructure.admissionFees]; n[i]={...n[i], item: e.target.value}; setDb({...db, feeStructure: {...db.feeStructure, admissionFees: n}}); }} style={inputStyle} />
                    </div>
                    <div>
                      {i === 0 && <label style={labelStyle}>Amount (KSh)</label>}
                      <input type="number" value={af.amount} onChange={e => { const n=[...db.feeStructure.admissionFees]; n[i]={...n[i], amount: Number(e.target.value)}; const tot=n.reduce((s,x)=>s+x.amount,0); setDb({...db, feeStructure: {...db.feeStructure, admissionFees: n, admissionTotal: tot}}); }} style={inputStyle} />
                    </div>
                  </div>
                ))}
                <div style={{ marginTop: '12px', padding: '12px 16px', background: '#FFF8E8', border: '1px solid #EF9F27', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', fontWeight: 700, color: '#BA7517', fontSize: '15px' }}>
                  <span>Admission Total</span>
                  <span>KSh {(db.feeStructure.admissionTotal || 0).toLocaleString()}</span>
                </div>
              </div>

              {/* Other Charges */}
              <div style={{ background: '#f8f7f4', borderRadius: '12px', padding: '24px', marginBottom: '20px' }}>
                <h3 style={{ fontWeight: 700, fontSize: '15px', marginBottom: '16px' }}>Other Charges (Short Courses / Part-Time)</h3>
                {(db.feeStructure.otherCharges || []).map((oc, i) => (
                  <div key={i} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '12px', marginBottom: '12px' }}>
                    <div>
                      {i === 0 && <label style={labelStyle}>Item</label>}
                      <input type="text" value={oc.item} onChange={e => { const n=[...db.feeStructure.otherCharges]; n[i]={...n[i], item: e.target.value}; setDb({...db, feeStructure: {...db.feeStructure, otherCharges: n}}); }} style={inputStyle} />
                    </div>
                    <div>
                      {i === 0 && <label style={labelStyle}>Amount (KSh)</label>}
                      <input type="number" value={oc.amount} onChange={e => { const n=[...db.feeStructure.otherCharges]; n[i]={...n[i], amount: Number(e.target.value)}; setDb({...db, feeStructure: {...db.feeStructure, otherCharges: n}}); }} style={inputStyle} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Bank Details */}
              <div style={{ background: '#f8f7f4', borderRadius: '12px', padding: '24px' }}>
                <h3 style={{ fontWeight: 700, fontSize: '15px', marginBottom: '16px' }}>Bank Payment Details</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }} className="contact-grid">
                  <div>
                    <p style={{ fontSize: '13px', fontWeight: 600, color: '#0F6E56', marginBottom: '10px' }}>Primary Bank (KCB)</p>
                    <label style={labelStyle}>Bank Name</label>
                    <input type="text" value={db.feeStructure.bankKCB?.bankName || ''} onChange={e => setDb({...db, feeStructure: {...db.feeStructure, bankKCB: {...db.feeStructure.bankKCB, bankName: e.target.value}}})} style={inputStyle} />
                    <label style={labelStyle}>Account Number</label>
                    <input type="text" value={db.feeStructure.bankKCB?.accountNumber || ''} onChange={e => setDb({...db, feeStructure: {...db.feeStructure, bankKCB: {...db.feeStructure.bankKCB, accountNumber: e.target.value}}})} style={inputStyle} />
                  </div>
                  <div>
                    <p style={{ fontSize: '13px', fontWeight: 600, color: '#0F6E56', marginBottom: '10px' }}>Alternative Bank (Co-op)</p>
                    <label style={labelStyle}>Bank Name</label>
                    <input type="text" value={db.feeStructure.bankCoop?.bankName || ''} onChange={e => setDb({...db, feeStructure: {...db.feeStructure, bankCoop: {...db.feeStructure.bankCoop, bankName: e.target.value}}})} style={inputStyle} />
                    <label style={labelStyle}>Account Number</label>
                    <input type="text" value={db.feeStructure.bankCoop?.accountNumber || ''} onChange={e => setDb({...db, feeStructure: {...db.feeStructure, bankCoop: {...db.feeStructure.bankCoop, accountNumber: e.target.value}}})} style={inputStyle} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── ABOUT PAGE MANAGER ── */}
          {activeTab === 'about' && (
            <div>
              <h2 style={{ fontFamily: 'var(--serif)', marginBottom: '8px', fontSize: '22px' }}>About Page Manager</h2>
              <p style={{ color: '#888', marginBottom: '28px' }}>Edit leadership bios and faculty department heads shown on the About page.</p>

              {/* Leadership */}
              <div style={{ marginBottom: '40px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h3 style={{ fontWeight: 700, fontSize: '16px', margin: 0 }}>Management Team (Principal & Deputy)</h3>
                  <button onClick={() => setDb({...db, leadership: [...db.leadership, { id: 'l'+Date.now(), name: 'New Leader', title: 'Title', img: '/principal.png', bio: 'Bio here.', badge: 'Badge' }]})} style={{...btnStyle, background: '#1a1a1a'}}>+ Add</button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {db.leadership.map((p, i) => (
                    <div key={p.id} style={{ border: '1.5px solid #eee', borderRadius: '12px', padding: '20px', position: 'relative' }}>
                      <button onClick={() => setDb({...db, leadership: db.leadership.filter(l => l.id !== p.id)})} style={{ position: 'absolute', top: '16px', right: '16px', background: '#ff4444', color: '#fff', border: 'none', borderRadius: '6px', padding: '4px 10px', cursor: 'pointer', fontSize: '12px' }}>Remove</button>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <div><label style={labelStyle}>Full Name</label><input type="text" value={p.name} onChange={e => { const n=[...db.leadership]; n[i].name=e.target.value; setDb({...db,leadership:n}); }} style={inputStyle} /></div>
                        <div><label style={labelStyle}>Title</label><input type="text" value={p.title} onChange={e => { const n=[...db.leadership]; n[i].title=e.target.value; setDb({...db,leadership:n}); }} style={inputStyle} /></div>
                        <div><label style={labelStyle}>Badge (e.g. 20+ Yrs)</label><input type="text" value={p.badge} onChange={e => { const n=[...db.leadership]; n[i].badge=e.target.value; setDb({...db,leadership:n}); }} style={inputStyle} /></div>
                        <div>
                          <label style={labelStyle}>Photo URL</label>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <input type="text" value={p.img} onChange={e => { const n=[...db.leadership]; n[i].img=e.target.value; setDb({...db,leadership:n}); }} style={{...inputStyle, marginBottom: 0}} />
                            <label style={{ ...btnStyle, cursor: 'pointer', display: 'flex', alignItems: 'center', height: '39px', padding: '0 12px' }}>
                              Upload
                              <input type="file" style={{ display: 'none' }} accept="image/*" onChange={e => handleFileUpload(e, url => { const n=[...db.leadership]; n[i].img=url; setDb({...db,leadership:n}); })} />
                            </label>
                          </div>
                        </div>
                        <div style={{ gridColumn: '1/-1', marginTop: '12px' }}><label style={labelStyle}>Short Bio</label><textarea value={p.bio} onChange={e => { const n=[...db.leadership]; n[i].bio=e.target.value; setDb({...db,leadership:n}); }} style={{...inputStyle, minHeight: '80px', resize: 'vertical'}} /></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Faculty */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h3 style={{ fontWeight: 700, fontSize: '16px', margin: 0 }}>Department Heads (Faculty)</h3>
                  <button onClick={() => setDb({...db, faculty: [...db.faculty, { id: 'f'+Date.now(), name: 'New Instructor', dept: 'Department', img: '/faculty1.png', courses: 'Courses taught' }]})} style={{...btnStyle, background: '#1a1a1a'}}>+ Add</button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
                  {db.faculty.map((f, i) => (
                    <div key={f.id} style={{ border: '1.5px solid #eee', borderRadius: '12px', padding: '16px', position: 'relative' }}>
                      <button onClick={() => setDb({...db, faculty: db.faculty.filter(x => x.id !== f.id)})} style={{ position: 'absolute', top: '12px', right: '12px', background: '#ff4444', color: '#fff', border: 'none', borderRadius: '6px', padding: '3px 8px', cursor: 'pointer', fontSize: '11px' }}>✕</button>
                      <div style={{ width: '64px', height: '64px', borderRadius: '50%', overflow: 'hidden', margin: '0 auto 12px', background: '#eee' }}>
                        <img src={f.img} alt={f.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                      <div><label style={labelStyle}>Name</label><input type="text" value={f.name} onChange={e => { const n=[...db.faculty]; n[i].name=e.target.value; setDb({...db,faculty:n}); }} style={inputStyle} /></div>
                      <div><label style={labelStyle}>Department Title</label><input type="text" value={f.dept} onChange={e => { const n=[...db.faculty]; n[i].dept=e.target.value; setDb({...db,faculty:n}); }} style={inputStyle} /></div>
                      <div><label style={labelStyle}>Courses Taught</label><input type="text" value={f.courses} onChange={e => { const n=[...db.faculty]; n[i].courses=e.target.value; setDb({...db,faculty:n}); }} style={inputStyle} /></div>
                      <div>
                        <label style={labelStyle}>Photo URL</label>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <input type="text" value={f.img} onChange={e => { const n=[...db.faculty]; n[i].img=e.target.value; setDb({...db,faculty:n}); }} style={{...inputStyle, marginBottom: 0}} />
                          <label style={{ ...btnStyle, cursor: 'pointer', display: 'flex', alignItems: 'center', height: '39px', padding: '0 12px' }}>
                            Upload
                            <input type="file" style={{ display: 'none' }} accept="image/*" onChange={e => handleFileUpload(e, url => { const n=[...db.faculty]; n[i].img=url; setDb({...db,faculty:n}); })} />
                          </label>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── COURSE MANAGER ── */}
          {activeTab === 'courses' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <h2 style={{ fontFamily: 'var(--serif)', margin: 0, fontSize: '22px' }}>Course Manager</h2>
                  <p style={{ color: '#888', margin: '4px 0 0', fontSize: '13px' }}>{db.courses.length} courses · Page {coursePage} of {totalCoursePages}</p>
                </div>
                <button onClick={() => setCourseModal('add')} style={{ ...btnStyle, background: '#1a1a1a', display: 'flex', alignItems: 'center', gap: '6px' }}>+ Add New Course</button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {pagedCourses.map((c) => {
                  const i = db.courses.findIndex(x => x.id === c.id);
                  return (
                    <div key={c.id} style={{ border: '1.5px solid #eee', borderRadius: '12px', overflow: 'hidden', display: 'flex', gap: '0' }}>
                      <div style={{ width: '100px', flexShrink: 0, background: '#f0f0f0', overflow: 'hidden' }}>
                        <img src={c.img || 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=200&q=60'} alt={c.name} style={{ width: '100%', height: '100%', objectFit: 'cover', minHeight: '90px' }} />
                      </div>
                      <div style={{ flex: 1, padding: '14px 16px' }}>
                        <div className="course-grid" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr', gap: '10px', alignItems: 'center' }}>
                          <div>
                            <label style={labelStyle}>Course Name</label>
                            <input type="text" value={c.name} onChange={e => { const newC=[...db.courses]; newC[i].name=e.target.value; setDb({...db,courses:newC}); }} style={{...inputStyle, marginBottom: 0}} />
                          </div>
                          <div>
                            <label style={labelStyle}>Tag</label>
                            <input type="text" value={c.tag} onChange={e => { const newC=[...db.courses]; newC[i].tag=e.target.value; setDb({...db,courses:newC}); }} style={{...inputStyle, marginBottom: 0}} />
                          </div>
                          <div>
                            <label style={labelStyle}>Certificate</label>
                            <input type="text" value={c.cert} onChange={e => { const newC=[...db.courses]; newC[i].cert=e.target.value; setDb({...db,courses:newC}); }} style={{...inputStyle, marginBottom: 0}} />
                          </div>
                          <div>
                            <label style={labelStyle}>Duration</label>
                            <input type="text" value={c.dur} onChange={e => { const newC=[...db.courses]; newC[i].dur=e.target.value; setDb({...db,courses:newC}); }} style={{...inputStyle, marginBottom: 0}} />
                          </div>
                          <div>
                            <label style={labelStyle}>Fees</label>
                            <input type="text" value={c.fees} onChange={e => { const newC=[...db.courses]; newC[i].fees=e.target.value; setDb({...db,courses:newC}); }} style={{...inputStyle, marginBottom: 0}} />
                          </div>
                          <div>
                            <label style={labelStyle}>Intake Months</label>
                            <input type="text" value={c.intake || ''} onChange={e => { const newC=[...db.courses]; newC[i].intake=e.target.value; setDb({...db,courses:newC}); }} style={{...inputStyle, marginBottom: 0}} />
                          </div>
                          <div style={{ gridColumn: '1 / -1' }}>
                            <label style={labelStyle}>Description</label>
                            <textarea value={c.description || ''} onChange={e => { const newC=[...db.courses]; newC[i].description=e.target.value; setDb({...db,courses:newC}); }} style={{...inputStyle, minHeight: '60px'}} />
                          </div>
                          <div style={{ gridColumn: '1 / -1' }}>
                            <label style={labelStyle}>What You Will Learn (One per line)</label>
                            <textarea value={(c.outcomes || []).join('\n')} onChange={e => { const newC=[...db.courses]; newC[i].outcomes=e.target.value.split('\n'); setDb({...db,courses:newC}); }} style={{...inputStyle, minHeight: '80px'}} />
                          </div>
                          <div style={{ gridColumn: '1 / -1' }}>
                            <label style={labelStyle}>Career Opportunities (One per line)</label>
                            <textarea value={(c.careers || []).join('\n')} onChange={e => { const newC=[...db.courses]; newC[i].careers=e.target.value.split('\n'); setDb({...db,courses:newC}); }} style={{...inputStyle, minHeight: '80px'}} />
                          </div>
                        </div>
                        <div style={{ marginTop: '10px' }}>
                          <label style={labelStyle}>Cover Image URL</label>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <input type="text" value={c.img} onChange={e => { const newC=[...db.courses]; newC[i].img=e.target.value; setDb({...db,courses:newC}); }} style={{...inputStyle, marginBottom: 0}} />
                            <label style={{ ...btnStyle, cursor: 'pointer', display: 'flex', alignItems: 'center', height: '39px' }}>
                              Upload
                              <input type="file" style={{ display: 'none' }} accept="image/*" onChange={e => handleFileUpload(e, url => { const newC=[...db.courses]; newC[i].img=url; setDb({...db,courses:newC}); })} />
                            </label>
                          </div>
                        </div>
                      </div>
                      <div style={{ padding: '14px', display: 'flex', alignItems: 'center' }}>
                        <button onClick={() => setDb({...db, courses: db.courses.filter(x => x.id !== c.id)})} style={{ background: '#fff5f5', color: '#ff4444', border: '1px solid #ffccc7', borderRadius: '8px', padding: '8px 12px', cursor: 'pointer', fontWeight: 600, fontSize: '12px' }}>Delete</button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Pagination */}
              {totalCoursePages > 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '24px' }}>
                  <button onClick={() => setCoursePage(p => Math.max(1, p-1))} disabled={coursePage === 1}
                    style={{ ...btnStyle, background: coursePage === 1 ? '#eee' : '#1a1a1a', color: coursePage === 1 ? '#aaa' : '#fff', padding: '8px 16px' }}>← Prev</button>
                  {Array.from({ length: totalCoursePages }, (_, i) => i+1).map(p => (
                    <button key={p} onClick={() => setCoursePage(p)}
                      style={{ ...btnStyle, background: coursePage === p ? '#0F6E56' : '#f0f0f0', color: coursePage === p ? '#fff' : '#555', padding: '8px 14px' }}>{p}</button>
                  ))}
                  <button onClick={() => setCoursePage(p => Math.min(totalCoursePages, p+1))} disabled={coursePage === totalCoursePages}
                    style={{ ...btnStyle, background: coursePage === totalCoursePages ? '#eee' : '#1a1a1a', color: coursePage === totalCoursePages ? '#aaa' : '#fff', padding: '8px 16px' }}>Next →</button>
                </div>
              )}
            </div>
          )}

          {/* ── FAQ MANAGER ── */}
          {activeTab === 'faqs' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
                <h2 style={{ fontFamily: 'var(--serif)', margin: 0, fontSize: '22px' }}>FAQ Manager</h2>
                <button onClick={() => setDb({...db, faqs: [...db.faqs, { id: 'faq-'+Date.now(), question: 'New Question?', answer: 'Answer here.' }]})} style={{...btnStyle, background: '#1a1a1a'}}>+ Add FAQ</button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {db.faqs.map((faq, i) => (
                  <div key={faq.id} style={{ padding: '20px', border: '1.5px solid #eee', borderRadius: '12px', position: 'relative' }}>
                    <button onClick={() => setDb({...db, faqs: db.faqs.filter(f => f.id !== faq.id)})} style={{ position: 'absolute', top: '16px', right: '16px', background: '#ff4444', color: '#fff', border: 'none', borderRadius: '6px', padding: '4px 10px', cursor: 'pointer', fontSize: '12px' }}>Delete</button>
                    <label style={labelStyle}>Question</label>
                    <input type="text" value={faq.question} onChange={e => { const n=[...db.faqs]; n[i].question=e.target.value; setDb({...db,faqs:n}); }} style={inputStyle} />
                    <label style={labelStyle}>Answer</label>
                    <textarea value={faq.answer} onChange={e => { const n=[...db.faqs]; n[i].answer=e.target.value; setDb({...db,faqs:n}); }} style={{...inputStyle, minHeight: '80px', resize: 'vertical', marginBottom: 0}} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── BLOG MANAGER ── */}
          {activeTab === 'blog' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
                <h2 style={{ fontFamily: 'var(--serif)', margin: 0, fontSize: '22px' }}>Blog Manager</h2>
                <button onClick={() => setDb({...db, blogs: [{ id: 'blog-'+Date.now(), slug: 'new-post-'+Date.now(), title: 'New Post Title', excerpt: 'Short summary...', content: 'Full article content here.', image: '', date: new Date().toISOString().split('T')[0] }, ...db.blogs]})} style={{...btnStyle, background: '#1a1a1a'}}>+ New Post</button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {db.blogs.map((blog, i) => (
                  <div key={blog.id} style={{ padding: '24px', border: '1.5px solid #eee', borderRadius: '12px', position: 'relative' }}>
                    <button onClick={() => setDb({...db, blogs: db.blogs.filter(b => b.id !== blog.id)})} style={{ position: 'absolute', top: '24px', right: '24px', background: '#ff4444', color: '#fff', border: 'none', borderRadius: '6px', padding: '6px 12px', cursor: 'pointer', fontSize: '12px' }}>Delete</button>
                    <div className="blog-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                      <div><label style={labelStyle}>Title</label><input type="text" value={blog.title} onChange={e => { const n=[...db.blogs]; n[i].title=e.target.value; n[i].slug=e.target.value.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)+/g,''); setDb({...db,blogs:n}); }} style={inputStyle} /></div>
                      <div><label style={labelStyle}>Date</label><input type="date" value={blog.date} onChange={e => { const n=[...db.blogs]; n[i].date=e.target.value; setDb({...db,blogs:n}); }} style={inputStyle} /></div>
                    </div>
                    <label style={labelStyle}>Cover Image URL</label>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <input type="text" value={blog.image} onChange={e => { const n=[...db.blogs]; n[i].image=e.target.value; setDb({...db,blogs:n}); }} style={{...inputStyle, marginBottom: '8px'}} />
                      <label style={{ ...btnStyle, cursor: 'pointer', display: 'flex', alignItems: 'center', height: '39px' }}>
                        Upload
                        <input type="file" style={{ display: 'none' }} accept="image/*" onChange={e => handleFileUpload(e, url => { const n=[...db.blogs]; n[i].image=url; setDb({...db,blogs:n}); })} />
                      </label>
                    </div>
                    <label style={labelStyle}>Excerpt</label>
                    <textarea value={blog.excerpt} onChange={e => { const n=[...db.blogs]; n[i].excerpt=e.target.value; setDb({...db,blogs:n}); }} style={{...inputStyle, minHeight: '60px'}} />
                    <label style={labelStyle}>Full Content</label>
                    <textarea value={blog.content} onChange={e => { const n=[...db.blogs]; n[i].content=e.target.value; setDb({...db,blogs:n}); }} style={{...inputStyle, minHeight: '160px', resize: 'vertical', marginBottom: 0}} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── GALLERY MANAGER ── */}
          {activeTab === 'gallery' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <h2 style={{ fontFamily: 'var(--serif)', margin: 0, fontSize: '22px' }}>Gallery Manager</h2>
                  <p style={{ color: '#888', margin: '4px 0 0', fontSize: '13px' }}>Images shown in the "Life at Kinoo VTC" section.</p>
                </div>
                <button onClick={() => setDb({...db, gallery: [...db.gallery, { id: 'img-'+Date.now(), src: '', label: 'New Image', span: false }]})} style={{...btnStyle, background: '#1a1a1a'}}>+ Add Image</button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {db.gallery.map((img, i) => (
                  <div key={img.id} style={{ display: 'flex', gap: '16px', alignItems: 'center', padding: '16px', background: '#f8f7f4', borderRadius: '12px', flexWrap: 'wrap' }}>
                    <div style={{ width: '100px', height: '68px', background: '#e0e0e0', borderRadius: '8px', overflow: 'hidden', flexShrink: 0 }}>
                      <img src={img.src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => e.target.style.display='none'} />
                    </div>
                    <div style={{ flex: 1, minWidth: '200px' }}>
                      <label style={labelStyle}>Image URL</label>
                      <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                        <input type="text" value={img.src} onChange={e => { const n=[...db.gallery]; n[i].src=e.target.value; setDb({...db,gallery:n}); }} style={{...inputStyle, marginBottom: 0}} />
                        <label style={{ ...btnStyle, cursor: 'pointer', display: 'flex', alignItems: 'center', height: '39px' }}>
                          Upload
                          <input type="file" style={{ display: 'none' }} accept="image/*" onChange={e => handleFileUpload(e, url => { const n=[...db.gallery]; n[i].src=url; setDb({...db,gallery:n}); })} />
                        </label>
                      </div>
                      <label style={labelStyle}>Caption</label>
                      <input type="text" value={img.label} onChange={e => { const n=[...db.gallery]; n[i].label=e.target.value; setDb({...db,gallery:n}); }} style={{...inputStyle, marginBottom: 0}} />
                    </div>
                    <button onClick={() => setDb({...db, gallery: db.gallery.filter(g => g.id !== img.id)})} style={{ background: '#fff5f5', color: '#ff4444', border: '1px solid #ffccc7', borderRadius: '8px', padding: '8px 14px', cursor: 'pointer', fontWeight: 600, fontSize: '12px', flexShrink: 0 }}>Delete</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── APPLICATIONS & PAYMENTS ── */}
          {activeTab === 'applications' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <h2 style={{ fontFamily: 'var(--serif)', margin: 0, fontSize: '22px' }}>Applications & Payments</h2>
                  <p style={{ color: '#888', margin: '4px 0 0', fontSize: '13px' }}>View all student applications and M-PESA payments.</p>
                </div>
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px' }}>
                  <thead>
                    <tr style={{ background: '#f8f7f4', borderBottom: '2px solid #eee' }}>
                      <th style={{ padding: '12px 16px', fontWeight: 600, fontSize: '13px', color: '#555' }}>Date</th>
                      <th style={{ padding: '12px 16px', fontWeight: 600, fontSize: '13px', color: '#555' }}>Name</th>
                      <th style={{ padding: '12px 16px', fontWeight: 600, fontSize: '13px', color: '#555' }}>Course Applied</th>
                      <th style={{ padding: '12px 16px', fontWeight: 600, fontSize: '13px', color: '#555' }}>Phone / Email</th>
                      <th style={{ padding: '12px 16px', fontWeight: 600, fontSize: '13px', color: '#555' }}>Amount Paid</th>
                      <th style={{ padding: '12px 16px', fontWeight: 600, fontSize: '13px', color: '#555' }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(db.applications || []).length === 0 ? (
                      <tr>
                        <td colSpan="6" style={{ padding: '24px', textAlign: 'center', color: '#888' }}>No applications received yet.</td>
                      </tr>
                    ) : (
                      db.applications.map(app => (
                        <tr key={app.id} style={{ borderBottom: '1px solid #eee' }}>
                          <td style={{ padding: '16px', fontSize: '13px' }}>{new Date(app.date).toLocaleDateString()}</td>
                          <td style={{ padding: '16px', fontSize: '14px', fontWeight: 600 }}>{app.name}</td>
                          <td style={{ padding: '16px', fontSize: '13px', color: '#0F6E56' }}>{app.course}</td>
                          <td style={{ padding: '16px', fontSize: '13px' }}>{app.phone}<br/><span style={{ color: '#888', fontSize: '12px' }}>{app.email}</span></td>
                          <td style={{ padding: '16px', fontSize: '14px', fontWeight: 600 }}>KSh {app.amount}</td>
                          <td style={{ padding: '16px' }}>
                            <span style={{ display: 'inline-block', background: '#E1F5EE', color: '#0F6E56', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 600 }}>{app.status}</span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── CONTACT INFO ── */}
          {activeTab === 'contact' && (
            <div>
              <h2 style={{ fontFamily: 'var(--serif)', marginBottom: '8px', fontSize: '22px' }}>Contact Information</h2>
              <p style={{ color: '#888', marginBottom: '24px' }}>These details appear on the contact page, footer, and prospectus.</p>
              <div className="contact-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', background: '#f8f7f4', padding: '24px', borderRadius: '12px' }}>
                <div><label style={labelStyle}>Primary Phone</label><input type="text" value={db.contact.phone1} onChange={e => setDb({...db,contact:{...db.contact,phone1:e.target.value}})} style={inputStyle} /></div>
                <div><label style={labelStyle}>Secondary Phone</label><input type="text" value={db.contact.phone2} onChange={e => setDb({...db,contact:{...db.contact,phone2:e.target.value}})} style={inputStyle} /></div>
                <div><label style={labelStyle}>Email Address</label><input type="email" value={db.contact.email} onChange={e => setDb({...db,contact:{...db.contact,email:e.target.value}})} style={inputStyle} /></div>
                <div><label style={labelStyle}>Office Hours</label><input type="text" value={db.contact.hours} onChange={e => setDb({...db,contact:{...db.contact,hours:e.target.value}})} style={inputStyle} /></div>
                <div style={{ gridColumn: '1/-1' }}><label style={labelStyle}>Physical Address</label><input type="text" value={db.contact.address} onChange={e => setDb({...db,contact:{...db.contact,address:e.target.value}})} style={{...inputStyle, marginBottom: 0}} /></div>
              </div>
            </div>
          )}


          {/* ── DEPARTMENTS MANAGER ── */}
          {activeTab === 'departments' && (() => {
            const depts = db.departments || [];
            const emptyDept = { id: '', slug: '', name: '', description: '', hod: '', image: '' };
            return (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '12px' }}>
                  <div>
                    <h2 style={{ fontFamily: 'var(--serif)', marginBottom: '6px', fontSize: '22px' }}>Departments Manager</h2>
                    <p style={{ color: '#888', fontSize: '14px' }}>Manage the academic faculties, HODs, and their descriptions.</p>
                  </div>
                  <button onClick={() => {
                    const id = 'dept-' + Date.now();
                    setDb(d => ({ ...d, departments: [...(d.departments || []), { ...emptyDept, id }] }));
                  }} style={{ background: '#0F6E56', color: '#fff', border: 'none', borderRadius: '10px', padding: '12px 24px', fontWeight: 700, cursor: 'pointer', fontSize: '14px' }}>
                    + Add Department
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {depts.map((dItem, i) => (
                    <div key={dItem.id} style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <h3 style={{ fontWeight: 700, fontSize: '15px', color: '#1a1a1a', margin: 0 }}>{dItem.name || `Department #${i + 1}`}</h3>
                        <button onClick={() => setDb(d => ({ ...d, departments: d.departments.filter((_, j) => j !== i) }))}
                          style={{ background: '#FEE2E2', color: '#991B1B', border: 'none', borderRadius: '8px', padding: '8px 16px', cursor: 'pointer', fontWeight: 600, fontSize: '13px' }}>
                          🗑 Delete
                        </button>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }} className="form-r">
                        <div>
                          <label style={labelStyle}>Department Name *</label>
                          <input style={inputStyle} value={dItem.name} placeholder="e.g. Engineering & Technology" onChange={e => {
                            const val = e.target.value;
                            setDb(d => ({ ...d, departments: d.departments.map((x, j) => j === i ? { ...x, name: val, slug: val.toLowerCase().replace(/[^a-z0-9]+/g, '-') } : x) }));
                          }} />
                        </div>
                        <div>
                          <label style={labelStyle}>URL Slug (Auto-generated)</label>
                          <input style={{...inputStyle, background: '#f5f5f5'}} value={dItem.slug} readOnly />
                        </div>
                        <div>
                          <label style={labelStyle}>Head of Department (HOD)</label>
                          <input style={inputStyle} value={dItem.hod} placeholder="e.g. Eng. Peter Omondi" onChange={e => setDb(d => ({ ...d, departments: d.departments.map((x, j) => j === i ? { ...x, hod: e.target.value } : x) }))} />
                        </div>
                        <div>
                          <label style={labelStyle}>Cover Image URL</label>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <input style={{...inputStyle, marginBottom: 0}} value={dItem.image} placeholder="https://..." onChange={e => setDb(d => ({ ...d, departments: d.departments.map((x, j) => j === i ? { ...x, image: e.target.value } : x) }))} />
                            <label style={{ ...btnStyle, cursor: 'pointer', display: 'flex', alignItems: 'center', height: '39px' }}>
                              Upload
                              <input type="file" style={{ display: 'none' }} accept="image/*" onChange={e => handleFileUpload(e, url => setDb(d => ({ ...d, departments: d.departments.map((x, j) => j === i ? { ...x, image: url } : x) })))} />
                            </label>
                          </div>
                        </div>
                        <div style={{ gridColumn: '1 / -1' }}>
                          <label style={labelStyle}>Description</label>
                          <textarea style={{ ...inputStyle, height: '80px', resize: 'vertical' }} value={dItem.description} placeholder="Department overview..." onChange={e => setDb(d => ({ ...d, departments: d.departments.map((x, j) => j === i ? { ...x, description: e.target.value } : x) }))} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {depts.length > 0 && (
                  <button onClick={handleSave} disabled={saving} style={{ marginTop: '28px', background: '#0F6E56', color: '#fff', border: 'none', borderRadius: '10px', padding: '14px 36px', fontWeight: 700, cursor: saving ? 'wait' : 'pointer', fontSize: '15px' }}>
                    {saving ? 'Saving...' : '💾 Save Departments'}
                  </button>
                )}
              </div>
            );
          })()}

          {/* ── EVENTS MANAGER ── */}
          {activeTab === 'events' && (() => {
            const events = db.events || [];
            const emptyEvent = { id: '', title: '', date: '', time: '', venue: '', category: 'Open Day', description: '', image: '', badge: '' };
            const categories = ['Open Day', 'Exams', 'Exhibition', 'Orientation', 'Sports', 'Graduation', 'Workshop', 'Other'];
            return (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '12px' }}>
                  <div>
                    <h2 style={{ fontFamily: 'var(--serif)', marginBottom: '6px', fontSize: '22px' }}>Events Manager</h2>
                    <p style={{ color: '#888', fontSize: '14px' }}>Create upcoming events that automatically appear on the homepage.</p>
                  </div>
                  <button onClick={() => {
                    const id = 'evt-' + Date.now();
                    setDb(d => ({ ...d, events: [...(d.events || []), { ...emptyEvent, id }] }));
                  }} style={{ background: '#0F6E56', color: '#fff', border: 'none', borderRadius: '10px', padding: '12px 24px', fontWeight: 700, cursor: 'pointer', fontSize: '14px' }}>
                    + Add New Event
                  </button>
                </div>

                {events.length === 0 && (
                  <div style={{ textAlign: 'center', padding: '60px', background: '#f8f7f4', borderRadius: '16px', color: '#888' }}>
                    <div style={{ fontSize: '48px', marginBottom: '16px' }}>📅</div>
                    <p style={{ fontWeight: 600, marginBottom: '8px', color: '#555' }}>No events yet</p>
                    <p style={{ fontSize: '14px' }}>Click "+ Add New Event" above to create the first event.</p>
                  </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {events.map((ev, i) => (
                    <div key={ev.id} style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <h3 style={{ fontWeight: 700, fontSize: '15px', color: '#1a1a1a', margin: 0 }}>{ev.title || `Event #${i + 1}`}</h3>
                        <button onClick={() => setDb(d => ({ ...d, events: d.events.filter((_, j) => j !== i) }))}
                          style={{ background: '#FEE2E2', color: '#991B1B', border: 'none', borderRadius: '8px', padding: '8px 16px', cursor: 'pointer', fontWeight: 600, fontSize: '13px' }}>
                          🗑 Delete
                        </button>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }} className="form-r">
                        <div>
                          <label style={labelStyle}>Event Title *</label>
                          <input style={inputStyle} value={ev.title} placeholder="e.g. 2026 Open Day" onChange={e => setDb(d => ({ ...d, events: d.events.map((x, j) => j === i ? { ...x, title: e.target.value } : x) }))} />
                        </div>
                        <div>
                          <label style={labelStyle}>Category</label>
                          <select style={inputStyle} value={ev.category} onChange={e => setDb(d => ({ ...d, events: d.events.map((x, j) => j === i ? { ...x, category: e.target.value } : x) }))}>
                            {categories.map(c => <option key={c}>{c}</option>)}
                          </select>
                        </div>
                        <div>
                          <label style={labelStyle}>Date</label>
                          <input type="date" style={inputStyle} value={ev.date} onChange={e => setDb(d => ({ ...d, events: d.events.map((x, j) => j === i ? { ...x, date: e.target.value } : x) }))} />
                        </div>
                        <div>
                          <label style={labelStyle}>Time</label>
                          <input style={inputStyle} value={ev.time} placeholder="e.g. 9:00 AM – 3:00 PM" onChange={e => setDb(d => ({ ...d, events: d.events.map((x, j) => j === i ? { ...x, time: e.target.value } : x) }))} />
                        </div>
                        <div>
                          <label style={labelStyle}>Venue</label>
                          <input style={inputStyle} value={ev.venue} placeholder="e.g. Kinoo VTC Main Hall" onChange={e => setDb(d => ({ ...d, events: d.events.map((x, j) => j === i ? { ...x, venue: e.target.value } : x) }))} />
                        </div>
                        <div>
                          <label style={labelStyle}>Badge Label (optional)</label>
                          <input style={inputStyle} value={ev.badge} placeholder="e.g. Free Admission" onChange={e => setDb(d => ({ ...d, events: d.events.map((x, j) => j === i ? { ...x, badge: e.target.value } : x) }))} />
                        </div>
                        <div style={{ gridColumn: '1 / -1' }}>
                          <label style={labelStyle}>Description</label>
                          <textarea style={{ ...inputStyle, height: '80px', resize: 'vertical' }} value={ev.description} placeholder="Describe the event..." onChange={e => setDb(d => ({ ...d, events: d.events.map((x, j) => j === i ? { ...x, description: e.target.value } : x) }))} />
                        </div>
                        <div style={{ gridColumn: '1 / -1' }}>
                          <label style={labelStyle}>Cover Image URL</label>
                          <input style={inputStyle} value={ev.image} placeholder="https://images.unsplash.com/..." onChange={e => setDb(d => ({ ...d, events: d.events.map((x, j) => j === i ? { ...x, image: e.target.value } : x) }))} />
                          {ev.image && <img src={ev.image} alt="preview" style={{ marginTop: '8px', height: '80px', borderRadius: '8px', objectFit: 'cover', width: '100%' }} />}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {events.length > 0 && (
                  <button onClick={handleSave} disabled={saving} style={{ marginTop: '28px', background: '#0F6E56', color: '#fff', border: 'none', borderRadius: '10px', padding: '14px 36px', fontWeight: 700, cursor: saving ? 'wait' : 'pointer', fontSize: '15px' }}>
                    {saving ? 'Saving...' : '💾 Save All Events'}
                  </button>
                )}
              </div>
            );
          })()}

          {/* ── ADMISSION LETTER ── */}
          {activeTab === 'letter' && (
            <div>
              <h2 style={{ fontFamily: 'var(--serif)', marginBottom: '8px', fontSize: '22px' }}>Admission Letter Generator</h2>
              <p style={{ color: '#888', marginBottom: '32px' }}>Generate and print a fully customised admission letter for new students — with live preview, editable rules, course table, and logo upload.</p>
              <a href="/admin/admission-letter" target="_blank" rel="noreferrer"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '12px', background: '#0F6E56', color: '#fff', padding: '18px 36px', borderRadius: '14px', fontWeight: 700, fontSize: '16px', textDecoration: 'none', boxShadow: '0 8px 32px rgba(15,110,86,0.3)', transition: 'all 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.background = '#085041'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = '#0F6E56'; e.currentTarget.style.transform = 'translateY(0)'; }}>
                <span style={{ fontSize: '22px' }}>✉️</span>
                Open Admission Letter Generator
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
              </a>
              <div style={{ marginTop: '32px', background: '#f8f7f4', borderRadius: '14px', padding: '28px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
                {[
                  { icon: '📝', title: 'Edit Content', desc: 'Customise letter body, paragraphs, contact info and declaration' },
                  { icon: '📚', title: 'Manage Courses', desc: 'Add, edit or remove courses shown in the admission table' },
                  { icon: '📋', title: 'Edit Rules', desc: 'Update or add institution rules and regulations' },
                  { icon: '🖼️', title: 'Upload Logos', desc: 'Upload the County Government and KVTC logos for the letter header' },
                  { icon: '🖨️', title: 'Print / Download', desc: 'Print a blank form for any student or save as PDF' },
                ].map(f => (
                  <div key={f.title} style={{ background: '#fff', borderRadius: '10px', padding: '20px', border: '1px solid rgba(0,0,0,0.06)' }}>
                    <div style={{ fontSize: '28px', marginBottom: '10px' }}>{f.icon}</div>
                    <div style={{ fontWeight: 700, fontSize: '14px', marginBottom: '6px' }}>{f.title}</div>
                    <div style={{ fontSize: '13px', color: '#888', lineHeight: 1.5 }}>{f.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── SECURITY ── */}
          {activeTab === 'security' && (
            <div>
              <h2 style={{ fontFamily: 'var(--serif)', marginBottom: '8px', fontSize: '22px' }}>Security Settings</h2>
              <p style={{ color: '#888', marginBottom: '24px' }}>Change the admin password. Remember to click "Save All" after updating.</p>
              <div style={{ background: '#f8f7f4', padding: '24px', borderRadius: '12px', maxWidth: '420px' }}>
                <label style={labelStyle}>New Password</label>
                <input type="password" placeholder="Enter new password..." onChange={e => setDb({...db, security: { password: e.target.value }})} style={inputStyle} />
                <p style={{ fontSize: '12px', color: '#888', margin: 0 }}>⚠️ Write it down somewhere safe before saving.</p>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* ── ADD COURSE MODAL ── */}
      {courseModal === 'add' && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }} onClick={() => setCourseModal(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ background: '#fff', borderRadius: '20px', padding: '32px', width: '560px', maxWidth: '100%', boxShadow: '0 32px 80px rgba(0,0,0,0.2)', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontFamily: 'var(--serif)', margin: 0, fontSize: '22px' }}>Add New Course</h2>
              <button onClick={() => setCourseModal(null)} style={{ background: '#f0f0f0', border: 'none', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', fontSize: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div style={{ gridColumn: '1/-1' }}>
                <label style={labelStyle}>Course Name *</label>
                <input type="text" value={newCourse.name} onChange={e => setNewCourse({...newCourse, name: e.target.value})} style={inputStyle} placeholder="e.g. Plumbing" autoFocus />
              </div>
              <div>
                <label style={labelStyle}>Department / Tag</label>
                <input type="text" value={newCourse.tag} onChange={e => setNewCourse({...newCourse, tag: e.target.value})} style={inputStyle} placeholder="e.g. Construction" />
              </div>
              <div>
                <label style={labelStyle}>Certificate Type</label>
                <select value={newCourse.cert} onChange={e => setNewCourse({...newCourse, cert: e.target.value})} style={inputStyle}>
                  <option>NITA</option><option>KNEC</option><option>NTSA</option><option>Internal</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>Duration</label>
                <input type="text" value={newCourse.dur} onChange={e => setNewCourse({...newCourse, dur: e.target.value})} style={inputStyle} placeholder="e.g. 2 Years" />
              </div>
              <div>
                <label style={labelStyle}>Fees</label>
                <input type="text" value={newCourse.fees} onChange={e => setNewCourse({...newCourse, fees: e.target.value})} style={inputStyle} placeholder="e.g. KSh 27,000/yr" />
              </div>
              <div>
                <label style={labelStyle}>Intake Months</label>
                <input type="text" value={newCourse.intake} onChange={e => setNewCourse({...newCourse, intake: e.target.value})} style={inputStyle} placeholder="e.g. January & September" />
              </div>
              <div style={{ gridColumn: '1/-1' }}>
                <label style={labelStyle}>Description</label>
                <textarea value={newCourse.description} onChange={e => setNewCourse({...newCourse, description: e.target.value})} style={{...inputStyle, minHeight: '60px'}} placeholder="Course overview..." />
              </div>
              <div style={{ gridColumn: '1/-1' }}>
                <label style={labelStyle}>What You Will Learn (One per line)</label>
                <textarea value={newCourse.outcomes} onChange={e => setNewCourse({...newCourse, outcomes: e.target.value})} style={{...inputStyle, minHeight: '60px'}} placeholder="Outcome 1&#10;Outcome 2" />
              </div>
              <div style={{ gridColumn: '1/-1' }}>
                <label style={labelStyle}>Careers (One per line)</label>
                <textarea value={newCourse.careers} onChange={e => setNewCourse({...newCourse, careers: e.target.value})} style={{...inputStyle, minHeight: '60px'}} placeholder="Career 1&#10;Career 2" />
              </div>
              <div style={{ gridColumn: '1/-1' }}>
                <label style={labelStyle}>Cover Image URL</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input type="text" value={newCourse.img} onChange={e => setNewCourse({...newCourse, img: e.target.value})} style={{...inputStyle, marginBottom: 0}} placeholder="/image.png" />
                  <label style={{ ...btnStyle, cursor: 'pointer', display: 'flex', alignItems: 'center', height: '39px' }}>
                    Upload
                    <input type="file" style={{ display: 'none' }} accept="image/*" onChange={e => handleFileUpload(e, url => setNewCourse({...newCourse, img: url}))} />
                  </label>
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
              <button onClick={addCourse} style={{ ...btnStyle, flex: 1, padding: '14px', fontSize: '15px' }}>✅ Add Course</button>
              <button onClick={() => setCourseModal(null)} style={{ flex: 1, padding: '14px', background: '#f0f0f0', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
