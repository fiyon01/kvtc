"use client";
import { useState } from "react";

const CGOK_LOGO_PLACEHOLDER = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='48' fill='%23e8f4ee' stroke='%23aaa' stroke-width='1.5'/%3E%3Ctext x='50' y='42' font-size='8' fill='%23555' text-anchor='middle' font-family='serif'%3ECounty%3C/text%3E%3Ctext x='50' y='54' font-size='8' fill='%23555' text-anchor='middle' font-family='serif'%3EGovt%3C/text%3E%3Ctext x='50' y='66' font-size='8' fill='%23555' text-anchor='middle' font-family='serif'%3ELogo%3C/text%3E%3C/svg%3E";
const KVTC_LOGO_PLACEHOLDER  = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='48' fill='%23fdf4e3' stroke='%23aaa' stroke-width='1.5'/%3E%3Ctext x='50' y='48' font-size='9' fill='%23555' text-anchor='middle' font-family='serif'%3EKVTC%3C/text%3E%3Ctext x='50' y='62' font-size='8' fill='%23555' text-anchor='middle' font-family='serif'%3ELogo%3C/text%3E%3C/svg%3E";

const ACCENT  = "#0F6E56";
const GOLD    = "#BA7517";
const ACCENT2 = "#0a5542";

const ALL_COURSES = [
  { name: "Food & Beverage Production & Service", cert: "ARTISAN", examBody: "KNEC",       duration: "1 YEAR"   },
  { name: "Hair Dressing and Beauty Therapy",      cert: "GRADE 3", examBody: "NITA",       duration: "1 YEAR"   },
  { name: "Electrical and Electronics",            cert: "GRADE 3", examBody: "NITA",       duration: "1 YEAR"   },
  { name: "Electronic Mechanics",                  cert: "GRADE 3", examBody: "NITA",       duration: "1 YEAR"   },
  { name: "Solar PV Installation",                 cert: "GRADE 3", examBody: "NITA",       duration: "6 MONTHS" },
  { name: "Security & Network Systems",            cert: "CERT",    examBody: "(INTERNAL)", duration: "3 MONTHS" },
  { name: "Plumbing",                              cert: "GRADE 3", examBody: "NITA",       duration: "1 YEAR"   },
  { name: "Masonry",                               cert: "GRADE 3", examBody: "NITA",       duration: "1 YEAR"   },
  { name: "Fashion Design and Dressmaking",        cert: "GRADE 3", examBody: "NITA",       duration: "1 YEAR"   },
  { name: "Motor Vehicle Mechanics",               cert: "GRADE 3", examBody: "NITA",       duration: "1 YEAR"   },
  { name: "Welding & Fabrication",                 cert: "GRADE 3", examBody: "NITA",       duration: "1 YEAR"   },
  { name: "Computer Operator",                     cert: "GRADE 3", examBody: "NITA",       duration: "1 YEAR"   },
  { name: "Computer Packages",                     cert: "CERT",    examBody: "INTERNAL",   duration: "2 MONTHS" },
];

const DEFAULT_RULES = [
  "All trainees must respect Authority and Co-exist harmoniously with the entire polytechnic Community.",
  "Sneaking out of school compound is a serious offence without express permission from the Manager, deputy manager, and instructor on duty or the class Instructor.",
  "English, Kiswahili shall be the language of communication in the institution and out of school activities.",
  "Stern disciplinary action will be taken against any trainee who bullies, molests, fights or insults and other trainee or trainees. When offended seek administrative redress.",
  "Every trainee expected to exhibit good and proper behavior towards members of the teaching, Non-teaching staff, other trainees as well as school prefects. Any trainee who disregards this rule will be heavily punished.",
  "Any type of punishment administered to ANY trainee by the school authorities must be carried out satisfactorily. Failure to observe this rule may even lead to suspension, and/or expulsion.",
  "Every trainee must stick to institution programmes by:\na) Attending all the lessons.\nb) Sitting for all examinations and doing all assignments.\nc) Being punctual at all times in class, clubs, games, general duties and meals.\nd) Note that there are no breaks between lessons UNLESS provided for in the time table.\ne) Not having any other form of entertainment other than the ones stipulated by the administration.\nf) Performing duties as allocated by any lawful authority.",
  "Every trainee should maintain order and avoid acts of disturbing or distracting training, games, etc. It is a serious offence for ANY trainee to incite others to deviate or disobey rules and regulation. Such trainees will be expelled.",
  "No trainee should absent himself/herself from the institution without express permission from the authorities. Any absence permission will require accompaniment by a parent/guardian.",
  "Every trainee should observe personal hygiene, smartness and be in proper official uniforms at all times.",
  "Taking of harmful drugs. Alcohol or smoking by any trainee is illegal. Drastic disciplinary action will be taken against the culprit.",
  "Acts of vandalism and hooliganism will not be tolerated in the school compound. Any student who willfully destroys institutions' property will be required to immediately replace the items and subsequently receive disciplinary action.",
  "Stealing is wrong. ANY trainee caught engaging in this undesirable activity will be punished severely by the administration.",
  "The staffroom, store, kitchen are out of bounds for ALL trainees unless with special permission.",
  "The lunch programme is compulsory to all trainees.",
  "No meals will be served to late-comers.",
  "All persons, who wish to visit a trainee within the institution, must first seek official clearance from the administration. Disciplinary action will be taken against anyone found to have talked to a visitor without due authority.",
  "Co-curricular activities are compulsory unless one has an exemption letter from a government hospital.",
  "Every trainee must be a member of at least one club, society or movement.",
  "Any trainee who does not abide by these rules and regulations as set by the administration or any other statutory rule thereafter that does not uphold the institution and that of the local community will face stern action that may include expulsion.",
  "Above all, use common sense.",
];

