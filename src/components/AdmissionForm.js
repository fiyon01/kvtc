"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { createPortal } from "react-dom";
import { useToast } from "./ToastProvider";
import CourseRequirementsModal from "./CourseRequirementsModal";

const KVTC_LOGO = "/kvtc_logo.png";
const MAX_PHOTO_BYTES = 5 * 1024 * 1024;

function resizeApplicantPhoto(file) {
  return new Promise((resolve, reject) => {
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      reject(new Error('Upload a JPG, PNG, or WebP image.'));
      return;
    }
    if (file.size > MAX_PHOTO_BYTES) {
      reject(new Error('The applicant photo must be smaller than 5 MB.'));
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error('The selected photo could not be read.'));
    reader.onload = () => {
      const image = new window.Image();
      image.onerror = () => reject(new Error('The selected file is not a valid image.'));
      image.onload = () => {
        const scale = Math.min(1, 720 / image.width, 900 / image.height);
        const canvas = document.createElement('canvas');
        canvas.width = Math.max(1, Math.round(image.width * scale));
        canvas.height = Math.max(1, Math.round(image.height * scale));
        const context = canvas.getContext('2d');
        context.fillStyle = '#ffffff';
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', 0.84));
      };
      image.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

// ── Signature Modal ────────────────────────────────────────────
function SignatureModal({ onSave, onClose }) {
  const canvasRef = useRef();
  const drawing = useRef(false);
  const lastPos = useRef(null);
  const [mode, setMode] = useState("draw");
  const [typed, setTyped] = useState("");
  const [isEmpty, setIsEmpty] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, []);

  const getPos = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left) * (canvas.width / rect.width),
      y: (e.clientY - rect.top) * (canvas.height / rect.height),
    };
  };

  const startDraw = (e) => {
    if (mode !== "draw") return;
    e.preventDefault();
    e.currentTarget.setPointerCapture?.(e.pointerId);
    drawing.current = true;
    const pos = getPos(e);
    lastPos.current = pos;
    const ctx = canvasRef.current.getContext("2d");
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, 3.5, 0, Math.PI * 2);
    ctx.fillStyle = "#111";
    ctx.fill();
    setIsEmpty(false);
  };
  const moveDraw = (e) => {
    if (mode !== "draw" || !drawing.current) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const pos = getPos(e);
    ctx.beginPath();
    ctx.moveTo(lastPos.current.x, lastPos.current.y);
    ctx.lineTo(pos.x, pos.y);
    ctx.strokeStyle = "#111"; ctx.lineWidth = 5; ctx.lineCap = "round"; ctx.lineJoin = "round";
    ctx.stroke();
    lastPos.current = pos;
    setIsEmpty(false);
  };
  const endDraw = (e) => {
    e?.preventDefault();
    drawing.current = false;
    lastPos.current = null;
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
    setIsEmpty(true); setTyped("");
  };

  const renderTyped = (val) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (val) {
      ctx.font = "italic 72px 'Brush Script MT','Comic Sans MS',cursive";
      ctx.fillStyle = "#000";
      ctx.fillText(val, 32, 190);
    }
    setIsEmpty(!val);
  };

  const handleTypeChange = (val) => { setTyped(val); renderTyped(val); };

  const handleSave = () => {
    if (isEmpty) return;
    onSave(canvasRef.current.toDataURL());
    onClose();
  };

  if (!mounted) return null;

  const modalContent = (
    <div
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
      style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.55)", zIndex:9999, display:"flex", alignItems:"center", justifyContent:"center", padding:16, backdropFilter: "blur(4px)" }}
    >
      <div style={{ background:"#fff", borderRadius:16, width:"100%", maxWidth:640, boxShadow:"0 24px 80px rgba(0,0,0,0.35)", overflow:"hidden" }}>
        <div style={{ background:"linear-gradient(135deg, #0F6E56, #2F79B7)", color:"#fff", padding:"15px 20px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <span style={{ fontWeight:700, fontSize:14, fontFamily:"var(--sans)" }}>Signature</span>
          <button onClick={onClose} style={{ background:"none", border:"none", color:"#fff", fontSize:20, cursor:"pointer", lineHeight:1, padding:0 }}>✕</button>
        </div>
        <div style={{ padding:"16px 18px 14px" }}>
          <div style={{ display:"flex", gap:8, marginBottom:12 }}>
            {["draw","type"].map(m => (
              <button key={m} onClick={() => { setMode(m); clearCanvas(); }}
                style={{ flex:1, padding:"7px 0", borderRadius:7, border:`2px solid ${mode===m?"#1a6e2e":"#ddd"}`, background:mode===m?"#1a6e2e":"#fff", color:mode===m?"#fff":"#555", fontWeight:700, fontSize:12, cursor:"pointer", fontFamily:"inherit" }}>
                {m === "draw" ? "✏️ Draw" : "⌨️ Type"}
              </button>
            ))}
          </div>
          {mode === "type" && (
            <input autoFocus value={typed} onChange={e => handleTypeChange(e.target.value)}
              placeholder="Type your full name..."
              style={{ width:"100%", marginBottom:10, padding:"9px 12px", border:"1.5px solid #ddd", borderRadius:7, fontSize:14, fontFamily:"inherit", boxSizing:"border-box" }} />
          )}
          <div style={{ border:"2px dashed #ccc", borderRadius:8, background:"#fafafa", position:"relative", overflow:"hidden" }}>
            <canvas ref={canvasRef} width={1200} height={440}
              onPointerDown={startDraw} onPointerMove={moveDraw} onPointerUp={endDraw}
              onPointerCancel={endDraw} onPointerLeave={endDraw}
              style={{ display:"block", width:"100%", height:"clamp(190px, 32vh, 250px)", cursor:mode==="draw"?"crosshair":"default", touchAction:"none" }} />
            {isEmpty && (
              <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center", pointerEvents:"none", color:"#ccc", fontSize:13, fontStyle:"italic", fontFamily: "var(--sans)" }}>
                {mode === "draw" ? "Use your finger or mouse to sign here" : "Type above to preview"}
              </div>
            )}
          </div>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginTop:12 }}>
            <button onClick={clearCanvas} style={{ padding:"7px 16px", borderRadius:7, border:"1.5px solid #ddd", background:"#fff", color:"#c00", fontWeight:600, fontSize:12, cursor:"pointer", fontFamily: "var(--sans)" }}>🗑 Clear</button>
            <div style={{ display:"flex", gap:8 }}>
              <button onClick={onClose} style={{ padding:"7px 16px", borderRadius:7, border:"1.5px solid #ddd", background:"#fff", color:"#555", fontWeight:600, fontSize:12, cursor:"pointer", fontFamily: "var(--sans)" }}>Cancel</button>
              <button onClick={handleSave} disabled={isEmpty}
                style={{ padding:"7px 20px", borderRadius:7, border:"none", background:isEmpty?"#ccc":"#1a6e2e", color:"#fff", fontWeight:700, fontSize:12, cursor:isEmpty?"not-allowed":"pointer", fontFamily: "var(--sans)", transition: "background 0.2s" }}>
                ✓ Use Signature
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}

