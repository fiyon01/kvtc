"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  X, Send, Trash2, PhoneCall, GraduationCap, ChevronRight, 
  MapPin, Clock, Banknote, ShieldCheck 
} from 'lucide-react';
import AriaHeader from './AriaHeader';
import WelcomeCard from './WelcomeCard';
import QuickActionGrid from './QuickActionGrid';
import LoadingRail from './LoadingRail';
import ResponseRail from './ResponseRail';
import SmartActionButtons from './SmartActionButtons';
import CareerDiscoveryStepper from './Cards/CareerDiscoveryStepper';
import CourseRecommendationCard from './Cards/CourseRecommendationCard';
import CourseRequirementsCard from './Cards/CourseRequirementsCard';
import ApplicationGuideCard from './Cards/ApplicationGuideCard';
import CourseComparisonCard from './Cards/CourseComparisonCard';
import FeeAdvisorCard from './Cards/FeeAdvisorCard';
import WhatsAppHandoffCard from './Cards/WhatsAppHandoffCard';
import IntakeAlertCard from './Cards/IntakeAlertCard';
import ApplicationWizard from './ApplicationWizard';

const STORAGE_KEY = 'aria_chat_history';
const GREETED_KEY = 'aria_greeted';

const getDynamicGreeting = () => {
  const hour = new Date().getHours();
  let timeOfDay = "Good morning";
  if (hour >= 12 && hour < 17) timeOfDay = "Good afternoon";
  else if (hour >= 17) timeOfDay = "Good evening";

  const GREETINGS = [
    `${timeOfDay}! 👋 I'm **ARIA**, your personal admissions guide at Kinoo VTC.\n\nI'm here to help you explore our courses, understand fees, find the right career path, and guide you through the entire admission process.\n\nWhat brings you here today? 😊`,
    `Hello and ${timeOfDay.toLowerCase()}! Welcome to Kinoo VTC 🎓\n\nI'm **ARIA** — think of me as your friendly admissions officer, always here and available 24/7.\n\nWhether you want to know about our courses, fees, how to apply, or which programme suits you best — I've got you covered! Where would you like to start?`,
    `${timeOfDay}! So glad you stopped by 😊\n\nI'm **ARIA**, Kinoo VTC's admissions assistant. I know everything about our programmes, fees, requirements, and career opportunities.\n\nAre you looking to join us, or just exploring your options? Either way — I'm here to help! 💪`
  ];
  return GREETINGS[Math.floor(Math.random() * GREETINGS.length)];
};

