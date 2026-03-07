"use client";

import { useInView } from "./useInView";

interface Slide7Props {
  onEnterDashboard: () => void;
}

export default function Slide7({ onEnterDashboard }: Slide7Props) {
  const { ref, isInView } = useInView();

  return (
    <section
      ref={ref}
      className="relative flex h-screen w-full flex-col items-center justify-center px-4"
    >
      <div
        className={`flex max-w-xl flex-col items-center gap-8 text-center transition-all duration-700 ${
          isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        <p className="text-lg leading-relaxed text-[#ededed]/80">
          We ran 120,000 cold emails through 10 industries, 11 company sizes,
          and 7 buyer personas over 12 simulated months.
        </p>

        <p className="text-xl font-medium text-[#ededed]">
          Here&apos;s what the system found.
        </p>

        <button
          onClick={onEnterDashboard}
          className="mt-4 rounded-lg bg-[#3b82f6] px-8 py-3 text-base font-medium text-white transition-all duration-200 hover:bg-[#2563eb] hover:shadow-lg hover:shadow-blue-500/20 active:scale-[0.98]"
        >
          Open Dashboard
        </button>
      </div>
    </section>
  );
}
