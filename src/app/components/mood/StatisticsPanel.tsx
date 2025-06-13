"use client";

import React from "react";
import { Activity, TrendingUp } from "lucide-react";
import { moodData, MoodHistory } from "@/lib/mood-utils";

interface StatisticsPanelProps {
  moodHistory: MoodHistory[];
  detectionCount: number;
  sessionStartTime: number;
  currentMood: string;
}

const StatisticsPanel: React.FC<StatisticsPanelProps> = ({
  moodHistory,
  detectionCount,
  sessionStartTime,
  currentMood,
}) => {
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

  return (
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
            <span className="font-medium">
              {Math.floor(getSessionDuration() / 60)}m {getSessionDuration() % 60}s
            </span>
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
  );
};

export default StatisticsPanel;