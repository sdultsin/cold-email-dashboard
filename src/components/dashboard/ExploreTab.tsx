"use client";

import { useState, useRef, useEffect } from "react";
import type { DashboardData } from "@/types/dashboard";
import SegmentDetail from "./SegmentDetail";
import ChatMessage from "@/components/chat/ChatMessage";
import StarterChips from "@/components/chat/StarterChips";

interface ExploreTabProps {
  data: DashboardData;
}

function buildSegmentKey(industry: string, companySize: string, jobTitle: string): string {
  const i = industry === "All" ? "*" : industry;
  const c = companySize === "All" ? "*" : companySize;
  const j = jobTitle === "All" ? "*" : jobTitle;
  return `${i}::${c}::${j}`;
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

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function ExploreTab({ data }: ExploreTabProps) {
  const [industry, setIndustry] = useState("All");
  const [companySize, setCompanySize] = useState("All");
  const [jobTitle, setJobTitle] = useState("All");

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = (text: string) => {
    const response = CANNED_RESPONSES[text] ?? DEFAULT_RESPONSE;
    setMessages((prev) => [
      ...prev,
      { role: "user", content: text },
      { role: "assistant", content: response },
    ]);
    setInput("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    sendMessage(input.trim());
  };

  const segmentKey = buildSegmentKey(industry, companySize, jobTitle);
  const segment = data.segments[segmentKey] || null;

  return (
    <div className="flex gap-0 h-[calc(100vh-60px)]">
      {/* Left panel: data + filters (70%) */}
      <div className="w-[70%] overflow-y-auto p-6 border-r border-[#222222]">
        {/* Selectors */}
        <div className="flex gap-3 mb-6 flex-wrap">
          <Dropdown
            label="Industry"
            value={industry}
            onChange={setIndustry}
            options={data.meta.industries}
          />
          <Dropdown
            label="Company Size"
            value={companySize}
            onChange={setCompanySize}
            options={data.meta.company_sizes}
          />
          <Dropdown
            label="Job Title Group"
            value={jobTitle}
            onChange={setJobTitle}
            options={data.meta.job_title_groups}
          />
        </div>

        <div className="text-xs text-[#555555] mb-4 font-mono">{segmentKey}</div>

        <SegmentDetail
          segment={segment}
          segmentKey={segmentKey}
          overrides={data.override_log}
          templateMap={data.templates}
        />
      </div>

      {/* Right panel: chat (30%) */}
      <div className="w-[30%] flex flex-col bg-[#111111]">
        {/* Header */}
        <div className="px-4 py-3 border-b border-[#222222]">
          <h2 className="text-sm font-semibold text-[#ededed]">Campaign Intelligence</h2>
        </div>

        {/* Messages area */}
        <div className="flex-1 overflow-y-auto px-3 py-3">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4">
              <p className="text-xs text-[#888] text-center px-2">
                Ask about your campaign performance
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
          className="border-t border-[#222222] px-3 py-2 flex gap-2"
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
            className="bg-[#3b82f6] hover:bg-[#2563eb] text-white rounded-lg px-3 py-2 text-sm font-medium transition-colors cursor-pointer"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}

function Dropdown({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs text-[#666666]">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-[#141414] border border-[#222222] text-[#ededed] text-sm rounded-md px-3 py-1.5 focus:outline-none focus:border-[#3b82f6] transition-colors"
      >
        <option value="All">All</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}
