"use client";

import Image from "next/image";
import { useInView } from "./useInView";
import DownArrow from "./DownArrow";

const leftSignals = [
  "Watch time: 14.2s, 87% completion",
  "Paused at 0:04, product reveal",
  "Replayed 1x",
  "Scroll velocity slowed before stopping",
  "Audio kept on, not muted",
  "Skipped next reel in <1s",
];

const rightSignals = [
  "Profile tap after viewing",
  "Read 3 comments, 8.4s total",
  "Scrolled to comments",
  "Saved to collection",
  "3rd reel from this creator this week",
  "Did not share",
];

export default function Slide2() {
  const { ref, isInView } = useInView();

  return (
    <section
      ref={ref}
      className="relative flex h-screen w-full flex-col items-center justify-center px-4"
    >
      <div className="flex flex-col items-center gap-10">
        {/* Three-column layout: signals - phone - signals */}
        <div className="flex items-center gap-6 lg:gap-10">
          {/* Left signals */}
          <div className="hidden sm:flex w-[260px] flex-col gap-3">
            {leftSignals.map((signal, i) => (
              <div
                key={i}
                className="flex items-center gap-3 justify-end"
                style={{
                  opacity: isInView ? 1 : 0,
                  transform: isInView ? "translateX(0)" : "translateX(-16px)",
                  transition: `opacity 400ms ${i * 150}ms, transform 400ms ${i * 150}ms`,
                }}
              >
                <span className="text-sm text-white text-right leading-tight">
                  {signal}
                </span>
                <div className="flex-shrink-0 w-8 h-px bg-zinc-600" />
              </div>
            ))}
          </div>

          {/* Phone mockup with dimmed image */}
          <div className="relative w-[280px] flex-shrink-0 rounded-[40px] border-[3px] border-zinc-700 bg-black p-2 shadow-2xl">
            {/* Notch */}
            <div className="absolute top-0 left-1/2 z-10 h-6 w-28 -translate-x-1/2 rounded-b-2xl bg-black" />
            {/* Screen */}
            <div className="relative overflow-hidden rounded-[34px]">
              <Image
                src="/images/instagram-reel.png"
                alt="Instagram reel dimmed"
                width={274}
                height={594}
                className="w-full opacity-30"
              />
              {/* Red heart overlay - sized to fit within the white outline heart */}
              <svg
                className="absolute"
                style={{ top: "45.2%", right: "6.2%", width: "16px", height: "16px" }}
                viewBox="0 0 24 24"
                fill="#F44752"
              >
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </div>
          </div>

          {/* Right signals */}
          <div className="hidden sm:flex w-[260px] flex-col gap-3">
            {rightSignals.map((signal, i) => (
              <div
                key={i}
                className="flex items-center gap-3"
                style={{
                  opacity: isInView ? 1 : 0,
                  transform: isInView ? "translateX(0)" : "translateX(16px)",
                  transition: `opacity 400ms ${i * 150}ms, transform 400ms ${i * 150}ms`,
                }}
              >
                <div className="flex-shrink-0 w-8 h-px bg-zinc-600" />
                <span className="text-sm text-white leading-tight">
                  {signal}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile fallback: show signals below phone */}
        <div className="flex sm:hidden flex-col gap-2 px-4">
          {[...leftSignals, ...rightSignals].map((signal, i) => (
            <div
              key={i}
              className="flex items-center gap-2"
              style={{
                opacity: isInView ? 1 : 0,
                transition: `opacity 400ms ${i * 100}ms`,
              }}
            >
              <div className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-zinc-500" />
              <span className="text-sm text-white">{signal}</span>
            </div>
          ))}
        </div>

        <p
          className="max-w-2xl text-center text-base font-light text-[#ededed]/70"
          style={{
            opacity: isInView ? 1 : 0,
            transition: "opacity 600ms 2000ms",
          }}
        >
          Instagram tracked 47 signals from that one interaction and fed them
          back into the algorithm before you swiped to the next reel -
          optimizing what you see with every scroll. Now imagine that feedback
          loop for cold email.
        </p>
      </div>

      <DownArrow />
    </section>
  );
}
