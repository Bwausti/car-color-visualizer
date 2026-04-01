"use client";

import { useState } from "react";
import ImageUploader from "@/components/ImageUploader";
import ColorPicker from "@/components/ColorPicker";
import BeforeAfterSlider from "@/components/BeforeAfterSlider";
import LoadingSpinner from "@/components/LoadingSpinner";

interface VisualizeResult {
  resultImage: string;
  resultId: string;
}

export default function Home() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [selectedColorName, setSelectedColorName] = useState("Midnight Black");
  const [selectedColorHex, setSelectedColorHex] = useState("#0a0a0a");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<VisualizeResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleImageSelect = (base64: string) => {
    setUploadedImage(base64);
    setResult(null);
    setError(null);
    setShareUrl(null);
  };

  const handleColorChange = (name: string, hex: string) => {
    setSelectedColorName(name);
    setSelectedColorHex(hex);
  };

  const handleVisualize = async () => {
    if (!uploadedImage) return;

    setIsLoading(true);
    setError(null);
    setResult(null);
    setShareUrl(null);

    try {
      const res = await fetch("/api/visualize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image: uploadedImage,
          targetColor: selectedColorName,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to visualize color");
      }

      setResult({
        resultImage: data.resultImage,
        resultId: data.resultId,
      });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const handleShare = async () => {
    if (!result) return;
    const url = `${window.location.origin}/result/${result.resultId}`;
    setShareUrl(url);
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard failed, just show the URL
    }
  };

  const handleDownload = () => {
    if (!result) return;
    const link = document.createElement("a");
    link.href = `data:image/jpeg;base64,${result.resultImage}`;
    link.download = `car-${selectedColorName.replace(/\s+/g, "-").toLowerCase()}.jpg`;
    link.click();
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* Header */}
      <header className="border-b border-zinc-800/60 sticky top-0 z-10 bg-zinc-950/90 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Minimal car silhouette icon */}
            <svg
              className="w-7 h-7 text-zinc-300"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z" />
            </svg>
            <div>
              <h1 className="font-semibold text-zinc-100 text-sm tracking-wide">
                Car Color Visualizer
              </h1>
              <p className="text-[10px] text-zinc-500 tracking-widest uppercase">
                Powered by Google AI
              </p>
            </div>
          </div>
          <a
            href="/embed"
            className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors tracking-wide"
          >
            Embed
          </a>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12 space-y-10">
        {/* Hero */}
        <div className="text-center py-8">
          <p className="text-xs text-zinc-500 uppercase tracking-[0.3em] mb-4 font-medium">
            AI Color Studio
          </p>
          <h2 className="text-5xl sm:text-6xl font-bold text-zinc-100 mb-4 tracking-tight">
            See Your Car in{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-300 to-zinc-500">
              Any Color
            </span>
          </h2>
          <p className="text-zinc-500 text-lg max-w-xl mx-auto leading-relaxed">
            Upload a photo. Choose a color. AI handles the rest.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Left: Upload */}
          <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-6 space-y-4">
            <div className="flex items-center gap-3 mb-1">
              <span className="text-[10px] text-zinc-500 uppercase tracking-[0.2em] font-semibold">
                Step 01
              </span>
              <div className="flex-1 h-px bg-zinc-800" />
            </div>
            <h3 className="font-semibold text-zinc-200 text-base">Upload Car Photo</h3>
            <ImageUploader
              onImageSelect={handleImageSelect}
              currentImage={uploadedImage}
            />
          </div>

          {/* Right: Color picker */}
          <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-6 space-y-4">
            <div className="flex items-center gap-3 mb-1">
              <span className="text-[10px] text-zinc-500 uppercase tracking-[0.2em] font-semibold">
                Step 02
              </span>
              <div className="flex-1 h-px bg-zinc-800" />
            </div>
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-zinc-200 text-base">Choose a Color</h3>
              {/* Selected color preview inline */}
              <div className="flex items-center gap-2">
                <div
                  className="w-5 h-5 rounded-full shadow-md border border-white/10"
                  style={{ backgroundColor: selectedColorHex }}
                />
                <span className="text-xs text-zinc-400 font-medium">
                  {selectedColorName}
                </span>
              </div>
            </div>

            <ColorPicker
              selectedColor={selectedColorName}
              onColorChange={handleColorChange}
            />
          </div>
        </div>

        {/* Visualize button */}
        <div className="flex justify-center">
          <button
            onClick={handleVisualize}
            disabled={!uploadedImage || isLoading}
            className="bg-zinc-100 hover:bg-white disabled:bg-zinc-800 disabled:text-zinc-600 disabled:cursor-not-allowed text-zinc-900 font-semibold text-base px-12 py-4 rounded-xl transition-all duration-200 shadow-2xl shadow-black/40 hover:shadow-black/60 active:scale-95 tracking-wide min-w-[220px]"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-3">
                <div className="w-4 h-4 border-2 border-zinc-400 border-t-zinc-700 rounded-full animate-spin" />
                Processing...
              </span>
            ) : (
              "Visualize Color"
            )}
          </button>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden">
            <LoadingSpinner />
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-950/40 border border-red-900/60 rounded-xl p-5 flex items-start gap-3">
            <svg
              className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div>
              <p className="font-semibold text-red-300 text-sm">
                Generation failed
              </p>
              <p className="text-red-400 text-sm mt-1">{error}</p>
            </div>
          </div>
        )}

        {/* Result */}
        {result && uploadedImage && (
          <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-6 space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
                  <svg
                    className="w-3 h-3 text-emerald-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h3 className="font-semibold text-zinc-200">
                  {selectedColorName}
                </h3>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleDownload}
                  className="text-sm bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-3 py-1.5 rounded-lg transition-colors font-medium flex items-center gap-1.5"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    />
                  </svg>
                  Download
                </button>
                <button
                  onClick={handleShare}
                  className="text-sm bg-zinc-100 hover:bg-white text-zinc-900 px-3 py-1.5 rounded-lg transition-colors font-medium flex items-center gap-1.5"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                    />
                  </svg>
                  {copied ? "Copied!" : "Share"}
                </button>
              </div>
            </div>

            {/* Share URL display */}
            {shareUrl && (
              <div className="bg-zinc-800/60 rounded-xl p-3 flex items-center gap-2">
                <svg
                  className="w-4 h-4 text-zinc-500 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                  />
                </svg>
                <span className="text-sm text-zinc-400 truncate font-mono flex-1">
                  {shareUrl}
                </span>
              </div>
            )}

            <p className="text-xs text-zinc-600 text-center tracking-wide">
              Drag the slider to compare before and after
            </p>

            {/* Larger image area */}
            <div className="rounded-xl overflow-hidden">
              <BeforeAfterSlider
                beforeImage={uploadedImage}
                afterImage={`data:image/jpeg;base64,${result.resultImage}`}
                beforeLabel="Original"
                afterLabel={selectedColorName}
              />
            </div>

            {/* Try another color */}
            <div className="text-center pt-2">
              <button
                onClick={() => {
                  setResult(null);
                  setShareUrl(null);
                }}
                className="text-sm text-zinc-500 hover:text-zinc-300 font-medium transition-colors tracking-wide"
              >
                ← Try a different color
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-800/60 mt-20 py-8 text-center text-zinc-600 text-xs tracking-widest uppercase">
        <p>Car Color Visualizer &nbsp;•&nbsp; Powered by Google AI</p>
      </footer>
    </div>
  );
}
