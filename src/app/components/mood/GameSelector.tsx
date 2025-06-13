"use client";

import React, { JSX, useState } from "react";
import MoodMatchGame from "../games/MoodMatchGame";
import ReactionTimer from "../games/ReactionTimer";
import GratitudeFlip from "../games/GratitudeFlip";
import BubblePop from "../games/BubblePop";
import BreatheWithMe from "../games/BreatheWithMe";
import QuickQuiz from "../games/QuickQuiz";
import MindfulMoment from "../games/MindfulMoment";

interface GameSelectorProps {
  mood: string;
}

const GameSelector: React.FC<GameSelectorProps> = ({ mood }) => {
  const [playGame, setPlayGame] = useState(false);

  // Map mood to component
  const gameComponents: Record<string, JSX.Element> = {
    happy: <MoodMatchGame />,
    neutral: <ReactionTimer />,
    sad: <GratitudeFlip />,
    angry: <BubblePop />,
    fearful: <BreatheWithMe />,
    surprised: <QuickQuiz />,
  };

  // Map mood to game names (for display)
  const gameByMood: Record<string, string> = {
    happy: "Mood Match Game 🎉",
    neutral: "Reaction Timer ⚡",
    sad: "Gratitude Flip 💖",
    angry: "Bubble Pop 🔴",
    fearful: "Breathe With Me 🫁",
    surprised: "Quick Quiz 🤯",
  };

  const currentGameName = gameByMood[mood] || "Try a Mindful Moment 🧘";
  const CurrentGameComponent = gameComponents[mood] || <MindfulMoment />;

  return (
    <div className="bg-slate-700 p-4 mt-4 rounded-xl text-slate-200 shadow-lg max-w-md mx-auto">
      <h4 className="text-md font-semibold mb-2">🎮 Personalized Game</h4>
      <p className="text-slate-300 mb-2">Based on your mood, try:</p>
      <div className="text-indigo-300 text-lg font-bold mb-4">{currentGameName}</div>
      {!playGame && (
        <button
          onClick={() => setPlayGame(true)}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-full text-white"
        >
          Play Now
        </button>
      )}

{playGame && (
  <div className="mt-4 max-h-[400px] overflow-auto">
    {CurrentGameComponent}
    <button
      onClick={() => setPlayGame(false)}
      className="mt-4 px-3 py-1 bg-red-600 hover:bg-red-500 rounded-full text-white text-sm"
    >
      Exit Game
    </button>
  </div>
)}

    </div>
  );
};

export default GameSelector;
