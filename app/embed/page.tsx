"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import ImageUploader from "@/components/ImageUploader";
import ColorPicker from "@/components/ColorPicker";
import BeforeAfterSlider from "@/components/BeforeAfterSlider";
import LoadingSpinner from "@/components/LoadingSpinner";

function EmbedContent() {
  const searchParams = useSearchParams();
  const primaryColor = searchParams.get("primaryColor") || "3b82f6";
  const logoUrl = searchParams.get("logo");

  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [selectedColorName, setSelectedColorName] = useState("Midnight Black");
  const [selectedColorHex, setSelectedColorHex] = useState("#0a0a0a");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{ resultImage: string; resultId: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const brandColor = `#${primaryColor.replace("#", "")}`;

  const handleImageSelect = (base64: string) => {
    setUploadedImage(base64);
    setResult(null);
    setError(null);
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

    try {
      const res = await fetch("/api/visualize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: uploadedImage, targetColor: selectedColorName }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setResult({ resultImage: data.resultImage, resultId: data.resultId });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white p-4 space-y-4">
      {/* Minimal header */}
      <div className="flex items-center justify-between pb-2 border-b border-gray-100">
        {logoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={logoUrl} alt="Logo" className="h-8 object-contain" />
        ) : (
          <div className="flex items-center gap-2">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: brandColor }}
            >
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
              </svg>
            </div>
            <span className="font-semibold text-gray-800 text-sm">Car Color Visualizer</span>
          </div>
        )}
      </div>

      {!result ? (
        <>
          <ImageUploader onImageSelect={handleImageSelect} currentImage={uploadedImage} />

          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-700">Choose Color</p>
            <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-xl">
              <div className="w-7 h-7 rounded-full shadow border-2 border-white" style={{ backgroundColor: selectedColorHex }} />
              <span className="text-sm font-medium text-gray-700">{selectedColorName}</span>
            </div>
            <ColorPicker selectedColor={selectedColorName} onColorChange={handleColorChange} />
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 text-sm p-3 rounded-xl border border-red-100">
              {error}
            </div>
          )}

          {isLoading ? (
            <LoadingSpinner />
          ) : (
            <button
              onClick={handleVisualize}
              disabled={!uploadedImage}
              className="w-full py-3 rounded-xl font-semibold text-white text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              style={{ backgroundColor: brandColor }}
            >
              Visualize Color
            </button>
          )}
        </>
      ) : (
        <>
          <p className="text-xs text-gray-400 text-center">Drag slider to compare</p>
          <BeforeAfterSlider
            beforeImage={uploadedImage!}
            afterImage={`data:image/jpeg;base64,${result.resultImage}`}
            beforeLabel="Original"
            afterLabel={selectedColorName}
          />
          <div className="flex gap-2">
            <button
              onClick={() => setResult(null)}
              className="flex-1 py-2.5 rounded-xl text-sm font-medium bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
            >
              ← Try Again
            </button>
            <a
              href={`/result/${result.resultId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-2.5 rounded-xl text-sm font-medium text-white text-center transition-colors"
              style={{ backgroundColor: brandColor }}
            >
              View & Share
            </a>
          </div>
        </>
      )}
    </div>
  );
}

export default function EmbedPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-gray-400">Loading...</div>}>
      <EmbedContent />
    </Suspense>
  );
}