/* ─── default editable content ─── */
const DEF = {
  academicYear:   "2026",
  countyLabel:    "County Government of Kiambu",
  deptLabel:      "Department of Education, Gender, Culture & Social Services",
  institutionName:"KINOO VOCATIONAL TRAINING CENTRE",
  poBox:          "P.O BOX 351-00902, Kikuyu",
  tel:            "Tel: 0113582008",
  website:        "www.kinoovtc.ac.ke",
  email:          "kinoovtc@gmail.com",
  bodyPara1:      "I am pleased to inform you that you have been admitted to KINOO VOCATIONAL TRAINING CENTRE for the academic year {YEAR}.",
  bodyPara2:      "Kinoo V.T.C is a public institution under the county Government of Kiambu. The institution regards parents', students, staff and the management as partners with special roles and responsibilities in promoting learning. We are committed to working closely with our trainees to ensure that they are able to succeed in meeting the challenges of excellence and innovativeness hence preparing them for the world of work. You will therefore be joining a vibrant institution that strongly values discipline and puts good conduct and the character as its prerequisite to admission.",
  bodyPara3:      "We henceforth are privileged to offer you an admission to our institution for further studies in a course of your choice.",
  otherSubjects:  "Communication Skills, Guidance and Counseling, Entrepreneurship, Life Skills, & ICT",
  extraNote:      "",
  showExtraNote:  false,
  feeInfo:        "",
  showFeeInfo:    false,
  reportingDate:  "",
  showReporting:  false,
  declaration:    "I hereby declare that I will adhere to all the rules and regulations of this institution.",
};

