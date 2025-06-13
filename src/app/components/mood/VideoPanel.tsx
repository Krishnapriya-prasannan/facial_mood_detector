"use client";

import React from "react";
import { Camera, Play, Pause, RotateCcw, Activity, Eye } from "lucide-react";
import { moodData, moodQuotes } from "@/lib/mood-utils";

interface VideoPanelProps {
  videoRef: React.Ref<HTMLVideoElement>;
  currentMood: string;
  confidence: number;
  modelsLoaded: boolean;
  isDetecting: boolean;
  detectionCount: number;
  faceDetected: boolean;
  startDetection: () => void;
  stopDetection: () => void;
  resetSession: () => void;
}

const VideoPanel: React.FC<VideoPanelProps> = ({
  videoRef,
  currentMood,
  confidence,
  modelsLoaded,
  isDetecting,
  detectionCount,
  faceDetected,
  startDetection,
  stopDetection,
  resetSession,
}) => {
  const currentMoodData = moodData[currentMood as keyof typeof moodData] || moodData.neutral;

  return (
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
  );
};

export default VideoPanel;