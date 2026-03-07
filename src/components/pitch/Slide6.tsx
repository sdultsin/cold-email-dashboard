"use client";

import { useInView } from "./useInView";
import DownArrow from "./DownArrow";

const without = [
  "Optimize for reply rate (the most visible, least reliable metric)",
  "Kill templates too early based on small sample sizes",
  "Miss that your best revenue template has a mediocre reply rate",
  "React to seasonal noise as if your campaigns broke",
  "Treat every segment the same regardless of data quality",
];

const withLoops = [
  "Optimize for revenue per send (the metric that actually matters)",
  "Let templates mature until you have statistically significant data",
  "Find the hidden winners that reply rate alone would never surface",
  "Separate signal from noise with statistical confidence thresholds",
  "Make different decisions for different segments based on data depth",
];

export default function Slide6() {
  const { ref, isInView } = useInView();

  return (
    <section
      ref={ref}
      className="relative flex h-screen w-full flex-col items-center justify-center px-4"
    >
      <div className="grid w-full max-w-4xl gap-6 md:grid-cols-2">
        {/* Without */}
        <div
          className="rounded-lg border border-zinc-800 bg-zinc-900/40 p-6 opacity-50 transition-all duration-700"
          style={{
            opacity: isInView ? 0.5 : 0,
            transform: isInView ? "translateX(0)" : "translateX(-24px)",
          }}
        >
          <h3 className="mb-4 text-lg font-semibold text-zinc-400">
            Without feedback loops
          </h3>
          <ul className="space-y-3">
            {without.map((item, i) => (
              <li
                key={i}
                className="flex gap-2 text-sm text-zinc-500"
                style={{
                  opacity: isInView ? 1 : 0,
                  transition: `opacity 400ms ${300 + i * 150}ms`,
                }}
              >
                <span className="mt-0.5 shrink-0 text-zinc-600">-</span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* With */}
        <div
          className="rounded-lg border border-blue-500/30 bg-zinc-900/60 p-6 transition-all duration-700"
          style={{
            opacity: isInView ? 1 : 0,
            transform: isInView ? "translateX(0)" : "translateX(24px)",
          }}
        >
          <h3 className="mb-4 text-lg font-semibold text-blue-400">
            With feedback loops
          </h3>
          <ul className="space-y-3">
            {withLoops.map((item, i) => (
              <li
                key={i}
                className="flex gap-2 text-sm text-[#ededed]/90"
                style={{
                  opacity: isInView ? 1 : 0,
                  transition: `opacity 400ms ${300 + i * 150}ms`,
                }}
              >
                <span className="mt-0.5 shrink-0 text-blue-400">+</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <p
        className="mt-8 max-w-lg text-center text-base font-light text-[#ededed]/70"
        style={{
          opacity: isInView ? 1 : 0,
          transition: "opacity 600ms 1200ms",
        }}
      >
        The difference isn&apos;t better math. It&apos;s using all the data
        you&apos;re already generating.
      </p>

      <DownArrow />
    </section>
  );
}
