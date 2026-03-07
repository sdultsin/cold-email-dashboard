"use client";

import { useState } from "react";
import type { Alert } from "@/types/dashboard";

const typeConfig = {
  override_explanation: { color: "#3b82f6", label: "Override Explanation" },
  statistical_trap: { color: "#a855f7", label: "Statistical Trap" },
  drift_analysis: { color: "#f59e0b", label: "Drift Analysis" },
  data_quality: { color: "#888888", label: "Data Quality" },
} as const;

interface AlertCardProps {
  alert: Alert;
}

export default function AlertCard({ alert }: AlertCardProps) {
  const [expanded, setExpanded] = useState(false);
  const config = typeConfig[alert.type];

  return (
    <div className="bg-[#141414] border border-[#222222] rounded-lg p-5">
      {/* Type badge */}
      <span
        className="inline-block px-2.5 py-0.5 rounded-full text-xs font-medium mb-3"
        style={{
          backgroundColor: config.color + "20",
          color: config.color,
        }}
      >
        {config.label}
      </span>

      {/* Title */}
      <h3 className="text-base font-bold text-[#ededed] mb-3">{alert.title}</h3>

      {/* Body paragraphs */}
      <div className="space-y-3 mb-4">
        {alert.body.map((paragraph, i) => (
          <p key={i} className="text-sm text-[#bbbbbb] leading-relaxed">
            {paragraph}
          </p>
        ))}
      </div>

      {/* Collapsible technical detail */}
      <div className="border-t border-[#222222] pt-3">
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-xs text-[#666666] hover:text-[#888888] transition-colors flex items-center gap-1"
        >
          <span
            className="inline-block transition-transform"
            style={{ transform: expanded ? "rotate(90deg)" : "rotate(0deg)" }}
          >
            &#9654;
          </span>
          Technical Detail
        </button>
        {expanded && (
          <p className="mt-2 text-xs text-[#555555] font-mono leading-relaxed whitespace-pre-wrap">
            {alert.technical_detail}
          </p>
        )}
      </div>
    </div>
  );
}