export default function AdmissionLetterAdmin() {
  const [cgokLogo, setCgokLogo] = useState(CGOK_LOGO_PLACEHOLDER);
  const [kvtcLogo, setKvtcLogo] = useState(KVTC_LOGO_PLACEHOLDER);
  const [tab, setTab]           = useState("content");
  const [d, setD]               = useState(DEF);
  const [rules, setRules]       = useState(DEFAULT_RULES);
  const [editingRule, setEditingRule] = useState(null); // index or null
  const [newRule, setNewRule]   = useState("");
  const [courses, setCourses]   = useState(ALL_COURSES);
  const [editingCourse, setEditingCourse] = useState(null);

  const upd = (k, v) => setD(x => ({ ...x, [k]: v }));

  const handleLogo = (which, e) => {
    const file = e.target.files[0]; if (!file) return;
    const r = new FileReader();
    r.onload = ev => which === "cgok" ? setCgokLogo(ev.target.result) : setKvtcLogo(ev.target.result);
    r.readAsDataURL(file);
  };

  const handlePrint = () => {
    const el = document.getElementById("printable-doc");
    const win = window.open("", "_blank", "width=960,height=1200");
    win.document.write(`<!DOCTYPE html><html><head>
      <title>KVTC Admission Letter ${d.academicYear}</title>
      <style>
        *{box-sizing:border-box;margin:0;padding:0}
        body{font-family:'Times New Roman',Times,serif;background:#fff;color:#000;font-size:10pt}
        @page{size:A4;margin:10mm 14mm}
        @media print{.page2{page-break-before:always}}
        table{border-collapse:collapse;width:100%}
        td,th{border:1px solid #777;padding:4px 7px;font-size:9pt}
        th{background:#d4e8e0;font-weight:700}
        ol{padding-left:18px} ol li{margin-bottom:4px;font-size:9pt;line-height:1.65}
        .blank{border-bottom:1px solid #000;display:inline-block;min-width:140px}
        .hdr-bar{background:#0F6E56;color:#fff;padding:10px 16px;display:flex;align-items:center;justify-content:space-between}
        .gold-rule{height:4px;background:linear-gradient(to right,#0F6E56,#BA7517,#0F6E56)}
        pre{font-family:inherit;white-space:pre-wrap;font-size:9pt;line-height:1.65}
      </style></head><body>${el.innerHTML}</body></html>`);
    win.document.close();
    win.focus();
    setTimeout(() => { win.print(); win.close(); }, 700);
  };

  const saveRule = (i, val) => { const r=[...rules]; r[i]=val; setRules(r); setEditingRule(null); };
  const deleteRule = i => { if(window.confirm("Delete this rule?")) setRules(rules.filter((_,idx)=>idx!==i)); };
  const addRule = () => { if(newRule.trim()){ setRules([...rules, newRule.trim()]); setNewRule(""); } };
  const saveCourse = (i, c) => { const r=[...courses]; r[i]=c; setCourses(r); setEditingCourse(null); };
  const deleteCourse = i => { if(window.confirm("Delete this course?")) setCourses(courses.filter((_,idx)=>idx!==i)); };
  const addCourse = () => setCourses([...courses,{name:"New Course",cert:"GRADE 3",examBody:"NITA",duration:"1 YEAR"}]);

  const TABS = [["content","📝 Content"],["courses","📚 Courses"],["rules","📋 Rules"],["logos","🖼 Logos"]];

  return (
    <div style={{fontFamily:"'Segoe UI',sans-serif",background:"#f0ede8",minHeight:"100vh",color:"#111"}}>
      <style>{`
        *{box-sizing:border-box}
        ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-thumb{background:#bbb;border-radius:4px}
        input,select,textarea{outline:none;font-family:inherit}
        input:focus,select:focus,textarea:focus{border-color:${ACCENT}!important}
        .ptab{cursor:pointer;transition:all .18s;border:none;background:none}
        .ptab:hover{opacity:.8}
        .pbtn{cursor:pointer;transition:all .15s}
        .pbtn:hover{opacity:.88;transform:translateY(-1px)}
        .irow:hover{background:#f5f5f5}
        textarea{resize:vertical}
      `}</style>

      {/* TOP BAR */}
      <div style={{background:ACCENT,color:"#fff",padding:"12px 24px",display:"flex",alignItems:"center",justifyContent:"space-between",boxShadow:"0 2px 12px rgba(0,0,0,0.2)"}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:34,height:34,borderRadius:8,background:"rgba(255,255,255,.18)",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,fontSize:13}}>KV</div>
          <div>
            <div style={{fontSize:14,fontWeight:700,letterSpacing:.4}}>KVTC Admission Letter Generator</div>
            <div style={{fontSize:10,opacity:.7,marginTop:1}}>Edit any content · Upload logos · Download blank form for students</div>
          </div>
        </div>
        <div style={{display:"flex",gap:10,alignItems:"center"}}>
          <button className="pbtn" onClick={handlePrint}
            style={{background:GOLD,color:"#fff",border:"none",borderRadius:8,padding:"10px 22px",fontSize:13,fontWeight:700,display:"flex",alignItems:"center",gap:6}}>
            🖨 Download / Print
          </button>
        </div>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"320px 1fr",minHeight:"calc(100vh - 56px)"}}>

        {/* ── LEFT PANEL ── */}
        <div style={{background:"#fff",borderRight:"1px solid #ddd",overflowY:"auto",maxHeight:"calc(100vh - 56px)"}}>
          <div style={{display:"flex",borderBottom:"1px solid #eee"}}>
            {TABS.map(([t,l])=>(
              <button key={t} className="ptab" onClick={()=>setTab(t)}
                style={{flex:1,padding:"11px 0",fontSize:10,fontWeight:700,
                  color:tab===t?ACCENT:"#999",
                  borderBottom:tab===t?`2.5px solid ${ACCENT}`:"2.5px solid transparent",
                  letterSpacing:.3}}>
                {l}
              </button>
            ))}
          </div>

          <div style={{padding:"16px 18px"}}>

            {/* ── CONTENT TAB ── */}
            {tab==="content" && (
              <div style={{display:"flex",flexDirection:"column",gap:14}}>
                <SectionHdr>Header Info</SectionHdr>
                <Field label="Academic Year" value={d.academicYear} onChange={v=>upd("academicYear",v)} />
                <Field label="County Label" value={d.countyLabel} onChange={v=>upd("countyLabel",v)} />
                <Field label="Department Label" value={d.deptLabel} onChange={v=>upd("deptLabel",v)} />
                <Field label="Institution Name" value={d.institutionName} onChange={v=>upd("institutionName",v)} />
                <Field label="P.O Box" value={d.poBox} onChange={v=>upd("poBox",v)} />
                <Field label="Tel" value={d.tel} onChange={v=>upd("tel",v)} />
                <Field label="Website" value={d.website} onChange={v=>upd("website",v)} />
                <Field label="Email" value={d.email} onChange={v=>upd("email",v)} />

                <SectionHdr>Letter Body</SectionHdr>
                <TextArea label="Opening Paragraph (use {YEAR} for year)" value={d.bodyPara1} onChange={v=>upd("bodyPara1",v)} rows={3}/>
                <TextArea label="Institution Description" value={d.bodyPara2} onChange={v=>upd("bodyPara2",v)} rows={5}/>
                <TextArea label="Closing Paragraph" value={d.bodyPara3} onChange={v=>upd("bodyPara3",v)} rows={2}/>
                <TextArea label="Other Subjects Taught" value={d.otherSubjects} onChange={v=>upd("otherSubjects",v)} rows={2}/>

                <SectionHdr>Optional Sections</SectionHdr>
                <ToggleRow label="Reporting / Intake Date" checked={d.showReporting} onChange={v=>upd("showReporting",v)} />
                {d.showReporting && <Field label="Reporting Date text" value={d.reportingDate} onChange={v=>upd("reportingDate",v)} />}
                <ToggleRow label="Fee Information" checked={d.showFeeInfo} onChange={v=>upd("showFeeInfo",v)} />
                {d.showFeeInfo && <TextArea label="Fee details" value={d.feeInfo} onChange={v=>upd("feeInfo",v)} rows={3}/>}
                <ToggleRow label="Additional Note" checked={d.showExtraNote} onChange={v=>upd("showExtraNote",v)} />
                {d.showExtraNote && <TextArea label="Note text" value={d.extraNote} onChange={v=>upd("extraNote",v)} rows={3}/>}

                <SectionHdr>Declaration Text</SectionHdr>
                <TextArea label="Declaration (shown on Rules page)" value={d.declaration} onChange={v=>upd("declaration",v)} rows={2}/>
              </div>
            )}

            {/* ── COURSES TAB ── */}
            {tab==="courses" && (
              <div style={{display:"flex",flexDirection:"column",gap:10}}>
                <div style={{background:"#f0f9f5",borderRadius:8,padding:"10px 12px",fontSize:11,color:"#555",lineHeight:1.6}}>
                  Edit, reorder, or add courses. All will appear in the table on the printed letter.
                </div>
                {courses.map((c,i)=>(
                  <div key={i} style={{border:"1px solid #e8e8e8",borderRadius:8,overflow:"hidden"}}>
                    {editingCourse===i ? (
                      <div style={{padding:"12px",display:"flex",flexDirection:"column",gap:8}}>
                        <MiniField label="Course Name" value={c.name} onChange={v=>saveCourseField(i,"name",v,courses,setCourses)}/>
                        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:6}}>
                          <MiniField label="Cert" value={c.cert} onChange={v=>saveCourseField(i,"cert",v,courses,setCourses)}/>
                          <MiniField label="Exam Body" value={c.examBody} onChange={v=>saveCourseField(i,"examBody",v,courses,setCourses)}/>
                          <MiniField label="Duration" value={c.duration} onChange={v=>saveCourseField(i,"duration",v,courses,setCourses)}/>
                        </div>
                        <div style={{display:"flex",gap:6,justifyContent:"flex-end"}}>
                          <Btn onClick={()=>setEditingCourse(null)} bg={ACCENT} small>✓ Done</Btn>
                          <Btn onClick={()=>deleteCourse(i)} bg="#c00" small>Delete</Btn>
                        </div>
                      </div>
                    ):(
                      <div className="irow" style={{padding:"9px 12px",display:"flex",alignItems:"center",justifyContent:"space-between",gap:8,cursor:"default"}}>
                        <div>
                          <div style={{fontSize:12,fontWeight:600}}>{c.name}</div>
                          <div style={{fontSize:10,color:"#888",marginTop:2}}>{c.cert} · {c.examBody} · {c.duration}</div>
                        </div>
                        <button onClick={()=>setEditingCourse(i)} style={{background:ACCENT,color:"#fff",border:"none",borderRadius:6,padding:"4px 10px",fontSize:11,fontWeight:600,cursor:"pointer"}}>Edit</button>
                      </div>
                    )}
                  </div>
                ))}
                <button onClick={addCourse} style={{padding:"9px",background:GOLD,color:"#fff",border:"none",borderRadius:7,fontWeight:700,fontSize:12,cursor:"pointer",marginTop:4}}>+ Add Course</button>
              </div>
            )}

            {/* ── RULES TAB ── */}
            {tab==="rules" && (
              <div style={{display:"flex",flexDirection:"column",gap:10}}>
                <div style={{background:"#f0f9f5",borderRadius:8,padding:"10px 12px",fontSize:11,color:"#555",lineHeight:1.6}}>
                  Click Edit on any rule to modify it. Add extra rules at the bottom.
                </div>
                {rules.map((r,i)=>(
                  <div key={i} style={{border:"1px solid #e8e8e8",borderRadius:8,overflow:"hidden"}}>
                    {editingRule===i ? (
                      <EditRuleBox value={r} onSave={val=>saveRule(i,val)} onCancel={()=>setEditingRule(null)} onDelete={()=>deleteRule(i)} />
                    ):(
                      <div className="irow" style={{padding:"9px 12px",display:"flex",alignItems:"flex-start",gap:8}}>
                        <span style={{color:GOLD,fontWeight:700,fontSize:11,minWidth:18,marginTop:1}}>{i+1}.</span>
                        <div style={{flex:1,fontSize:11,color:"#333",lineHeight:1.5}}>{r.length>90?r.slice(0,90)+"…":r}</div>
                        <button onClick={()=>setEditingRule(i)} style={{background:ACCENT,color:"#fff",border:"none",borderRadius:6,padding:"3px 9px",fontSize:10,fontWeight:600,cursor:"pointer",flexShrink:0}}>Edit</button>
                      </div>
                    )}
                  </div>
                ))}
                <div style={{marginTop:6}}>
                  <div style={{fontSize:11,fontWeight:700,color:"#666",marginBottom:6,textTransform:"uppercase",letterSpacing:.5}}>Add New Rule</div>
                  <textarea value={newRule} onChange={e=>setNewRule(e.target.value)} placeholder="Type new rule..." rows={3}
                    style={{width:"100%",padding:"8px 10px",border:"1.5px solid #ddd",borderRadius:7,fontSize:12,marginBottom:6}} />
                  <button onClick={addRule} style={{width:"100%",padding:"9px",background:ACCENT,color:"#fff",border:"none",borderRadius:7,fontWeight:700,fontSize:12,cursor:"pointer"}}>+ Add Rule</button>
                </div>
              </div>
            )}

            {/* ── LOGOS TAB ── */}
            {tab==="logos" && (
              <div style={{display:"flex",flexDirection:"column",gap:20}}>
                <div style={{background:"#f0f9f5",borderRadius:8,padding:"10px 12px",fontSize:12,color:"#555",lineHeight:1.6}}>
                  Upload real logos. They appear in the letter header. <strong>PNG with transparent background</strong> preferred.
                </div>
                <LogoUploader label="County Govt of Kiambu Logo (Left)" current={cgokLogo} onChange={e=>handleLogo("cgok",e)} />
                <LogoUploader label="KVTC Logo (Right)" current={kvtcLogo} onChange={e=>handleLogo("kvtc",e)} />
              </div>
            )}
          </div>
        </div>

        {/* ── RIGHT: PREVIEW ── */}
        <div style={{overflowY:"auto",maxHeight:"calc(100vh - 56px)",padding:"24px 28px",background:"#f0ede8",display:"flex",flexDirection:"column",alignItems:"center"}}>
          <div style={{marginBottom:12,fontSize:11,color:"#999",fontWeight:600,letterSpacing:1,textTransform:"uppercase"}}>
            Live Preview — 2 Pages (A4)
          </div>
          <div id="printable-doc" style={{width:"210mm",fontFamily:"'Times New Roman',Times,serif"}}>
            <Page1 d={d} cgokLogo={cgokLogo} kvtcLogo={kvtcLogo} courses={courses} />
            <Page2 d={d} rules={rules} />
          </div>
        </div>
      </div>
    </div>
  );
}

