// components/games/MindfulMoment.tsx
"use client";

import React, { useEffect, useState } from "react";

const phrases = [
  "Close your eyes and take a deep breath...",
  "Feel the air fill your lungs, slowly...",
  "Exhale gently, let go of any tension...",
  "You're safe, you're calm, you're here...",
  "Let your thoughts pass like clouds...",
  "Just be still for this moment...",
];

const MindfulMoment: React.FC = () => {
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPhraseIndex((prevIndex) => (prevIndex + 1) % phrases.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-slate-800 border border-teal-500 p-6 rounded-2xl text-slate-200 max-w-md w-full mx-auto shadow-xl text-center">
      <p className="text-lg text-slate-100 transition-opacity duration-1000 ease-in-out min-h-[64px]">
        {phrases[currentPhraseIndex]}
      </p>
      <div className="mt-6">
        <svg className="w-16 h-16 mx-auto animate-pulse text-teal-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="9" stroke="currentColor" />
        </svg>
        <p className="text-sm text-slate-400 mt-2">Breathe in... Breathe out...</p>
      </div>
    </div>
  );
};

export default MindfulMoment;
