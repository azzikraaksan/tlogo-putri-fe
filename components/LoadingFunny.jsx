import { useEffect, useState } from "react";

const LoadingFunny = () => {
  const messages = [
    "Loading...",
    "Masih loading...",
    "Sabar ya...",
    "Sebentar lagi...",
  ];

  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % messages.length);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      <div className="relative w-30 h-14 overflow-hidden">
        <div className="absolute right-0 animate-walk text-4xl">🥴</div>
      </div>
      <p className="text-lg font-semibold text-gray-700">
        {messages[messageIndex]}
      </p>

      <style jsx>{`
        @keyframes walk {
          0% {
            right: 0%;
          }
          100% {
            right: 100%;
          }
        }
        .animate-walk {
          animation: walk 1s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default LoadingFunny;
