"use client";

import { useState, useRef } from "react";
import PitchDeck from "@/components/pitch/PitchDeck";
import Dashboard from "@/components/dashboard/Dashboard";
import ChatDrawer from "@/components/chat/ChatDrawer";
import GhostBridge from "@/components/ghost/GhostBridge";

export default function Home() {
  const [showDashboard, setShowDashboard] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const dashboardRef = useRef<HTMLDivElement>(null);

  const handleEnterDashboard = () => {
    setShowDashboard(true);
    setTimeout(() => {
      dashboardRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  return (
    <main className="min-h-screen">
      <PitchDeck onEnterDashboard={handleEnterDashboard} />

      {showDashboard && (
        <>
          <div ref={dashboardRef}>
            <Dashboard chatOpen={chatOpen} onToggleChat={() => setChatOpen(!chatOpen)} />
          </div>
          <GhostBridge />
          <ChatDrawer isOpen={chatOpen} onClose={() => setChatOpen(false)} />
        </>
      )}
    </main>
  );
}
