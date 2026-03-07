"use client";

import { useState } from "react";
import type { Meta, DashboardData } from "@/types/dashboard";
import SegmentDetail from "./SegmentDetail";

interface ExploreTabProps {
  data: DashboardData;
}

function buildSegmentKey(industry: string, companySize: string, jobTitle: string): string {
  const i = industry === "All" ? "*" : industry;
  const c = companySize === "All" ? "*" : companySize;
  const j = jobTitle === "All" ? "*" : jobTitle;
  return `${i}::${c}::${j}`;
}

export default function ExploreTab({ data }: ExploreTabProps) {
  const [industry, setIndustry] = useState("All");
  const [companySize, setCompanySize] = useState("All");
  const [jobTitle, setJobTitle] = useState("All");

  const segmentKey = buildSegmentKey(industry, companySize, jobTitle);
  const segment = data.segments[segmentKey] || null;

  return (
    <div className="p-6 max-w-4xl mx-auto">
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
