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
