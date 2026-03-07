"use client";

import { useState } from "react";
import type { Story } from "@/types/dashboard";

const statusConfig = {
  action_needed: { color: "#f59e0b", label: "Action Needed" },
  auto_applied: { color: "#22c55e", label: "Auto-Applied" },
  monitoring: { color: "#3b82f6", label: "Monitoring" },
} as const;

function formatPct(v: number): string {
  return (v * 100).toFixed(2) + "%";
}

function formatDollar(v: number): string {
  return "$" + v.toFixed(2);
}

interface RecommendationCardProps {
  story: Story;
}

export default function RecommendationCard({ story }: RecommendationCardProps) {
  const [status, setStatus] = useState(story.status);
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  const config = statusConfig[status];

  return (
    <div
      className="bg-[#141414] border border-[#222222] rounded-lg p-5 transition-opacity"
      style={{ opacity: dismissed ? 0 : 1 }}
    >
      {/* Status badge */}
      <span
        className="inline-block px-2.5 py-0.5 rounded-full text-xs font-medium mb-3"
        style={{
          backgroundColor: config.color + "20",
          color: config.color,
        }}
      >
        {config.label}
      </span>

      {/* Headline */}
      <h3 className="text-lg font-bold text-[#ededed] mb-4">{story.headline}</h3>

      {/* Evidence block */}
      {story.comparison && <ComparisonBlock comparison={story.comparison} />}
      {story.evidence && !story.comparison && <EvidenceBlock evidence={story.evidence} />}

      {/* Explanation */}
      <p className="text-sm text-[#bbbbbb] mb-3 leading-relaxed">{story.explanation}</p>

      {/* Counterfactual */}
      <p className="text-xs text-[#666666] italic mb-4">{story.counterfactual}</p>

      {/* Action buttons for action_needed */}
      {status === "action_needed" && (
        <div className="flex gap-3">
          <button
            onClick={() => setStatus("auto_applied")}
            className="px-4 py-1.5 text-sm font-medium rounded-md bg-[#3b82f6] text-white hover:bg-[#2563eb] transition-colors"
          >
            Approve
          </button>
          <button
            onClick={() => setDismissed(true)}
            className="px-4 py-1.5 text-sm font-medium rounded-md border border-[#333333] text-[#888888] hover:text-[#ededed] hover:border-[#555555] transition-colors"
          >
            Dismiss
          </button>
        </div>
      )}
    </div>
  );
}

function ComparisonBlock({ comparison }: { comparison: NonNullable<Story["comparison"]> }) {
  const { winner, loser } = comparison;

  // Determine which metrics are available
  const hasDemo = winner.demo_rate != null || loser.demo_rate != null;
  const hasRevenue = winner.revenue_per_send != null || loser.revenue_per_send != null;
  const hasClose = winner.close_rate != null || loser.close_rate != null;

  return (
    <div className="grid grid-cols-2 gap-4 mb-4 p-4 bg-[#0a0a0a] rounded-lg border border-[#1a1a1a]">
      {/* Winner column */}
      <div>
        <div className="text-xs text-[#22c55e] font-medium uppercase tracking-wide mb-2">
          Winner
        </div>
        <div className="text-sm text-[#ededed] font-medium mb-3">{winner.label}</div>
        <div className="space-y-2">
          <MetricRow label="Reply Rate" value={formatPct(winner.reply_rate)} winning />
          {hasDemo && winner.demo_rate != null && (
            <MetricRow label="Demo Rate" value={formatPct(winner.demo_rate)} winning />
          )}
          {hasClose && winner.close_rate != null && (
            <MetricRow label="Close Rate" value={formatPct(winner.close_rate)} winning />
          )}
          {hasRevenue && winner.revenue_per_send != null && (
            <MetricRow
              label="Rev/Send"
              value={formatDollar(winner.revenue_per_send)}
              winning
            />
          )}
          <MetricRow label="Sends" value={winner.n_sends.toLocaleString()} />
        </div>
      </div>

      {/* Loser column */}
      <div>
        <div className="text-xs text-[#ef4444] font-medium uppercase tracking-wide mb-2">
          Loser
        </div>
        <div className="text-sm text-[#ededed] font-medium mb-3">{loser.label}</div>
        <div className="space-y-2">
          <MetricRow label="Reply Rate" value={formatPct(loser.reply_rate)} losing />
          {hasDemo && loser.demo_rate != null && (
            <MetricRow label="Demo Rate" value={formatPct(loser.demo_rate)} losing />
          )}
          {hasClose && loser.close_rate != null && (
            <MetricRow label="Close Rate" value={formatPct(loser.close_rate)} losing />
          )}
          {hasRevenue && loser.revenue_per_send != null && (
            <MetricRow
              label="Rev/Send"
              value={formatDollar(loser.revenue_per_send ?? 0)}
              losing
            />
          )}
          <MetricRow label="Sends" value={loser.n_sends.toLocaleString()} />
        </div>
      </div>
    </div>
  );
}

function MetricRow({
  label,
  value,
  winning,
  losing,
}: {
  label: string;
  value: string;
  winning?: boolean;
  losing?: boolean;
}) {
  const valueColor = winning ? "text-[#22c55e]" : losing ? "text-[#666666]" : "text-[#ededed]";
  return (
    <div className="flex justify-between items-baseline">
      <span className="text-xs text-[#666666]">{label}</span>
      <span className={`text-2xl font-bold ${valueColor}`}>{value}</span>
    </div>
  );
}

function EvidenceBlock({ evidence }: { evidence: NonNullable<Story["evidence"]> }) {
  return (
    <div className="mb-4 p-4 bg-[#0a0a0a] rounded-lg border border-[#1a1a1a]">
      {evidence.segment && (
        <div className="text-xs text-[#888888] mb-2">Segment: {evidence.segment}</div>
      )}
      {evidence.total_sends != null && (
        <div className="text-sm text-[#ededed]">
          Total sends: <span className="font-medium">{evidence.total_sends.toLocaleString()}</span>
        </div>
      )}
      {evidence.reply_events != null && (
        <div className="text-sm text-[#ededed]">
          Reply events: <span className="font-medium">{evidence.reply_events}</span>
        </div>
      )}
      {evidence.templates_tested != null && (
        <div className="text-sm text-[#ededed]">
          Templates tested: <span className="font-medium">{evidence.templates_tested}</span>
        </div>
      )}
      {evidence.data_needed_pct != null && (
        <div className="text-sm text-[#ededed]">
          Data completeness: <span className="font-medium">{evidence.data_needed_pct}%</span>
        </div>
      )}
      {evidence.industries && (
        <div className="mt-2 space-y-1">
          {evidence.industries.map((ind) => (
            <div
              key={ind.industry}
              className="flex items-center justify-between text-sm text-[#ededed]"
            >
              <span className="capitalize">{ind.industry}</span>
              <span className="text-xs text-[#888888]">
                {ind.total_sends.toLocaleString()} sends - {ind.avg_reply_rate}% reply rate
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
