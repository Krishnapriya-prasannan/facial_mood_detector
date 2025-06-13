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
    <div className="lg:col-span-2 bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-2xl p-6 sm:p-8 border border-slate-700">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg">
            <Eye className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-100">Mood Detector</h1>
            <p className="text-slate-400 text-sm sm:text-base">AI-Powered Emotion Recognition</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${modelsLoaded ? 'bg-green-400' : 'bg-red-400'} animate-pulse`}></div>
          <span className="text-sm text-slate-400">{modelsLoaded ? 'Ready' : 'Loading...'}</span>
        </div>
      </div>

      {/* Video Container */}
      <div className="relative mb-6">
        <video
          ref={videoRef}
          autoPlay
          muted
          className="w-full h-64 sm:h-80 object-cover rounded-xl border-2 border-slate-700 shadow-lg"
        />
        {!faceDetected && isDetecting && (
          <div className="absolute inset-0 bg-black/60 rounded-xl flex items-center justify-center">
            <div className="text-center text-slate-300">
              <Camera className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p className="text-lg font-medium">No face detected</p>
              <p className="text-sm opacity-75">Please position your face in the camera</p>
            </div>
          </div>
        )}
      </div>

      {/* Current Mood Display */}
      <div className={`bg-slate-700/50 border-2 ${currentMoodData.borderColor} rounded-xl p-4 sm:p-6 mb-6 ${
        detectionCount > 0 && !isDetecting ? 'ring-4 ring-indigo-500/50 shadow-2xl transform scale-105 animate-bounce-in' : ''
      } transition-all duration-500`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-4xl sm:text-5xl">{currentMoodData.emoji}</span>
            <div>
              <h3 className={`text-2xl sm:text-3xl font-bold ${currentMoodData.color} capitalize`}>
                {currentMood}
              </h3>
              <p className="text-slate-400 italic">"{moodQuotes[currentMood as keyof typeof moodQuotes]}"</p>
              {detectionCount > 0 && !isDetecting && (
                <div className="mt-2 flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-sm text-green-400 font-medium">Detection Complete!</span>
                </div>
              )}
            </div>
          </div>
          <div className="text-right">
            <div className={`text-3xl sm:text-4xl font-bold ${currentMoodData.color}`}>
              {confidence}%
            </div>
            <p className="text-slate-400 text-sm">Confidence</p>
            {detectionCount > 0 && !isDetecting && (
              <div className="mt-1 text-xs text-slate-500">
                Detected at {new Date().toLocaleTimeString()}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <button
          onClick={startDetection}
          disabled={!modelsLoaded || isDetecting}
          className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-lg shadow-lg hover:from-indigo-600 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-indigo-500"
        >
          <Play className="w-5 h-5" />
          {isDetecting ? 'Analyzing...' : detectionCount > 0 ? 'Detect Again' : 'Start Detection'}
        </button>
        
        <button
          onClick={stopDetection}
          disabled={!isDetecting}
          className="w-full flex items-center justify-center gap-2 py-3 bg-slate-700 text-slate-300 font-semibold rounded-lg shadow-lg hover:bg-slate-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Pause className="w-5 h-5" />
        </button>
        
        <button
          onClick={resetSession}
          className="w-full flex items-center justify-center gap-2 py-3 bg-rose-800/70 text-rose-100 font-semibold rounded-lg shadow-lg hover:bg-rose-700/90 transition-all"
        >
          <RotateCcw className="w-5 h-5" />
        </button>
      </div>

      {/* Result Summary - Shows after detection is complete */}
      {detectionCount > 0 && !isDetecting && (
        <div className="mt-6 bg-green-500/10 border border-green-500/30 rounded-xl p-4 sm:p-6 animate-slide-in">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-2 bg-green-500/20 rounded-lg">
              <Activity className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <h4 className="text-lg font-semibold text-slate-100">Analysis Complete</h4>
              <p className="text-green-400 text-sm">Your mood has been successfully detected</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="bg-slate-700/50 rounded-lg p-4">
              <div className="text-2xl font-bold text-green-400">{currentMood.charAt(0).toUpperCase() + currentMood.slice(1)}</div>
              <div className="text-sm text-slate-400">Detected Mood</div>
            </div>
            <div className="bg-slate-700/50 rounded-lg p-4">
              <div className="text-2xl font-bold text-green-400">{confidence}%</div>
              <div className="text-sm text-slate-400">Accuracy</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoPanel;