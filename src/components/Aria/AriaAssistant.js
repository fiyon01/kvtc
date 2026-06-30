"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  X, Send, Trash2, PhoneCall, GraduationCap, ChevronRight, Clock3, MessageSquareMore, OctagonX,
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
const createMessageId = () =>
  globalThis.crypto?.randomUUID?.() || `aria-${Date.now()}-${Math.random().toString(36).slice(2)}`;

const getDynamicGreeting = () => {
  const hour = new Date().getHours();
  let timeOfDay = "Good morning";
  if (hour >= 12 && hour < 17) timeOfDay = "Good afternoon";
  else if (hour >= 17) timeOfDay = "Good evening";

  const GREETINGS = [
    `${timeOfDay}! 👋 I'm **ARIA**, Kinoo VTC's virtual admissions assistant.\n\nI can help you explore verified course, fee, requirement, and application information.\n\nWhat brings you here today? 😊`,
    `Hello and ${timeOfDay.toLowerCase()}! Welcome to Kinoo VTC 🎓\n\nI'm **ARIA**, the institution's virtual admissions assistant.\n\nI can explain courses, fees, and application steps, then connect you with the admissions team when official confirmation is needed. Where would you like to start?`,
    `${timeOfDay}! So glad you stopped by 😊\n\nI'm **ARIA**, Kinoo VTC's virtual admissions assistant. I answer from the institution's approved course and admissions information.\n\nAre you looking to join, or just exploring your options?`
  ];
  return GREETINGS[Math.floor(Math.random() * GREETINGS.length)];
};

