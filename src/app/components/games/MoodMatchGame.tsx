// components/games/MoodMatchGame.tsx
"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

const emojiPairs = ["😊", "😄", "🎉", "😎", "🥳", "💖"];
const shuffledEmojis = () =>
  [...emojiPairs, ...emojiPairs]
    .sort(() => Math.random() - 0.5)
    .map((emoji, index) => ({
      id: index,
      emoji,
      flipped: false,
      matched: false,
    }));

const MoodMatchGame: React.FC = () => {
  const [cards, setCards] = useState(shuffledEmojis);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [gameCompleted, setGameCompleted] = useState(false);

  useEffect(() => {
    if (flippedIndices.length === 2) {
      const [first, second] = flippedIndices;
      if (cards[first].emoji === cards[second].emoji) {
        const updated = cards.map((card, i) =>
          flippedIndices.includes(i) ? { ...card, matched: true } : card
        );
        setCards(updated);
        setFlippedIndices([]);
      } else {
        setTimeout(() => {
          const updated = cards.map((card, i) =>
            flippedIndices.includes(i) ? { ...card, flipped: false } : card
          );
          setCards(updated);
          setFlippedIndices([]);
        }, 800);
      }
      setMoves((m) => m + 1);
    }
  }, [flippedIndices,cards]);

  useEffect(() => {
    if (cards.every((card) => card.matched)) {
      setGameCompleted(true);
    }
  }, [cards]);

  const handleFlip = (index: number) => {
    if (flippedIndices.length < 2 && !cards[index].flipped && !cards[index].matched) {
      const newCards = [...cards];
      newCards[index].flipped = true;
      setCards(newCards);
      setFlippedIndices([...flippedIndices, index]);
    }
  };

  const resetGame = () => {
    setCards(shuffledEmojis);
    setFlippedIndices([]);
    setMoves(0);
    setGameCompleted(false);
  };

  return (
    <div className="bg-slate-800 p-6 rounded-2xl shadow-lg">
      <p className="text-slate-300 mb-4">Match all the happy emoji pairs!</p>
      <div className="grid grid-cols-4 gap-4 mb-4">
        {cards.map((card, index) => (
          <motion.div
            key={card.id}
            className={`w-16 h-16 rounded-lg flex items-center justify-center text-2xl cursor-pointer transition-all duration-300 ${
              card.flipped || card.matched
                ? "bg-indigo-500 text-white"
                : "bg-slate-600"
            }`}
            onClick={() => handleFlip(index)}
            whileTap={{ scale: 0.9 }}
          >
            {card.flipped || card.matched ? card.emoji : "❓"}
          </motion.div>
        ))}
      </div>

      <p className="text-slate-400 mb-4">Moves: {moves}</p>

      {gameCompleted && (
        <div className="text-green-400 font-semibold mb-4">
          🎉 You matched all pairs in {moves} moves!
        </div>
      )}

      <button
        onClick={resetGame}
        className="mt-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full"
      >
        Restart Game
      </button>
    </div>
  );
};

export default MoodMatchGame;
