'use client';

import React, { useState, useRef, useEffect } from 'react';
import ChatMessage from './ChatMessage';
import StarterChips from './StarterChips';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const CANNED_RESPONSES: Record<string, string> = {
  "What's my best performing template?":
    "Template 4 (Consultative Stat Lead) - $30.02 revenue per send across all segments. But the real answer depends on your segment. In SaaS, Template 7 (Consultative Urgency) dominates at $108.84/send. In fintech, Template 5 (Direct Pain Point) leads at $113.54/send. The system optimizes per-segment, not globally - because what works in manufacturing is different from what works in fintech.",
  "Why did the system override my top campaign?":
    "Template 0 (Consultative Question) had the highest reply rate at 4.15% and received the most volume - 27,923 sends. But reply rate was misleading. Template 4 generates $30.02 in revenue per send vs Template 0's $16.27 - that's 1.85x more revenue despite 33% fewer replies. The system detected this at month 4 through revenue analysis and confirmed it at months 8 and 12 as more deal data matured.",
  "Which segments need more data?":
    "Three industries are significantly underexplored: Trucking (1,482 total sends), Insurance (1,247 sends), and E-commerce (18,072 sends but 0.87% reply rate makes signal extraction very slow). At the specific segment level, trucking enterprise (10,001+ employees) has only 108 sends with 1 reply - any recommendation there is essentially borrowed from the industry-wide model. You'd need roughly 400-500 more sends to start getting confident recommendations.",
  "What should I test next?":
    "Three priorities: First, trucking and insurance need more volume across the board - they're your blind spots. Second, in e-commerce, try more aggressive hooks (pain point, urgency) since the low reply rate means conservative approaches aren't generating enough signal. Third, Template 8 (Casual Urgency) is undertested in enterprise segments - only 3 sends in trucking 10,001+. The parent model suggests casual underperforms in enterprise, but it hasn't been properly tested.",
  "Why is reply rate misleading?":
    "Reply rate counts all replies equally - including 'not interested', 'remove me', and auto-replies. In SaaS, Template 9 has a 7.87% reply rate but $0 in revenue because it attracts tire-kickers, not buyers. Template 7 has 3.55% reply rate but $108.84 revenue per send. That's the difference between measuring activity and measuring outcomes. The system tracks the full cascade: replies, positive replies, demos, deals, and revenue - because each stage corrects the one before it.",
};

const DEFAULT_RESPONSE =
  "I can answer questions about your campaign data, template performance, segment analysis, and system recommendations. Try asking about a specific industry or template, or use one of the suggested questions to get started.";

function getResponse(input: string): string {
  return CANNED_RESPONSES[input] ?? DEFAULT_RESPONSE;
}

export default function ChatDrawer({ isOpen, onClose }: ChatDrawerProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = (text: string) => {
    const userMsg: Message = { role: 'user', content: text };
    const assistantMsg: Message = { role: 'assistant', content: getResponse(text) };
    setMessages((prev) => [...prev, userMsg, assistantMsg]);
    setInput('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    sendMessage(input.trim());
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-[400px] z-50 flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{ backgroundColor: '#111111' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#222222]">
          <h2 className="text-base font-semibold text-[#ededed]">Campaign Intelligence</h2>
          <button
            onClick={onClose}
            className="text-[#888] hover:text-[#ededed] transition-colors text-xl leading-none cursor-pointer"
            aria-label="Close"
          >
            &times;
          </button>
        </div>

        {/* Messages area */}
        <div className="flex-1 overflow-y-auto px-4 py-4">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-6">
              <p className="text-sm text-[#888] text-center px-4">
                Ask a question about your campaign performance, or try one of these:
              </p>
              <StarterChips onSelect={sendMessage} />
            </div>
          ) : (
            <>
              {messages.map((msg, i) => (
                <ChatMessage key={i} role={msg.role} content={msg.content} />
              ))}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Input area */}
        <form
          onSubmit={handleSubmit}
          className="border-t border-[#222222] px-4 py-3 flex gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about your campaigns..."
            className="flex-1 bg-[#1a1a1a] border border-[#333] rounded-lg px-3 py-2 text-sm text-[#ededed] placeholder-[#666] outline-none focus:border-[#3b82f6] transition-colors"
          />
          <button
            type="submit"
            className="bg-[#3b82f6] hover:bg-[#2563eb] text-white rounded-lg px-4 py-2 text-sm font-medium transition-colors cursor-pointer"
          >
            Send
          </button>
        </form>
      </div>
    </>
  );
}
