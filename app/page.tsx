"use client";

import { useState } from "react";
import ImageUploader from "@/components/ImageUploader";
import ColorPicker from "@/components/ColorPicker";
import ResultModal from "@/components/ResultModal";

interface VisualizeResult {
  resultImage: string;
  resultId: string;
}

export default function Home() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [selectedColorName, setSelectedColorName] = useState("#3b82f6");
  const [selectedColorHex, setSelectedColorHex] = useState("#3b82f6");
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
      // clipboard failed
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
      {/* Subtle gradient overlay */}
      <div className="fixed inset-0 bg-gradient-to-b from-zinc-900/50 via-transparent to-zinc-900/80 pointer-events-none" />

      <div className="relative">
        {/* Header — minimal */}
        <header className="border-b border-zinc-800/40">
          <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-1.5 h-5 bg-gradient-to-b from-white to-zinc-500 rounded-full" />
              <span className="text-sm font-semibold text-zinc-200 tracking-wide">ColorShift</span>
            </div>
          </div>
        </header>

        <main className="max-w-6xl mx-auto px-6 py-16">
          {/* Hero — tight and confident */}
          <div className="text-center mb-16">
            <h1 className="text-5xl sm:text-6xl font-bold tracking-tight mb-4">
              <span className="text-white">Reimagine</span>{" "}
              <span className="text-zinc-500">your ride</span>
            </h1>
            <p className="text-zinc-500 text-base max-w-md mx-auto">
              Upload a photo. Pick a color. AI does the rest.
            </p>
          </div>

          {/* Two-column layout */}
          <div className="grid lg:grid-cols-5 gap-8 mb-12">
            {/* Left: Upload — takes more space */}
            <div className="lg:col-span-3 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs text-zinc-500 uppercase tracking-widest font-medium">Your Vehicle</h3>
                {uploadedImage && (
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full border border-zinc-700"
                      style={{ backgroundColor: selectedColorHex }}
                    />
                    <span className="text-xs text-zinc-500">{selectedColorName}</span>
                  </div>
                )}
              </div>
              <ImageUploader
                onImageSelect={handleImageSelect}
                currentImage={uploadedImage}
              />
            </div>

            {/* Right: Color picker */}
            <div className="lg:col-span-2 space-y-3">
              <h3 className="text-xs text-zinc-500 uppercase tracking-widest font-medium">New Color</h3>
              <div className="bg-zinc-900/50 border border-zinc-800/60 rounded-xl p-5">
                <ColorPicker
                  selectedColor={selectedColorName}
                  onColorChange={handleColorChange}
                />
              </div>

              {/* CTA */}
              <button
                onClick={handleVisualize}
                disabled={!uploadedImage || isLoading}
                className="w-full bg-white hover:bg-zinc-100 disabled:bg-zinc-800 disabled:text-zinc-600 disabled:cursor-not-allowed text-zinc-900 font-semibold text-sm py-3.5 rounded-xl transition-all duration-200 active:scale-[0.98]"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-3.5 h-3.5 border-2 border-zinc-400 border-t-zinc-700 rounded-full animate-spin" />
                    Processing
                  </span>
                ) : (
                  "Visualize"
                )}
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-950/20 border border-red-900/30 rounded-xl p-4 mb-8 flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-red-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-red-400 text-xs">!</span>
              </div>
              <div>
                <p className="text-red-300 text-sm font-medium">Generation failed</p>
                <p className="text-red-400/70 text-xs mt-1">{error}</p>
              </div>
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="border-t border-zinc-800/40 py-6">
          <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
            <p className="text-zinc-700 text-xs">ColorShift</p>
            <p className="text-zinc-800 text-xs">AI-Powered Color Visualization</p>
          </div>
        </footer>
      </div>

      {/* Result Modal — shows during loading AND after result */}
      {(isLoading || result) && uploadedImage && (
        <ResultModal
          isOpen={true}
          onClose={() => {
            setResult(null);
            setShareUrl(null);
          }}
          originalImage={uploadedImage}
          resultImage={result?.resultImage ?? null}
          colorName={selectedColorName}
          resultId={result?.resultId ?? ""}
          onShare={handleShare}
          onDownload={handleDownload}
          shareUrl={shareUrl}
          copied={copied}
          isLoading={isLoading}
        />
      )}
    </div>
  );
}
