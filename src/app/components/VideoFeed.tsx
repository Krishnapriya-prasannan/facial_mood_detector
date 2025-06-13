"use client";

import React, { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";

const getMoodBackground = (mood: string) => {
  switch (mood) {
    case "happy":
      return "bg-yellow-300 animate-pulseGlow";
    case "sad":
      return "bg-blue-400 bg-gradient-to-r from-blue-400 via-blue-300 to-blue-500 animate-wave";
    case "angry":
      return "bg-red-600 animate-flicker";
    case "surprised":
      return "bg-purple-400 animate-sparkle";
    case "fearful":
      return "bg-gray-700 animate-slowFade";
    case "disgusted":
      return "bg-green-600 animate-flicker";
    case "neutral":
      return "bg-gray-300 animate-slowFade";
    default:
      return "bg-gray-100";
  }
};

const moodEmojis: { [key: string]: string } = {
  happy: "😊",
  sad: "😢",
  angry: "😠",
  surprised: "😲",
  fearful: "😨",
  disgusted: "🤢",
  neutral: "😐",
};

const moodQuotes: { [key: string]: string } = {
  happy: "Happiness is a choice you make every day.",
  sad: "Even storms don’t last forever.",
  angry: "Calm is a superpower.",
  surprised: "Life is full of surprises!",
  fearful: "Feel the fear and do it anyway.",
  disgusted: "Let go of what weighs you down.",
  neutral: "Peace begins with a smile.",
};

const VideoFeed: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [mood, setMood] = useState<string>("Waiting for detection...");
  const [modelsLoaded, setModelsLoaded] = useState<boolean>(false);
  const [isDetecting, setIsDetecting] = useState<boolean>(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = "/models";

      try {
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
          faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
        ]);
        setModelsLoaded(true);
        startVideo();
      } catch (error) {
        console.error("Model loading error:", error);
      }
    };

    const startVideo = () => {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch((err) => console.error("Camera error:", err));
    };

    loadModels();

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const detectMoodOnce = async () => {
    if (videoRef.current && faceapi.nets.tinyFaceDetector.params) {
      try {
        const result = await faceapi
          .detectSingleFace(
            videoRef.current,
            new faceapi.TinyFaceDetectorOptions()
          )
          .withFaceExpressions();

        if (result && result.expressions) {
          const sorted = Object.entries(result.expressions).sort(
            (a, b) => b[1] - a[1]
          );
          const topExpression = sorted[0][0];

          if (topExpression && intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
            setIsDetecting(false);
          }

          setMood(topExpression);
        } else {
          setMood("No face detected");
        }
      } catch (error) {
        console.error("Detection error:", error);
        setMood("Error detecting face");
      }
    }
  };

  const startDetection = () => {
    if (isDetecting) return;

    setMood("Detecting...");
    setIsDetecting(true);
    intervalRef.current = setInterval(detectMoodOnce, 500);
  };

  return (
    <div
      className={`${getMoodBackground(mood)} min-h-screen flex flex-col justify-center items-center px-6 py-12 transition-colors duration-1000`}
    >
      <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-8 flex flex-col items-center">
        <h1 className="text-4xl font-extrabold text-indigo-700 mb-6 select-none">
          Facial Mood Detector
        </h1>

        <video
          ref={videoRef}
          autoPlay
          muted
          width="480"
          height="360"
          className="rounded-lg border-4 border-indigo-300 shadow-md mb-6 transition-transform duration-300 hover:scale-105"
        />

        <p
          className={`text-3xl font-semibold mb-4 text-center select-none ${
            mood === "No face detected" || mood === "Error detecting face"
              ? "text-red-500"
              : "text-indigo-700"
          }`}
          style={{ minHeight: "3rem" }}
        >
          {moodEmojis[mood] || "❓"} {mood.toUpperCase()}
        </p>

        {moodQuotes[mood] &&
          mood !== "No face detected" &&
          mood !== "Error detecting face" && (
            <p className="text-indigo-500 italic text-center max-w-xs mb-6 select-none">
              "{moodQuotes[mood]}"
            </p>
          )}

        <button
          onClick={startDetection}
          disabled={isDetecting}
          className="w-full py-3 bg-indigo-600 text-white font-bold rounded-lg shadow-lg hover:bg-indigo-700 active:scale-95 transition transform disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isDetecting ? "Detecting..." : "Start Detection"}
        </button>
      </div>
      <footer className="mt-8 text-sm text-gray-500 select-none">
        Made with ❤️ by Krishnapriya
      </footer>
    </div>
  );
};

export default VideoFeed;
