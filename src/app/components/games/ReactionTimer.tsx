// components/games/ReactionTimer.tsx
"use client";

import React, { useEffect, useState } from "react";

const ReactionTimer: React.FC = () => {
  const [gameState, setGameState] = useState<"idle" | "waiting" | "go" | "done">("idle");
  const [message, setMessage] = useState("Click to Start");
  const [startTime, setStartTime] = useState<number | null>(null);
  const [reactionTime, setReactionTime] = useState<number | null>(null);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  const handleClick = () => {
    if (gameState === "idle") {
      setMessage("Wait for green...");
      setGameState("waiting");
      const delay = Math.random() * 3000 + 2000; // 2-5 seconds
      const id = setTimeout(() => {
        setGameState("go");
        setMessage("CLICK NOW!");
        setStartTime(Date.now());
      }, delay);
      setTimeoutId(id);
    } else if (gameState === "waiting") {
      if (timeoutId) clearTimeout(timeoutId);
      setMessage("Too early! Try again.");
      setGameState("done");
    } else if (gameState === "go") {
      const endTime = Date.now();
      const reaction = endTime - (startTime ?? endTime);
      setReactionTime(reaction);
      setMessage(`⚡ Your Reaction Time: ${reaction} ms`);
      setGameState("done");
    } else {
      // Reset
      setReactionTime(null);
      setGameState("idle");
      setMessage("Click to Start");
    }
  };

  useEffect(() => {
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [timeoutId]);

  return (
    <div
      onClick={handleClick}
      className={`rounded-xl p-8 text-center text-xl font-semibold transition-all duration-300 cursor-pointer ${
        gameState === "go"
          ? "bg-green-600 text-white"
          : gameState === "waiting"
          ? "bg-yellow-500 text-black"
          : "bg-slate-700 text-slate-100"
      }`}
    >
      <p className="text-2xl mb-2">{message}</p>
      {reactionTime !== null && (
        <p className="text-indigo-300 text-lg mt-2">
          🔁 Tap to try again
        </p>
      )}
    </div>
  );
};

export default ReactionTimer;
