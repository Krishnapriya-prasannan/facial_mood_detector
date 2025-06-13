export const getMoodGradient = (mood: string) => {
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

export const moodData = {
  happy: { emoji: "😊", color: "text-yellow-600", bgColor: "bg-yellow-50", borderColor: "border-yellow-200" },
  sad: { emoji: "😢", color: "text-blue-600", bgColor: "bg-blue-50", borderColor: "border-blue-200" },
  angry: { emoji: "😠", color: "text-red-600", bgColor: "bg-red-50", borderColor: "border-red-200" },
  surprised: { emoji: "😲", color: "text-purple-600", bgColor: "bg-purple-50", borderColor: "border-purple-200" },
  fearful: { emoji: "😨", color: "text-gray-600", bgColor: "bg-gray-50", borderColor: "border-gray-200" },
  disgusted: { emoji: "🤢", color: "text-green-600", bgColor: "bg-green-50", borderColor: "border-green-200" },
  neutral: { emoji: "😐", color: "text-slate-600", bgColor: "bg-slate-50", borderColor: "border-slate-200" },
};

export const moodQuotes = {
  happy: "Happiness radiates from within like sunshine.",
  sad: "Every storm eventually clears to reveal the rainbow.",
  angry: "In the depths of calm lies your greatest strength.",
  surprised: "Life's surprises are the universe's way of keeping us curious.",
  fearful: "Courage isn't the absence of fear, it's moving forward despite it.",
  disgusted: "Sometimes we must feel disgust to appreciate beauty.",
  neutral: "In stillness, we find our center and inner peace.",
};

export interface MoodHistory {
  mood: string;
  confidence: number;
  timestamp: number;
}