"use client";

import puter from "@heyputer/puter.js";
import { useState } from "react";
import { Send, Bot, User, Loader2 } from "lucide-react";

export default function AITutor() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const askAI = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;

    setIsLoading(true);
    setAnswer(""); // clear previous answer

    try {
      const response = await puter.ai.chat(
        `You are a friendly KVTC (Kinoo Vocational Training Centre) tutor. Answer clearly and concisely: ${question}`
      );

      setAnswer(response?.message?.content || response);
    } catch (error) {
      console.error("Puter AI error:", error);
      setAnswer("Oops! I had trouble connecting to the network. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="ai-tutor-container">
      <div className="ai-tutor-header">
        <Bot className="ai-icon" size={24} />
        <div>
          <h3>KVTC AI Tutor</h3>
          <p>Powered by Puter.js (GPT-4o)</p>
        </div>
      </div>

      <div className="ai-tutor-body">
        {answer && (
          <div className="ai-response">
            <Bot size={16} className="response-icon" />
            <div className="response-text">{answer}</div>
          </div>
        )}
      </div>

      <form className="ai-tutor-input-area" onSubmit={askAI}>
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask me anything about your studies..."
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading || !question.trim()}>
          {isLoading ? <Loader2 className="spin" size={18} /> : <Send size={18} />}
        </button>
      </form>

      <style jsx>{`
        .ai-tutor-container {
          background: #ffffff;
          border-radius: 16px;
          border: 1px solid #e2e8f0;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05);
          overflow: hidden;
          width: 100%;
          max-width: 450px;
          margin: 20px auto;
          font-family: var(--font-inter, sans-serif);
          display: flex;
          flex-direction: column;
        }

        .ai-tutor-header {
          background: linear-gradient(135deg, #0f6e56 0%, #1d9e75 100%);
          color: white;
          padding: 16px 20px;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .ai-tutor-header h3 {
          margin: 0;
          font-size: 16px;
          font-weight: 600;
        }

        .ai-tutor-header p {
          margin: 0;
          font-size: 12px;
          opacity: 0.8;
        }

        .ai-icon {
          background: rgba(255, 255, 255, 0.2);
          padding: 6px;
          border-radius: 8px;
          width: 36px;
          height: 36px;
        }

        .ai-tutor-body {
          padding: 20px;
          min-height: 100px;
          max-height: 300px;
          overflow-y: auto;
          background: #f8fafc;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
        }

        .ai-response {
          background: white;
          border: 1px solid #e2e8f0;
          padding: 12px 16px;
          border-radius: 12px;
          border-top-left-radius: 2px;
          font-size: 14px;
          color: #334155;
          line-height: 1.5;
          display: flex;
          gap: 12px;
          align-items: flex-start;
          animation: slideUp 0.3s ease-out;
        }

        .response-icon {
          color: #0f6e56;
          margin-top: 2px;
          flex-shrink: 0;
        }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .ai-tutor-input-area {
          padding: 16px;
          background: white;
          border-top: 1px solid #e2e8f0;
          display: flex;
          gap: 8px;
        }

        input {
          flex: 1;
          padding: 12px 16px;
          border: 1px solid #cbd5e1;
          border-radius: 100px;
          outline: none;
          font-size: 14px;
          transition: all 0.2s;
        }

        input:focus {
          border-color: #0f6e56;
          box-shadow: 0 0 0 3px rgba(15, 110, 86, 0.1);
        }

        input:disabled {
          background: #f1f5f9;
          cursor: not-allowed;
        }

        button {
          background: #0f6e56;
          color: white;
          border: none;
          width: 44px;
          height: 44px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
        }

        button:hover:not(:disabled) {
          background: #1d9e75;
          transform: scale(1.05);
        }

        button:disabled {
          background: #94a3b8;
          cursor: not-allowed;
        }

        .spin {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
