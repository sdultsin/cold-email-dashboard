"use client";

import { useInView } from "./useInView";
import DownArrow from "./DownArrow";

const signals = [
  'Your "best" campaign ranks #1 on replies but #4 on revenue',
  "A 5.04% reply rate template generates half the revenue of one with fewer replies",
  "In manufacturing, your most-sent template produces 3x less revenue per send",
  "42% of your segments don't have enough data for real conclusions",
];

export default function Slide4() {
  const { ref, isInView } = useInView();

  return (
    <section
      ref={ref}
      className="relative flex h-screen w-full flex-col items-center justify-center px-4"
    >
      <div className="flex flex-col items-center gap-10 w-full max-w-2xl">
        {/* Signal list - clean, not overlaid */}
        <div className="w-full space-y-4">
          {signals.map((signal, i) => (
            <div
              key={i}
              className="flex items-start gap-4 rounded-lg border border-zinc-800 bg-zinc-900/60 px-6 py-4"
              style={{
                opacity: isInView ? 1 : 0,
                transform: isInView ? "translateY(0)" : "translateY(12px)",
                transition: `opacity 400ms ${i * 200}ms, transform 400ms ${i * 200}ms`,
              }}
            >
              <div className="flex-shrink-0 mt-1.5 w-2 h-2 rounded-full bg-[#3b82f6]" />
              <span className="text-base text-white leading-relaxed">
                {signal}
              </span>
            </div>
          ))}
        </div>

        <p
          className="max-w-lg text-center text-base font-light text-[#ededed]/70"
          style={{
            opacity: isInView ? 1 : 0,
            transition: `opacity 600ms ${signals.length * 200 + 400}ms`,
          }}
        >
          Every campaign generates dozens of signals you&apos;re not seeing.
          You&apos;re making decisions based on one.
        </p>
      </div>

      <DownArrow />
    </section>
  );
}
