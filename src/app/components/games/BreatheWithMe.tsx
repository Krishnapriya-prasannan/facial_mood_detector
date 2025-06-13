// components/games/BreatheWithMe.tsx
"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

const BreatheWithMe: React.FC = () => {
  const [phase, setPhase] = useState<"inhale" | "hold" | "exhale">("inhale");
  const [count, setCount] = useState(0);

  useEffect(() => {
    const sequence = [
      { phase: "inhale", duration: 4000 },
      { phase: "hold", duration: 2000 },
      { phase: "exhale", duration: 4000 },
    ];

    let index = 0;
    let timeout: NodeJS.Timeout;

    const next = () => {
      const current = sequence[index];
      setPhase(current.phase as typeof phase);
      timeout = setTimeout(() => {
        index = (index + 1) % sequence.length;
        next();
      }, current.duration);
    };

    next();
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    setCount((prev) => prev + 1);
  }, [phase === "inhale"]);

  return (
    <div className="bg-slate-800 border border-blue-500 rounded-2xl p-6 h-80 flex flex-col items-center justify-center text-slate-200">
      <p className="mb-2 text-sm text-center text-slate-400">A guided calming exercise</p>

      <motion.div
        className="w-40 h-40 bg-blue-400 rounded-full shadow-lg"
        animate={{
          scale: phase === "inhale" ? 1.3 : phase === "hold" ? 1.3 : 1,
        }}
        transition={{ duration: 2 }}
      />

      <div className="mt-6 text-lg font-semibold capitalize text-blue-200">
        {phase === "inhale" && "Inhale..."}
        {phase === "hold" && "Hold..."}
        {phase === "exhale" && "Exhale..."}
      </div>

      <div className="mt-2 text-xs text-slate-400">Cycles: {count}</div>
    </div>
  );
};

export default BreatheWithMe;
