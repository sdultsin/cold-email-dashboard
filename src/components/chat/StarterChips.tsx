'use client';

import React from 'react';

const STARTER_PROMPTS = [
  "What's my best performing template?",
  "Why did the system override my top campaign?",
  "Which segments need more data?",
  "What should I test next?",
  "Why is reply rate misleading?",
];

interface StarterChipsProps {
  onSelect: (text: string) => void;
}

export default function StarterChips({ onSelect }: StarterChipsProps) {
  return (
    <div className="flex flex-wrap gap-2 px-4 py-3">
      {STARTER_PROMPTS.map((prompt) => (
        <button
          key={prompt}
          onClick={() => onSelect(prompt)}
          className="border border-[#333] rounded-full px-4 py-2 text-xs text-[#ededed] bg-transparent hover:bg-[#1a1a1a] hover:border-[#3b82f6] transition-colors cursor-pointer"
        >
          {prompt}
        </button>
      ))}
    </div>
  );
}
