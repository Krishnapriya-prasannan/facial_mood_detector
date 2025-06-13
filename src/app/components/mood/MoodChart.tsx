"use client";

import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { MoodHistory } from "@/lib/mood-utils";

interface MoodChartProps {
  moodHistory: MoodHistory[];
}

const MoodChart: React.FC<MoodChartProps> = ({ moodHistory }) => {
  const formattedHistory = moodHistory.map(entry => ({
    ...entry,
    time: new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
  }));

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-2xl p-6 border border-slate-700">
      <h3 className="text-lg font-semibold text-slate-100 mb-4">Mood Fluctuation</h3>
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <LineChart
            data={formattedHistory}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
            <XAxis dataKey="time" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(30, 41, 59, 0.8)',
                borderColor: '#475569'
              }}
              labelStyle={{ color: '#cbd5e1' }}
            />
            <Legend wrapperStyle={{ color: '#cbd5e1' }} />
            <Line type="monotone" dataKey="confidence" stroke="#818cf8" activeDot={{ r: 8 }} />
            <Line type="monotone" dataKey="mood" stroke="#a78bfa" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default MoodChart;