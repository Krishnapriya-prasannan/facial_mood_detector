"use client";

import React, { useEffect, useRef, useState } from "react";
import { Camera, Play, Pause, RotateCcw, Activity, TrendingUp, Eye } from "lucide-react";

// Mock face-api.js for demonstration (replace with actual import)
const faceapi = {
  nets: {
    tinyFaceDetector: {
      loadFromUri: async (MODEL_URL: string) => {},
      params: true
    },
    faceExpressionNet: {
      loadFromUri: async (MODEL_URL: string) => {}
    }
  },
  detectSingleFace: () => ({
    withFaceExpressions: async () => ({
      expressions: {
        happy: Math.random(),
        sad: Math.random(),
        angry: Math.random(),
        surprised: Math.random(),
        fearful: Math.random(),
        disgusted: Math.random(),
        neutral: Math.random()
      }
    })
  }),
  TinyFaceDetectorOptions: class {}
};

const getMoodGradient = (mood: string) => {
  switch (mood) {
    case "happy":
      return "from-yellow-400 via-orange-300 to-pink-400";
    case "sad":
      return "from-blue-500 via-indigo-400 to-purple-500";
    case "angry":
      return "from-red-500 via-orange-500 to-yellow-500";
    case "surprised":
      return "from-purple-500 via-pink-400 to-indigo-400";
    case "fearful":
      return "from-gray-600 via-slate-500 to-gray-700";
    case "disgusted":
      return "from-green-600 via-emerald-500 to-teal-500";
    case "neutral":
      return "from-gray-400 via-slate-400 to-zinc-400";
    default:
      return "from-slate-100 via-gray-100 to-zinc-100";
  }
};

const moodData = {
  happy: { emoji: "😊", color: "text-yellow-600", bgColor: "bg-yellow-50", borderColor: "border-yellow-200" },
  sad: { emoji: "😢", color: "text-blue-600", bgColor: "bg-blue-50", borderColor: "border-blue-200" },
  angry: { emoji: "😠", color: "text-red-600", bgColor: "bg-red-50", borderColor: "border-red-200" },
  surprised: { emoji: "😲", color: "text-purple-600", bgColor: "bg-purple-50", borderColor: "border-purple-200" },
  fearful: { emoji: "😨", color: "text-gray-600", bgColor: "bg-gray-50", borderColor: "border-gray-200" },
  disgusted: { emoji: "🤢", color: "text-green-600", bgColor: "bg-green-50", borderColor: "border-green-200" },
  neutral: { emoji: "😐", color: "text-slate-600", bgColor: "bg-slate-50", borderColor: "border-slate-200" },
};

const moodQuotes = {
  happy: "Happiness radiates from within like sunshine.",
  sad: "Every storm eventually clears to reveal the rainbow.",
  angry: "In the depths of calm lies your greatest strength.",
  surprised: "Life's surprises are the universe's way of keeping us curious.",
  fearful: "Courage isn't the absence of fear, it's moving forward despite it.",
  disgusted: "Sometimes we must feel disgust to appreciate beauty.",
  neutral: "In stillness, we find our center and inner peace.",
};

