// components/games/BubblePop.tsx
"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

interface Bubble {
  id: number;
  left: number;
  size: number;
  top: number;
}

const BubblePop: React.FC = () => {
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [score, setScore] = useState<number>(0);
  const bubbleId = useRef<number>(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const newBubble: Bubble = {
        id: bubbleId.current++,
        left: Math.random() * 90,
        size: Math.random() * 30 + 30,
        top: Math.random() * 60 + 10,
      };
      setBubbles((prev) => [...prev.slice(-9), newBubble]);
    }, 700);

    return () => clearInterval(interval);
  }, []);

  const popBubble = (id: number) => {
    setBubbles((prev) => prev.filter((b) => b.id !== id));
    setScore((s) => s + 1);
  };

  return (
    <div className="relative bg-red-900/10 border border-red-500 p-6 rounded-2xl text-red-100 h-80 overflow-hidden">
      <p className="text-center text-sm mb-4">Pop bubbles to release stress!</p>
      <div className="absolute inset-0 pointer-events-none">
        {bubbles.map((bubble) => (
          <motion.div
            key={bubble.id}
            onClick={() => popBubble(bubble.id)}
            className="absolute rounded-full bg-red-400 cursor-pointer shadow-lg pointer-events-auto"
            style={{
              width: bubble.size,
              height: bubble.size,
              left: `${bubble.left}%`,
              top: `${bubble.top}%`,
            }}
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 1.2, repeat: Infinity }}
          />
        ))}
      </div>
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-lg font-semibold bg-red-600 px-4 py-1 rounded-full">
        Score: {score}
      </div>
    </div>
  );
};

export default BubblePop;
