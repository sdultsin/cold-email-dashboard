"use client";

import Slide1And2 from "./Slide1And2";
import Slide3 from "./Slide3";
import Slide4 from "./Slide4";
import Slide5 from "./Slide5";
import Slide6 from "./Slide6";
import Slide7 from "./Slide7";

interface PitchDeckProps {
  onEnterDashboard: () => void;
}

export default function PitchDeck({ onEnterDashboard }: PitchDeckProps) {
  return (
    <div className="w-full">
      <Slide1And2 />
      <Slide3 />
      <Slide4 />
      <Slide5 />
      <Slide6 />
      <Slide7 onEnterDashboard={onEnterDashboard} />
    </div>
  );
}
