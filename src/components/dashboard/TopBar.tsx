"use client";

type Tab = "recommendations" | "explore";

interface TopBarProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

const tabs: { key: Tab; label: string }[] = [
  { key: "recommendations", label: "Recommendations" },
  { key: "explore", label: "Explore" },
];

export default function TopBar({
  activeTab,
  onTabChange,
}: TopBarProps) {
  return (
    <div className="sticky top-0 z-30 bg-[#0a0a0a] border-b border-[#222222]">
      <div className="flex items-center px-6 py-3">
        <div className="flex gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => onTabChange(tab.key)}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors cursor-pointer ${
                activeTab === tab.key
                  ? "bg-[#141414] text-[#ededed] border border-[#222222]"
                  : "text-[#888888] hover:text-[#ededed]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
