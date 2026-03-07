"use client";

import type { Alert } from "@/types/dashboard";
import AlertCard from "./AlertCard";

interface AlertsTabProps {
  alerts: Alert[];
}

export default function AlertsTab({ alerts }: AlertsTabProps) {
  return (
    <div className="space-y-4 p-6 max-w-3xl mx-auto">
      {alerts.map((alert) => (
        <AlertCard key={alert.id} alert={alert} />
      ))}
    </div>
  );
}
