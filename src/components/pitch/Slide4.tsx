"use client";

import { useInView } from "./useInView";
import DownArrow from "./DownArrow";

const stats = [
  { label: "Emails Sent", value: "120,000" },
  { label: "Reply Rate", value: "3.1%" },
  { label: "Demos Booked", value: "312" },
  { label: "Pipeline Value", value: "$2.4M" },
];

const signals = [
  'Your "best" campaign ranks #1 on replies but #6 on revenue',
  "Template 7 gets 7.9% reply rate but $0 in closed deals",
  "Template 4 gets 2.8% replies but generates $30/send - your actual winner",
  "In fintech, your 5th-ranked template produces 3x more revenue than your 1st",
  "Manufacturing: the template booking the most demos isn't the one getting the most replies",
  "43% of your segments don't have enough data for real conclusions",
  'Your November "dip" was seasonal - your optimizations were still working',
  "A template you killed after 2 weeks was trending toward your best performer",
];

export default function Slide4() {
  const { ref, isInView } = useInView();

  return (
    <section
      ref={ref}
      className="relative flex h-screen w-full flex-col items-center justify-center px-4"
    >
      <div className="flex flex-col items-center gap-8">
        {/* Dimmed dashboard card with overlay */}
        <div className="relative w-full max-w-xl">
          {/* The card, dimmed */}
          <div className="rounded-xl border border-zinc-300/20 bg-zinc-100/10 p-8 opacity-30 shadow-lg backdrop-blur-sm">
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

          {/* Signal overlay */}
          <div className="absolute inset-0 flex flex-col justify-center px-6">
            <ul className="space-y-2">
              {signals.map((signal, i) => (
                <li
                  key={i}
                  className="font-mono text-xs leading-snug text-green-400"
                  style={{
                    opacity: isInView ? 1 : 0,
                    transform: isInView
                      ? "translateY(0)"
                      : "translateY(8px)",
                    transition: `opacity 400ms ${i * 200}ms, transform 400ms ${i * 200}ms`,
                  }}
                >
                  {signal}
                </li>
              ))}
            </ul>
          </div>
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
