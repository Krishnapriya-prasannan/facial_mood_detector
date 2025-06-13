// components/mood/GameSelector.tsx
"use client";

import React from "react";

interface GameSelectorProps {
  mood: string;
}

const GameSelector: React.FC<GameSelectorProps> = ({ mood }) => {
  const gameByMood: Record<string, string> = {
    happy: "Mood Match Game 🎉",
    neutral: "Reaction Timer ⚡",
    sad: "Gratitude Flip 💖",
    angry: "Bubble Pop 🔴",
    fearful: "Breathe With Me 🫁",
    surprised: "Quick Quiz 🤯",
  };

  const currentGame = gameByMood[mood] || "Try a Mindful Moment 🧘";

  return (
    <div className="bg-slate-700 p-4 mt-4 rounded-xl text-slate-200 shadow-lg">
      <h4 className="text-md font-semibold mb-2">🎮 Personalized Game</h4>
      <p className="text-slate-300 mb-2">Based on your mood, try:</p>
      <div className="text-indigo-300 text-lg font-bold">{currentGame}</div>
      <button className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-full text-white">
        Play Now
      </button>
    </div>
  );
};

export default GameSelector;
