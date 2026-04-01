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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
                />
              </svg>
            </div>
            <div>
              <h1 className="font-bold text-gray-900 text-base leading-tight">
                Car Color Visualizer
              </h1>
              <p className="text-xs text-gray-400">Powered by Google Imagen AI</p>
            </div>
          </div>
          <a
            href="/embed"
            className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
          >
            Embed →
          </a>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8 space-y-8">
        {/* Hero */}
        <div className="text-center py-6">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-3">
            See Your Car in{" "}
            <span className="text-blue-600">Any Color</span>
          </h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            Upload a photo, pick a color, and watch AI transform your vehicle's
            paint — instantly.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Left: Upload */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-7 h-7 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">
                1
              </span>
              <h3 className="font-semibold text-gray-800">Upload Car Photo</h3>
            </div>
            <ImageUploader
              onImageSelect={handleImageSelect}
              currentImage={uploadedImage}
            />
          </div>

          {/* Right: Color picker */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-7 h-7 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">
                2
              </span>
              <h3 className="font-semibold text-gray-800">Choose a Color</h3>
            </div>

            {/* Selected color preview */}
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-2xl">
              <div
                className="w-10 h-10 rounded-full shadow-md border-2 border-white"
                style={{ backgroundColor: selectedColorHex }}
              />
              <div>
                <p className="font-semibold text-gray-800 text-sm">
                  {selectedColorName}
                </p>
                <p className="text-xs text-gray-400 font-mono">
                  {selectedColorHex}
                </p>
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
            className="flex items-center gap-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold text-lg px-10 py-4 rounded-2xl transition-all duration-200 shadow-lg hover:shadow-blue-200 active:scale-95"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
                Visualize Color
              </>
            )}
          </button>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <LoadingSpinner />
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-5 flex items-start gap-3">
            <svg
              className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5"
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
              <p className="font-semibold text-red-700 text-sm">
                Generation failed
              </p>
              <p className="text-red-600 text-sm mt-1">{error}</p>
            </div>
          </div>
        )}

        {/* Result */}
        {result && uploadedImage && (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
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
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </span>
                <h3 className="font-semibold text-gray-800">
                  Your {selectedColorName} Vehicle
                </h3>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleDownload}
                  className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-lg transition-colors font-medium flex items-center gap-1.5"
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
                  className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg transition-colors font-medium flex items-center gap-1.5"
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
              <div className="bg-gray-50 rounded-xl p-3 flex items-center gap-2">
                <svg
                  className="w-4 h-4 text-gray-400 flex-shrink-0"
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
                <span className="text-sm text-gray-600 truncate font-mono flex-1">
                  {shareUrl}
                </span>
              </div>
            )}

            <p className="text-xs text-gray-400 text-center">
              Drag the slider to compare before and after
            </p>

            <BeforeAfterSlider
              beforeImage={uploadedImage}
              afterImage={`data:image/jpeg;base64,${result.resultImage}`}
              beforeLabel="Original"
              afterLabel={selectedColorName}
            />

            {/* Try another color */}
            <div className="text-center pt-2">
              <button
                onClick={() => {
                  setResult(null);
                  setShareUrl(null);
                }}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                ← Try a different color
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-100 mt-16 py-8 text-center text-gray-400 text-sm">
        <p>Car Color Visualizer • Powered by Google Imagen AI</p>
      </footer>
    </div>
  );
}
