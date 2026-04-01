"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import ImageUploader from "@/components/ImageUploader";
import ColorPicker from "@/components/ColorPicker";
import BeforeAfterSlider from "@/components/BeforeAfterSlider";
import LoadingSpinner from "@/components/LoadingSpinner";

function EmbedContent() {
  const searchParams = useSearchParams();
  const logoUrl = searchParams.get("logo");

  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [selectedColorName, setSelectedColorName] = useState("Custom #3b82f6");
  const [selectedColorHex, setSelectedColorHex] = useState("#3b82f6");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{ resultImage: string; resultId: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

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
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-4 space-y-4">
      {/* Minimal header */}
      <div className="flex items-center justify-between pb-3 border-b border-zinc-800/40">
        {logoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={logoUrl} alt="Logo" className="h-8 object-contain" />
        ) : (
          <div className="flex items-center gap-2">
            <div className="w-1 h-4 bg-gradient-to-b from-white to-zinc-500 rounded-full" />
            <span className="font-semibold text-zinc-200 text-sm tracking-wide">ColorShift</span>
          </div>
        )}
      </div>

      {!result ? (
        <div className="space-y-4">
          <ImageUploader onImageSelect={handleImageSelect} currentImage={uploadedImage} />

          <div className="bg-zinc-900/50 border border-zinc-800/60 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-zinc-500 uppercase tracking-widest font-medium">Color</span>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full border border-zinc-700" style={{ backgroundColor: selectedColorHex }} />
                <span className="text-xs text-zinc-500">{selectedColorName}</span>
              </div>
            </div>
            <ColorPicker selectedColor={selectedColorName} onColorChange={handleColorChange} />
          </div>

          {error && (
            <div className="bg-red-950/20 border border-red-900/30 rounded-xl p-3 text-red-400 text-xs">
              {error}
            </div>
          )}

          {isLoading ? (
            <div className="bg-zinc-900/50 border border-zinc-800/60 rounded-xl overflow-hidden">
              <LoadingSpinner />
            </div>
          ) : (
            <button
              onClick={handleVisualize}
              disabled={!uploadedImage}
              className="w-full py-3 rounded-xl font-semibold text-sm bg-white hover:bg-zinc-100 text-zinc-900 disabled:bg-zinc-800 disabled:text-zinc-600 disabled:cursor-not-allowed transition-colors"
            >
              Visualize
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-xs text-zinc-600 text-center tracking-wide">Drag slider to compare</p>
          <BeforeAfterSlider
            beforeImage={uploadedImage!}
            afterImage={`data:image/jpeg;base64,${result.resultImage}`}
            beforeLabel="Original"
            afterLabel={selectedColorName}
          />
          <div className="flex gap-2">
            <button
              onClick={() => setResult(null)}
              className="flex-1 py-2.5 rounded-xl text-sm font-medium bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors"
            >
              ← Try Again
            </button>
            <a
              href={`/result/${result.resultId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-2.5 rounded-xl text-sm font-medium bg-white hover:bg-zinc-200 text-zinc-900 text-center transition-colors"
            >
              View & Share
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

export default function EmbedPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-zinc-950 flex items-center justify-center text-zinc-600 text-sm">Loading...</div>}>
      <EmbedContent />
    </Suspense>
  );
}
