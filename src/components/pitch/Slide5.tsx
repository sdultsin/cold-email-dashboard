"use client";

import { useInView } from "./useInView";
import DownArrow from "./DownArrow";

const layers = [
  {
    title: "Reply Analysis",
    speed: "Days",
    question: "Who's replying? Are they the right replies?",
    insight:
      "Catches negative replies inflating your best campaign",
    borderColor: "border-l-blue-500",
  },
  {
    title: "Demo Analysis",
    speed: "Months",
    question:
      "Who's booking demos? Reply rate was wrong about this.",
    insight:
      "Catches templates that get responses but not meetings",
    borderColor: "border-l-amber-500",
  },
  {
    title: "Revenue Analysis",
    speed: "Quarters",
    question:
      "Who's closing deals? Demo rate was wrong about this too.",
    insight:
      "Catches the template making you money isn't the one you'd pick",
    borderColor: "border-l-green-500",
  },
];

export default function Slide5() {
  const { ref, isInView } = useInView();

  return (
    <section
      ref={ref}
      className="relative flex h-screen w-full flex-col items-center justify-center px-4"
    >
      <div className="flex w-full max-w-2xl flex-col gap-5">
        {/* Section title */}
        <h2
          className="text-sm font-semibold uppercase tracking-widest text-zinc-500 mb-2"
          style={{
            opacity: isInView ? 1 : 0,
            transition: "opacity 400ms",
          }}
        >
          Three Feedback Loops
        </h2>

        {layers.map((layer, i) => (
          <div
            key={layer.title}
            className={`rounded-lg border border-zinc-800 ${layer.borderColor} border-l-4 bg-zinc-900/60 p-6 transition-all duration-500`}
            style={{
              opacity: isInView ? 1 : 0,
              transform: isInView ? "translateX(0)" : "translateX(-24px)",
              transitionDelay: `${i * 200 + 200}ms`,
            }}
          >
            <div className="mb-2 flex items-baseline justify-between">
              <h3 className="text-lg font-semibold text-[#ededed]">
                {layer.title}
              </h3>
              <span className="font-mono text-xs text-zinc-500">
                Speed: {layer.speed}
              </span>
            </div>
            <p className="mb-1 text-sm text-[#ededed]/80">
              {layer.question}
            </p>
            <p className="text-sm italic text-zinc-500">
              {layer.insight}
            </p>
          </div>
        ))}
      </div>

      <p
        className="mt-8 max-w-lg text-center text-base font-light text-[#ededed]/70"
        style={{
          opacity: isInView ? 1 : 0,
          transition: "opacity 600ms 1000ms",
        }}
      >
        Three feedback loops running at different speeds. Each one corrects the
        last. The system compounds knowledge from every send.
      </p>

      <DownArrow />
    </section>
  );
}
