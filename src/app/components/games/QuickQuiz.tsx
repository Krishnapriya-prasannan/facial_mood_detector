// components/games/QuickQuiz.tsx
"use client";

import React, { useState } from "react";

interface Question {
  question: string;
  options: string[];
  answer: string;
}

const questions: Question[] = [
  {
    question: "What is the capital of France?",
    options: ["Paris", "London", "Berlin", "Rome"],
    answer: "Paris",
  },
  {
    question: "What planet is known as the Red Planet?",
    options: ["Venus", "Earth", "Mars", "Jupiter"],
    answer: "Mars",
  },
  {
    question: "Who wrote 'Hamlet'?",
    options: ["Shakespeare", "Homer", "Tolstoy", "Dante"],
    answer: "Shakespeare",
  },
  {
    question: "Which language runs in a web browser?",
    options: ["Python", "C", "JavaScript", "Java"],
    answer: "JavaScript",
  },
];

const QuickQuiz: React.FC = () => {
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);

  const handleOption = (option: string) => {
    setSelected(option);
    if (option === questions[currentQ].answer) {
      setScore((s) => s + 1);
    }

    setTimeout(() => {
      setSelected(null);
      if (currentQ + 1 < questions.length) {
        setCurrentQ((q) => q + 1);
      } else {
        setFinished(true);
      }
    }, 1000);
  };

  return (
    <div className="bg-slate-800 border border-purple-500 p-6 rounded-2xl text-slate-200 max-w-md w-full mx-auto shadow-lg">

      {finished ? (
        <div className="text-center">
          <p className="text-lg font-semibold text-green-400 mb-2">Quiz Complete!</p>
          <p className="text-sm text-slate-400">Your score: {score} / {questions.length}</p>
        </div>
      ) : (
        <>
          <p className="text-md font-medium mb-3">{questions[currentQ].question}</p>
          <div className="grid gap-3">
            {questions[currentQ].options.map((opt) => (
              <button
                key={opt}
                className={`px-4 py-2 rounded-lg text-left ${
                  selected
                    ? opt === questions[currentQ].answer
                      ? "bg-green-500 text-white"
                      : opt === selected
                      ? "bg-red-500 text-white"
                      : "bg-slate-700"
                    : "bg-slate-700 hover:bg-slate-600"
                }`}
                disabled={!!selected}
                onClick={() => handleOption(opt)}
              >
                {opt}
              </button>
            ))}
          </div>
          <div className="mt-4 text-xs text-slate-400">
            Question {currentQ + 1} of {questions.length}
          </div>
        </>
      )}
    </div>
  );
};

export default QuickQuiz;
