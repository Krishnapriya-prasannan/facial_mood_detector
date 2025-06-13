import VideoFeed from "./components/VideoFeed";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Facial Mood Detector</h1>
      <VideoFeed />
    </main>
  );
}
