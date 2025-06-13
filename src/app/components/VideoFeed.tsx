"use client";

import React, { useEffect, useRef, useState } from "react";
import { MoodHistory } from "@/lib/mood-utils";
import faceapi from "@/lib/face-api-mock";
import VideoPanel from "./mood/VideoPanel";
import StatisticsPanel from "./mood/StatisticsPanel";
import MoodChart from "./mood/MoodChart";
import MoodInsights from "./mood/MoodInsights";
import GameSelector from "./mood/GameSelector";
const VideoFeed: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [currentMood, setCurrentMood] = useState<string>("neutral");
  const [confidence, setConfidence] = useState<number>(0);
  const [modelsLoaded, setModelsLoaded] = useState<boolean>(false);
  const [isDetecting, setIsDetecting] = useState<boolean>(false);
  const [moodHistory, setMoodHistory] = useState<MoodHistory[]>([]);
  const [detectionCount, setDetectionCount] = useState<number>(0);
  const [sessionStartTime] = useState<number>(Date.now());
  const [faceDetected, setFaceDetected] = useState<boolean>(true);
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
          .detectSingleFace()
          .withFaceExpressions();

        if (result && result.expressions) {
          const sorted = Object.entries(result.expressions).sort(
            (a, b) => b[1] - a[1]
          );
          const topExpression = sorted[0][0];
          const confidenceScore = Math.round(sorted[0][1] * 100);

          setCurrentMood(topExpression);
          setConfidence(confidenceScore);
          setFaceDetected(true);
          setDetectionCount(prev => prev + 1);
          
          setMoodHistory(prev => [
            ...prev.slice(-9),
            {
              mood: topExpression,
              confidence: confidenceScore,
              timestamp: Date.now()
            }
          ]);

          stopDetection();
        } else {
          setFaceDetected(false);
        }
      } catch (error) {
        console.error("Detection error:", error);
        setFaceDetected(false);
      }
    }
  };

  const startDetection = () => {
    if (isDetecting) return;
    setIsDetecting(true);
    intervalRef.current = setInterval(detectMoodOnce, 1000);
  };

  const stopDetection = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsDetecting(false);
  };

  const resetSession = () => {
    stopDetection();
    setMoodHistory([]);
    setDetectionCount(0);
    setCurrentMood("neutral");
    setConfidence(0);
    setFaceDetected(true);
  };

  return (
    <div className="relative min-h-screen w-full bg-slate-900 text-slate-50 font-sans flex flex-col">
      <main className="flex-grow p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          <VideoPanel
            videoRef={videoRef}
            currentMood={currentMood}
            confidence={confidence}
            modelsLoaded={modelsLoaded}
            isDetecting={isDetecting}
            detectionCount={detectionCount}
            faceDetected={faceDetected}
            startDetection={startDetection}
            stopDetection={stopDetection}
            resetSession={resetSession}
          />
          <StatisticsPanel
            moodHistory={moodHistory}
            detectionCount={detectionCount}
            sessionStartTime={sessionStartTime}
            currentMood={currentMood}
          />

          <MoodChart moodHistory={moodHistory} />
          <GameSelector mood={currentMood} />
          <MoodInsights moodHistory={moodHistory} />


        </div>
      </main>
      
      <footer className="w-full text-center p-4">
        <p className="text-slate-400 text-sm bg-slate-800/50 px-4 py-2 rounded-full inline-block">
          Made with ❤️ by Krishnapriya
        </p>
      </footer>
    </div>
  );
};

export default VideoFeed;