function saveCourseField(i, key, val, courses, setCourses) {
  const r=[...courses]; r[i]={...r[i],[key]:val}; setCourses(r);
}

/* ═══════════════════════════════════
   PAGE 1 — ADMISSION LETTER
═══════════════════════════════════ */
function Page1({ d, cgokLogo, kvtcLogo, courses }) {
  const para1 = d.bodyPara1.replace("{YEAR}", d.academicYear);
  return (
    <div style={{background:"#fff",marginBottom:24,border:"1px solid #ccc",boxShadow:"0 4px 20px rgba(0,0,0,0.12)"}}>
      <LetterHeader d={d} cgokLogo={cgokLogo} kvtcLogo={kvtcLogo} title="ADMISSION LETTER" />

      <div style={{padding:"16px 20px 20px"}}>
        {/* NAME / DEPT */}
        <div style={{display:"flex",gap:0,marginBottom:12,fontSize:"10pt",alignItems:"baseline",flexWrap:"wrap"}}>
          <span style={{fontWeight:700,marginRight:4}}>NAME</span>
          <span style={{borderBottom:"1px solid #000",flex:1,minWidth:180,display:"inline-block"}}>&nbsp;</span>
          <span style={{fontWeight:700,margin:"0 4px 0 16px"}}>DEPARTMENT</span>
          <span style={{borderBottom:"1px solid #000",flex:"0 0 160px",display:"inline-block"}}>&nbsp;</span>
        </div>

        <p style={{fontSize:"10pt",marginBottom:10,lineHeight:1.75,textAlign:"justify"}}>{para1}</p>
        <p style={{fontSize:"10pt",marginBottom:10,lineHeight:1.75,textAlign:"justify"}}><strong>Kinoo V.T.C</strong> {d.bodyPara2.replace(/^Kinoo V\.T\.C\s*/,"")}</p>
        <p style={{fontSize:"10pt",marginBottom:12,lineHeight:1.75,textAlign:"justify"}}>{d.bodyPara3}</p>

        {/* COURSES TABLE */}
        <table style={{width:"100%",borderCollapse:"collapse",marginBottom:12,tableLayout:"fixed"}}>
          <thead>
            <tr style={{background:ACCENT}}>
              {[["COURSE","55%"],["CERTIFICATION","17%"],["EXAM BODY","14%"],["DURATION","14%"]].map(([h,w])=>(
                <th key={h} style={{border:"1px solid #555",padding:"5px 7px",textAlign:"left",fontWeight:700,fontSize:"8.5pt",color:"#fff",width:w}}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {courses.map((c,i)=>(
              <tr key={i} style={{background:i%2===0?"#fff":"#f4faf7"}}>
                <td style={{border:"1px solid #bbb",padding:"4px 7px",fontSize:"9pt"}}>{c.name}</td>
                <td style={{border:"1px solid #bbb",padding:"4px 7px",fontSize:"9pt",textAlign:"center"}}>{c.cert}</td>
                <td style={{border:"1px solid #bbb",padding:"4px 7px",fontSize:"9pt",textAlign:"center"}}>{c.examBody}</td>
                <td style={{border:"1px solid #bbb",padding:"4px 7px",fontSize:"9pt",textAlign:"center",fontWeight:600,color:ACCENT2}}>{c.duration}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <p style={{fontSize:"10pt",marginBottom:4}}><strong>Other general subjects taught are:</strong></p>
        <ul style={{marginLeft:20,marginBottom:12,fontSize:"10pt",lineHeight:1.75}}>
          <li>{d.otherSubjects}</li>
        </ul>

        {d.showReporting && (
          <p style={{fontSize:"10pt",marginBottom:8}}>
            <strong>Reporting Date:</strong> {d.reportingDate||"_______________________________"}
          </p>
        )}
        {d.showFeeInfo && (
          <div style={{border:"1px solid #bbb",borderLeft:`3px solid ${GOLD}`,padding:"8px 12px",marginBottom:10,fontSize:"9.5pt",lineHeight:1.6}}>
            <strong>FEE INFORMATION</strong>
            <div style={{marginTop:5,whiteSpace:"pre-wrap"}}>{d.feeInfo}</div>
          </div>
        )}
        {d.showExtraNote && (
          <div style={{borderLeft:`3px solid ${ACCENT}`,paddingLeft:10,marginBottom:10,fontSize:"9.5pt",lineHeight:1.6}}>
            <strong>NOTE:</strong> {d.extraNote}
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════
   PAGE 2 — RULES AND REGULATIONS
═══════════════════════════════════ */
function Page2({ d, rules }) {
  return (
    <div style={{background:"#fff",border:"1px solid #ccc",boxShadow:"0 4px 20px rgba(0,0,0,0.12)",pageBreakBefore:"always"}}
         className="page2">
      {/* Rules page has ONLY the title — no institution header repeated */}
      <div style={{background:ACCENT,padding:"8px 20px",display:"flex",alignItems:"center",justifyContent:"center"}}>
        <span style={{color:"#fff",fontWeight:800,fontSize:"13pt",letterSpacing:2,textTransform:"uppercase",fontFamily:"'Times New Roman',Times,serif"}}>
          RULES AND REGULATIONS
        </span>
      </div>
      <div style={{height:4,background:`linear-gradient(to right,${ACCENT},${GOLD},${ACCENT})`}}/>

      <div style={{padding:"14px 20px 18px"}}>
        <ol style={{margin:0,paddingLeft:20,fontSize:"9.5pt",lineHeight:1.7}}>
          {rules.map((rule,i)=>(
            <li key={i} style={{marginBottom:5,paddingLeft:2}}>
              <pre style={{margin:0,fontFamily:"'Times New Roman',Times,serif",fontSize:"9.5pt",lineHeight:1.7,whiteSpace:"pre-wrap"}}>{rule}</pre>
            </li>
          ))}
        </ol>

        {/* Declaration + Signatures */}
        <div style={{marginTop:18,borderTop:`2px solid ${ACCENT}`,paddingTop:14}}>
          <p style={{fontStyle:"italic",fontSize:"10pt",marginBottom:14,lineHeight:1.7}}>
            "{d.declaration}"
          </p>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:32,fontSize:"9.5pt"}}>
            <div>
              <div style={{marginBottom:22}}>
                Name: <span style={{borderBottom:"1px solid #000",display:"inline-block",width:155}}>&nbsp;</span>
              </div>
              <div style={{borderBottom:"1.5px solid #000",marginBottom:5}}/>
              <div>Sign: <span style={{borderBottom:"1px solid #000",display:"inline-block",width:158}}>&nbsp;</span></div>
              <div style={{marginTop:6}}>Date: <span style={{borderBottom:"1px solid #000",display:"inline-block",width:155}}>&nbsp;</span></div>
            </div>
            <div>
              <div style={{marginBottom:22,fontWeight:600}}>Principal / Registrar</div>
              <div style={{borderBottom:"1.5px solid #000",marginBottom:5}}/>
              <div>Kinoo Vocational Training Centre</div>
              <div style={{marginTop:6}}>
                Official Stamp: <span style={{borderBottom:"1px solid #000",display:"inline-block",width:95}}>&nbsp;</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════
   SHARED LETTER HEADER (Page 1 only)
═══════════════════════════════════ */
function LetterHeader({ d, cgokLogo, kvtcLogo, title }) {
  return (
    <>
      <div style={{background:ACCENT,padding:"14px 18px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <img src={cgokLogo} alt="County Logo" style={{width:66,height:66,objectFit:"contain",filter:"drop-shadow(0 1px 3px rgba(0,0,0,0.25))"}} />
        <div style={{textAlign:"center",flex:1,padding:"0 12px"}}>
          <div style={{fontSize:"7.5pt",color:"rgba(255,255,255,0.82)",letterSpacing:1.5,textTransform:"uppercase",marginBottom:2}}>{d.countyLabel}</div>
          <div style={{fontSize:"7pt",color:"rgba(255,255,255,0.75)",marginBottom:5}}>{d.deptLabel}</div>
          <div style={{fontSize:"15pt",fontWeight:800,color:"#fff",letterSpacing:1.2,textTransform:"uppercase",textDecoration:"underline",textDecorationColor:GOLD,fontFamily:"'Times New Roman',Times,serif"}}>
            {d.institutionName}
          </div>
          <div style={{width:56,height:3,background:GOLD,margin:"7px auto 6px"}}/>
          <div style={{fontSize:"7.5pt",color:"rgba(255,255,255,0.8)"}}>
            {d.poBox} &nbsp;|&nbsp; {d.tel} &nbsp;|&nbsp; {d.website}
          </div>
          <div style={{fontSize:"7.5pt",color:"rgba(255,255,255,0.72)"}}>{d.email}</div>
        </div>
        <img src={kvtcLogo} alt="KVTC Logo" style={{width:66,height:66,objectFit:"contain",filter:"drop-shadow(0 1px 3px rgba(0,0,0,0.25))"}} />
      </div>
      <div style={{height:4,background:`linear-gradient(to right,${ACCENT},${GOLD},${ACCENT})`}}/>
      <div style={{textAlign:"center",padding:"10px 0 6px"}}>
        <span style={{fontWeight:800,fontSize:"13pt",textTransform:"uppercase",letterSpacing:2,borderBottom:`2px solid ${ACCENT}`,paddingBottom:2,color:ACCENT,fontFamily:"'Times New Roman',Times,serif"}}>{title}</span>
      </div>
    </>
  );
}

/* ── MINI COMPONENTS ── */
function SectionHdr({children}) {
  return <div style={{fontSize:10,fontWeight:800,color:ACCENT,textTransform:"uppercase",letterSpacing:.8,borderBottom:`2px solid ${ACCENT}20`,paddingBottom:5,marginTop:4}}>{children}</div>;
}
function Field({label,value,onChange,mono}) {
  return (
    <div>
      <label style={{fontSize:10,fontWeight:700,color:"#888",letterSpacing:.5,textTransform:"uppercase",display:"block",marginBottom:4}}>{label}</label>
      <input value={value} onChange={e=>onChange(e.target.value)}
        style={{width:"100%",padding:"8px 10px",border:"1.5px solid #e5e5e5",borderRadius:7,fontSize:12,fontFamily:mono?"monospace":"inherit"}} />
    </div>
  );
}
function MiniField({label,value,onChange}) {
  return (
    <div>
      <label style={{fontSize:10,fontWeight:600,color:"#888",display:"block",marginBottom:3}}>{label}</label>
      <input value={value} onChange={e=>onChange(e.target.value)}
        style={{width:"100%",padding:"6px 8px",border:"1.5px solid #e5e5e5",borderRadius:6,fontSize:11}} />
    </div>
  );
}
function TextArea({label,value,onChange,rows=3}) {
  return (
    <div>
      <label style={{fontSize:10,fontWeight:700,color:"#888",letterSpacing:.5,textTransform:"uppercase",display:"block",marginBottom:4}}>{label}</label>
      <textarea value={value} onChange={e=>onChange(e.target.value)} rows={rows}
        style={{width:"100%",padding:"8px 10px",border:"1.5px solid #e5e5e5",borderRadius:7,fontSize:12,lineHeight:1.5}} />
    </div>
  );
}
function ToggleRow({label,checked,onChange}) {
  return (
    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
      <span style={{fontSize:12,fontWeight:600}}>{label}</span>
      <div onClick={()=>onChange(!checked)}
        style={{width:42,height:22,borderRadius:11,background:checked?ACCENT:"#ccc",cursor:"pointer",position:"relative",transition:"background .2s",flexShrink:0}}>
        <div style={{width:16,height:16,borderRadius:8,background:"#fff",position:"absolute",top:3,left:checked?23:3,transition:"left .2s",boxShadow:"0 1px 3px rgba(0,0,0,0.2)"}}/>
      </div>
    </div>
  );
}
function Btn({children,onClick,bg,small}) {
  return (
    <button onClick={onClick} style={{background:bg,color:"#fff",border:"none",borderRadius:6,padding:small?"5px 12px":"8px 16px",fontSize:small?11:12,fontWeight:700,cursor:"pointer"}}>
      {children}
    </button>
  );
}
function EditRuleBox({value,onSave,onCancel,onDelete}) {
  const [v,setV]=useState(value);
  return (
    <div style={{padding:12,background:"#f9f9f9"}}>
      <textarea value={v} onChange={e=>setV(e.target.value)} rows={5}
        style={{width:"100%",padding:"8px 10px",border:`1.5px solid ${ACCENT}`,borderRadius:6,fontSize:12,lineHeight:1.6,marginBottom:8}} />
      <div style={{display:"flex",gap:6,justifyContent:"flex-end"}}>
        <Btn onClick={()=>onSave(v)} bg={ACCENT} small>✓ Save</Btn>
        <Btn onClick={onCancel} bg="#888" small>Cancel</Btn>
        <Btn onClick={onDelete} bg="#c00" small>Delete</Btn>
      </div>
    </div>
  );
}
function LogoUploader({label,current,onChange}) {
  return (
    <div>
      <div style={{fontSize:11,fontWeight:700,color:"#666",textTransform:"uppercase",letterSpacing:.5,marginBottom:8}}>{label}</div>
      <div style={{display:"flex",alignItems:"center",gap:14}}>
        <img src={current} alt={label} style={{width:60,height:60,objectFit:"contain",border:"1.5px solid #ddd",borderRadius:8,padding:4,background:"#fafafa"}}/>
        <div>
          <label style={{display:"inline-block",padding:"8px 16px",background:ACCENT,color:"#fff",borderRadius:7,fontSize:12,fontWeight:700,cursor:"pointer"}}>
            Upload Image
            <input type="file" accept="image/*" onChange={onChange} style={{display:"none"}}/>
          </label>
          <div style={{fontSize:11,color:"#aaa",marginTop:5}}>PNG transparent BG preferred</div>
        </div>
      </div>
    </div>
  );
}
