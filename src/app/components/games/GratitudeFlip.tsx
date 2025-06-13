// components/games/GratitudeFlip.tsx
"use client";

import React, { useState } from "react";

const gratitudePrompts = [
  "Name one thing you're grateful for today.",
  "Think of someone who made you smile recently.",
  "What's a simple pleasure you enjoy?",
  "Recall a kind gesture someone did for you.",
  "What’s a challenge you’ve overcome recently?",
  "Who in your life do you appreciate most?",
  "What's a place that makes you feel calm?",
  "Name one thing your body helped you do today.",
];

const GratitudeFlip: React.FC = () => {
  const [currentPrompt, setCurrentPrompt] = useState<string>("");
  const [hasFlipped, setHasFlipped] = useState<boolean>(false);

  const handleFlip = () => {
    const random = gratitudePrompts[Math.floor(Math.random() * gratitudePrompts.length)];
    setCurrentPrompt(random);
    setHasFlipped(true);
  };

  return (
    <div className="bg-pink-100/10 text-pink-200 border border-pink-400 rounded-2xl shadow-lg p-6 text-center transition-all duration-300">
      {!hasFlipped ? (
        <button
          onClick={handleFlip}
          className="px-6 py-2 bg-pink-600 hover:bg-pink-500 rounded-full text-white text-md font-semibold"
        >
          Flip a Card
        </button>
      ) : (
        <>
          <p className="text-lg italic mb-4">"{currentPrompt}"</p>
          <button
            onClick={handleFlip}
            className="mt-2 px-4 py-2 bg-pink-500 hover:bg-pink-400 rounded-full text-white"
          >
            Flip Again 🔄
          </button>
        </>
      )}
    </div>
  );
};

export default GratitudeFlip;
