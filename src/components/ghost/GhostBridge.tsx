'use client';

import React from 'react';

const NODES = [
  {
    label: 'Sales Calls',
    description:
      'Talk time is one signal. Objection patterns, close language, and deal velocity tell the real story.',
  },
  {
    label: 'Customer Onboarding',
    description:
      'Completion rate is one signal. Feature adoption, support patterns, and expansion signals tell the real story.',
  },
  {
    label: 'Content Performance',
    description:
      'Page views is one signal. Scroll depth, return visits, and conversion paths tell the real story.',
  },
];

export default function GhostBridge() {
  return (
    <section className="w-full max-w-5xl mx-auto px-6 py-24">
      {/* Headline */}
      <h2 className="text-3xl font-bold text-[#ededed] text-center mb-16">
        This is one workflow.
      </h2>

      {/* Diagram */}
      <div className="flex flex-col items-center gap-0">
        {/* Top node - Cold Email */}
        <div className="relative border-2 border-[#3b82f6] rounded-xl px-8 py-5 bg-[#141414] text-center max-w-md">
          <p className="text-base font-semibold text-[#3b82f6] mb-1">Cold Email Campaigns</p>
          <p className="text-xs text-[#999] leading-relaxed">
            Reply rate is one signal. Demos, deals, and revenue tell the real story.
          </p>
        </div>

        {/* Vertical connector line */}
        <div className="w-px h-10 bg-[#333]" />

        {/* Feedback loops label */}
        <div className="text-xs font-semibold uppercase tracking-widest text-[#666] mb-0">
          Feedback Loops
        </div>

        {/* Vertical connector line */}
        <div className="w-px h-10 bg-[#333]" />

        {/* Branch connector - horizontal line with 3 drops */}
        <div className="relative w-full max-w-3xl">
          {/* Horizontal line */}
          <div className="absolute top-0 left-[16.66%] right-[16.66%] h-px bg-[#333]" />

          {/* Three vertical drop lines */}
          <div className="absolute top-0 left-[16.66%] w-px h-8 bg-[#333]" />
          <div className="absolute top-0 left-[50%] w-px h-8 bg-[#333] -translate-x-px" />
          <div className="absolute top-0 right-[16.66%] w-px h-8 bg-[#333]" />

          {/* Bottom nodes */}
          <div className="grid grid-cols-3 gap-6 pt-8">
            {NODES.map((node) => (
              <div
                key={node.label}
                className="border border-[#222222] rounded-xl px-5 py-4 bg-[#141414] text-center"
              >
                <p className="text-sm font-semibold text-[#ededed] mb-2">{node.label}</p>
                <p className="text-xs text-[#999] leading-relaxed">{node.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Closing copy */}
      <div className="mt-20 max-w-2xl mx-auto space-y-6 text-center">
        <p className="text-sm text-[#999] leading-relaxed">
          The same architecture that finds your hidden best-performing cold email template can find
          hidden patterns in any workflow where surface metrics don't tell the full story.
        </p>
        <p className="text-sm text-[#ededed] leading-relaxed">
          This is what Coworker Ghost does. It watches your workflows, learns what actually drives
          outcomes, and tells you what to do differently. Not a dashboard you stare at. An agent
          that works alongside you.
        </p>
      </div>
    </section>
  );
}
