"use client";

import { useInView } from "./useInView";
import DownArrow from "./DownArrow";

const stats = [
  { label: "Emails Sent", value: "1.2M" },
  { label: "Reply Rate", value: "3.0%" },
  { label: "Demos Booked", value: "5,473" },
  { label: "Pipeline Value", value: "$14.5M" },
];

export default function Slide3() {
  const { ref, isInView } = useInView();

  return (
    <section
      ref={ref}
      className="relative flex h-screen w-full flex-col items-center justify-center px-4"
    >
      <div
        className={`flex flex-col items-center gap-8 transition-all duration-700 ${
          isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        {/* Mock dashboard card - light-ish on dark */}
        <div className="w-full max-w-xl rounded-xl border border-zinc-300/20 bg-zinc-100/10 p-8 shadow-lg backdrop-blur-sm">
          <div className="mb-6 flex items-center gap-2">
            <div className="h-2.5 w-2.5 rounded-full bg-green-500" />
            <span className="text-sm font-medium text-zinc-400">
              Campaign Overview
            </span>
          </div>
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="flex flex-col gap-1">
                <span className="text-xs uppercase tracking-wider text-zinc-500">
                  {stat.label}
                </span>
                <span className="text-2xl font-semibold text-white">
                  {stat.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-base font-light text-[#ededed]/70">
          This is what your sending platform shows you.
        </p>
      </div>

      <DownArrow />
    </section>
  );
}
