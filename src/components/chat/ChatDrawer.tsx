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
    "Template 0 (Consultative Question) leads globally at $20.23 revenue per send - but that's misleading because it received 282,290 sends (disproportionately to high-reply segments). The real answer depends on your segment. In SaaS, Template 1 (Direct Social Proof) dominates at $35.53/send. In manufacturing, Template 4 (Consultative Stat Lead) leads at $44.05/send. In fintech, Template 7 (Consultative Urgency) leads at $15.97/send. The system optimizes per-segment, not globally.",
  "Why did the system override my top campaign?":
    "Template 0 (Consultative Question) had the highest reply rate at 4.05% and received the most volume - 282,290 sends. But in specific segments, it's often not the revenue winner. In manufacturing, Template 4 generates $44.05 per send vs Template 0's $15.33 - that's 2.9x more revenue. The system detected these mismatches through Loop 2 demo analysis and Loop 3 revenue analysis, issuing 257 total overrides across all segments.",
  "Which segments need more data?":
    "Three industries have the widest confidence intervals: Trucking (18,083 total sends across all segments but very sparse at the 3-dim level), Insurance (30,246 sends, 1.89% reply rate), and E-commerce (239,018 sends but 0.75% reply rate makes downstream signal extraction very slow). At the specific segment level, trucking enterprise (10,001+ employees) has only 106 sends with 3 replies - any recommendation there is essentially borrowed from the industry-wide model.",
  "What should I test next?":
    "Three priorities: First, trucking needs more volume across the board - it received only 1.5% of total sends. Second, in e-commerce, try more aggressive hooks (pain point, urgency) since the 0.75% reply rate means conservative approaches aren't generating enough downstream signal. Third, insurance enterprise segments remain thin - the parent model suggests certain templates should work but deal data hasn't confirmed it.",
  "Why is reply rate misleading?":
    "Reply rate counts all replies equally - including 'not interested', 'remove me', and auto-replies. In SaaS, Template 6 has a 5.04% reply rate but generates $18.68 per send. Template 1 has only 3.79% reply rate but generates $35.53 per send - nearly 2x the revenue. In manufacturing, the gap is even wider: Template 6 leads replies at 4.59% but Template 4 generates $44.05/send vs Template 6's $6.79. The system tracks the full cascade: replies, positive replies, demos, deals, and revenue.",
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
