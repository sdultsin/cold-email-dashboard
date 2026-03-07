"use client";

import type { SystemHealth } from "@/types/dashboard";

type Tab = "recommendations" | "alerts" | "explore" | "the-math";

interface TopBarProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
  onToggleChat: () => void;
  systemHealth: SystemHealth;
}

const tabs: { key: Tab; label: string }[] = [
  { key: "recommendations", label: "Recommendations" },
  { key: "alerts", label: "Alerts" },
  { key: "explore", label: "Explore" },
  { key: "the-math", label: "The Math" },
];

export default function TopBar({
  activeTab,
  onTabChange,
  onToggleChat,
  systemHealth,
}: TopBarProps) {
  return (
    <div className="sticky top-0 z-30 bg-[#0a0a0a] border-b border-[#222222]">
      <div className="flex items-center justify-between px-6 py-3">
        <div className="flex gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => onTabChange(tab.key)}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === tab.key
                  ? "bg-[#141414] text-[#ededed] border border-[#222222]"
                  : "text-[#888888] hover:text-[#ededed]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <button
          onClick={onToggleChat}
          className="p-2 rounded-md text-[#888888] hover:text-[#ededed] hover:bg-[#141414] transition-colors"
          title="Toggle chat"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        </button>
      </div>
      <div className="px-6 pb-2 text-xs text-[#888888] flex items-center gap-3 flex-wrap">
        <span>
          <span className="text-[#22c55e] font-medium">{systemHealth.optimized}</span> segments
          optimized
        </span>
        <span className="text-[#333333]">|</span>
        <span>
          <span className="text-[#f59e0b] font-medium">{systemHealth.stabilizing}</span>{" "}
          stabilizing
        </span>
        <span className="text-[#333333]">|</span>
        <span>
          <span className="text-[#3b82f6] font-medium">{systemHealth.learning}</span> learning
        </span>
        <span className="text-[#333333]">|</span>
        <span>
          <span className="font-medium text-[#ededed]">{systemHealth.overrides_this_quarter}</span>{" "}
          overrides this quarter
        </span>
        <span className="text-[#333333]">|</span>
        <span>
          <span className="font-medium text-[#f59e0b]">{systemHealth.pending_approval}</span>{" "}
          pending approval
        </span>
      </div>
    </div>
  );
}
