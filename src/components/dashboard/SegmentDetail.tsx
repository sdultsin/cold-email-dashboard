"use client";

import { useState } from "react";
import type { SegmentData, SegmentTemplate, Override, Template } from "@/types/dashboard";

interface SegmentDetailProps {
  segment: SegmentData | null;
  segmentKey: string;
  overrides: Override[];
  templateMap: Record<string, Template>;
}

function getConfidence(t: SegmentTemplate): "High" | "Medium" | "Low" {
  if (t.ci_width_reply < 0.01 && t.data_completeness > 0.8) return "High";
  if (t.ci_width_reply < 0.03 || t.data_completeness > 0.5) return "Medium";
  return "Low";
}

const confidenceColors = {
  High: "text-[#22c55e]",
  Medium: "text-[#f59e0b]",
  Low: "text-[#ef4444]",
};

const learningStatusColors: Record<string, { bg: string; text: string }> = {
  optimized: { bg: "#22c55e20", text: "#22c55e" },
  stabilizing: { bg: "#f59e0b20", text: "#f59e0b" },
  learning: { bg: "#3b82f620", text: "#3b82f6" },
};

const TOP_N = 5;

export default function SegmentDetail({
  segment,
  segmentKey,
  overrides,
  templateMap,
}: SegmentDetailProps) {
  const [showAllTemplates, setShowAllTemplates] = useState(false);
  const [overridesExpanded, setOverridesExpanded] = useState(false);

  if (!segment) {
    return (
      <div className="text-center text-[#666666] py-12 text-sm">
        No data for this segment combination. Try a broader selection.
      </div>
    );
  }

  // Determine learning status from the most common template status
  const statusCounts: Record<string, number> = {};
  segment.templates.forEach((t) => {
    statusCounts[t.learning_status] = (statusCounts[t.learning_status] || 0) + 1;
  });
  const dominantStatus =
    Object.entries(statusCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "learning";
  const statusStyle = learningStatusColors[dominantStatus] || learningStatusColors.learning;

  // Sort templates by revenue_per_send DESC, nulls last
  const rankedTemplates = [...segment.templates].sort((a, b) => {
    if (a.revenue_per_send == null && b.revenue_per_send == null) return 0;
    if (a.revenue_per_send == null) return 1;
    if (b.revenue_per_send == null) return -1;
    return b.revenue_per_send - a.revenue_per_send;
  });

  const visibleTemplates = showAllTemplates ? rankedTemplates : rankedTemplates.slice(0, TOP_N);
  const hasMore = rankedTemplates.length > TOP_N;

  // Own data weight (simplified: avg_data_completeness as proxy)
  const ownWeight = Math.min(segment.avg_data_completeness, 1);

  // Overrides for this segment
  const segOverrides = overrides.filter((o) => o.segment_key === segmentKey);

  // Untested templates (< 20 sends)
  const untested = segment.templates.filter((t) => t.n_sends < 20);

  return (
    <div className="space-y-6">
      {/* Segment health summary */}
      <div className="bg-[#141414] border border-[#222222] rounded-lg p-5">
        <div className="flex items-center gap-3 mb-4 flex-wrap">
          <span
            className="inline-block px-2.5 py-0.5 rounded-full text-xs font-medium capitalize"
            style={{ backgroundColor: statusStyle.bg, color: statusStyle.text }}
          >
            {dominantStatus}
          </span>
          <span className="text-xs text-[#666666]">{segment.data_source}</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-[#ededed]">
              {segment.total_sends.toLocaleString()}
            </div>
            <div className="text-xs text-[#666666]">Total Sends</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-[#ededed]">
              {segment.total_reply_events.toLocaleString()}
            </div>
            <div className="text-xs text-[#666666]">Reply Events</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-[#ededed]">
              {(segment.avg_data_completeness * 100).toFixed(1)}%
            </div>
            <div className="text-xs text-[#666666]">Data Completeness</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-[#ededed]">{segment.template_count}</div>
            <div className="text-xs text-[#666666]">Templates</div>
          </div>
        </div>

        {/* Weight bar */}
        <div className="mt-4">
          <div className="flex justify-between text-xs text-[#666666] mb-1">
            <span>Own data: {(ownWeight * 100).toFixed(0)}%</span>
            <span>Parent model: {((1 - ownWeight) * 100).toFixed(0)}%</span>
          </div>
          <div className="h-1.5 bg-[#222222] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#3b82f6] rounded-full transition-all"
              style={{ width: `${ownWeight * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Template ranking table - top 5 with expand */}
      <div className="bg-[#141414] border border-[#222222] rounded-lg overflow-hidden">
        <div className="px-5 py-3 border-b border-[#222222]">
          <h4 className="text-sm font-medium text-[#ededed]">Template Rankings</h4>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-[#666666] border-b border-[#1a1a1a]">
                <th className="text-left px-4 py-2 font-medium">#</th>
                <th className="text-left px-4 py-2 font-medium">Template</th>
                <th className="text-right px-4 py-2 font-medium">Reply Rate</th>
                <th className="text-right px-4 py-2 font-medium">Demo Rate</th>
                <th className="text-right px-4 py-2 font-medium">Rev/Send</th>
                <th className="text-right px-4 py-2 font-medium">Sends</th>
                <th className="text-right px-4 py-2 font-medium">Confidence</th>
              </tr>
            </thead>
            <tbody>
              {visibleTemplates.map((t, i) => {
                const conf = getConfidence(t);
                const label = templateMap[t.sequence_id]?.label || t.sequence_id;
                return (
                  <tr
                    key={t.sequence_id}
                    className="border-b border-[#1a1a1a] hover:bg-[#1a1a1a] transition-colors"
                  >
                    <td className="px-4 py-2.5 text-[#666666]">{i + 1}</td>
                    <td className="px-4 py-2.5 text-[#ededed]">{label}</td>
                    <td className="px-4 py-2.5 text-right text-[#ededed]">
                      {(t.reply_rate * 100).toFixed(2)}%
                    </td>
                    <td className="px-4 py-2.5 text-right text-[#ededed]">
                      {t.demo_rate != null ? (t.demo_rate * 100).toFixed(2) + "%" : "-"}
                    </td>
                    <td className="px-4 py-2.5 text-right text-[#ededed]">
                      {t.revenue_per_send != null ? "$" + t.revenue_per_send.toFixed(2) : "-"}
                    </td>
                    <td className="px-4 py-2.5 text-right text-[#888888]">
                      {t.n_sends.toLocaleString()}
                    </td>
                    <td className={`px-4 py-2.5 text-right font-medium ${confidenceColors[conf]}`}>
                      {conf}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {hasMore && (
          <button
            onClick={() => setShowAllTemplates(!showAllTemplates)}
            className="w-full px-5 py-2.5 text-xs text-[#3b82f6] hover:text-[#60a5fa] hover:bg-[#1a1a1a] transition-colors cursor-pointer border-t border-[#1a1a1a]"
          >
            {showAllTemplates
              ? "Show top 5"
              : `Show all ${rankedTemplates.length} templates`}
          </button>
        )}
      </div>

      {/* Override history - collapsible */}
      {segOverrides.length > 0 && (
        <div className="bg-[#141414] border border-[#222222] rounded-lg overflow-hidden">
          <button
            onClick={() => setOverridesExpanded(!overridesExpanded)}
            className="w-full flex items-center justify-between px-5 py-3 cursor-pointer hover:bg-[#1a1a1a] transition-colors"
          >
            <h4 className="text-sm font-medium text-[#ededed]">
              Override History
              <span className="ml-2 text-xs text-[#666666] font-normal">
                ({segOverrides.length})
              </span>
            </h4>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#666666"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={`transition-transform ${overridesExpanded ? "rotate-180" : ""}`}
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>
          {overridesExpanded && (
            <div className="px-5 pb-4 space-y-3 border-t border-[#1a1a1a]">
              <div className="pt-3" />
              {segOverrides.map((o) => (
                <div key={o.id} className="flex gap-3 items-start">
                  <div className="text-xs text-[#3b82f6] font-mono whitespace-nowrap mt-0.5">
                    Month {o.month}
                  </div>
                  <div className="text-xs text-[#888888] leading-relaxed">{o.reason}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Untested templates */}
      {untested.length > 0 && (
        <div className="bg-[#141414] border border-[#222222] rounded-lg p-5">
          <h4 className="text-sm font-medium text-[#ededed] mb-3">
            Untested Templates (&lt;20 sends)
          </h4>
          <div className="flex flex-wrap gap-2">
            {untested.map((t) => {
              const label = templateMap[t.sequence_id]?.label || t.sequence_id;
              return (
                <span
                  key={t.sequence_id}
                  className="text-xs px-2.5 py-1 rounded bg-[#0a0a0a] border border-[#222222] text-[#888888]"
                >
                  {label} ({t.n_sends} sends)
                </span>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
