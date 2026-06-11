"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";

const ToastContext = createContext(null);

const palette = {
  success: { accent: "#0F6E56", soft: "#E1F5EE", label: "Success" },
  error: { accent: "#B42318", soft: "#FEECEB", label: "Error" },
  warning: { accent: "#9A6700", soft: "#FFF4D6", label: "Attention" },
  info: { accent: "#245A87", soft: "#EDF6FC", label: "Information" },
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const dismiss = useCallback((id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback((message, type = "info", options = {}) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const duration = options.duration ?? (type === "error" ? 6500 : 4500);
    setToasts((current) => [...current.slice(-3), { id, message, type, title: options.title }]);
    if (duration > 0) {
      window.setTimeout(() => dismiss(id), duration);
    }
    return id;
  }, [dismiss]);

  const value = useMemo(() => ({ showToast, dismissToast: dismiss }), [showToast, dismiss]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      {mounted && createPortal(
        <div className="toast-viewport" aria-live="polite" aria-relevant="additions">
          {toasts.map((toast) => {
            const style = palette[toast.type] || palette.info;
            return (
              <div
                key={toast.id}
                className="site-toast"
                role={toast.type === "error" ? "alert" : "status"}
                style={{ "--toast-accent": style.accent, "--toast-soft": style.soft }}
              >
                <span className="toast-mark" aria-hidden="true" />
                <div className="toast-copy">
                  <strong>{toast.title || style.label}</strong>
                  <span>{toast.message}</span>
                </div>
                <button type="button" onClick={() => dismiss(toast.id)} aria-label="Dismiss notification">×</button>
              </div>
            );
          })}
        </div>,
        document.body
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within ToastProvider");
  return context;
}
