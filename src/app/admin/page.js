"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Settings, Wallet, Building, LayoutGrid, GraduationCap, Calendar, FileText, Image as ImageIcon, HelpCircle, Phone, Mail, FileCheck, BarChart3, Lock, BrainCircuit } from 'lucide-react';
import AriaInsightsPanel from '@/components/admin/AriaInsightsPanel';

const COURSES_PER_PAGE = 6;

export default function AdminDashboard() {
  const [db, setDb] = useState(null);
  const [activeTab, setActiveTab] = useState('analytics');
  const [saving, setSaving] = useState(false);
  const [auth, setAuth] = useState({ authenticated: false, email: '', password: '', error: '', loading: false });
  const [coursePage, setCoursePage] = useState(1);
  const [courseModal, setCourseModal] = useState(null); // null | 'add' | {index}
  const [newCourse, setNewCourse] = useState({ name: '', tag: '', cert: 'NITA', dur: '2 Years', fees: 'KSh 27,000/yr', img: '', description: '', outcomes: '', careers: '', intake: 'January & September' });
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [analytics, setAnalytics] = useState({ loading: true, topCourses: [], recentEvents: [], funnelData: [], totalEvents: 0, eventsToday: 0, uniqueCourses: 0, error: null });
  const [funnel, setFunnel] = useState({ loading: true, page_visits: 0, aria_chats: 0, apply_starts: 0, apply_completes: 0, enrolled: 0 });
  const [leads, setLeads] = useState({ loading: true, list: [], total: 0 });
  const [enrolledInput, setEnrolledInput] = useState('');
  const [passwordReset, setPasswordReset] = useState({ password: '', confirm: '', loading: false, message: '', error: '' });

  const refreshAnalytics = () => {
    setAnalytics(a => ({ ...a, loading: true }));
    fetch('/api/analytics/admin')
      .then(r => r.json())
      .then(d => setAnalytics({ loading: false, ...d, error: null }))
      .catch(() => setAnalytics({ loading: false, topCourses: [], recentEvents: [], funnelData: [], totalEvents: 0, eventsToday: 0, uniqueCourses: 0, error: 'Could not load analytics.' }));

    fetch('/api/funnel')
      .then(r => r.json())
      .then(d => setFunnel({ loading: false, ...d }))
      .catch(() => setFunnel({ loading: false, page_visits: 0, aria_chats: 0, apply_starts: 0, apply_completes: 0, enrolled: 0 }));

    fetch('/api/leads')
      .then(r => r.json())
      .then(d => setLeads({ loading: false, list: d.leads || [], total: d.total || 0 }))
      .catch(() => setLeads({ loading: false, list: [], total: 0 }));
  };

  useEffect(() => {
    if (activeTab !== 'analytics') return;
    refreshAnalytics();
  }, [activeTab]);

  useEffect(() => {
    fetch('/api/data')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data.applications)) {
          setDb(data);
          setAuth(a => ({ ...a, authenticated: true }));
        }
      })
      .catch(err => console.error("Failed to load db", err));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(db)
      });
      if (!res.ok) throw new Error('Save rejected');
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
        body: JSON.stringify({ action: 'login', email: auth.email, password: auth.password })
      });
      if (res.ok) {
        const loginData = await res.json();
        const dataRes = await fetch('/api/data', { cache: 'no-store' });
        if (!dataRes.ok) throw new Error('Could not load protected data');
        setDb(await dataRes.json());
        setAuth(a => ({ ...a, authenticated: true, email: loginData.user || a.email, loading: false }));
      } else {
        setAuth(a => ({ ...a, error: 'Incorrect password.', loading: false }));
      }
    } catch (e) {
      setAuth(a => ({ ...a, error: 'Connection error.', loading: false }));
    }
  };

  const handleLogout = async () => {
    await fetch('/api/data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'logout' }),
    }).catch(() => {});
    setDb(null);
    setAuth({ authenticated: false, email: '', password: '', error: '', loading: false });
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setPasswordReset(state => ({ ...state, loading: true, message: '', error: '' }));

    if (passwordReset.password.length < 8) {
      setPasswordReset(state => ({ ...state, loading: false, error: 'Password must be at least 8 characters.' }));
      return;
    }

    if (passwordReset.password !== passwordReset.confirm) {
      setPasswordReset(state => ({ ...state, loading: false, error: 'Passwords do not match.' }));
      return;
    }

    try {
      const res = await fetch('/api/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'resetAdminPassword',
          email: auth.email,
          password: passwordReset.password,
        }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok || data.error) {
        throw new Error(data.error || 'Password reset failed.');
      }

      setPasswordReset({ password: '', confirm: '', loading: false, message: 'Password updated successfully.', error: '' });
    } catch (err) {
      setPasswordReset(state => ({ ...state, loading: false, error: err.message || 'Password reset failed.' }));
    }
  };

  // ── Login Screen ──
  if (!auth.authenticated) {
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg,#0F6E56,#085041)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
        <form onSubmit={handleLogin} style={{ background: '#fff', padding: '40px', borderRadius: '20px', boxShadow: '0 24px 80px rgba(0,0,0,0.2)', width: '100%', maxWidth: '400px', textAlign: 'center' }}>
          <img src="/kvtc_logo.png" alt="KVTC" className="kvtc-logo-crop" style={{ width: '64px', height: '64px', margin: '0 auto 24px' }} />
          <h1 style={{ fontFamily: 'var(--serif)', fontSize: '26px', marginBottom: '8px', color: '#1a1a1a' }}>Admin Login</h1>
          <p style={{ color: '#888', fontSize: '14px', marginBottom: '28px' }}>Enter your email and password to manage the website.</p>
          <input type="email" placeholder="Email Address" value={auth.email} onChange={e => setAuth({...auth, email: e.target.value})}
            style={{ width: '100%', padding: '14px', border: '1.5px solid #ddd', borderRadius: '10px', marginBottom: '12px', fontFamily: 'inherit', fontSize: '15px', boxSizing: 'border-box' }} autoFocus />
          <input type="password" placeholder="Password" value={auth.password} onChange={e => setAuth({...auth, password: e.target.value})}
            style={{ width: '100%', padding: '14px', border: '1.5px solid #ddd', borderRadius: '10px', marginBottom: '16px', fontFamily: 'inherit', fontSize: '15px', boxSizing: 'border-box' }} />
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
    { id: 'analytics', label: 'Dashboard', icon: <BarChart3 size={16} /> },
    { id: 'general', label: 'General Settings', icon: <Settings size={16} /> },
    { id: 'fees', label: 'Fee Structure', icon: <Wallet size={16} /> },
    { id: 'about', label: 'About Page', icon: <Building size={16} /> },
    { id: 'departments', label: 'Departments', icon: <LayoutGrid size={16} /> },
    { id: 'courses', label: 'Course Manager', icon: <GraduationCap size={16} /> },
    { id: 'events', label: 'Calendar Events', icon: <Calendar size={16} /> },
    { id: 'blog', label: 'Latest News', icon: <FileText size={16} /> },
    { id: 'faqs', label: 'FAQ Manager', icon: <HelpCircle size={16} /> },
    { id: 'gallery', label: 'Gallery Manager', icon: <ImageIcon size={16} /> },
    { id: 'contact', label: 'Contact Info', icon: <Phone size={16} /> },
    { id: 'letter', label: 'Admission Letter', icon: <Mail size={16} /> },
    { id: 'applications', label: 'Applications & Payments', icon: <FileCheck size={16} /> },
    { id: 'aria', label: 'ARIA Knowledge', icon: <BrainCircuit size={16} /> },
    { id: 'security', label: 'Security', icon: <Lock size={16} /> },
  ];
  const mobilePrimaryTabs = ['analytics', 'courses', 'blog', 'applications'];
  const mobilePrimary = tabs.filter(tab => mobilePrimaryTabs.includes(tab.id));
  const mobileMoreGroups = [
    { title: 'Institution', ids: ['general', 'about', 'contact', 'departments'] },
    { title: 'Admissions', ids: ['fees', 'letter', 'events'] },
    { title: 'Content', ids: ['faqs', 'gallery', 'aria', 'security'] },
  ].map(group => ({ ...group, tabs: group.ids.map(id => tabs.find(tab => tab.id === id)).filter(Boolean) }));

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
    <div style={{ minHeight: '100vh', background: '#f0f2f5', fontFamily: 'var(--sans)', overflowX: 'hidden' }}>
      <style>{`
        .admin-layout, .admin-content, .admin-content * { box-sizing: border-box; }
        @media (max-width: 768px) {
          .admin-layout { flex-direction: column !important; padding: 0 0 100px !important; gap: 0 !important; }
          .admin-sidebar { display: none !important; }
          .admin-content { border-radius: 0 !important; margin: 0 !important; padding: 22px 14px 30px !important; }
          .admin-header-title { font-size: 16px !important; }
          .course-grid { grid-template-columns: 1fr !important; }
          .contact-grid { grid-template-columns: 1fr !important; }
          .modal-content { width: calc(100vw - 24px) !important; max-width: 100% !important; padding: 20px !important; border-radius: 22px !important; }
          .blog-grid { grid-template-columns: 1fr !important; }
          .admin-top-actions { gap: 6px !important; }
          .admin-top-actions a, .admin-top-actions button { padding: 8px 9px !important; font-size: 12px !important; }
          .mobile-admin-nav { display: block !important; }
          .mobile-more-backdrop { display: ${sidebarOpen ? 'block' : 'none'} !important; }
          .mobile-more-sheet { transform: translateY(${sidebarOpen ? '0' : '110%'}) !important; }
          .course-admin-list-card { display: block !important; border-radius: 22px !important; }
          .course-admin-image { width: 100% !important; height: 150px !important; }
          .course-admin-delete-wrap { padding: 0 16px 16px !important; }
          .course-admin-delete { width: 100% !important; justify-content: center !important; }
        }
        .admin-sidebar button:hover { background: rgba(255,255,255,0.09) !important; color: #fff !important; }
        .mobile-admin-nav { display: none; }
      `}</style>

      {/* Header */}
      <div style={{ background: '#fff', borderBottom: '1px solid rgba(0,0,0,0.08)', padding: '0 24px', position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1300px', margin: '0 auto', height: '64px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <img src="/kvtc_logo.png" alt="KVTC" className="kvtc-logo-crop" style={{ width: '40px', height: '40px' }} />
            <h1 className="admin-header-title" style={{ fontFamily: 'var(--serif)', fontSize: '20px', margin: 0, color: '#1a1a1a' }}>Admin Dashboard</h1>
          </div>
          <div className="admin-top-actions" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <Link href="/" style={{ color: '#666', textDecoration: 'none', fontWeight: 500, fontSize: '13px', padding: '8px 12px', borderRadius: '8px', border: '1px solid #eee' }}>View Site</Link>
            <button onClick={handleLogout} style={{ background: '#fff', border: '1px solid #ffccc7', color: '#ff4444', cursor: 'pointer', fontWeight: 600, fontSize: '13px', padding: '8px 12px', borderRadius: '8px' }}>Logout</button>
            <button onClick={handleSave} style={{ ...btnStyle, padding: '10px 20px' }} disabled={saving}>{saving ? 'Saving...' : '💾 Save All'}</button>
          </div>
        </div>
        <style>{`@media(max-width:768px){.admin-header-title{font-size:16px!important;}}`}</style>
      </div>

      <div className="admin-layout" style={{ display: 'flex', maxWidth: '1300px', margin: '0 auto', gap: '24px', padding: '24px', alignItems: 'flex-start' }}>

        {/* Sidebar */}
        <div className="admin-sidebar" style={{ width: '240px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '5px', background: 'linear-gradient(180deg,#10251f,#0F3F35)', borderRadius: '20px', padding: '14px', boxShadow: '0 18px 50px rgba(4,28,22,0.18)', position: 'sticky', top: '88px', maxHeight: 'calc(100vh - 120px)', overflowY: 'auto', border: '1px solid rgba(255,255,255,.08)' }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => { setActiveTab(t.id); setSidebarOpen(false); }} style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              textAlign: 'left', padding: '12px 14px', borderRadius: '13px', border: activeTab === t.id ? '1px solid rgba(255,255,255,.28)' : '1px solid transparent', cursor: 'pointer',
              background: activeTab === t.id ? 'linear-gradient(135deg,#1D9E75,#378ADD)' : 'transparent',
              color: activeTab === t.id ? '#fff' : 'rgba(255,255,255,.72)',
              fontWeight: activeTab === t.id ? 800 : 650,
              fontSize: '13px', transition: '0.2s',
            }}>
              {t.icon}
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
                  <span style={{ fontWeight: 500 }}>Show &quot;Intake Ongoing&quot; Banner on Homepage</span>
                </label>
                <label style={labelStyle}>Intake Year / Term Text</label>
                <input type="text" value={db.intake.yearText} onChange={e => setDb({...db, intake: {...db.intake, yearText: e.target.value}})} style={inputStyle} placeholder="e.g. 2026 or May 2026" />
                <p style={{ fontSize: '12px', color: '#888', marginTop: '-4px', marginBottom: '20px' }}>This text appears in the hero banner and prospectus.</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={labelStyle}>Intake Start Date</label>
                    <input type="date" value={db.intake.startDate || ''} onChange={e => setDb({...db, intake: {...db.intake, startDate: e.target.value}})} style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Intake End Date</label>
                    <input type="date" value={db.intake.endDate || ''} onChange={e => setDb({...db, intake: {...db.intake, endDate: e.target.value}})} style={inputStyle} />
                  </div>
                </div>
                <p style={{ fontSize: '12px', color: '#888', marginTop: '-4px' }}>The website computes a countdown from the start to end date. When the end date passes, the intake banners automatically hide.</p>
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
                <p style={{ fontSize: '12px', color: '#888', marginTop: '4px' }}>Displayed as: &quot;Subsidised Fee Structure – {db.feeStructure.year}&quot;</p>
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
                    <div key={c.id} className="course-admin-list-card" style={{ border: '1px solid rgba(15,110,86,0.12)', borderRadius: '18px', overflow: 'hidden', display: 'flex', gap: '0', background: 'linear-gradient(135deg,#ffffff,#fbfdfc)', boxShadow: '0 10px 32px rgba(15,57,49,0.06)' }}>
                      <div className="course-admin-image" style={{ width: '120px', flexShrink: 0, background: '#eaf3ef', overflow: 'hidden' }}>
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
                      <div className="course-admin-delete-wrap" style={{ padding: '14px', display: 'flex', alignItems: 'center' }}>
                        <button className="course-admin-delete" onClick={() => setDb({...db, courses: db.courses.filter(x => x.id !== c.id)})} style={{ background: '#fff5f5', color: '#b42318', border: '1px solid #ffccc7', borderRadius: '10px', padding: '10px 13px', cursor: 'pointer', fontWeight: 750, fontSize: '12px', display: 'inline-flex' }}>Delete</button>
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

          {/* ── LATEST NEWS MANAGER ── */}
          {activeTab === 'blog' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <h2 style={{ fontFamily: 'var(--serif)', margin: 0, fontSize: '22px' }}>Latest News Manager</h2>
                  <p style={{ color: '#888', margin: '4px 0 0', fontSize: '13px' }}>Create articles, notices, news updates, and stories shown in the Latest News section.</p>
                </div>
                <button onClick={() => setDb({...db, blogs: [{ id: 'blog-'+Date.now(), slug: 'new-update-'+Date.now(), type: 'News', title: 'New Update Title', excerpt: 'Short summary...', content: 'Full article content here.', image: '', date: new Date().toISOString().split('T')[0], badge: '' }, ...(db.blogs || [])]})} style={{...btnStyle, background: '#1a1a1a'}}>+ New Update</button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {(db.blogs || []).map((blog, i) => (
                  <div key={blog.id} style={{ padding: '24px', border: '1.5px solid #eee', borderRadius: '12px', position: 'relative' }}>
                    <button onClick={() => setDb({...db, blogs: db.blogs.filter(b => b.id !== blog.id)})} style={{ position: 'absolute', top: '24px', right: '24px', background: '#ff4444', color: '#fff', border: 'none', borderRadius: '6px', padding: '6px 12px', cursor: 'pointer', fontSize: '12px' }}>Delete</button>
                    <div className="blog-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                      <div><label style={labelStyle}>Title</label><input type="text" value={blog.title} onChange={e => { const n=[...db.blogs]; n[i].title=e.target.value; n[i].slug=e.target.value.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)+/g,''); setDb({...db,blogs:n}); }} style={inputStyle} /></div>
                      <div><label style={labelStyle}>Date</label><input type="date" value={blog.date} onChange={e => { const n=[...db.blogs]; n[i].date=e.target.value; setDb({...db,blogs:n}); }} style={inputStyle} /></div>
                      <div>
                        <label style={labelStyle}>Content Type</label>
                        <select value={blog.type || 'News'} onChange={e => { const n=[...db.blogs]; n[i].type=e.target.value; setDb({...db,blogs:n}); }} style={inputStyle}>
                          {['News', 'Article', 'Event', 'Notice', 'Student Story', 'Announcement'].map(type => <option key={type}>{type}</option>)}
                        </select>
                      </div>
                      <div><label style={labelStyle}>Badge / Label</label><input type="text" value={blog.badge || ''} placeholder="e.g. Important, New, Success Story" onChange={e => { const n=[...db.blogs]; n[i].badge=e.target.value; setDb({...db,blogs:n}); }} style={inputStyle} /></div>
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
                  <p style={{ color: '#888', margin: '4px 0 0', fontSize: '13px' }}>Images shown in the &quot;Life at Kinoo VTC&quot; section.</p>
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

          {/* ── CALENDAR EVENTS MANAGER ── */}
          {activeTab === 'events' && (() => {
            const events = db.events || [];
            const emptyEvent = { id: '', slug: '', title: '', date: '', time: '', venue: '', category: 'Open Day', description: '', image: '', badge: '' };
            const categories = ['Open Day', 'Exams', 'Exhibition', 'Orientation', 'Sports', 'Graduation', 'Workshop', 'Other'];
            return (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '12px' }}>
                  <div>
                    <h2 style={{ fontFamily: 'var(--serif)', marginBottom: '6px', fontSize: '22px' }}>Calendar Events Manager</h2>
                    <p style={{ color: '#888', fontSize: '14px' }}>Create open days, orientations, graduations, and school events. They appear inside Latest News and each gets its own reading page.</p>
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
                    <p style={{ fontSize: '14px' }}>Click &quot;+ Add New Event&quot; above to create the first event.</p>
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
                          <input style={inputStyle} value={ev.title} placeholder="e.g. 2026 Open Day" onChange={e => {
                            const title = e.target.value;
                            setDb(d => ({ ...d, events: d.events.map((x, j) => j === i ? { ...x, title, slug: title.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)+/g,'') } : x) }));
                          }} />
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

          {/* ── ANALYTICS ── */}
          {activeTab === 'analytics' && (
            <div>
              <h2 style={{ fontFamily: 'var(--serif)', marginBottom: '6px', fontSize: '22px' }}>📊 Analytics Dashboard</h2>
              <p style={{ color: '#888', marginBottom: '28px', fontSize: '14px' }}>Real-time intelligence from ARIA conversations and student interactions.</p>
              {analytics.loading ? (
                <div style={{ textAlign: 'center', padding: '60px', color: '#888' }}>Loading analytics…</div>
              ) : analytics.error ? (
                <div style={{ textAlign: 'center', padding: '60px', color: '#ef4444' }}>{analytics.error}</div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
                  {/* KPI Cards */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
                    {[
                      { label: 'Total Events', value: analytics.totalEvents ?? 0, icon: '⚡', color: '#0F6E56' },
                      { label: 'Unique Courses', value: analytics.uniqueCourses ?? 0, icon: '🎓', color: '#6366f1' },
                      { label: 'Top Course', value: analytics.topCourses?.[0]?.course ?? '—', icon: '🔥', color: '#ef4444', small: true },
                  { label: 'Events Today', value: analytics.eventsToday ?? 0, icon: '📅', color: '#f59e0b' },
                    ].map((kpi, i) => (
                      <div key={i} style={{ background: '#f8fafc', borderRadius: '14px', padding: '20px', border: `1.5px solid ${kpi.color}22` }}>
                        <div style={{ fontSize: '24px', marginBottom: '6px' }}>{kpi.icon}</div>
                        <div style={{ fontSize: kpi.small ? '15px' : '26px', fontWeight: 800, color: kpi.color, lineHeight: 1.2 }}>{kpi.value}</div>
                        <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 600, marginTop: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{kpi.label}</div>
                      </div>
                    ))}
                  </div>

                  {/* ── LEAD FUNNEL ── */}
                  <div style={{ background: '#0f172a', borderRadius: '20px', padding: '28px', color: '#fff' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                      <div>
                        <h3 style={{ margin: '0 0 4px', fontSize: '17px', fontWeight: 800, color: '#fff' }}>🎯 Student Lead Funnel</h3>
                        <p style={{ margin: 0, color: '#94a3b8', fontSize: '13px' }}>Live conversion from visitor to enrolled student</p>
                      </div>
                      <button onClick={refreshAnalytics} style={{ background: 'rgba(255,255,255,0.08)', border: 'none', color: '#94a3b8', padding: '8px 14px', borderRadius: '10px', fontSize: '12px', cursor: 'pointer' }}>↻ Refresh</button>
                    </div>
                    {(() => {
                      const stages = [
                        { label: 'Website Visitors', key: 'page_visits', icon: '🌐', color: '#6366f1' },
                        { label: 'Chatted with ARIA', key: 'aria_chats', icon: '💬', color: '#0ea5e9' },
                        { label: 'Started Application', key: 'apply_starts', icon: '📝', color: '#f59e0b' },
                        { label: 'Completed Application', key: 'apply_completes', icon: '✅', color: '#22c55e' },
                        { label: 'Enrolled', key: 'enrolled', icon: '🎓', color: '#0F6E56' },
                      ];
                      const top = Math.max(funnel.page_visits || 1, 1);
                      return (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                          {stages.map((s, i) => {
                            const val = funnel[s.key] || 0;
                            const pct = Math.min(100, Math.round((val / top) * 100));
                            const prevVal = i > 0 ? (funnel[stages[i-1].key] || 0) : null;
                            const dropoff = prevVal !== null && prevVal > 0 ? Math.round((1 - val / prevVal) * 100) : null;
                            return (
                              <div key={s.key}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <span style={{ fontSize: '18px' }}>{s.icon}</span>
                                    <span style={{ fontSize: '14px', fontWeight: 700, color: '#e2e8f0' }}>{s.label}</span>
                                    {dropoff !== null && dropoff > 0 && (
                                      <span style={{ fontSize: '11px', color: '#f87171', background: 'rgba(248,113,113,0.12)', padding: '2px 8px', borderRadius: '100px' }}>
                                        −{dropoff}% drop
                                      </span>
                                    )}
                                  </div>
                                  <span style={{ fontSize: '20px', fontWeight: 900, color: s.color }}>{val.toLocaleString()}</span>
                                </div>
                                <div style={{ height: '8px', background: 'rgba(255,255,255,0.07)', borderRadius: '100px', overflow: 'hidden' }}>
                                  <div style={{ height: '100%', width: `${pct}%`, background: `linear-gradient(90deg, ${s.color}99, ${s.color})`, borderRadius: '100px', transition: 'width 0.8s ease' }} />
                                </div>
                                {i < stages.length - 1 && (
                                  <div style={{ display: 'flex', justifyContent: 'center', marginTop: '6px' }}>
                                    <span style={{ color: '#475569', fontSize: '16px' }}>↓</span>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                          {/* Enrolled manual input */}
                          <div style={{ marginTop: '8px', padding: '16px', background: 'rgba(15,110,86,0.15)', borderRadius: '14px', border: '1px solid rgba(15,110,86,0.3)' }}>
                            <p style={{ margin: '0 0 10px', fontSize: '13px', color: '#86efac' }}>✏️ Update enrolled count manually:</p>
                            <div style={{ display: 'flex', gap: '10px' }}>
                              <input
                                type="number" min="0" placeholder="e.g. 20"
                                value={enrolledInput}
                                onChange={e => setEnrolledInput(e.target.value)}
                                style={{ flex: 1, padding: '10px 14px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#fff', fontSize: '14px' }}
                              />
                              <button
                                onClick={() => {
                                  if (!enrolledInput) return;
                                  fetch('/api/funnel', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ stage: 'enrolled', value: enrolledInput }) })
                                    .then(() => { refreshAnalytics(); setEnrolledInput(''); });
                                }}
                                style={{ padding: '10px 20px', background: '#0F6E56', border: 'none', borderRadius: '10px', color: '#fff', fontWeight: 700, fontSize: '13px', cursor: 'pointer' }}
                              >Save</button>
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                  </div>

                  {/* ── CAPTURED LEADS ── */}
                  <div style={{ background: '#f8fafc', borderRadius: '20px', padding: '28px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                      <div>
                        <h3 style={{ margin: '0 0 4px', fontSize: '17px', fontWeight: 800, color: '#0f172a' }}>📋 Captured Leads</h3>
                        <p style={{ margin: 0, color: '#94a3b8', fontSize: '13px' }}>{leads.total} students left their contact details</p>
                      </div>
                      <a
                        href="/api/leads"
                        target="_blank"
                        style={{ background: '#0F6E56', color: '#fff', padding: '8px 16px', borderRadius: '10px', fontSize: '12px', fontWeight: 700, textDecoration: 'none' }}
                      >Export JSON ↗</a>
                    </div>
                    {leads.loading ? (
                      <p style={{ color: '#94a3b8', fontSize: '14px' }}>Loading leads…</p>
                    ) : leads.list.length === 0 ? (
                      <div style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
                        <div style={{ fontSize: '40px', marginBottom: '12px' }}>📭</div>
                        <p style={{ margin: 0, fontSize: '14px' }}>No leads yet. The exit-intent modal will capture them automatically!</p>
                      </div>
                    ) : (
                      <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                          <thead>
                            <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
                              {['Name', 'Phone', 'Interested Course', 'Source', 'Date'].map(h => (
                                <th key={h} style={{ textAlign: 'left', padding: '10px 12px', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', fontSize: '11px' }}>{h}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {leads.list.slice(0, 50).map((lead, i) => (
                              <tr key={lead.id || i} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background 0.2s' }}
                                onMouseEnter={e => e.currentTarget.style.background = '#f0fdf4'}
                                onMouseLeave={e => e.currentTarget.style.background = ''}
                              >
                                <td style={{ padding: '12px', fontWeight: 700, color: '#1e293b' }}>{lead.name}</td>
                                <td style={{ padding: '12px' }}>
                                  <a href={`https://wa.me/${lead.phone.replace(/\D/g,'').replace(/^0/, '254')}`} target="_blank" rel="noopener noreferrer"
                                    style={{ color: '#25D366', fontWeight: 700, textDecoration: 'none' }}>
                                    📱 {lead.phone}
                                  </a>
                                </td>
                                <td style={{ padding: '12px', color: '#0F6E56', fontWeight: 600 }}>{lead.course}</td>
                                <td style={{ padding: '12px' }}>
                                  <span style={{ background: '#ede9fe', color: '#7c3aed', padding: '3px 10px', borderRadius: '100px', fontSize: '11px', fontWeight: 700 }}>{lead.source?.replace('_', ' ')}</span>
                                </td>
                                <td style={{ padding: '12px', color: '#94a3b8', fontSize: '12px' }}>
                                  {new Date(lead.timestamp).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        {leads.total > 50 && <p style={{ color: '#94a3b8', fontSize: '12px', padding: '12px', margin: 0 }}>Showing 50 of {leads.total} leads. Export JSON for full list.</p>}
                      </div>
                    )}
                  </div>

                  {/* Demand Chart */}
                  <div style={{ background: '#f8fafc', borderRadius: '14px', padding: '24px' }}>
                    <h3 style={{ margin: '0 0 20px', fontSize: '16px', fontWeight: 700, color: '#1e293b' }}>🔥 Course Demand Ranking</h3>
                    {analytics.topCourses.length === 0 ? (
                      <p style={{ color: '#94a3b8', fontSize: '14px' }}>No data yet — ARIA conversations will populate this automatically.</p>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {analytics.topCourses.map((item, i) => {
                          const max = analytics.topCourses[0]?.count || 1;
                          const pct = Math.round((item.count / max) * 100);
                          const colors = ['#0F6E56','#1d9e75','#6366f1','#f59e0b','#ef4444','#06b6d4','#8b5cf6'];
                          return (
                            <div key={i}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                                <span style={{ fontSize: '13px', fontWeight: 700, color: '#1e293b' }}>{i === 0 ? '🔥 ' : `#${i+1} `}{item.course}</span>
                                <span style={{ fontSize: '13px', color: '#64748b', fontWeight: 600 }}>{item.count} views</span>
                              </div>
                              <div style={{ height: '10px', background: '#e2e8f0', borderRadius: '100px', overflow: 'hidden' }}>
                                <div style={{ height: '100%', width: `${pct}%`, background: colors[i] || '#0F6E56', borderRadius: '100px' }} />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Recent Activity Log */}
                  <div style={{ background: '#f8fafc', borderRadius: '14px', padding: '24px' }}>
                    <h3 style={{ margin: '0 0 20px', fontSize: '16px', fontWeight: 700, color: '#1e293b' }}>💬 Recent ARIA Activity</h3>
                    {analytics.recentEvents.length === 0 ? (
                      <p style={{ color: '#94a3b8', fontSize: '14px' }}>No recent events logged.</p>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '320px', overflowY: 'auto' }}>
                        {analytics.recentEvents.map((ev, i) => (
                          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 14px', background: '#fff', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '13px' }}>
                            <span style={{ fontSize: '18px' }}>{ev.event_type === 'aria_requirements' ? '📋' : ev.event_type === 'aria_recommendation' ? '⭐' : '📌'}</span>
                            <div style={{ flex: 1 }}>
                              <span style={{ fontWeight: 700, color: '#1e293b' }}>{ev.course_name || ev.course}</span>
                              <span style={{ color: '#94a3b8', marginLeft: '8px', fontSize: '12px' }}>{(ev.event_type || '').replace('_', ' ')}</span>
                            </div>
                            <span style={{ color: '#94a3b8', fontSize: '11px', whiteSpace: 'nowrap' }}>
                              {new Date(ev.created_at || ev.timestamp).toLocaleString('en-KE', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Funnel Table */}
                  <div style={{ background: '#f8fafc', borderRadius: '14px', padding: '24px' }}>
                    <h3 style={{ margin: '0 0 6px', fontSize: '16px', fontWeight: 700, color: '#1e293b' }}>🎯 Apply Funnel per Course</h3>
                    <p style={{ color: '#94a3b8', fontSize: '12px', margin: '0 0 20px' }}>ARIA mentions vs actual applications submitted.</p>
                    <div style={{ overflowX: 'auto' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                        <thead>
                          <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
                            {['Course','ARIA Mentions','Applications','Conversion'].map(h => (
                              <th key={h} style={{ textAlign: 'left', padding: '10px 12px', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', fontSize: '11px' }}>{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {analytics.funnelData?.length > 0 ? analytics.funnelData.map((row, i) => (
                            <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                              <td style={{ padding: '12px', fontWeight: 700, color: '#1e293b' }}>{row.course}</td>
                              <td style={{ padding: '12px', color: '#64748b' }}>{row.mentions}</td>
                              <td style={{ padding: '12px', color: '#64748b' }}>{row.applications}</td>
                              <td style={{ padding: '12px' }}>
                                <span style={{ background: row.rate > 20 ? '#dcfce7' : row.rate > 5 ? '#fef9c3' : '#fee2e2', color: row.rate > 20 ? '#166534' : row.rate > 5 ? '#854d0e' : '#991b1b', padding: '4px 10px', borderRadius: '100px', fontWeight: 700, fontSize: '12px' }}>
                                  {row.rate}%
                                </span>
                              </td>
                            </tr>
                          )) : (
                            <tr><td colSpan={4} style={{ padding: '24px', textAlign: 'center', color: '#94a3b8' }}>Funnel data will appear once students interact with ARIA and apply.</td></tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                </div>
              )}
            </div>
          )}

          {/* ── SECURITY ── */}
          {activeTab === 'aria' && <AriaInsightsPanel />}

          {activeTab === 'security' && (
            <div>
              <h2 style={{ fontFamily: 'var(--serif)', marginBottom: '8px', fontSize: '22px' }}>Security Settings</h2>
              <p style={{ color: '#888', marginBottom: '24px' }}>Reset the password for the currently signed-in admin account.</p>
              <form onSubmit={handlePasswordReset} style={{ background: '#f8f7f4', padding: '24px', borderRadius: '12px', maxWidth: '460px' }}>
                <label style={labelStyle}>Admin Email</label>
                <input type="email" value={auth.email || ''} onChange={e => setAuth(state => ({ ...state, email: e.target.value }))} placeholder="admin@example.com" style={{ ...inputStyle, background: '#fff', color: '#555' }} />
                <label style={labelStyle}>New Password</label>
                <input type="password" value={passwordReset.password} placeholder="Enter new password..." onChange={e => setPasswordReset(state => ({ ...state, password: e.target.value, message: '', error: '' }))} style={inputStyle} />
                <label style={labelStyle}>Confirm Password</label>
                <input type="password" value={passwordReset.confirm} placeholder="Repeat new password..." onChange={e => setPasswordReset(state => ({ ...state, confirm: e.target.value, message: '', error: '' }))} style={inputStyle} />
                {passwordReset.error && <p style={{ color: '#b42318', background: '#fff1f0', border: '1px solid #ffd2cc', borderRadius: 8, padding: '10px 12px', fontSize: 13, margin: '0 0 12px' }}>{passwordReset.error}</p>}
                {passwordReset.message && <p style={{ color: '#0F6E56', background: '#eaf7f2', border: '1px solid #bfe5d7', borderRadius: 8, padding: '10px 12px', fontSize: 13, margin: '0 0 12px' }}>{passwordReset.message}</p>}
                <button type="submit" disabled={passwordReset.loading} style={{ ...btnStyle, width: '100%', justifyContent: 'center', padding: '13px 18px' }}>
                  {passwordReset.loading ? 'Updating...' : 'Update Admin Password'}
                </button>
                <p style={{ fontSize: '12px', color: '#888', margin: '12px 0 0' }}>Use at least 8 characters. The change applies immediately after success.</p>
              </form>
            </div>
          )}

        </div>
      </div>

      <nav className="mobile-admin-nav" aria-label="Admin mobile navigation">
        <div className="mobile-more-backdrop" onClick={() => setSidebarOpen(false)} />
        <div className="mobile-more-sheet" aria-hidden={!sidebarOpen}>
          <div style={{ width: '42px', height: '4px', borderRadius: '999px', background: '#d7dfdd', margin: '0 auto 14px' }} />
          <h3 style={{ margin: '0 0 12px', fontSize: '15px', color: '#10251f' }}>More Admin Sections</h3>
          <div className="mobile-more-scroll">
            {mobileMoreGroups.map(group => (
              <section key={group.title} className="mobile-more-group">
                <h4>{group.title}</h4>
                <div>
                  {group.tabs.map(tab => (
                    <button key={tab.id} type="button" onClick={() => { setActiveTab(tab.id); setSidebarOpen(false); }} className={activeTab === tab.id ? 'active' : ''}>
                      {tab.icon}
                      <span>{tab.label}</span>
                    </button>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
        <div className="mobile-admin-bar">
          {mobilePrimary.map(tab => (
            <button key={tab.id} type="button" onClick={() => { setActiveTab(tab.id); setSidebarOpen(false); }} className={activeTab === tab.id ? 'active' : ''}>
              {tab.icon}
              <span>{tab.id === 'analytics' ? 'Home' : tab.id === 'applications' ? 'Apps' : tab.label.replace('Latest ', '')}</span>
            </button>
          ))}
          <button type="button" onClick={() => setSidebarOpen(open => !open)} className={sidebarOpen ? 'active' : ''}>
            <LayoutGrid size={16} />
            <span>More</span>
          </button>
        </div>
        <style>{`
          .mobile-more-backdrop {
            position: fixed;
            inset: 0;
            z-index: 850;
            background: rgba(8, 22, 18, .38);
            backdrop-filter: blur(3px);
          }
          .mobile-more-sheet {
            position: fixed;
            left: 12px;
            right: 12px;
            bottom: 88px;
            z-index: 900;
            padding: 16px;
            max-height: min(62vh, 520px);
            border-radius: 24px;
            background: rgba(255,255,255,.96);
            border: 1px solid rgba(15,110,86,.12);
            box-shadow: 0 24px 70px rgba(4,28,22,.22);
            transition: transform .28s cubic-bezier(.2,.8,.2,1);
          }
          .mobile-more-scroll {
            max-height: calc(min(62vh, 520px) - 58px);
            overflow-y: auto;
            padding-right: 2px;
          }
          .mobile-more-group + .mobile-more-group { margin-top: 14px; }
          .mobile-more-group h4 {
            margin: 0 0 8px;
            color: #71807c;
            font-size: 10px;
            font-weight: 900;
            letter-spacing: .13em;
            text-transform: uppercase;
          }
          .mobile-more-group > div {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 10px;
          }
          .mobile-more-sheet button {
            min-height: 54px;
            border: 1px solid #e7eeec;
            border-radius: 16px;
            background: #f8fbfa;
            color: #52625e;
            display: flex;
            align-items: center;
            gap: 9px;
            padding: 10px;
            font-size: 12px;
            font-weight: 750;
            text-align: left;
          }
          .mobile-more-sheet button.active {
            background: #0F6E56;
            color: #fff;
            border-color: #0F6E56;
          }
          .mobile-admin-bar {
            position: fixed;
            left: 10px;
            right: 10px;
            bottom: 10px;
            z-index: 950;
            display: grid;
            grid-template-columns: repeat(5, minmax(0, 1fr));
            gap: 6px;
            padding: 8px;
            border-radius: 24px;
            background: rgba(255,255,255,.96);
            border: 1px solid rgba(15,110,86,.1);
            box-shadow: 0 18px 60px rgba(4,28,22,.2);
            backdrop-filter: blur(14px);
          }
          .mobile-admin-bar button {
            min-width: 0;
            border: 0;
            border-radius: 17px;
            background: transparent;
            color: #63736f;
            padding: 9px 3px;
            display: grid;
            justify-items: center;
            gap: 4px;
            font-size: 10px;
            font-weight: 800;
          }
          .mobile-admin-bar button.active {
            background: linear-gradient(135deg, #0F6E56, #245A87);
            color: #fff;
            box-shadow: 0 10px 24px rgba(15,110,86,.22);
          }
          .mobile-admin-bar span {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            max-width: 100%;
          }
        `}</style>
      </nav>

      {/* ── ADD COURSE MODAL ── */}
      {courseModal === 'add' && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(5,20,16,0.58)', backdropFilter: 'blur(8px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }} onClick={() => setCourseModal(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ background: 'linear-gradient(180deg,#ffffff,#fbfdfc)', border: '1px solid rgba(15,110,86,.12)', borderRadius: '28px', padding: '32px', width: '720px', maxWidth: '100%', boxShadow: '0 32px 90px rgba(4,28,22,0.28)', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', gap: '18px' }}>
              <div>
                <span style={{ display: 'inline-block', padding: '6px 12px', borderRadius: '999px', background: '#E1F5EE', color: '#0F6E56', fontSize: '11px', fontWeight: 850, letterSpacing: '.08em', textTransform: 'uppercase', marginBottom: '10px' }}>Course Setup</span>
                <h2 style={{ fontFamily: 'var(--serif)', margin: 0, fontSize: '28px', color: '#10251f' }}>Add New Course</h2>
                <p style={{ color: '#71807c', margin: '8px 0 0', fontSize: '13px' }}>Create a polished course record for the public website, ARIA, and application flow.</p>
              </div>
              <button onClick={() => setCourseModal(null)} style={{ background: '#f0f0f0', border: 'none', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', fontSize: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
            </div>
            <div className="blog-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
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
