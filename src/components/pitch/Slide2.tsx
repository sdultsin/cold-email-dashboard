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
