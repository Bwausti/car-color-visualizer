"use client";

import { useState, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";

const PRESETS = [
  { name: "Midnight Black", hex: "#0a0a0a" },
  { name: "Pearl White", hex: "#f5f5f0" },
  { name: "Racing Red", hex: "#cc0000" },
  { name: "Deep Blue", hex: "#1a237e" },
  { name: "Forest Green", hex: "#2d5a27" },
  { name: "Silver", hex: "#a8a9ad" },
  { name: "Burgundy", hex: "#800020" },
  { name: "Gold", hex: "#c5a028" },
  { name: "Matte Gray", hex: "#6b6b6b" },
  { name: "Electric Blue", hex: "#0066ff" },
  { name: "Orange", hex: "#ff6600" },
  { name: "BRG", hex: "#004225" },
];

const STEPS = [
  "Analyzing vehicle...",
  "Mapping paint surfaces...",
  "Applying color...",
  "Blending finish...",
  "Rendering...",
];

function EmbedContent() {
  const searchParams = useSearchParams();
  const logoUrl = searchParams.get("logo");

  const [image, setImage] = useState<string | null>(null);
  const [colorName, setColorName] = useState("Custom");
  const [colorHex, setColorHex] = useState("#3b82f6");
  const [loading, setLoading] = useState(false);
  const [loadStep, setLoadStep] = useState(0);
  const [result, setResult] = useState<{ img: string; id: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [sliderPos, setSliderPos] = useState(50);
  const [dragging, setDragging] = useState(false);

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) return;
    const r = new FileReader();
    r.onload = (e) => {
      setImage(e.target?.result as string);
      setResult(null);
      setError(null);
    };
    r.readAsDataURL(file);
  }, []);

  const visualize = async () => {
    if (!image) return;
    setLoading(true);
    setError(null);
    setResult(null);
    setLoadStep(0);

    const stepTimer = setInterval(() => {
      setLoadStep((s) => (s + 1) % STEPS.length);
    }, 2000);

    try {
      const res = await fetch("/api/visualize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image, targetColor: colorName }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setResult({ img: data.resultImage, id: data.resultId });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error");
    } finally {
      clearInterval(stepTimer);
      setLoading(false);
    }
  };

  const updateSlider = useCallback((clientX: number, el: HTMLDivElement) => {
    const rect = el.getBoundingClientRect();
    setSliderPos(Math.min(Math.max(((clientX - rect.left) / rect.width) * 100, 0), 100));
  }, []);

  // Result view with before/after
  if (result && image) {
    const beforeSrc = image.startsWith("data:") ? image : `data:image/jpeg;base64,${image}`;
    const afterSrc = `data:image/jpeg;base64,${result.img}`;

    return (
      <div className="h-screen bg-zinc-950 flex flex-col">
        {/* Compact slider */}
        <div
          className="flex-1 relative select-none cursor-col-resize overflow-hidden"
          onMouseDown={(e) => { setDragging(true); updateSlider(e.clientX, e.currentTarget as HTMLDivElement); }}
          onMouseMove={(e) => { if (dragging) updateSlider(e.clientX, e.currentTarget as HTMLDivElement); }}
          onMouseUp={() => setDragging(false)}
          onMouseLeave={() => setDragging(false)}
          onTouchMove={(e) => updateSlider(e.touches[0].clientX, e.currentTarget as HTMLDivElement)}
          style={{ touchAction: "none" }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={afterSrc} alt="After" className="w-full h-full object-contain" draggable={false} />
          <div className="absolute inset-0 overflow-hidden" style={{ width: `${sliderPos}%` }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={beforeSrc} alt="Before" className="h-full object-contain" style={{ width: "100vw", maxWidth: "none" }} draggable={false} />
          </div>
          <div className="absolute top-0 bottom-0 w-px bg-white/60" style={{ left: `${sliderPos}%` }}>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l-4 3 4 3M16 9l4 3-4 3" />
              </svg>
            </div>
          </div>
          <div className="absolute bottom-2 left-2 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded-full">Original</div>
          <div className="absolute bottom-2 right-2 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded-full">{colorName}</div>
        </div>

        {/* Bottom bar */}
        <div className="flex items-center gap-2 p-3 border-t border-zinc-800/60 bg-zinc-900/50">
          <button
            onClick={() => { setResult(null); }}
            className="text-xs text-zinc-400 hover:text-white px-3 py-2 rounded-lg hover:bg-zinc-800 transition-colors"
          >
            ← New Color
          </button>
          <div className="flex-1" />
          <a
            href={`/result/${result.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs bg-white text-zinc-900 px-4 py-2 rounded-lg font-medium hover:bg-zinc-200 transition-colors"
          >
            Share
          </a>
        </div>
      </div>
    );
  }

  // Loading view
  if (loading) {
    return (
      <div className="h-screen bg-zinc-950 flex flex-col items-center justify-center">
        <div className="relative w-12 h-12 mb-4">
          <svg className="w-full h-full animate-spin" style={{ animationDuration: "2s" }} viewBox="0 0 50 50">
            <circle cx="25" cy="25" r="20" fill="none" stroke="rgb(39,39,42)" strokeWidth="3" />
            <circle cx="25" cy="25" r="20" fill="none" stroke="rgb(161,161,170)" strokeWidth="3" strokeLinecap="round" strokeDasharray="60 70" />
          </svg>
        </div>
        <p className="text-zinc-400 text-sm">{STEPS[loadStep]}</p>
      </div>
    );
  }

  // Upload + color select view
  return (
    <div className="h-screen bg-zinc-950 flex flex-col overflow-auto">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-zinc-800/40 flex-shrink-0">
        {logoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={logoUrl} alt="Logo" className="h-6 object-contain" />
        ) : (
          <>
            <div className="w-1 h-4 bg-gradient-to-b from-white to-zinc-500 rounded-full" />
            <span className="text-xs font-semibold text-zinc-300 tracking-wide">ColorShift</span>
          </>
        )}
      </div>

      <div className="flex-1 p-4 space-y-4 overflow-auto">
        {/* Upload */}
        <div
          className={`rounded-xl border border-dashed transition-colors ${
            image ? "border-transparent" : "border-zinc-700 hover:border-zinc-500 bg-zinc-900/30"
          }`}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}
        >
          {image ? (
            <div className="relative group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={image} alt="Car" className="w-full rounded-xl object-contain" style={{ maxHeight: "250px" }} />
              <label className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/50 rounded-xl transition-colors cursor-pointer">
                <span className="opacity-0 group-hover:opacity-100 text-white text-xs bg-white/10 backdrop-blur px-3 py-1.5 rounded-lg border border-white/20 transition-opacity">Change</span>
                <input type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
              </label>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center py-12 cursor-pointer">
              <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center mb-3">
                <svg className="w-5 h-5 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
              </div>
              <p className="text-zinc-400 text-sm">Upload car photo</p>
              <p className="text-zinc-700 text-[10px] mt-1">or drag & drop</p>
              <input type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
            </label>
          )}
        </div>

        {/* Color selection — compact */}
        <div className="space-y-3">
          {/* Custom picker */}
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-lg overflow-hidden flex-shrink-0" style={{ backgroundColor: colorHex }}>
              <input
                type="color"
                value={colorHex}
                onChange={(e) => { setColorHex(e.target.value); setColorName(`Custom ${e.target.value}`); }}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
            <input
              type="text"
              value={colorName.startsWith("Custom") ? "" : colorName}
              placeholder="Color name..."
              onChange={(e) => setColorName(e.target.value || `Custom ${colorHex}`)}
              className="flex-1 bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-600"
            />
          </div>

          {/* Presets — small dots */}
          <div className="flex flex-wrap gap-1.5">
            {PRESETS.map((c) => (
              <button
                key={c.name}
                title={c.name}
                onClick={() => { setColorName(c.name); setColorHex(c.hex); }}
                className={`w-6 h-6 rounded-full transition-all hover:scale-125 ${
                  colorName === c.name ? "ring-2 ring-white/40 ring-offset-1 ring-offset-zinc-950" : ""
                }`}
                style={{ backgroundColor: c.hex }}
              />
            ))}
          </div>
        </div>

        {error && (
          <p className="text-red-400 text-xs">{error}</p>
        )}
      </div>

      {/* Sticky CTA */}
      <div className="p-4 border-t border-zinc-800/40 flex-shrink-0">
        <button
          onClick={visualize}
          disabled={!image}
          className="w-full py-3 rounded-xl text-sm font-semibold bg-white text-zinc-900 hover:bg-zinc-100 disabled:bg-zinc-800 disabled:text-zinc-600 disabled:cursor-not-allowed transition-colors"
        >
          Visualize
        </button>
      </div>
    </div>
  );
}

export default function EmbedPage() {
  return (
    <Suspense fallback={<div className="h-screen bg-zinc-950 flex items-center justify-center text-zinc-600 text-xs">Loading...</div>}>
      <EmbedContent />
    </Suspense>
  );
}