export default function AriaAssistant() {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [inputText, setInputText] = useState('');
  const [loaded, setLoaded] = useState(false);
  const [showClearModal, setShowClearModal] = useState(false);
  const chatEndRef = useRef(null);
  
  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Load chat history from localStorage on mount and check for follow-up
  useEffect(() => {
    let parsedMessages = [];
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        parsedMessages = JSON.parse(saved);
        setMessages(parsedMessages);
      }
    } catch (_) {}
    
    setLoaded(true);

    // AI Follow-Up System (Feature 16)
    if (parsedMessages.length > 0) {
      const lastMsg = parsedMessages[parsedMessages.length - 1];
      const timeSinceLastMsg = Date.now() - new Date(lastMsg.timestamp || Date.now()).getTime();
      
      // If the user returns after 5 minutes and hasn't been followed up recently
      if (timeSinceLastMsg > 5 * 60 * 1000 && lastMsg.provider !== 'ARIA Follow-Up') {
        setIsLoading(true);
        setTimeout(() => {
          setIsLoading(false);
          setMessages(prev => [...prev, {
            role: 'assistant',
            response_type: 'text',
            text: `Welcome back! 👋 Are you ready to start your application, or do you have more questions about our courses?`,
            provider: 'ARIA Follow-Up',
            timestamp: new Date().toISOString()
          }]);
        }, 1500);
      }
    }
  }, []);

  // Auto-greet on first visit or when chat is cleared
  useEffect(() => {
    if (!loaded || messages.length > 0) return;
    const alreadyGreeted = sessionStorage.getItem(GREETED_KEY);
    const hasSavedChat = !!localStorage.getItem(STORAGE_KEY);
    if (alreadyGreeted || hasSavedChat) return;

    // Pick a random time-aware greeting
    const greeting = getDynamicGreeting();

    // Show typing indicator briefly, then deliver greeting
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
      setMessages([{
        role: 'assistant',
        response_type: 'text',
        text: greeting,
        provider: 'ARIA'
      }]);
      sessionStorage.setItem(GREETED_KEY, '1');
    }, 1400);

    return () => clearTimeout(timer);
  }, [loaded, messages.length]);

  // Persist chat history to localStorage on every change
  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch (_) {}
  }, [messages, loaded]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (textOverride = null) => {
    const text = textOverride || inputText;
    if (!text.trim()) return;

    const timestamp = new Date().toISOString();
    const newUserMsg = { role: 'user', content: text, timestamp };
    
    setMessages(prev => [...prev, newUserMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/aria/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: text,
          history: messages 
        })
      });
      
      let data;
      if (!response.ok) {
        throw new Error('Backend API failed');
      } else {
        data = await response.json();
      }
      
      // Typing effect: simulate human reading/typing speed based on response length
      const textLength = data.text ? data.text.length : 100;
      const readingDelay = Math.min(1800, Math.max(600, textLength * 5));
      await new Promise(resolve => setTimeout(resolve, readingDelay));

      data.timestamp = new Date().toISOString();
      
      setMessages(prev => [...prev, { role: 'assistant', ...data }]);
    } catch (error) {
      console.error("Chat fetch failed:", error);
      // Absolute final UI fallback (Tier 4) so the app never breaks
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        response_type: 'whatsapp_handoff',
        text: 'ARIA is having trouble connecting right now. You can chat with our human admissions team directly using the buttons below.',
        provider: 'offline',
        timestamp: new Date().toISOString()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAction = (actionType, payload) => {
    // Handle specific actions from buttons or cards
    console.log("Action triggered:", actionType, payload);
    if (actionType === 'start_application') {
      window.location.href = '/apply';
    } else if (actionType === 'send_message') {
      handleSendMessage(payload);
    }
  };

  const handleClearChat = useCallback(() => {
    setShowClearModal(true);
  }, []);

  const confirmClearChat = useCallback(() => {
    setMessages([]);
    localStorage.removeItem(STORAGE_KEY);
    sessionStorage.removeItem(GREETED_KEY); // so she greets again
    setShowClearModal(false);
  }, []);

  const handleWizardComplete = async (formData) => {
    const params = new URLSearchParams({
      skipPre: 'true',
      course: formData.course,
      name: formData.name,
      phone: formData.phone,
      idNo: formData.idNo,
      kinName: formData.kinName,
      kinTel: formData.kinTel
    });
    window.location.href = `/apply?${params.toString()}`;
  };

  // Inline quick-action chips shown after the greeting
  const QUICK_CHIPS = [
    { label: '💰 What are the fees?', msg: 'What are the course fees?' },
    { label: '🎓 Help me choose a course', msg: 'Help me choose a course' },
    { label: '📅 When is the next intake?', msg: 'When is the next intake?' },
    { label: '📋 How do I apply?', msg: 'How do I apply?' },
    { label: '🌍 Which course has best jobs?', msg: 'Which course has the best job opportunities?' },
  ];

  return (
    <div className={`aria-container ${messages.length > 0 ? 'has-messages' : 'empty-chat'}`}>
      {/* LEFT PANEL - Sticky */}
      <div className="aria-left-panel">
        <AriaHeader onClearChat={handleClearChat} hasMessages={messages.length > 0} />
        
        <div className="aria-left-content">
          <WelcomeCard />
          <QuickActionGrid onAction={handleAction} />
          
          <div className="support-notice">
            <p>Need to speak to someone?</p>
            <button className="support-btn" onClick={() => window.location.href = '/contact'}>Contact Admissions</button>
            {messages.length > 0 && (
              <button className="clear-chat-btn" onClick={handleClearChat}>
                <Trash2 size={13} /> Clear conversation
              </button>
            )}
          </div>
        </div>
      </div>

      {/* RIGHT PANEL - Chat Area */}
      <div className="aria-right-panel">
        <div className="chat-history">
          {messages.length === 0 ? (
            <div className="empty-state" />
          ) : (
            messages.map((msg, idx) => (
              <div key={idx} className={`chat-message ${msg.role}`}>
                {msg.role === 'user' ? (
                  <div className="user-bubble-wrapper">
                    <div className="user-bubble">{msg.content}</div>
                    {msg.timestamp && (
                      <div className="msg-timestamp">
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="assistant-response">
                    {msg.response_type === 'course_requirements' ? (
                      <>
                        <ResponseRail data={msg} onAction={handleAction} />
                        <CourseRequirementsCard data={msg} onAction={handleAction} />
                      </>
                    ) : msg.response_type === 'course_recommendation' ? (
                      <CourseRecommendationCard data={msg} onAction={handleAction} />
                    ) : msg.response_type === 'career_discovery' ? (
                      <CareerDiscoveryStepper data={msg} onAction={handleAction} />
                    ) : msg.response_type === 'application_wizard' ? (
                      <>
                        <ResponseRail data={msg} onAction={handleAction} />
                        {/* Only render the interactive wizard for the last wizard message */}
                        {idx === messages.length - 1 && (
                          <ApplicationWizard onComplete={handleWizardComplete} />
                        )}
                      </>
                    ) : msg.response_type === 'application_guide' ? (
                      <>
                        <ResponseRail data={msg} onAction={handleAction} />
                        <ApplicationGuideCard data={msg} onAction={handleAction} />
                      </>
                    ) : msg.response_type === 'course_comparison' ? (
                      <>
                        <ResponseRail data={msg} onAction={handleAction} />
                        <CourseComparisonCard data={msg} onAction={handleAction} />
                      </>
                    ) : msg.response_type === 'fee_advisor' ? (
                      <>
                        <ResponseRail data={msg} onAction={handleAction} />
                        <FeeAdvisorCard data={msg} onAction={handleAction} />
                      </>
                    ) : msg.response_type === 'whatsapp_handoff' ? (
                      <>
                        <ResponseRail data={msg} onAction={handleAction} />
                        <WhatsAppHandoffCard data={msg} onAction={handleAction} />
                      </>
                    ) : msg.response_type === 'intake_alert' ? (
                      <>
                        <ResponseRail data={msg} onAction={handleAction} />
                        <IntakeAlertCard data={msg} onAction={handleAction} />
                      </>
                    ) : (
                      <ResponseRail data={msg} onAction={handleAction} />
                    )}

                    {msg.actions && msg.actions.length > 0 && (
                      <SmartActionButtons actions={msg.actions} onAction={handleAction} />
                    )}

                    {/* Show quick-chip suggestions after the greeting (first message only) */}
                    {idx === 0 && msg.provider === 'ARIA' && messages.length === 1 && (
                      <div className="quick-chips">
                        {QUICK_CHIPS.map((chip, ci) => (
                          <button
                            key={ci}
                            className="quick-chip"
                            onClick={() => handleAction('send_message', chip.msg)}
                          >
                            {chip.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
          
          {isLoading && <LoadingRail />}
          <div ref={chatEndRef} />
        </div>

        {/* INPUT AREA */}
        <div className="chat-input-area">
          <div className="chat-input-wrapper">
            <input 
              type="text" 
              placeholder="Type your message..." 
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(inputText)}
              disabled={isLoading}
            />
            <button onClick={() => handleSendMessage(inputText)} disabled={isLoading || !inputText.trim()}>
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>{/* closes aria-right-panel */}

      {/* Clear Chat Confirmation Modal */}
      {showClearModal && (
        <div className="clear-modal-overlay">
          <div className="clear-modal">
            <Trash2 size={32} color="#e53e3e" style={{ marginBottom: 12 }} />
            <h3>Clear Conversation?</h3>
            <p>Are you sure you want to delete this chat with ARIA? This cannot be undone.</p>
            <div className="clear-modal-actions">
              <button className="btn-cancel" onClick={() => setShowClearModal(false)}>Cancel</button>
              <button className="btn-confirm" onClick={confirmClearChat}>Yes, Clear Chat</button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        /* CLEAR CHAT MODAL STYLES */
        .clear-modal-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0,0,0,0.4);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          animation: fadeIn 0.2s ease;
        }
        .clear-modal {
          background: #fff;
          padding: 24px;
          border-radius: 16px;
          width: 90%;
          max-width: 320px;
          text-align: center;
          box-shadow: 0 10px 40px rgba(0,0,0,0.1);
          animation: scaleUp 0.2s ease;
        }
        .clear-modal h3 {
          margin: 0 0 8px 0;
          font-size: 18px;
          color: #1a1a1a;
        }
        .clear-modal p {
          margin: 0 0 20px 0;
          font-size: 14px;
          color: #666;
          line-height: 1.4;
        }
        .clear-modal-actions {
          display: flex;
          gap: 12px;
        }
        .clear-modal-actions button {
          flex: 1;
          padding: 10px 0;
          border-radius: 8px;
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
          border: none;
          transition: background 0.2s;
        }
        .btn-cancel {
          background: #f1f1f1;
          color: #555;
        }
        .btn-cancel:hover {
          background: #e4e4e4;
        }
        .btn-confirm {
          background: #e53e3e;
          color: white;
        }
        .btn-confirm:hover {
          background: #c53030;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleUp {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }

        .aria-container {
          display: flex;
          height: 100dvh;
          width: 100vw;
          background: #fdfdfc;
          overflow: hidden;
          font-family: var(--font-inter, sans-serif);
        }
        
        /* LEFT PANEL */
        .aria-left-panel {
          width: 35%;
          min-width: 350px;
          max-width: 450px;
          background: #f8f7f4;
          border-right: 1px solid rgba(0,0,0,0.05);
          display: flex;
          flex-direction: column;
          z-index: 10;
        }

        .aria-left-content {
          padding: 24px;
          overflow-y: auto;
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        /* RIGHT PANEL */
        .aria-right-panel {
          flex: 1;
          display: flex;
          flex-direction: column;
          background: #fff;
          position: relative;
        }

        .chat-history {
          flex: 1;
          overflow-y: auto;
          padding: 40px;
          padding-bottom: 120px;
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .chat-message {
          max-width: 85%;
          animation: slideUp 0.3s ease;
        }

        .chat-message.user {
          justify-content: flex-end;
        }

        .user-bubble-wrapper {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          max-width: 85%;
        }

        .user-bubble {
          background: #0F6E56;
          color: white;
          padding: 14px 18px;
          border-radius: 16px 16px 4px 16px;
          font-size: 15px;
          line-height: 1.5;
          box-shadow: 0 4px 12px rgba(15,110,86,0.15);
        }

        .msg-timestamp {
          font-size: 10px;
          color: #aaa;
          margin-top: 6px;
          font-weight: 500;
        }

        .chat-message.assistant {
          justify-content: flex-start;
        }

        .chat-input-area {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 20px 40px;
          background: linear-gradient(to top, #fff 80%, rgba(255,255,255,0));
          z-index: 20;
        }

        .chat-input-wrapper {
          display: flex;
          background: #fff;
          border: 1px solid rgba(0,0,0,0.1);
          border-radius: 30px;
          padding: 8px 8px 8px 24px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.05);
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        
        .chat-input-wrapper:focus-within {
          border-color: #0F6E56;
          box-shadow: 0 10px 30px rgba(15,110,86,0.1);
        }

        .chat-input-wrapper input {
          flex: 1;
          border: none;
          outline: none;
          font-size: 16px;
          color: #1a1a1a;
          background: transparent;
        }

        .chat-input-wrapper button {
          background: #0F6E56;
          color: white;
          border: none;
          width: 44px;
          height: 44px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background 0.2s, transform 0.2s;
        }

        .chat-input-wrapper button:disabled {
          background: #ccc;
          cursor: not-allowed;
        }

        .chat-input-wrapper button:not(:disabled):hover {
          background: #0c5a46;
          transform: scale(1.05);
        }

        .support-notice {
          margin-top: auto;
          background: #fff;
          padding: 20px;
          border-radius: 16px;
          border: 1px solid rgba(0,0,0,0.05);
          text-align: center;
        }

        .support-notice p {
          font-size: 14px;
          color: #555;
          margin-bottom: 12px;
        }

        .support-btn {
          background: transparent;
          color: #0F6E56;
          border: 1.5px solid #0F6E56;
          padding: 10px 20px;
          border-radius: 100px;
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .support-btn:hover {
          background: #0F6E56;
          color: white;
        }

        .clear-chat-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-top: 10px;
          background: transparent;
          border: none;
          color: #aaa;
          font-size: 12px;
          font-weight: 500;
          cursor: pointer;
          padding: 6px 0;
          transition: color 0.2s;
          width: 100%;
          justify-content: center;
        }

        .clear-chat-btn:hover {
          color: #e53e3e;
        }

        /* Quick suggestion chips after greeting */
        .quick-chips {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 14px;
          margin-left: 44px;
          animation: slideUp 0.4s 0.2s both;
        }

        .quick-chip {
          background: #fff;
          border: 1.5px solid rgba(15,110,86,0.25);
          color: #0F6E56;
          border-radius: 100px;
          padding: 8px 14px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          white-space: nowrap;
          box-shadow: 0 2px 8px rgba(15,110,86,0.08);
        }

        .quick-chip:hover {
          background: #0F6E56;
          color: white;
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(15,110,86,0.2);
        }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* MOBILE LAYOUT */
        @media (max-width: 768px) {

          /* ── Base container: full screen column ── */
          .aria-container {
            flex-direction: column;
            height: 100dvh;
            overflow: hidden;
          }

          /* ══════════════════════════════════════
             EMPTY / WELCOME STATE (no messages yet)
             Left panel fills screen; right panel
             shrinks to just the sticky input bar
          ══════════════════════════════════════ */
          .empty-chat .aria-left-panel {
            flex: 1;
            min-height: 0;
            width: 100%;
            max-width: none;
            border-right: none;
            border-bottom: none;
            overflow-y: auto;
            -webkit-overflow-scrolling: touch;
          }

          .empty-chat .aria-right-panel {
            flex: none;
            height: auto;
            border-top: 1px solid rgba(0,0,0,0.06);
          }

          /* Input always visible on welcome screen */
          .empty-chat .chat-history {
            display: none;
          }

          .empty-chat .chat-input-area {
            position: relative;
            padding: 14px 16px calc(14px + env(safe-area-inset-bottom));
            background: #fff;
          }

          /* Contain the support notice so it never clips */
          .support-notice {
            margin-top: 12px;
            padding: 14px 16px;
          }

          .support-notice p {
            font-size: 13px;
            margin-bottom: 10px;
          }

          .support-btn {
            width: 100%;
            padding: 11px 16px;
            font-size: 13px;
          }

          /* ══════════════════════════════════════
             HAS-MESSAGES / CHAT STATE
             Header stays; left panel collapses to
             just the header strip; right panel
             fills remaining height with sticky input
          ══════════════════════════════════════ */
          .has-messages .aria-left-panel {
            flex: none;
            width: 100%;
            max-width: none;
            height: auto;
            border-right: none;
            border-bottom: 1px solid rgba(0,0,0,0.05);
          }

          /* Hide sidebar content, show only the header */
          .has-messages .aria-left-content {
            display: none;
          }

          .has-messages .aria-right-panel {
            flex: 1;
            min-height: 0;
            position: relative;
            display: flex;
            flex-direction: column;
          }

          .has-messages .chat-history {
            flex: 1;
            overflow-y: auto;
            -webkit-overflow-scrolling: touch;
            padding: 20px 16px;
            padding-bottom: 90px;
          }

          /* Pinned input bar above phone home indicator */
          .has-messages .chat-input-area {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            padding: 12px 16px calc(12px + env(safe-area-inset-bottom));
            background: linear-gradient(to top, #fff 85%, rgba(255,255,255,0));
            z-index: 20;
          }

          .chat-message {
            max-width: 95%;
          }

          /* Quick chips scroll horizontally on mobile */
          .quick-chips {
            flex-wrap: nowrap;
            overflow-x: auto;
            margin-left: 0;
            padding-bottom: 4px;
            -webkit-overflow-scrolling: touch;
          }

          .quick-chips::-webkit-scrollbar { display: none; }

          .quick-chip {
            font-size: 12px;
            padding: 7px 12px;
            flex-shrink: 0;
          }
        }
      `}</style>
    </div>
  );
}