export default function AriaAssistant() {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [messageQueue, setMessageQueue] = useState([]);
  const [processingId, setProcessingId] = useState(null);
  const [inputText, setInputText] = useState('');
  const [loaded, setLoaded] = useState(false);
  const [showClearModal, setShowClearModal] = useState(false);
  const chatEndRef = useRef(null);
  const inputRef = useRef(null);
  const messagesRef = useRef([]);
  const mountedRef = useRef(true);
  const abortControllerRef = useRef(null);
  const cancelledIdsRef = useRef(new Set());

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  useEffect(() => () => {
    mountedRef.current = false;
  }, []);
  
  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Load chat history from localStorage on mount and check for follow-up
  useEffect(() => {
    let followUpTimer;
    const hydrateTimer = setTimeout(() => {
      let parsedMessages = [];
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          parsedMessages = JSON.parse(saved);
          setMessages(parsedMessages);
        }
      } catch (_) {}

      setLoaded(true);

      if (parsedMessages.length > 0) {
        const lastMsg = parsedMessages[parsedMessages.length - 1];
        const timeSinceLastMsg = Date.now() - new Date(lastMsg.timestamp || Date.now()).getTime();

        if (timeSinceLastMsg > 5 * 60 * 1000 && lastMsg.provider !== 'ARIA Follow-Up') {
          setIsLoading(true);
          followUpTimer = setTimeout(() => {
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
    }, 0);

    return () => {
      clearTimeout(hydrateTimer);
      clearTimeout(followUpTimer);
    };
  }, []);

  // Auto-greet on first visit or when chat is cleared
  useEffect(() => {
    if (!loaded || messages.length > 0) return;
    const alreadyGreeted = sessionStorage.getItem(GREETED_KEY);
    const hasSavedChat = !!localStorage.getItem(STORAGE_KEY);
    if (alreadyGreeted || hasSavedChat) return;

    // Pick a random time-aware greeting
    const greeting = getDynamicGreeting();

    const loadingTimer = setTimeout(() => setIsLoading(true), 0);
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

    return () => {
      clearTimeout(loadingTimer);
      clearTimeout(timer);
    };
  }, [loaded, messages.length]);

  // Persist chat history to localStorage on every change
  useEffect(() => {
    if (!loaded) return;
    try {
      const completedMessages = messages
        .filter(message => !['queued', 'thinking'].includes(message.status) && !message.isTyping)
        .map(({ status, isTyping, ...message }) => message);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(completedMessages));
    } catch (_) {}
  }, [messages, loaded]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const revealAssistantMessage = useCallback(async (data, sourceMessageId = null) => {
    if (sourceMessageId && cancelledIdsRef.current.has(sourceMessageId)) return;
    const fullText = data.text || '';
    const assistantId = createMessageId();
    const baseMessage = {
      role: 'assistant',
      ...data,
      id: assistantId,
      text: '',
      isTyping: true,
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, baseMessage]);

    if (!fullText) {
      setMessages(prev => prev.map(message =>
        message.id === assistantId ? { ...message, isTyping: false } : message
      ));
      return;
    }

    const chunkSize = Math.max(1, Math.ceil(fullText.length / 90));
    for (let end = chunkSize; end < fullText.length + chunkSize; end += chunkSize) {
      if (
        !mountedRef.current ||
        (sourceMessageId && cancelledIdsRef.current.has(sourceMessageId))
      ) {
        setMessages(prev => prev.filter(message => message.id !== assistantId));
        return;
      }
      const visibleText = fullText.slice(0, Math.min(end, fullText.length));
      setMessages(prev => prev.map(message =>
        message.id === assistantId
          ? { ...message, text: visibleText, isTyping: visibleText.length < fullText.length }
          : message
      ));
      await new Promise(resolve => setTimeout(resolve, 18));
    }
  }, []);

  const processQueuedMessage = useCallback(async (queuedMessage) => {
    const controller = new AbortController();
    let timedOut = false;
    const timeoutId = setTimeout(() => {
      timedOut = true;
      controller.abort();
    }, 28000);
    abortControllerRef.current = controller;
    setProcessingId(queuedMessage.id);
    setIsLoading(true);
    setMessageQueue(prev => prev.filter(item => item.id !== queuedMessage.id));
    setMessages(prev => prev.map(message =>
      message.id === queuedMessage.id ? { ...message, status: 'thinking' } : message
    ));

    const history = messagesRef.current
      .filter(message =>
        message.id !== queuedMessage.id &&
        !['queued', 'thinking'].includes(message.status) &&
        !message.isTyping
      )
      .map(message => ({
        role: message.role,
        content: message.content || message.text || '',
        text: message.text || message.content || '',
      }));

    try {
      const response = await fetch('/api/aria/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          message: queuedMessage.content,
          history,
        }),
      });

      const data = await response.json().catch(() => ({}));
      const responseData = response.ok
        ? data
        : {
            response_type: 'text',
            text: data.error || 'ARIA could not process that request. Please try again.',
            provider: 'ARIA',
          };

      setIsLoading(false);
      await revealAssistantMessage(responseData, queuedMessage.id);
    } catch (error) {
      if ((timedOut || error.name !== 'AbortError') && !cancelledIdsRef.current.has(queuedMessage.id)) {
        console.error('Chat fetch failed:', error);
        setIsLoading(false);
        await revealAssistantMessage({
          response_type: timedOut ? 'text' : 'whatsapp_handoff',
          text: timedOut
            ? 'ARIA is taking longer than expected, so I will not keep you waiting. Please ask again in a shorter phrase, or use the contact options if you need immediate help from admissions.'
            : 'ARIA is having trouble connecting right now. You can contact the admissions team using the options below.',
          provider: timedOut ? 'ARIA Timeout Guard' : 'offline',
        }, queuedMessage.id);
      }
    } finally {
      clearTimeout(timeoutId);
      if (mountedRef.current) {
        const wasCancelled = cancelledIdsRef.current.has(queuedMessage.id);
        setMessages(prev => wasCancelled
          ? prev.filter(message => message.id !== queuedMessage.id)
          : prev.map(message =>
              message.id === queuedMessage.id ? { ...message, status: 'sent' } : message
            )
        );
        cancelledIdsRef.current.delete(queuedMessage.id);
        if (abortControllerRef.current === controller) abortControllerRef.current = null;
        setProcessingId(null);
        setIsLoading(false);
      }
    }
  }, [revealAssistantMessage]);

  useEffect(() => {
    if (!loaded || processingId || messageQueue.length === 0) return;
    const nextMessage = messageQueue[0];
    const startTimer = setTimeout(() => {
      void processQueuedMessage(nextMessage);
    }, 0);
    return () => clearTimeout(startTimer);
  }, [loaded, messageQueue, processingId, processQueuedMessage]);

  const handleSendMessage = useCallback((textOverride = null) => {
    const text = textOverride || inputText;
    if (!text.trim()) return;

    const newUserMsg = {
      id: createMessageId(),
      role: 'user',
      content: text.trim(),
      timestamp: new Date().toISOString(),
      status: 'queued',
    };

    setMessages(prev => [...prev, newUserMsg]);
    setMessageQueue(prev => [...prev, newUserMsg]);
    setInputText('');
  }, [inputText]);

  const removeQueuedMessage = useCallback((messageId) => {
    setMessageQueue(prev => prev.filter(message => message.id !== messageId));
    setMessages(prev => prev.filter(message =>
      message.id !== messageId || message.status !== 'queued'
    ));
  }, []);

  const clearQueuedMessages = useCallback(() => {
    const queuedIds = new Set(messageQueue.map(message => message.id));
    setMessageQueue([]);
    setMessages(prev => prev.filter(message => !queuedIds.has(message.id)));
  }, [messageQueue]);

  const stopCurrentMessage = useCallback(() => {
    if (!processingId) return;
    cancelledIdsRef.current.add(processingId);
    abortControllerRef.current?.abort();
    setIsLoading(false);
  }, [processingId]);

  const focusComposer = useCallback(() => {
    inputRef.current?.focus();
  }, []);

  const handleAction = (actionType, payload) => {
    // Handle specific actions from buttons or cards
    console.log("Action triggered:", actionType, payload);
    if (actionType === 'start_application') {
      const params = new URLSearchParams({ skipPre: 'true' });
      if (payload) params.set('course', payload);
      window.location.href = `/apply?${params.toString()}`;
    } else if (actionType === 'send_message') {
      handleSendMessage(payload);
    }
  };

  const handleClearChat = useCallback(() => {
    setShowClearModal(true);
  }, []);

  const confirmClearChat = useCallback(() => {
    setMessages([]);
    setMessageQueue([]);
    setProcessingId(null);
    setIsLoading(false);
    abortControllerRef.current?.abort();
    cancelledIdsRef.current.clear();
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
      dob: formData.dob,
      homeAddress: formData.homeAddress,
      residentialArea: formData.residentialArea,
      kinName: formData.kinName,
      kinIdNo: formData.kinIdNo,
      kinTel: formData.kinTel,
      relationship: formData.relationship,
      startDate: formData.startDate,
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
              <div key={msg.id || `${msg.role}-${idx}`} className={`chat-message ${msg.role}`}>
                {msg.role === 'user' ? (
                  <div className="user-bubble-wrapper">
                    <div className="user-bubble">{msg.content}</div>
                    <div className="user-message-meta">
                      {msg.status === 'queued' && (
                        <span className="queue-status">
                          <Clock3 size={11} />
                          Queued {Math.max(1, messageQueue.findIndex(item => item.id === msg.id) + 1)}
                        </span>
                      )}
                      {msg.status === 'thinking' && (
                        <span className="queue-status active">
                          <span className="status-dot" />
                          ARIA is thinking
                        </span>
                      )}
                      {msg.status === 'queued' && (
                        <button
                          className="remove-queued"
                          onClick={() => removeQueuedMessage(msg.id)}
                          aria-label={`Remove queued message: ${msg.content}`}
                          title="Remove from queue"
                        >
                          <X size={12} />
                        </button>
                      )}
                      {msg.timestamp && (
                        <span className="msg-timestamp">
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="assistant-response">
                    {msg.isTyping ? (
                      <ResponseRail data={msg} onAction={handleAction} />
                    ) : msg.response_type === 'course_requirements' ? (
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
          {(processingId || messageQueue.length > 0) && (
            <div className="queue-panel" aria-live="polite">
              <div className="queue-summary">
                <span>
                  {processingId ? 'ARIA is answering' : 'Ready'}
                  {messageQueue.length > 0
                    ? ` · ${messageQueue.length} message${messageQueue.length === 1 ? '' : 's'} queued`
                    : ''}
                </span>
                <small>You can steer or manage pending messages.</small>
              </div>
              <div className="queue-controls">
                <button type="button" onClick={focusComposer}>
                  <MessageSquareMore size={13} /> Steer
                </button>
                {processingId && (
                  <button type="button" className="danger" onClick={stopCurrentMessage}>
                    <OctagonX size={13} /> Stop
                  </button>
                )}
                {messageQueue.length > 0 && (
                  <button type="button" onClick={clearQueuedMessages}>
                    <Trash2 size={13} /> Clear queue
                  </button>
                )}
              </div>
            </div>
          )}
          <div className="chat-input-wrapper">
            <input 
              ref={inputRef}
              type="text" 
              placeholder={processingId ? 'Add another message to the queue...' : 'Type your message...'}
              maxLength={600}
              aria-label="Message ARIA virtual admissions assistant"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage(inputText);
                }
              }}
            />
            <button onClick={() => handleSendMessage(inputText)} disabled={!inputText.trim()}>
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
          align-self: flex-end;
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
          font-weight: 500;
        }

        .user-message-meta {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 7px;
          min-height: 20px;
          margin-top: 5px;
        }

        .queue-status {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          color: #7a8790;
          font-size: 10px;
          font-weight: 650;
        }

        .queue-status.active {
          color: #0f6e56;
        }

        .status-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #0f6e56;
          box-shadow: 0 0 0 4px rgba(15, 110, 86, 0.12);
          animation: queuePulse 1.2s ease-in-out infinite;
        }

        .remove-queued {
          display: grid;
          width: 20px;
          height: 20px;
          padding: 0;
          place-items: center;
          border: 1px solid #dce2e5;
          border-radius: 50%;
          background: #fff;
          color: #78858c;
          cursor: pointer;
          transition: border-color 0.2s, color 0.2s, transform 0.2s;
        }

        .remove-queued:hover {
          border-color: #d15a5a;
          color: #bf3f3f;
          transform: scale(1.06);
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

        .queue-panel {
          max-width: calc(100% - 20px);
          margin: 0 auto 8px;
          padding: 8px 10px;
          border: 1px solid #e1e9e6;
          border-radius: 12px;
          background: rgba(248, 251, 250, 0.96);
          box-shadow: 0 4px 14px rgba(24, 55, 47, 0.06);
        }

        .queue-summary {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          color: #52636b;
          font-size: 10px;
          font-weight: 700;
        }

        .queue-summary small {
          color: #89949a;
          font-size: 9px;
          font-weight: 550;
        }

        .queue-controls {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-top: 7px;
        }

        .queue-controls button {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 6px 9px;
          border: 1px solid #d8e3df;
          border-radius: 8px;
          background: #fff;
          color: #405a51;
          font-size: 10px;
          font-weight: 700;
          cursor: pointer;
          transition: border-color 0.2s, background 0.2s, transform 0.2s;
        }

        .queue-controls button:hover {
          border-color: #0f6e56;
          background: #f0f8f5;
          transform: translateY(-1px);
        }

        .queue-controls button.danger {
          border-color: #efd7d7;
          color: #a74343;
        }

        .queue-controls button.danger:hover {
          border-color: #c95959;
          background: #fff5f5;
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

        @keyframes queuePulse {
          0%, 100% { opacity: 0.55; transform: scale(0.9); }
          50% { opacity: 1; transform: scale(1); }
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
            padding-bottom: 125px;
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

          .user-bubble-wrapper {
            max-width: 92%;
          }

          .queue-summary {
            align-items: flex-start;
            flex-direction: column;
            gap: 1px;
          }

          .queue-panel {
            max-width: 100%;
            margin-bottom: 6px;
          }

          .queue-controls button {
            flex: 1;
            justify-content: center;
            min-width: 82px;
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
