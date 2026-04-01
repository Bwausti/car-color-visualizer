"use client";

import { useEffect, useState } from "react";

const LOADING_MESSAGES = [
  "Analyzing your vehicle...",
  "Applying paint color...",
  "Blending metallic finish...",
  "Adjusting light reflections...",
  "Finalizing your custom color...",
];

export default function LoadingSpinner() {
  const [messageIndex, setMessageIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const msgInterval = setInterval(() => {
      setMessageIndex((i) => (i + 1) % LOADING_MESSAGES.length);
    }, 2500);

    const progressInterval = setInterval(() => {
      setProgress((p) => {
        if (p >= 95) return p;
        return p + Math.random() * 3;
      });
    }, 800);

    return () => {
      clearInterval(msgInterval);
      clearInterval(progressInterval);
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-16 px-8">
      <div className="relative w-20 h-20 mb-6">
        <div className="absolute inset-0 rounded-full border-4 border-blue-100" />
        <div
          className="absolute inset-0 rounded-full border-4 border-blue-600 border-t-transparent animate-spin"
          style={{ animationDuration: "1s" }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <svg
            className="w-8 h-8 text-blue-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
            />
          </svg>
        </div>
      </div>

      <p className="text-gray-700 font-semibold text-lg mb-2">
        AI Recoloring in Progress
      </p>
      <p className="text-gray-400 text-sm mb-6 text-center">
        {LOADING_MESSAGES[messageIndex]}
      </p>

      <div className="w-full max-w-xs bg-gray-100 rounded-full h-1.5 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-700"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="text-gray-400 text-xs mt-2">{Math.round(progress)}%</p>
    </div>
  );
}
