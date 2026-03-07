"use client";

import Image from "next/image";
import { useInView } from "./useInView";
import DownArrow from "./DownArrow";

export default function Slide1() {
  const { ref, isInView } = useInView();

  return (
    <section
      ref={ref}
      className="relative flex h-screen w-full flex-col items-center justify-center"
    >
      <div
        className={`flex flex-col items-center gap-8 transition-all duration-700 ${
          isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        {/* Phone mockup */}
        <div className="relative w-[280px] rounded-[40px] border-[3px] border-zinc-700 bg-black p-2 shadow-2xl">
          {/* Notch */}
          <div className="absolute top-0 left-1/2 z-10 h-6 w-28 -translate-x-1/2 rounded-b-2xl bg-black" />
          {/* Screen */}
          <div className="relative overflow-hidden rounded-[34px]">
            <Image
              src="/images/instagram-reel.png"
              alt="Instagram reel with 86.8K likes, 275 comments, 2,796 shares, 15.8K saves"
              width={274}
              height={594}
              className="w-full"
              priority
            />
            {/* Red heart overlay */}
            <svg
              className="absolute"
              style={{ top: "44.5%", right: "5.5%", width: "24px", height: "24px" }}
              viewBox="0 0 24 24"
              fill="#F44752"
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </div>
        </div>

        <p className="text-xl font-light text-[#ededed]/80">
          You liked a reel.
        </p>
      </div>

      <DownArrow />
    </section>
  );
}
