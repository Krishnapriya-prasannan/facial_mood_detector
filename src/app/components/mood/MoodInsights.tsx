"use client";

import React from "react";
import { MoodHistory } from "@/lib/mood-utils";

interface MoodInsightsProps {
  moodHistory: MoodHistory[];
}

const MoodInsights: React.FC<MoodInsightsProps> = ({ moodHistory }) => {
  const recentMood = moodHistory[moodHistory.length - 1]?.mood || "neutral";
  const moodCounts: Record<string, number> = {};

  moodHistory.forEach(({ mood }) => {
    moodCounts[mood] = (moodCounts[mood] || 0) + 1;
  });

  const mostFrequentMood = Object.entries(moodCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "neutral";

  const suggestions: Record<string, string> = {
    happy: "Keep spreading positivity! Try journaling your good moments.",
    sad: "It’s okay to feel low. Listen to calming music or talk to a friend.",
    angry: "Take a deep breath. Try a short walk or breathing exercise.",
    neutral: "Consider reflecting or taking a short break.",
    fearful: "Try grounding techniques. A quick meditation can help.",
    surprised: "Use your energy creatively—draw or write something fun.",
    disgusted: "Engage in something that makes you feel calm and safe."
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl shadow-lg border border-slate-700 p-4 text-slate-100 space-y-3 h-fit">
      <h3 className="text-base font-semibold text-indigo-300">Mood Insights</h3>

      <div className="text-sm text-slate-300">
        <span className="font-medium text-slate-100">Most Frequent Mood: </span>
        <span className="capitalize">{mostFrequentMood}</span>
      </div>

      <div className="text-sm text-slate-300">
        <span className="font-medium text-slate-100">Last Detected Mood: </span>
        <span className="capitalize">{recentMood}</span>
      </div>

      <div className="bg-slate-700 rounded-md px-3 py-2 text-sm text-slate-200">
        <span className="font-medium text-indigo-300">Suggestion:</span><br />
        {suggestions[recentMood] || "Stay mindful and take care of yourself."}
      </div>
    </div>
  );
};

export default MoodInsights;
