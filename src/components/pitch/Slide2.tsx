"use client";

import Image from "next/image";
import { useInView } from "./useInView";
import DownArrow from "./DownArrow";

const signals = [
  "Watch time: 14.2s (87% completion)",
  "Paused at 0:04 (product reveal moment)",
  "Replayed 1x",
  "Scrolled to comments",
  "Read 3 comments (8.4s in comment section)",
  "Profile tap after viewing",
  "Did not share",
  "Skipped next reel in <1s",
  "3rd reel from this creator this week",
  "Saved to collection",
  "Audio: kept on (not muted)",
  "Scroll velocity: slowed before stopping",
];

export default function Slide2() {
  const { ref, isInView } = useInView();

  return (
    <section
      ref={ref}
      className="relative flex h-screen w-full flex-col items-center justify-center px-4"
    >
      <div className="flex flex-col items-center gap-8">
        {/* Phone mockup with dimmed image + overlay */}
        <div className="relative w-[280px] rounded-[40px] border-[3px] border-zinc-700 bg-black p-2 shadow-2xl">
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
            {/* Signal overlay */}
            <div className="absolute inset-0 flex flex-col justify-center px-4 py-6">
              <ul className="space-y-1">
                {signals.map((signal, i) => (
                  <li
                    key={i}
                    className="font-mono text-[10px] leading-tight text-green-400"
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
        </div>

        <p
          className="max-w-lg text-center text-base font-light text-[#ededed]/70"
          style={{
            opacity: isInView ? 1 : 0,
            transition: `opacity 600ms ${signals.length * 200 + 400}ms`,
          }}
        >
          Instagram tracked 47 signals from that one interaction. The like was
          the least interesting one.
        </p>
      </div>

      <DownArrow />
    </section>
  );
}