// ── Payment Modal ───────────────────────────────────────────────
function PaymentModal({ name, phone: initialPhone, amount, application, onClose, onSuccess }) {
  const { showToast } = useToast();
  const [phone, setPhone] = useState(initialPhone);
  const [email, setEmail] = useState("");
  const [paymentAmount, setPaymentAmount] = useState(String(amount));
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState("input"); // input -> loading -> success
  const [loadingMsg, setLoadingMsg] = useState("Awaiting M-PESA PIN...");
  const [mounted, setMounted] = useState(false);
  const pollRef = useRef(null);
  const idempotencyKeyRef = useRef(null);

  useEffect(() => {
    setMounted(true);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
      if (pollRef.current) clearTimeout(pollRef.current);
    };
  }, []);

  // Simple phone validation for M-PESA (07XX, 01XX, or 2547XX, 2541XX)
  const isValidPhone = (p) => /^(\+?254|0)[17]\d{8}$/.test(p.replace(/\s/g, ""));

  const handlePay = async (e) => {
    e.preventDefault();
    if (loading) return;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      showToast("Please enter a valid email address to receive the receipt and application copy.", "warning");
      return;
    }
    if (!isValidPhone(phone)) {
      showToast("Enter a valid M-PESA phone number, for example 0712345678.", "warning");
      return;
    }
    const numericAmount = Number(paymentAmount);
    if (!Number.isFinite(numericAmount) || numericAmount < 1) {
      showToast("Enter a valid payment amount of at least KSh 1.", "warning");
      return;
    }
    
    setLoading(true);
    setStep("loading");
    setLoadingMsg("Awaiting M-PESA PIN...");
    
    // Generate a fresh idempotency key for every attempt so the user actually gets a new STK push if they retry.
    // Fallback for mobile browsers testing on local network (non-HTTPS) where crypto.randomUUID is undefined.
    const generateId = () => {
      if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
      return 'id-' + Date.now() + '-' + Math.random().toString(36).substring(2, 9);
    };
    idempotencyKeyRef.current = generateId();
    
    try {
      const res = await fetch("/api/stkpush", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone,
          amount: numericAmount,
          idempotencyKey: idempotencyKeyRef.current,
          application,
        })
      });
      const data = await res.json();
      
      if (!res.ok || data.error) {
        throw new Error(data.error || "Payment request failed. Please try again.");
      }
      
      // Mock mode (no M-PESA credentials) — simulate success after delay
      if (data.mock) {
        setTimeout(() => {
          setStep("success");
          setTimeout(() => onSuccess(email, {
            paymentReference: data.CheckoutRequestID,
            paymentDate: new Date().toISOString(),
            paymentPhone: phone,
            amount: numericAmount,
            checkoutRequestId: data.CheckoutRequestID,
          }), 2000);
        }, 3000);
        return;
      }
      
      // Real mode — poll for callback confirmation
      const checkoutId = data.CheckoutRequestID;
      const maxAttempts = 20;
      let attempts = 0;

      // Helper to cleanly stop polling and return to input
      const stopPolling = (msg, type = "error") => {
        clearTimeout(pollRef.current);
        pollRef.current = null;
        if (msg) showToast(msg, type);
        setStep("input");
        setLoading(false);
      };
      
      const pollStatus = async () => {
        attempts++;
        try {
          const statusRes = await fetch(`/api/mpesa-status?CheckoutRequestID=${checkoutId}`);
          const statusText = await statusRes.text();
          let statusData;
          try {
            statusData = JSON.parse(statusText);
          } catch {
            statusData = {
              status: "service_error",
              message: "M-PESA verification returned an invalid server response.",
            };
          }

          // ── Terminal success ──────────────────────────────────
          if (statusData.status === "success") {
            clearTimeout(pollRef.current);
            pollRef.current = null;
            setStep("success");
            setTimeout(() => onSuccess(email, statusData), 2000);
            return;
          }

          // ── Payment confirmed but waiting for M-Pesa receipt number ──
          if (statusData.status === "confirming_receipt") {
            setLoadingMsg("Payment confirmed! Waiting for M-PESA receipt...");
            // Keep polling – receipt usually arrives within the next poll
            if (attempts >= maxAttempts / 2) {
              // If we've waited half the max time and still no webhook, proceed anyway. Daraja confirmed it.
              clearTimeout(pollRef.current);
              pollRef.current = null;
              setStep("success");
              setTimeout(() => onSuccess(email, {
                ...statusData,
                paymentReference: statusData.paymentReference || 'AWAITING_RECEIPT'
              }), 2000);
              return;
            }
            pollRef.current = setTimeout(pollStatus, 8000);
            return;
          }

          // ── Payment failed (insufficient balance, cancelled, etc.) ──
          if (statusData.status === "failed") {
            const rawMsg = statusData.message || "";
            
            // SENIOR FIX: If it's a timeout, the user might have paid at the very last second.
            // Safaricom Daraja Query returns 1037, but the webhook might still arrive with Success.
            // Do NOT stop polling immediately. Give the webhook time to arrive.
            if ((/timeout/i.test(rawMsg) || /1037/.test(rawMsg)) && attempts < maxAttempts - 2) {
              setLoadingMsg("M-PESA prompt timed out, but we are double-checking if the payment went through...");
              pollRef.current = setTimeout(pollStatus, 8000);
              return;
            }

            let userMsg;
            if (/insufficient/i.test(rawMsg)) {
              userMsg = "Your M-PESA account has insufficient balance. Please top up and try again.";
            } else if (/cancel/i.test(rawMsg) || /1032/.test(rawMsg)) {
              userMsg = "You cancelled the M-PESA prompt. Please try again when ready.";
            } else if (/timeout/i.test(rawMsg) || /1037/.test(rawMsg)) {
              userMsg = "The M-PESA request timed out. Please check your phone and try again.";
            } else {
              userMsg = rawMsg || "M-PESA did not complete the payment. Please try again.";
            }
            stopPolling(userMsg, "error");
            return;
          }

          // ── Service / configuration errors ──────────────────
          if (statusData.status === "configuration_error" || statusData.status === "service_error") {
            stopPolling(
              statusData.message || "M-PESA verification is temporarily unavailable. Please try again later.",
              "error"
            );
            return;
          }

          // ── Still pending — update UI message after a few polls ──
          if (attempts >= 2) {
            setLoadingMsg("Confirming your payment...");
          }

          if (attempts >= maxAttempts) {
            stopPolling(
              "Payment confirmation is taking longer than expected. If you paid, contact the institution with the M-PESA message.",
              "info"
            );
            return;
          }
        } catch {
          if (attempts >= maxAttempts) {
            stopPolling(
              "Payment confirmation timed out. If you paid, please contact the institution.",
              "error"
            );
            return;
          }
        }

        pollRef.current = setTimeout(pollStatus, 15000);
      };

      pollRef.current = setTimeout(pollStatus, 12000);

    } catch (err) {
      console.error(err);
      showToast(err.message || "Payment failed. Please try again.", "error");
      setStep("input");
      setLoading(false);
    }
  };

  if (!mounted) return null;

  const modalContent = (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.65)", zIndex:999999, display:"flex", alignItems:"center", justifyContent:"center", padding:16, backdropFilter: "blur(6px)" }}>
      <div style={{ background:"#fff", borderRadius:16, width:"100%", maxWidth:420, boxShadow:"0 24px 80px rgba(0,0,0,0.4)", overflow:"hidden", position: "relative", maxHeight: "calc(100vh - 40px)", overflowY: "auto" }}>
        {/* Header */}
        <div style={{ background:"linear-gradient(135deg, #0F6E56, #1D9E75)", color:"#fff", padding:"20px", textAlign: "center", position: "sticky", top: 0, zIndex: 10 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", marginBottom: "10px" }}>
            <img src="/kvtc_logo.png" alt="KVTC" className="kvtc-logo-crop" style={{ height: "48px", width: "48px" }} onError={(e) => e.target.style.display='none'} />
            <img src="/cgok-logo.png" alt="CGOK" style={{ height: "44px", objectFit: "contain" }} onError={(e) => e.target.style.display='none'} />
          </div>
          <h3 style={{ margin: 0, fontFamily: "var(--sans)", fontSize: "1.1rem", fontWeight: 700 }}>Application Fee Payment</h3>
          <p style={{ margin: "4px 0 0", fontSize: "12px", opacity: 0.85 }}>Secure M-PESA Payment</p>
        </div>

        {/* Content */}
        <div style={{ padding:"24px" }}>
          {step === "input" && (
            <form onSubmit={handlePay} noValidate>
              <p style={{ fontFamily: "var(--sans)", fontSize: "14px", color: "#555", marginBottom: "20px", textAlign: "center", lineHeight: 1.5 }}>
                To proceed with your application, please pay the non-refundable admission fee of <strong>KSh {amount}</strong> via M-PESA.
              </p>
              
              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", fontFamily: "var(--sans)", fontSize: "13px", fontWeight: 600, color: "#333", marginBottom: "6px" }}>Applicant Name</label>
                <input type="text" value={name} readOnly style={{ width: "100%", padding: "12px", background: "#f5f5f5", border: "1px solid #ddd", borderRadius: "8px", fontFamily: "var(--sans)", color: "#777", boxSizing: "border-box" }} />
              </div>

              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", fontFamily: "var(--sans)", fontSize: "13px", fontWeight: 600, color: "#333", marginBottom: "6px" }}>M-PESA Phone Number <span style={{color: "#e53e3e"}}>*</span></label>
                <input type="tel" required value={phone} onChange={e => setPhone(e.target.value)} placeholder="e.g. 0712345678" style={{ width: "100%", padding: "12px", border: "1.5px solid #0F6E56", borderRadius: "8px", fontFamily: "var(--sans)", color: "#1a1a1a", boxSizing: "border-box", outline: "none" }} />
              </div>

              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", fontFamily: "var(--sans)", fontSize: "13px", fontWeight: 600, color: "#333", marginBottom: "6px" }}>Payment Amount (KSh) <span style={{color: "#e53e3e"}}>*</span></label>
                <input
                  type="number"
                  required
                  min="1"
                  step="1"
                  inputMode="numeric"
                  value={paymentAmount}
                  onChange={e => setPaymentAmount(e.target.value)}
                  style={{ width: "100%", padding: "12px", border: "1.5px solid #0F6E56", borderRadius: "8px", fontFamily: "var(--sans)", color: "#1a1a1a", boxSizing: "border-box", outline: "none" }}
                />
                <p style={{ fontSize: "11px", color: "#b26a00", marginTop: "6px", fontFamily: "var(--sans)", lineHeight: 1.4 }}>Testing only: enter the amount to send in the STK prompt.</p>
              </div>

              <div style={{ marginBottom: "24px" }}>
                <label style={{ display: "block", fontFamily: "var(--sans)", fontSize: "13px", fontWeight: 600, color: "#333", marginBottom: "6px" }}>Email Address <span style={{color: "#e53e3e"}}>*</span></label>
                <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="yourname@example.com" style={{ width: "100%", padding: "12px", border: "1.5px solid #0F6E56", borderRadius: "8px", fontFamily: "var(--sans)", color: "#1a1a1a", boxSizing: "border-box", outline: "none" }} autoFocus />
                <p style={{ fontSize: "11px", color: "#888", marginTop: "6px", fontFamily: "var(--sans)", lineHeight: 1.4 }}>Your official <strong>Admission Letter</strong> and receipt will be sent to this email address.</p>
              </div>

              <div style={{ display: "flex", gap: "12px" }}>
                <button type="button" onClick={onClose} style={{ flex: 1, padding: "14px", background: "#fff", border: "1.5px solid #ddd", borderRadius: "10px", color: "#555", fontWeight: 600, fontFamily: "var(--sans)", cursor: "pointer", transition: "0.2s" }}>Cancel</button>
                <button type="submit" style={{ flex: 2, padding: "14px", background: "#25D366", border: "none", borderRadius: "10px", color: "#fff", fontWeight: 700, fontFamily: "var(--sans)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", boxShadow: "0 4px 14px rgba(37,211,102,0.3)", transition: "transform 0.2s" }} onMouseEnter={e => e.target.style.transform = "translateY(-2px)"} onMouseLeave={e => e.target.style.transform = "translateY(0)"}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
                  Pay KSh {paymentAmount || 0}
                </button>
              </div>
            </form>
          )}

          {step === "loading" && (
            <div style={{ textAlign: "center", padding: "20px 0" }}>
              <div className="spinner" style={{ width: "48px", height: "48px", border: "4px solid rgba(15,110,86,0.2)", borderTopColor: "#0F6E56", borderRadius: "50%", margin: "0 auto 20px", animation: "spin 1s linear infinite" }}></div>
              <h4 style={{ fontFamily: "var(--sans)", fontSize: "1.1rem", color: "#1a1a1a", marginBottom: "8px" }}>{loadingMsg}</h4>
              <p style={{ fontFamily: "var(--sans)", fontSize: "14px", color: "#666", lineHeight: 1.5 }}>
                {loadingMsg === "Awaiting M-PESA PIN..."
                  ? `Please check your phone and enter your M-PESA PIN to complete the payment of KSh ${paymentAmount}.`
                  : loadingMsg === "Payment confirmed! Waiting for M-PESA receipt..."
                  ? "Your payment was received. Fetching your M-PESA receipt number..."
                  : "Please do not close this page. We are waiting for M-PESA to confirm your payment."}
              </p>
              <button
                type="button"
                onClick={() => {
                  clearTimeout(pollRef.current);
                  pollRef.current = null;
                  setStep("input");
                  setLoading(false);
                  setLoadingMsg("Awaiting M-PESA PIN...");
                }}
                style={{ marginTop: "20px", padding: "10px 22px", background: "#fff", border: "1.5px solid #ddd", borderRadius: "8px", color: "#666", fontWeight: 600, fontFamily: "var(--sans)", cursor: "pointer", fontSize: "13px" }}
              >
                Cancel
              </button>
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
          )}


          {step === "success" && (
            <div style={{ textAlign: "center", padding: "20px 0", animation: "fadeIn 0.4s ease" }}>
              <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "#E1F5EE", color: "#0F6E56", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
                <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
              </div>
              <h4 style={{ fontFamily: "var(--sans)", fontSize: "1.2rem", color: "#1a1a1a", marginBottom: "8px" }}>Payment Successful!</h4>
              <p style={{ fontFamily: "var(--sans)", fontSize: "14px", color: "#666", lineHeight: 1.5 }}>Preparing your official Admission Letter...</p>
              <style>{`@keyframes fadeIn { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }`}</style>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}


// ── Date Field ────────────────────────────────────────────────
function DateField({ value, onChange, flex=1, maxWidth=180, required=false }) {
  const ref = useRef();
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const fmt = (v) => {
    if (!v || typeof v !== 'string') return "";
    const parts = v.split("-");
    if (parts.length < 3) return v; // fallback: return raw value
    const [y, m, d] = parts;
    const mnames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    const monthName = mnames[+m - 1];
    return monthName ? `${d} ${monthName} ${y}` : v;
  };

  // Only show the formatted value after client mount to avoid hydration mismatch
  const displayValue = mounted ? (value && typeof value === 'string' ? fmt(value) : "dd mmm yyyy") : "dd mmm yyyy";
  const displayColor = mounted && value ? "#000" : "#bbb";

  return (
    <div style={{ flex:`${flex} 1 auto`, maxWidth, minWidth:70, position:"relative", display:"inline-block" }}
      onClick={() => { try { ref.current.showPicker(); } catch { ref.current.click(); } }}>
      <span suppressHydrationWarning style={{
        display:"block", width:"100%",
        borderBottom:"1.5px dotted #444",
        padding:"0 22px 0 2px", lineHeight:"1.9em",
        fontFamily:"'Times New Roman',serif", fontSize:"inherit",
        color: displayColor, userSelect:"none", cursor:"pointer",
        fontWeight: 400,
      }}>
        {displayValue}
        <span style={{ position:"absolute", right:2, top:"50%", transform:"translateY(-50%)", fontSize:11, color:"#999", pointerEvents:"none" }}>▼</span>
      </span>
      <input ref={ref} type="date" value={value} onChange={e=>onChange(e.target.value)} required={required} aria-required={required}
        style={{ position:"absolute", inset:0, opacity:0, width:"100%", height:"100%", cursor:"pointer", zIndex:1 }} />
    </div>
  );
}

// ── Locked Span ───────────────────────────────────────────────
const Locked = ({ val="", flex=1, maxWidth=160 }) => (
  <span style={{
    display:"inline-block", flex:`${flex} 1 auto`, maxWidth, minWidth:50,
    borderBottom:"1.5px dotted #ccc", background: "rgba(0,0,0,0.03)",
    padding:"0 4px", lineHeight:"1.9em", borderRadius: "2px",
    fontFamily:"'Times New Roman',serif", color:"#888", userSelect:"none",
    cursor: "not-allowed"
  }} title="This field is locked and for official use only.">{val||"\u00A0"}</span>
);

// ── Sig inline display ────────────────────────────────────────
const SigDisplay = ({ value, onClick }) => (
  <span onClick={onClick}
    style={{
      display:"inline-flex", alignItems:"center",
      flex:"1 1 auto", maxWidth:280, minWidth:60,
      borderBottom:"1.5px dotted #444",
      minHeight:"1.9em", cursor:"pointer",
      padding:"0 2px",
    }}>
    {value
      ? <img src={value} alt="sig" style={{ height:28, maxWidth:"100%", display:"block", objectFit:"contain", objectPosition:"left center" }} />
      : <span style={{ color:"#bbb", fontSize:11, fontStyle:"italic" }}>click to sign</span>}
  </span>
);

// ── Reusable helpers (defined outside to prevent remount on every render) ──
const F = {
  border:"none", borderBottom:"1.5px dotted #444",
  outline:"none", background:"transparent",
  fontFamily:"'Times New Roman',serif",
  fontSize:"inherit", color:"#000", fontWeight:400,
  padding:"0 2px 0", lineHeight:"1.9em",
  width:"100%", display:"block",
  scrollMarginTop:"120px",
};
const S = { ...F, cursor:"pointer", appearance:"none", WebkitAppearance:"none" };
const Row = ({children, mt=0}) => (
  <div style={{display:"flex", flexWrap:"wrap", gap:"0 6px", alignItems:"baseline", marginBottom:1, marginTop:mt, lineHeight:"1.9em"}}>
    {children}
  </div>
);
const L = ({t, required=false}) => (
  <span style={{whiteSpace:"nowrap", flexShrink:0, fontFamily:"'Times New Roman',serif"}}>
    {t}{required ? <span style={{ color:"#c62828", fontWeight:700 }}>*</span> : null}
  </span>
);
const GI = ({ value, onChange, max=400, min=60, type="text", placeholder="", required=false }) => (
  <div style={{flex:"1 1 auto", maxWidth:max, minWidth:min}}>
    <input type={type} placeholder={placeholder} value={value || ""} onChange={e => onChange(e.target.value)} required={required} aria-required={required} style={F} />
  </div>
);
const Sec = ({t}) => (
  <div style={{fontWeight:700, textDecoration:"underline", marginTop:10, marginBottom:2, fontFamily:"'Times New Roman',serif"}}>{t}</div>
);

// ═════════════════════════════════════════════════════════════
export default function AdmissionForm({
  dbData,
  selectedCoursePre = "",
  prefilledName = "",
  prefilledPhone = "",
  prefilledIdNo = "",
  prefilledDob = "",
  prefilledHomeAddress = "",
  prefilledResidentialArea = "",
  prefilledKinName = "",
  prefilledKinIdNo = "",
  prefilledKinTel = "",
  prefilledRelationship = "",
  prefilledStartDate = "",
  onApplicationSuccess
}) {
  const { showToast } = useToast();
  const [kvtcLogo, setKvtcLogo] = useState(KVTC_LOGO);
  const [cgokLogo, setCgokLogo] = useState("/cgok-logo.png"); // Use the public folder logo
  const [sigModal, setSigModal] = useState(false);
  const [paymentModal, setPaymentModal] = useState(false);
  const [reviewCourse, setReviewCourse] = useState(null);
  const [confirmedCourse, setConfirmedCourse] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState(() => {
    // If a specific course is being pre-selected (user clicked Apply on a course),
    // ignore any stale localStorage to ensure the correct course is shown.
    if (!selectedCoursePre) {
      try {
        const saved = localStorage.getItem('kvtc_admission_form');
        if (saved) return JSON.parse(saved);
      } catch(e) {}
    } else {
      // Clear stale localStorage so the new course pre-fill always wins
      try { localStorage.removeItem('kvtc_admission_form'); } catch(e) {}
    }
    return {
      name: prefilledName, idNo: prefilledIdNo, dob: prefilledDob, tel: prefilledPhone,
      homeAddress: prefilledHomeAddress, residentialArea: prefilledResidentialArea,
      kinName: prefilledKinName, kinIdNo: prefilledKinIdNo, kinTel: prefilledKinTel,
      relationship: prefilledRelationship,
      course: selectedCoursePre, duration: "", examBody: "", startDate: prefilledStartDate,
      signatureData: "", signDate: "", applicantPhoto: "",
    };
  });
  const prefillAppliedRef = useRef(false);
  const formRef = useRef();
  
  const courseList = dbData?.courses || [];
  const feeStructure = dbData?.feeStructure;
  const admissionAmount = feeStructure?.admissionFees?.[0]?.amount || 500;

  const set = useCallback((k,v) => setForm(f=>({...f,[k]:v})), []);

  useEffect(() => {
    if (prefillAppliedRef.current) return;
    prefillAppliedRef.current = true;

    setForm(current => {
      const next = { ...current };

      // ALWAYS force-apply the course if explicitly provided — never let stale cache win
      if (selectedCoursePre) next.course = selectedCoursePre;

      // Apply other prefill fields only if the field is currently empty
      const otherPrefills = {
        name: prefilledName,
        idNo: prefilledIdNo,
        dob: prefilledDob,
        tel: prefilledPhone,
        homeAddress: prefilledHomeAddress,
        residentialArea: prefilledResidentialArea,
        kinName: prefilledKinName,
        kinIdNo: prefilledKinIdNo,
        kinTel: prefilledKinTel,
        relationship: prefilledRelationship,
        startDate: prefilledStartDate,
      };
      for (const [field, value] of Object.entries(otherPrefills)) {
        if (value && !next[field]) next[field] = value;
      }
      return next;
    });
  }, [
    prefilledName,
    prefilledIdNo,
    prefilledDob,
    prefilledPhone,
    prefilledHomeAddress,
    prefilledResidentialArea,
    prefilledKinName,
    prefilledKinIdNo,
    prefilledKinTel,
    prefilledRelationship,
    selectedCoursePre,
    prefilledStartDate,
  ]);

  useEffect(() => {
    try {
      localStorage.setItem('kvtc_admission_form', JSON.stringify(form));
    } catch(e) {}
  }, [form]);

  // Auto-fill duration and exam body when course changes
  useEffect(() => {
    if (form.course) {
      const selected = courseList.find(c => c.name === form.course);
      if (selected) {
        set("duration", selected.dur || "");
        set("examBody", selected.cert || "");
      }
    }
  }, [form.course, courseList, set]);

  // Set default start date and sign date to today — runs only on client to avoid SSR mismatch
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    set("signDate", today);
    // Only set startDate if not already prefilled via URL param
    setForm(f => ({ ...f, startDate: f.startDate || today }));
  }, [set]);


  const validateForm = () => {
    const requiredFields = [
      ['name', 'full name'],
      ['idNo', 'ID or birth certificate number'],
      ['dob', 'date of birth'],
      ['tel', 'telephone number'],
      ['homeAddress', 'home address'],
      ['residentialArea', 'residential area'],
      ['kinName', 'next of kin name'],
      ['kinIdNo', 'next of kin ID number'],
      ['kinTel', 'next of kin telephone number'],
      ['relationship', 'relationship to trainee'],
      ['course', 'course'],
      ['duration', 'course duration'],
      ['examBody', 'exam body'],
      ['startDate', 'start date'],
      ['signatureData', 'signature'],
      ['signDate', 'signature date'],
      ['applicantPhoto', 'applicant photo'],
    ];
    for (const [field, label] of requiredFields) {
      if (!String(form[field] || '').trim()) {
        showToast(`Please fill in the required ${label} field before proceeding.`, "warning");
        const invalidField = formRef.current?.querySelector(`[data-field="${field}"]`);
        invalidField?.scrollIntoView({ behavior: "smooth", block: "center" });
        invalidField?.focus?.();
        return false;
      }
    }
    
    // Phone number validation (10 digits, starts with 01 or 07)
    const phoneRegex = /^(01|07)\d{8}$/;
    
    const telClean = String(form.tel || '').replace(/\s/g, '');
    if (!phoneRegex.test(telClean)) {
      showToast("Student telephone must be exactly 10 digits and start with 01 or 07.", "warning");
      const invalidField = formRef.current?.querySelector(`[data-field="tel"]`);
      invalidField?.scrollIntoView({ behavior: "smooth", block: "center" });
      invalidField?.focus?.();
      return false;
    }

    const kinTelClean = String(form.kinTel || '').replace(/\s/g, '');
    if (!phoneRegex.test(kinTelClean)) {
      showToast("Next of kin telephone must be exactly 10 digits and start with 01 or 07.", "warning");
      const invalidField = formRef.current?.querySelector(`[data-field="kinTel"]`);
      invalidField?.scrollIntoView({ behavior: "smooth", block: "center" });
      invalidField?.focus?.();
      return false;
    }

    return true;
  };

  const handleNext = () => {
    if (!validateForm()) return;
    if (confirmedCourse !== form.course) {
      const selected = courseList.find(course => course.name === form.course);
      if (selected) setReviewCourse(selected);
      return;
    }
    setPaymentModal(true);
  };

  const handleCourseSelection = (courseName) => {
    const selected = courseList.find(course => course.name === courseName);
    setConfirmedCourse('');
    setForm(current => ({
      ...current,
      course: courseName,
      duration: selected?.dur || '',
      examBody: selected?.cert || '',
    }));
    if (selected) setReviewCourse(selected);
  };

  const handlePhotoChange = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    try {
      set('applicantPhoto', await resizeApplicantPhoto(file));
      showToast('Applicant photo attached successfully.', 'success');
    } catch (error) {
      showToast(error.message, 'warning');
    }
  };

  const handlePaymentSuccess = async (userEmail, payment = {}) => {
    setPaymentModal(false);
    setSubmitting(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const paidAmount = payment.amount || admissionAmount;
    
    try {
      // 1a. Generate the filled Admission Form PDF for the admin
      const formRes = await fetch('/api/admission-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          ...payment,
          paymentAmount: paidAmount,
          paymentPhone: payment.paymentPhone || payment.phone || form.tel,
          email: userEmail,
          pdfType: 'form',
        })
      });
      if (!formRes.ok) throw new Error("Failed to generate Form PDF");
      const formBlob = await formRes.blob();

      // 1b. Generate the Admission Letter PDF for the student
      const letterRes = await fetch('/api/admission-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          ...payment,
          paymentAmount: paidAmount,
          paymentPhone: payment.paymentPhone || payment.phone || form.tel,
          email: userEmail,
          pdfType: 'letter',
        })
      });
      if (!letterRes.ok) throw new Error("Failed to generate Letter PDF");
      const letterBlob = await letterRes.blob();
      
      // 2. Submit to local Nodemailer API
      const fd = new FormData();
      fd.append("name", form.name);
      fd.append("email", userEmail);
      fd.append("phone", form.tel);
      fd.append("course", form.course);
      fd.append("idNo", form.idNo);
      fd.append("homeAddress", form.homeAddress);
      fd.append("kinName", form.kinName);
      fd.append("kinTel", form.kinTel);
      fd.append("admissionAmount", paidAmount);
      fd.append("paymentReference", payment.paymentReference || "");
      fd.append("paymentDate", payment.paymentDate || new Date().toISOString());
      fd.append("paymentPhone", payment.paymentPhone || payment.phone || form.tel);
      fd.append("checkoutRequestId", payment.checkoutRequestId || "");
      
      // Attach both PDF files
      const formFile = new File([formBlob], `AdmissionForm_${form.name.replace(/\s+/g, '_')}.pdf`, { type: 'application/pdf' });
      const letterFile = new File([letterBlob], `Admission_Letter_${form.name.replace(/\s+/g, '_')}.pdf`, { type: 'application/pdf' });
      
      fd.append("formPdf", formFile);
      fd.append("letterPdf", letterFile);
      
      const emailRes = await fetch("/api/submit-application", {
        method: "POST",
        body: fd
      });
      const emailData = await emailRes.json();
      if (!emailRes.ok || !emailData.success) throw new Error(emailData.message || "Failed to submit application");
      
      try { localStorage.removeItem('kvtc_admission_form'); } catch(e) {}
      
      if (onApplicationSuccess) onApplicationSuccess(form.name, userEmail);
      
    } catch (err) {
      console.error(err);
      showToast("There was an issue submitting your application. Please contact the institution.", "error", { duration: 8000 });
      setSubmitting(false);
    }
  };

  // Extract unique exam bodies & durations from db for dropdowns (fallback)
  const DURATIONS = [...new Set(courseList.map(c => c.dur))].filter(Boolean);
  const EXAM_BODIES = [...new Set(courseList.map(c => c.cert))].filter(Boolean);

  return (
    <div style={{fontFamily:"'Times New Roman',serif", background:"#d0cec8", padding:"16px 8px", display:"flex", flexDirection:"column", alignItems:"center", borderRadius: "12px" }}>
      <style>{`
        input,select{font-size:16px!important;} /* prevents iOS zoom/scroll-jump */
        input:focus,select:focus{outline:none!important;box-shadow:none!important;}
        input::placeholder{color:rgba(0,0,0,0.2);}
        .applicant-photo-field{display:flex;align-items:center;gap:16px;margin:7px 0 10px;padding:12px;border:1px solid #cfd8dc;border-radius:10px;background:#fff;font-family:var(--sans);}
        .applicant-photo-preview{width:96px;height:120px;flex-shrink:0;border:1px solid #aebbc1;border-radius:7px;overflow:hidden;background:#f4f7f8;}
        .applicant-photo-preview img{width:100%;height:100%;object-fit:cover;display:block;}
        .applicant-photo-placeholder{height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;color:#829199;font-size:10px;text-transform:uppercase;letter-spacing:.5px;}
        .applicant-photo-copy{flex:1;min-width:0;}
        .applicant-photo-copy strong{display:block;color:#263b47;font-size:13px;margin-bottom:5px;}
        .applicant-photo-copy strong span{color:#d92d20;}
        .applicant-photo-copy p{margin:0 0 10px;color:#72828a;font-size:11px;line-height:1.5;}
        .applicant-photo-copy>div{display:flex;align-items:center;gap:8px;flex-wrap:wrap;}
        .applicant-photo-copy label,.applicant-photo-copy button{padding:8px 13px;border-radius:7px;font:700 11px var(--sans);cursor:pointer;}
        .applicant-photo-copy label{background:#245A87;color:#fff;}
        .applicant-photo-copy button{border:1px solid #d6dde0;background:#fff;color:#b42318;}
        .applicant-photo-copy input{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0);}
        @media(max-width:580px){
          .form-kvtc-logo{width:58px!important;height:58px!important;}
          .form-cgok-logo{width:52px!important;height:52px!important;}
          .form-letterhead{padding:8px 10px 7px!important;}
          .form-letterhead-center{padding:0 5px!important;}
          .county{font-size:6.6pt!important;letter-spacing:.35px!important;}
          .inst{font-size:9pt!important;}
          .dept{font-size:7.5pt!important;}
          .cntc{font-size:7pt!important;}
          .fbody{padding:10px 12px 14px!important;}
          .ftg{grid-template-columns:58px 1fr!important;}
          .applicant-photo-field{align-items:flex-start;gap:12px;padding:10px;}
          .applicant-photo-preview{width:80px;height:100px;}
        }
        @media(max-width:380px){
          .form-kvtc-logo{width:48px!important;height:48px!important;}
          .form-cgok-logo{width:43px!important;height:43px!important;}
          .county{font-size:5.8pt!important;}
          .dept{font-size:6.6pt!important;}
          .inst{font-size:7.8pt!important;}
          .cntc{font-size:6pt!important;}
        }
      `}</style>

      {sigModal && <SignatureModal onSave={v=>set("signatureData",v)} onClose={()=>setSigModal(false)} />}
      {reviewCourse && (
        <CourseRequirementsModal
          course={reviewCourse}
          onChooseAnother={() => {
            setReviewCourse(null);
            setConfirmedCourse('');
            setForm(current => ({ ...current, course: '', duration: '', examBody: '' }));
          }}
          onConfirm={() => {
            setConfirmedCourse(reviewCourse.name);
            setReviewCourse(null);
            showToast(`${reviewCourse.name} selected. Requirements confirmed.`, 'success');
          }}
        />
      )}
      {paymentModal && (
        <PaymentModal
          name={form.name}
          phone={form.tel}
          amount={admissionAmount}
          application={{ name: form.name, idNo: form.idNo, course: form.course }}
          onClose={()=>setPaymentModal(false)}
          onSuccess={handlePaymentSuccess}
        />
      )}
      
      {submitting && (
        <div style={{ position:"fixed", inset:0, background:"rgba(255,255,255,0.9)", zIndex:9999, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", backdropFilter: "blur(8px)" }}>
           <div style={{ background: "#fff", padding: "40px", borderRadius: "24px", boxShadow: "0 12px 40px rgba(0,0,0,0.08)", textAlign: "center", border: "1px solid rgba(0,0,0,0.05)" }}>
             <div className="spinner" style={{ width: "64px", height: "64px", border: "4px solid rgba(15,110,86,0.1)", borderTopColor: "#0F6E56", borderRadius: "50%", margin: "0 auto 24px", animation: "spin 1s cubic-bezier(0.4, 0, 0.2, 1) infinite" }}></div>
             <h3 style={{ fontFamily: "var(--serif)", fontSize: "24px", color: "#1a1a1a", marginBottom: "8px" }}>Finalizing Application</h3>
             <p style={{ fontFamily: "var(--sans)", color: "#666", fontSize: "15px", maxWidth: "260px", margin: "0 auto", lineHeight: 1.5 }}>
               Generating your official documents and sending them securely...
             </p>
           </div>
           <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
        </div>
      )}

      {/* ═══ DOCUMENT ═══ */}
      <div ref={formRef} style={{width:"100%",maxWidth:760,background:"#f4f2ee",border:"1px solid #ccc",boxShadow:"0 4px 32px rgba(0,0,0,0.18)",fontSize:"10.5pt",color:"#000", marginBottom: "24px"}}>

        {/* HEADER */}
        <div className="form-letterhead" style={{display:"flex",alignItems:"center",justifyContent:"space-between",minHeight:92,padding:"8px 18px",borderBottom:"3px solid #2f79b7",background:"#fff"}}>
          <img
            src={kvtcLogo}
            alt="KVTC"
            className="form-kvtc-logo"
            style={{width:86,height:86,objectFit:"cover",objectPosition:"50% 18%",flexShrink:0,marginLeft:-5,marginRight:-5}}
          />
          <div className="form-letterhead-center" style={{flex:1,textAlign:"center",padding:"0 10px"}}>
            <div className="county" style={{fontSize:"10pt",fontWeight:700,color:"#b59b69",letterSpacing:.7,marginBottom:3}}>COUNTY GOVERNMENT OF KIAMBU</div>
            <div className="dept" style={{fontSize:"9.5pt",fontWeight:700,color:"#1a1a1a",marginBottom:1}}>Department Of Education, Gender, Culture &amp; Social Services</div>
            <div className="inst" style={{fontSize:"11pt",fontWeight:900,color:"#4c9daa",letterSpacing:.7,textTransform:"uppercase",marginBottom:5}}>KINOO VOCATIONAL TRAINING CENTRE</div>
            <div className="cntc" style={{fontSize:"8.5pt",color:"#333",marginBottom:1}}>P.O B0X 351-00902, Kikuyu.&nbsp;&nbsp; Tel: 0113582008</div>
            <div className="cntc" style={{fontSize:"8.5pt",color:"#333"}}>Email: <span style={{color:"#0044cc",textDecoration:"underline"}}>kinoovtc@gmail.com</span>&nbsp;&nbsp; www.kinoovtc.ac.ke</div>
          </div>
          <img src={cgokLogo} alt="CGOK" className="form-cgok-logo" style={{width:76,height:76,objectFit:"contain",flexShrink:0}}/>
        </div>

        {/* BODY */}
        <div className="fbody" style={{padding:"12px 22px 16px"}}>
          <div style={{textAlign:"center",fontWeight:900,fontSize:"12pt",textDecoration:"underline",marginBottom:10}}>ADMISSION FORM</div>
          <p style={{fontSize:"10px", color:"#e53e3e", marginBottom: "8px", fontStyle:"italic", textAlign:"center", fontFamily:"var(--sans)"}}>
            All fields marked * are required. Fields with a gray background are locked for official use only.
          </p>

          {/* PERSONAL DETAILS */}
          <Sec t="PART I: PERSONAL DETAILS"/>
          <div data-field="applicantPhoto" tabIndex={-1} className="applicant-photo-field">
            <div className="applicant-photo-preview">
              {form.applicantPhoto
                ? <img src={form.applicantPhoto} alt="Applicant preview" />
                : (
                  <div className="applicant-photo-placeholder">
                    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                      <circle cx="12" cy="8" r="3.2" />
                      <path d="M5.5 20c.7-4 3-6 6.5-6s5.8 2 6.5 6" />
                    </svg>
                    <span>Passport photo</span>
                  </div>
                )}
            </div>
            <div className="applicant-photo-copy">
              <strong>Applicant Photo <span>*</span></strong>
              <p>Attach a clear, recent passport-style photo. JPG, PNG or WebP, maximum 5 MB.</p>
              <div>
                <label htmlFor="applicant-photo">{form.applicantPhoto ? 'Change Photo' : 'Attach Photo'}</label>
                {form.applicantPhoto && (
                  <button type="button" onClick={() => set('applicantPhoto', '')}>Remove</button>
                )}
              </div>
              <input
                id="applicant-photo"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handlePhotoChange}
                required
              />
            </div>
          </div>
          <Row mt={4}>
            <L t="ADM NO"/>
            <Locked flex={1} maxWidth={140}/>
            <L t="&nbsp;&nbsp;DATE&nbsp;"/>
            <Locked flex={1} maxWidth={110}/>
          </Row>
          <Row>
            <L t="NAME (as per ID/Cert)&nbsp;" required/>
            <GI value={form.name} onChange={v => set("name", v)} max={800} min={100} required/>
          </Row>
          <Row>
            <L t="ID NO/BIRTH CERT NO&nbsp;" required/>
            <GI value={form.idNo} onChange={v => set("idNo", v)} max={180} required/>
            <L t="&nbsp;&nbsp;DATE OF BIRTH&nbsp;" required/>
            <DateField value={form.dob} onChange={v=>set("dob",v)} flex={1} required/>
          </Row>
          <Row>
            <L t="TEL NUMBER&nbsp;" required/>
            <GI value={form.tel} onChange={v => set("tel", v)} type="tel" max={250} required/>
          </Row>
          <Row>
            <L t="HOME ADDRESS&nbsp;" required/>
            <GI value={form.homeAddress} onChange={v => set("homeAddress", v)} max={220} required/>
            <L t="&nbsp;&nbsp;RESIDENTIAL AREA&nbsp;" required/>
            <GI value={form.residentialArea} onChange={v => set("residentialArea", v)} max={300} required/>
          </Row>

          {/* NEXT OF KIN */}
          <Sec t="PART II: NEXT OF KIN"/>
          <Row>
            <L t="NAME&nbsp;" required/>
            <GI value={form.kinName} onChange={v => set("kinName", v)} max={800} min={100} required/>
          </Row>
          <Row>
            <L t="ID NO&nbsp;" required/>
            <GI value={form.kinIdNo} onChange={v => set("kinIdNo", v)} max={180} required/>
            <L t="&nbsp;&nbsp;TEL NUMBER&nbsp;" required/>
            <GI value={form.kinTel} onChange={v => set("kinTel", v)} type="tel" max={220} required/>
          </Row>
          <Row>
            <L t="RELATIONSHIP TO TRAINEE&nbsp;" required/>
            <GI value={form.relationship} onChange={v => set("relationship", v)} max={400} required/>
          </Row>

          {/* ADMISSION DETAILS */}
          <Sec t="ADMISSION DETAILS"/>
          <Row>
            <L t="COURSE&nbsp;" required/>
            <div style={{flex:"1 1 auto",minWidth:80, maxWidth:"none"}}>
              <select value={form.course} onChange={e=>handleCourseSelection(e.target.value)} required aria-required="true" style={{...S, whiteSpace:"normal", overflow:"visible"}}>
                <option value="">{"............................................."}</option>
                {courseList.map(c=><option key={c.id} value={c.name}>{c.name}</option>)}
              </select>
            </div>
          </Row>
          <Row>
            <L t="DURATION&nbsp;" required/>
            <div style={{flex:"1 1 auto",maxWidth:340,minWidth:80}}>
              <select value={form.duration} onChange={e=>set("duration",e.target.value)} required aria-required="true" style={S}>
                <option value="">{"............................................."}</option>
                {DURATIONS.map(d=><option key={d} value={d}>{d}</option>)}
              </select>
            </div>
          </Row>
          <Row>
            <L t="EXAM BODY&nbsp;" required/>
            <div style={{flex:"1 1 auto",maxWidth:300,minWidth:80}}>
              <select value={form.examBody} onChange={e=>set("examBody",e.target.value)} required aria-required="true" style={S}>
                <option value="">{"............................................."}</option>
                {EXAM_BODIES.map(b=><option key={b} value={b}>{b}</option>)}
              </select>
            </div>
          </Row>
          <Row>
            <L t="START DATE&nbsp;" required/>
            <DateField value={form.startDate} onChange={v=>set("startDate",v)} flex={1} maxWidth={260} required/>
          </Row>

          {/* DECLARATION */}
          <Sec t="DECLARATION"/>
          <div style={{lineHeight:1.9, marginBottom:4, fontFamily:"'Times New Roman',serif", fontSize:"10.5pt"}}>
            I&nbsp;
            <span style={{
              display:"inline-block", borderBottom:"1.5px dotted #444",
              minWidth:240, padding:"0 6px", fontFamily:"'Times New Roman',serif",
              fontWeight:600, color:"#000", lineHeight:"1.4em", textAlign: "center",
              transform: "translateY(2px)"
            }}>{form.name || "\u00A0"}</span>
            &nbsp;declare that I shall abide by the rules and regulations and be obedient to the management and staff in the institution.
          </div>

          <Row>
            <L t="SIGN&nbsp;" required/>
            <SigDisplay value={form.signatureData} onClick={()=>setSigModal(true)}/>
            <L t="&nbsp;&nbsp;DATE&nbsp;" required/>
            <DateField value={form.signDate} onChange={v=>set("signDate",v)} flex={1} maxWidth={180} required/>
          </Row>

          {/* OFFICIAL USE */}
          <div style={{marginTop:16, paddingTop:8}}>
            <Sec t="OFFICIAL USE"/>
            <Row>
              <L t="NAME OF STUDENT&nbsp;"/>
              <span style={{
                display:"inline-block", flex:"1 1 auto", maxWidth:250, borderBottom:"1.5px dotted #444",
                padding:"0 2px", lineHeight:"1.9em", fontFamily:"'Times New Roman',serif", fontWeight:400, color:"#000",
              }}>{form.name||"\u00A0"}</span>
              <L t="&nbsp;&nbsp;ADMISSION NO&nbsp;"/>
              <Locked flex={1} maxWidth={120}/>
            </Row>
            <Row>
              <L t="ADMISSION DATE&nbsp;"/><Locked flex={2} maxWidth={220}/>
              <L t="&nbsp;&nbsp;SIGN&nbsp;"/>
              <span style={{
                display:"inline-flex", alignItems:"center", flex:"1 1 auto", maxWidth:140, minWidth:50,
                borderBottom:"1.5px dotted #444", minHeight:"1.9em", padding:"0 2px",
              }}>
                {form.signatureData
                  ? <img src={form.signatureData} alt="sig" style={{height:26,maxWidth:"100%",objectFit:"contain",objectPosition:"left center"}}/>
                  : <span style={{color:"#bbb",fontSize:10,fontStyle:"italic"}}>auto-filled</span>}
              </span>
            </Row>
          </div>
        </div>

        {/* FOOTER */}
        <div style={{borderTop:"2.5px solid #1a3a6e",padding:"10px 22px 12px",background:"#ede9e0",fontSize:"9pt"}}>
          <div className="ftg" style={{display:"grid",gridTemplateColumns:"72px 1fr",gap:"3px 8px",lineHeight:1.65}}>
            <span style={{fontWeight:900}}>MISSION:</span>
            <span>To educate and nurture our students to excel in work and in life and to equip them with skills and knowledge to enhance their employability.</span>
            <span style={{fontWeight:900}}>VISION:</span>
            <span>A leading institution that prepares our students to be work ready, life ready and world ready.</span>
            <span style={{fontWeight:900}}>MOTTO:</span>
            <span style={{fontStyle:"italic"}}>&ldquo;Serve with skills.&rdquo;</span>
          </div>
        </div>
      </div>
      
      <button 
        onClick={handleNext}
        style={{
          width: '100%', maxWidth: '760px', padding: '16px', background: '#0F6E56', color: '#fff',
          border: 'none', borderRadius: '12px', fontFamily: 'var(--sans)', fontSize: '16px', fontWeight: 700,
          cursor: 'pointer', transition: 'background 0.2s, transform 0.15s',
          boxShadow: '0 4px 16px rgba(15,110,86,0.3)', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px'
        }}
        onMouseEnter={e => { e.target.style.background = '#1D9E75'; e.target.style.transform = 'translateY(-2px)'; }}
        onMouseLeave={e => { e.target.style.background = '#0F6E56'; e.target.style.transform = 'translateY(0)'; }}
      >
        Proceed to Payment (KSh {admissionAmount})
        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
      </button>

    </div>
  );
}
