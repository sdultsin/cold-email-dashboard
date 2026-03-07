"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import DownArrow from "./DownArrow";

const leftSignals = [
  "Watch time: 14.2s",
  "87% completion",
  "Paused at 0:04",
  "Replayed 1x",
  "Scroll velocity slowed",
  "before stopping",
  "Audio kept on, not muted",
  "Skipped previous reel in <1s",
];

const rightSignals = [
  "Read 3 comments, 8.4s total",
  "Scrolled to comments",
  "Saved to collection",
  "3rd reel from this creator this week",
  "Profile tap after viewing",
  "Did not share",
];

export default function Slide1And2() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const rect = container.getBoundingClientRect();
      const containerHeight = container.offsetHeight;
      const viewportHeight = window.innerHeight;
      // progress 0 = top of container at top of viewport
      // progress 1 = bottom of container at bottom of viewport
      const scrolled = -rect.top;
      const scrollable = containerHeight - viewportHeight;
      const p = Math.max(0, Math.min(1, scrolled / scrollable));
      setProgress(p);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Phase 1 (0-0.4): phone visible, text "You liked a reel."
  // Phase 2 (0.4-0.6): transition - dim, signals start appearing
  // Phase 3 (0.6-1.0): signals fully visible, bottom text visible

  const showInitial = progress < 0.5;
  const transitionProgress = Math.max(0, Math.min(1, (progress - 0.35) / 0.3)); // 0 at 0.35, 1 at 0.65
  const dimAmount = 1 - transitionProgress * 0.7; // 1.0 -> 0.3
  const signalProgress = transitionProgress;
  const bottomTextOpacity = Math.max(0, Math.min(1, (progress - 0.7) / 0.15));
  const initialTextOpacity = Math.max(0, 1 - transitionProgress * 3);

  return (
    <section ref={containerRef} className="relative" style={{ height: "250vh" }}>
      {/* Sticky container - phone stays centered */}
      <div className="sticky top-0 flex h-screen w-full flex-col items-center justify-center px-4">
        <div className="flex flex-col items-center gap-10">
          {/* Three-column layout: signals - phone - signals */}
          <div className="flex items-center gap-6 lg:gap-10">
            {/* Left signals */}
            <div className="hidden sm:flex w-[260px] flex-col gap-3">
              {leftSignals.map((signal, i) => {
                const stagger = i * 0.08;
                const opacity = Math.max(0, Math.min(1, (signalProgress - stagger) / 0.3));
                const tx = (1 - opacity) * -16;
                return (
                  <div
                    key={i}
                    className="flex items-center gap-3 justify-end"
                    style={{
                      opacity,
                      transform: `translateX(${tx}px)`,
                    }}
                  >
                    <span className="text-sm text-white text-right leading-tight">
                      {signal}
                    </span>
                    <div className="flex-shrink-0 w-8 h-px bg-zinc-600" />
                  </div>
                );
              })}
            </div>

            {/* Phone mockup */}
            <div className="relative w-[280px] flex-shrink-0 rounded-[40px] border-[3px] border-zinc-700 bg-black p-2 shadow-2xl">
              <div className="absolute top-0 left-1/2 z-10 h-6 w-28 -translate-x-1/2 rounded-b-2xl bg-black" />
              <div className="relative overflow-hidden rounded-[34px]">
                <Image
                  src="/images/instagram-reel.png"
                  alt="Instagram reel with 86.8K likes, 275 comments, 2,796 shares, 15.8K saves"
                  width={274}
                  height={594}
                  className="w-full"
                  style={{ opacity: dimAmount }}
                  priority
                />
              </div>
            </div>

            {/* Right signals */}
            <div className="hidden sm:flex w-[260px] flex-col gap-3">
              {rightSignals.map((signal, i) => {
                const stagger = i * 0.08;
                const opacity = Math.max(0, Math.min(1, (signalProgress - stagger) / 0.3));
                const tx = (1 - opacity) * 16;
                return (
                  <div
                    key={i}
                    className="flex items-center gap-3"
                    style={{
                      opacity,
                      transform: `translateX(${tx}px)`,
                    }}
                  >
                    <div className="flex-shrink-0 w-8 h-px bg-zinc-600" />
                    <span className="text-sm text-white leading-tight">
                      {signal}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Mobile fallback: show signals below phone */}
          <div className="flex sm:hidden flex-col gap-2 px-4">
            {[...leftSignals, ...rightSignals].map((signal, i) => {
              const stagger = i * 0.04;
              const opacity = Math.max(0, Math.min(1, (signalProgress - stagger) / 0.3));
              return (
                <div
                  key={i}
                  className="flex items-center gap-2"
                  style={{ opacity }}
                >
                  <div className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-zinc-500" />
                  <span className="text-sm text-white">{signal}</span>
                </div>
              );
            })}
          </div>

          {/* Phase 1 text: "You liked a reel." */}
          <p
            className="text-xl font-light text-[#ededed]/80 absolute bottom-[15%]"
            style={{ opacity: initialTextOpacity }}
          >
            You liked a reel.
          </p>

          {/* Phase 2 text: the Instagram explanation */}
          <p
            className="max-w-2xl text-center text-base font-light text-[#ededed]/70"
            style={{ opacity: bottomTextOpacity }}
          >
            Instagram tracked 47 signals from that one interaction and fed them
            back into the algorithm before you swiped to the next reel -
            optimizing what you see with every scroll. Now imagine that feedback
            loop for cold email.
          </p>
        </div>

        {showInitial ? null : <DownArrow />}
      </div>
    </section>
  );
}
