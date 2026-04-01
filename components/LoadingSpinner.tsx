"use client";

import { useEffect, useState } from "react";

const LOADING_MESSAGES = [
  "Analyzing vehicle geometry...",
  "Mapping paint surfaces...",
  "Applying color coat...",
  "Blending metallic finish...",
  "Rendering reflections...",
  "Final polish...",
];

export default function LoadingSpinner() {
  const [messageIndex, setMessageIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const msgInterval = setInterval(() => {
      setMessageIndex((i) => (i + 1) % LOADING_MESSAGES.length);
    }, 2200);

    const progressInterval = setInterval(() => {
      setProgress((p) => {
        if (p >= 92) return p;
        return p + Math.random() * 2.5;
      });
    }, 600);

    return () => {
      clearInterval(msgInterval);
      clearInterval(progressInterval);
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-14 px-8">
      {/* Animated ring */}
      <div className="relative w-16 h-16 mb-6">
        <svg className="w-full h-full animate-spin" style={{ animationDuration: "2s" }} viewBox="0 0 50 50">
          <circle
            cx="25" cy="25" r="20"
            fill="none"
            stroke="rgb(39,39,42)"
            strokeWidth="3"
          />
          <circle
            cx="25" cy="25" r="20"
            fill="none"
            stroke="rgb(161,161,170)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray="60 70"
          />
        </svg>
      </div>

      <p className="text-zinc-300 font-medium text-sm mb-1 tracking-wide">
        {LOADING_MESSAGES[messageIndex]}
      </p>

      {/* Progress bar */}
      <div className="w-48 mt-4">
        <div className="w-full bg-zinc-800 rounded-full h-0.5 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-zinc-500 to-zinc-300 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-zinc-600 text-[10px] mt-2 text-center font-mono">
          {Math.round(progress)}%
        </p>
      </div>
    </div>
  );
}
