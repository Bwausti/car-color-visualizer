"use client";

import { useState } from "react";
import Link from "next/link";
import BeforeAfterSlider from "@/components/BeforeAfterSlider";
import type { ResultData } from "@/lib/storage";

interface Props {
  result: ResultData;
}

export default function ResultView({ result }: Props) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = `data:image/jpeg;base64,${result.resultImage}`;
    link.download = `car-${result.targetColor.replace(/\s+/g, "-").toLowerCase()}.jpg`;
    link.click();
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <header className="border-b border-zinc-800/40 sticky top-0 z-10 bg-zinc-950/90 backdrop-blur-md">
        <div className="max-w-3xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
            <div className="w-1.5 h-5 bg-gradient-to-b from-white to-zinc-500 rounded-full" />
            <span className="text-sm font-semibold text-zinc-200 tracking-wide">ColorShift</span>
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-12 space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">
            {result.targetColor}
          </h2>
          <p className="text-zinc-600 text-xs tracking-wide">
            Generated {new Date(result.createdAt).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        </div>

        <div className="space-y-3">
          <p className="text-xs text-zinc-600 text-center tracking-wide">
            Drag the slider to compare
          </p>
          <div className="rounded-xl overflow-hidden border border-zinc-800/60">
            <BeforeAfterSlider
              beforeImage={result.originalImage}
              afterImage={result.resultImage}
              beforeLabel="Original"
              afterLabel={result.targetColor}
            />
          </div>
        </div>

        <div className="flex gap-3 justify-center">
          <button
            onClick={handleDownload}
            className="text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-5 py-2.5 rounded-lg transition-colors font-medium"
          >
            Download
          </button>
          <button
            onClick={handleShare}
            className="text-xs bg-white hover:bg-zinc-200 text-zinc-900 px-5 py-2.5 rounded-lg transition-colors font-medium"
          >
            {copied ? "Copied!" : "Copy Link"}
          </button>
          <Link
            href="/"
            className="text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-5 py-2.5 rounded-lg transition-colors font-medium"
          >
            Try Your Car
          </Link>
        </div>
      </main>
    </div>
  );
}
