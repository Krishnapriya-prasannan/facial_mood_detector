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
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-2xl p-6 border border-slate-700">
        <div className="flex items-center gap-4 mb-4">
          <Activity className="w-6 h-6 text-indigo-400" />
          <h3 className="text-lg font-semibold text-slate-100">Session Stats</h3>
        </div>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-400">Duration</span>
            <span className="font-medium text-slate-200">
              {Math.floor(getSessionDuration() / 60)}m {getSessionDuration() % 60}s
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Detections</span>
            <span className="font-medium text-slate-200">{detectionCount}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Frequent Mood</span>
            <span className="font-medium text-slate-200 capitalize">{getMostFrequentMood()}</span>
          </div>
        </div>
      </div>

      {/* Mood History */}
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-2xl p-6 border border-slate-700">
        <div className="flex items-center gap-4 mb-4">
          <TrendingUp className="w-6 h-6 text-indigo-400" />
          <h3 className="text-lg font-semibold text-slate-100">Recent Moods</h3>
        </div>
        <div className="space-y-2 max-h-60 sm:max-h-64 overflow-y-auto pr-2">
          {moodHistory.slice(-10).reverse().map((entry, index) => {
            const entryMoodData = moodData[entry.mood as keyof typeof moodData];
            return (
              <div key={index} className={`bg-slate-700/50 rounded-lg p-3 flex items-center justify-between animate-slide-in border-l-4 ${entryMoodData.borderColor}`}>
                <div className="flex items-center gap-3">
                  <span className="text-xl">{entryMoodData.emoji}</span>
                  <span className={`font-medium capitalize ${entryMoodData.color}`}>
                    {entry.mood}
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-slate-200">{entry.confidence}%</div>
                  <div className="text-xs text-slate-400">
                    {new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            );
          })}
          {moodHistory.length === 0 && (
            <div className="text-center text-slate-500 py-8">
              <Activity className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>No mood data yet</p>
              <p className="text-sm">Start detection to see history</p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Mood Overview */}
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-2xl p-6 border border-slate-700">
        <h3 className="text-lg font-semibold text-slate-100 mb-4">Mood Palette</h3>
        <div className="grid grid-cols-4 gap-2">
          {Object.entries(moodData).map(([mood, data]) => (
            <div
              key={mood}
              className={`rounded-lg p-2 text-center transition-all cursor-pointer hover:scale-105 hover:bg-slate-700/50 ${
                currentMood === mood ? `bg-slate-700 ring-2 ${data.borderColor}` : 'bg-slate-700/20'
              }`}
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