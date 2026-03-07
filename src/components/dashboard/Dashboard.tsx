"use client";

import { useState } from "react";
import { useDashboardData } from "@/lib/data";
import TopBar from "./TopBar";
import RecommendationsTab from "./RecommendationsTab";
import ExploreTab from "./ExploreTab";

type Tab = "recommendations" | "explore";

export default function Dashboard() {
  const { data, loading, error } = useDashboardData();
  const [activeTab, setActiveTab] = useState<Tab>("recommendations");

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#0a0a0a] text-[#666666]">
        Loading dashboard...
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#0a0a0a] text-[#ef4444]">
        Failed to load: {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#ededed]">
      <TopBar
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
      <main>
        {activeTab === "recommendations" && <RecommendationsTab stories={data.stories} />}
        {activeTab === "explore" && <ExploreTab data={data} />}
      </main>
    </div>
  );
}
