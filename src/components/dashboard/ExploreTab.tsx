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
  const [showSuggestions, setShowSuggestions] = useState(false);
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
    setShowSuggestions(false);
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
              {showSuggestions && (
                <div className="mt-2">
                  <StarterChips onSelect={sendMessage} />
                </div>
              )}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Suggested questions toggle */}
        {messages.length > 0 && (
          <div className="px-3 pt-2">
            <button
              onClick={() => setShowSuggestions(!showSuggestions)}
              className="text-xs text-[#3b82f6] hover:text-[#60a5fa] transition-colors cursor-pointer"
            >
              {showSuggestions ? "Hide suggestions" : "Suggested questions"}
            </button>
          </div>
        )}

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