interface MoodHistory {
  mood: string;
  confidence: number;
  timestamp: number;
}

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
          
          // Add to mood history
          setMoodHistory(prev => [
            ...prev.slice(-9), // Keep last 9 entries
            {
              mood: topExpression,
              confidence: confidenceScore,
              timestamp: Date.now()
            }
          ]);

          // Stop detection automatically once mood is detected
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

  const getSessionDuration = () => {
    return Math.floor((Date.now() - sessionStartTime) / 1000);
  };

  const getMostFrequentMood = () => {
    if (moodHistory.length === 0) return "neutral";
    const moodCounts = moodHistory.reduce((acc, entry) => {
      acc[entry.mood] = (acc[entry.mood] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    return Object.entries(moodCounts).sort((a, b) => b[1] - a[1])[0][0];
  };

  const currentMoodData = moodData[currentMood as keyof typeof moodData] || moodData.neutral;

  return (
    <div className={`min-h-screen bg-gradient-to-br ${getMoodGradient(currentMood)} transition-all duration-1000`}>
      <div className="min-h-screen backdrop-blur-sm bg-white/10 flex items-center justify-center p-4">
        <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Video Panel */}
          <div className="lg:col-span-2 bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl p-8 border border-white/20">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl">
                  <Eye className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">Mood Detector</h1>
                  <p className="text-gray-600 text-sm">AI-Powered Emotion Recognition</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${modelsLoaded ? 'bg-green-500' : 'bg-red-500'} animate-pulse`}></div>
                <span className="text-sm text-gray-600">{modelsLoaded ? 'Ready' : 'Loading...'}</span>
              </div>
            </div>

            {/* Video Container */}
            <div className="relative mb-6">
              <video
                ref={videoRef}
                autoPlay
                muted
                className="w-full h-80 object-cover rounded-2xl border-4 border-white shadow-lg"
              />
              {!faceDetected && isDetecting && (
                <div className="absolute inset-0 bg-black/50 rounded-2xl flex items-center justify-center">
                  <div className="text-white text-center">
                    <Camera className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p className="text-lg font-medium">No face detected</p>
                    <p className="text-sm opacity-75">Please position your face in the camera</p>
                  </div>
                </div>
              )}
            </div>

            {/* Current Mood Display */}
            <div className={`${currentMoodData.bgColor} ${currentMoodData.borderColor} border-2 rounded-2xl p-6 mb-6 ${
              detectionCount > 0 && !isDetecting ? 'ring-4 ring-indigo-200 shadow-2xl transform scale-105' : ''
            } transition-all duration-500`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="text-4xl animate-bounce">{currentMoodData.emoji}</span>
                  <div>
                    <h3 className={`text-2xl font-bold ${currentMoodData.color} capitalize`}>
                      {currentMood}
                    </h3>
                    <p className="text-gray-600 italic">"{moodQuotes[currentMood as keyof typeof moodQuotes]}"</p>
                    {detectionCount > 0 && !isDetecting && (
                      <div className="mt-2 flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-sm text-green-600 font-medium">Detection Complete!</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-3xl font-bold ${currentMoodData.color}`}>
                    {confidence}%
                  </div>
                  <p className="text-gray-500 text-sm">Confidence</p>
                  {detectionCount > 0 && !isDetecting && (
                    <div className="mt-1 text-xs text-gray-500">
                      Detected at {new Date().toLocaleTimeString()}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="flex gap-3">
              <button
                onClick={startDetection}
                disabled={!modelsLoaded || isDetecting}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Play className="w-5 h-5" />
                {isDetecting ? 'Analyzing Mood...' : detectionCount > 0 ? 'Detect Again' : 'Start Detection'}
              </button>
              
              <button
                onClick={stopDetection}
                disabled={!isDetecting}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Pause className="w-5 h-5" />
              </button>
              
              <button
                onClick={resetSession}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-red-100 text-red-600 font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
            </div>

            {/* Result Summary - Shows after detection is complete */}
            {detectionCount > 0 && !isDetecting && (
              <div className="mt-6 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-green-500 rounded-lg">
                    <Activity className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-green-800">Analysis Complete</h4>
                    <p className="text-green-600 text-sm">Your mood has been successfully detected</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="bg-white rounded-lg p-4">
                    <div className="text-2xl font-bold text-green-600">{currentMood.charAt(0).toUpperCase() + currentMood.slice(1)}</div>
                    <div className="text-sm text-gray-600">Detected Mood</div>
                  </div>
                  <div className="bg-white rounded-lg p-4">
                    <div className="text-2xl font-bold text-green-600">{confidence}%</div>
                    <div className="text-sm text-gray-600">Accuracy</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Statistics Panel */}
          <div className="space-y-6">
            {/* Session Stats */}
            <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl p-6 border border-white/20">
              <div className="flex items-center gap-3 mb-4">
                <Activity className="w-5 h-5 text-indigo-600" />
                <h3 className="text-lg font-semibold text-gray-800">Session Stats</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Duration</span>
                  <span className="font-medium">{Math.floor(getSessionDuration() / 60)}m {getSessionDuration() % 60}s</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Detections</span>
                  <span className="font-medium">{detectionCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Frequent Mood</span>
                  <span className="font-medium capitalize">{getMostFrequentMood()}</span>
                </div>
              </div>
            </div>

            {/* Mood History */}
            <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl p-6 border border-white/20">
              <div className="flex items-center gap-3 mb-4">
                <TrendingUp className="w-5 h-5 text-indigo-600" />
                <h3 className="text-lg font-semibold text-gray-800">Recent Moods</h3>
              </div>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {moodHistory.slice(-10).reverse().map((entry, index) => {
                  const entryMoodData = moodData[entry.mood as keyof typeof moodData];
                  return (
                    <div key={index} className={`${entryMoodData.bgColor} rounded-lg p-3 flex items-center justify-between`}>
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{entryMoodData.emoji}</span>
                        <span className={`font-medium capitalize ${entryMoodData.color}`}>
                          {entry.mood}
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">{entry.confidence}%</div>
                        <div className="text-xs text-gray-500">
                          {new Date(entry.timestamp).toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  );
                })}
                {moodHistory.length === 0 && (
                  <div className="text-center text-gray-500 py-8">
                    <Activity className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>No mood data yet</p>
                    <p className="text-sm">Start detection to see history</p>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Mood Overview */}
            <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl p-6 border border-white/20">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Mood Palette</h3>
              <div className="grid grid-cols-4 gap-2">
                {Object.entries(moodData).map(([mood, data]) => (
                  <div
                    key={mood}
                    className={`${data.bgColor} ${data.borderColor} ${
                      currentMood === mood ? 'border-2 scale-110' : 'border'
                    } rounded-lg p-2 text-center transition-all cursor-pointer hover:scale-105`}
                  >
                    <div className="text-2xl mb-1">{data.emoji}</div>
                    <div className={`text-xs font-medium ${data.color} capitalize`}>
                      {mood}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
        <p className="text-white/80 text-sm backdrop-blur-sm bg-black/20 px-4 py-2 rounded-full">
          Made with ❤️ by Krishnapriya
        </p>
      </div>
    </div>
  );
};

export default VideoFeed;