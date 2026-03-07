"use client";

import { useState, useRef } from "react";
import PitchDeck from "@/components/pitch/PitchDeck";
import Dashboard from "@/components/dashboard/Dashboard";

export default function Home() {
  const [showDashboard, setShowDashboard] = useState(false);
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
        <div ref={dashboardRef}>
          <Dashboard />
        </div>
      )}
    </main>
  );
}
