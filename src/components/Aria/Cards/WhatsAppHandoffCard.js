"use client";

import React from 'react';
import { Mail, MessageCircle, Phone, ShieldCheck, User } from 'lucide-react';

export default function WhatsAppHandoffCard({ data }) {
  const contact = data?.contact || {};
  const phone = contact.phone || '0113 582 008';
  const secondaryPhone = contact.secondaryPhone || '0748 455 116';
  const email = contact.email || 'kinoovtc@gmail.com';
  const hours = contact.hours || 'Monday-Friday, 8:00 AM-5:00 PM';
  const whatsappNumber = String(contact.whatsapp || phone)
    .replace(/\D/g, '')
    .replace(/^0/, '254');
  const dialNumber = String(phone).replace(/\s/g, '');
  const secondaryDialNumber = String(secondaryPhone).replace(/\s/g, '');
  const whatsappMessage = encodeURIComponent(
    'Hello Kinoo VTC Admissions. I was speaking with ARIA on the website and would like assistance.'
  );

  return (
    <div className="wa-card">
      <div className="wa-header">
        <div className="wa-icon"><User size={20} /></div>
        <div>
          <h4 className="wa-title">Contact Admissions</h4>
          <p className="wa-sub">Choose the option that works best for you</p>
        </div>
      </div>

      <div className="wa-body">
        <div className="availability">
          <ShieldCheck size={15} />
          <span>Official KVTC contacts · {hours}</span>
        </div>

        <p>Get direct help with applications, payments, documents, or course confirmation.</p>

        <div className="wa-actions">
          <a
            className="contact-btn whatsapp-btn"
            href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <MessageCircle size={19} />
            <span><strong>WhatsApp</strong><small>{phone}</small></span>
          </a>

          <a className="contact-btn call-btn" href={`tel:${dialNumber}`}>
            <Phone size={19} />
            <span><strong>Call</strong><small>{phone}</small></span>
          </a>

          <a
            className="contact-btn email-btn"
            href={`mailto:${email}?subject=Kinoo%20VTC%20Admissions%20Enquiry`}
          >
            <Mail size={19} />
            <span><strong>Email</strong><small>{email}</small></span>
          </a>
        </div>

        <p className="alternate">
          Alternative phone: <a href={`tel:${secondaryDialNumber}`}>{secondaryPhone}</a>
        </p>
      </div>

      <style jsx>{`
        .wa-card {
          max-width: 440px;
          margin-top: 10px;
          overflow: hidden;
          border: 1px solid rgba(15, 110, 86, 0.16);
          border-radius: 18px;
          background: #fff;
          box-shadow: 0 10px 30px rgba(20, 48, 65, 0.09);
          animation: slideIn 0.35s cubic-bezier(0.22, 1, 0.36, 1) both;
          font-family: var(--font-inter, system-ui, sans-serif);
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .wa-header {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px;
          border-bottom: 1px solid rgba(15, 110, 86, 0.09);
          background: linear-gradient(135deg, #f5fbf8, #eef6fb);
        }
        .wa-icon {
          display: grid;
          width: 42px;
          height: 42px;
          flex-shrink: 0;
          place-items: center;
          border-radius: 12px;
          background: #dff3ea;
          color: #0f6e56;
        }
        .wa-title { margin: 0 0 2px; color: #15242d; font-size: 16px; font-weight: 750; }
        .wa-sub { margin: 0; color: #6a7882; font-size: 11px; font-weight: 550; }
        .wa-body { padding: 16px; }
        .availability {
          display: flex;
          align-items: center;
          gap: 7px;
          padding: 9px 10px;
          margin-bottom: 12px;
          border-radius: 9px;
          background: #f4f7f9;
          color: #405566;
          font-size: 11px;
          font-weight: 650;
        }
        .wa-body > p {
          margin: 0 0 14px;
          color: #45545e;
          font-size: 13px;
          line-height: 1.55;
        }
        .wa-actions {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 8px;
        }
        .contact-btn {
          display: flex;
          min-width: 0;
          align-items: center;
          gap: 8px;
          padding: 11px 10px;
          border-radius: 11px;
          color: #fff;
          text-decoration: none;
          transition: transform 0.2s, opacity 0.2s;
        }
        .contact-btn span { display: flex; min-width: 0; flex-direction: column; }
        .contact-btn strong { font-size: 12px; line-height: 1.2; }
        .contact-btn small {
          overflow: hidden;
          margin-top: 2px;
          color: rgba(255, 255, 255, 0.84);
          font-size: 9px;
          font-weight: 500;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .whatsapp-btn { background: #178d4c; }
        .call-btn { background: #0f6e56; }
        .email-btn { background: #28649f; }
        .contact-btn:hover { opacity: 0.92; transform: translateY(-1px); }
        .alternate {
          margin: 12px 0 0 !important;
          color: #6a7882 !important;
          font-size: 11px !important;
          text-align: center;
        }
        .alternate a { color: #0f6e56; font-weight: 750; text-decoration: none; }
        @media (max-width: 480px) {
          .wa-actions { grid-template-columns: 1fr; }
          .contact-btn { padding: 12px; }
          .contact-btn strong { font-size: 13px; }
          .contact-btn small { font-size: 10px; }
        }
      `}</style>
    </div>
  );
}
