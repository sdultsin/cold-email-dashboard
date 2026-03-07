"use client";

import type { Story } from "@/types/dashboard";
import RecommendationCard from "./RecommendationCard";

interface RecommendationsTabProps {
  stories: Story[];
}

export default function RecommendationsTab({ stories }: RecommendationsTabProps) {
  return (
    <div className="space-y-4 p-6 max-w-3xl mx-auto">
      {stories.map((story) => (
        <RecommendationCard key={story.id} story={story} />
      ))}
    </div>
  );
}
