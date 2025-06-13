export const getMoodGradient = (mood: string) => {
  switch (mood) {
    case "happy":
      return "from-yellow-300 via-amber-400 to-orange-500";
    case "sad":
      return "from-sky-400 via-blue-500 to-indigo-600";
    case "angry":
      return "from-red-500 via-rose-600 to-pink-700";
    case "surprised":
      return "from-fuchsia-500 via-purple-600 to-violet-700";
    case "fearful":
      return "from-slate-500 via-gray-600 to-zinc-700";
    case "disgusted":
      return "from-lime-400 via-green-500 to-emerald-600";
    case "neutral":
      return "from-slate-300 via-gray-400 to-zinc-500";
    default:
      return "from-slate-200 via-gray-200 to-zinc-200";
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