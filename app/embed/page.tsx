"use client";

import { useState, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import BeforeAfterSlider from "@/components/BeforeAfterSlider";
import LoadingSpinner from "@/components/LoadingSpinner";

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

function EmbedContent() {
  const searchParams = useSearchParams();
  const logoUrl = searchParams.get("logo");

  const [image, setImage] = useState<string | null>(null);
  const [colorHex, setColorHex] = useState("#3b82f6");
  const [hexInput, setHexInput] = useState("#3b82f6");
  const [presetName, setPresetName] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ img: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

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

  const applyHex = (hex: string) => {
    setColorHex(hex);
    setHexInput(hex);
    setPresetName(null);
  };

  const handleHexInput = (val: string) => {
    setHexInput(val);
    const clean = val.startsWith("#") ? val : `#${val}`;
    if (/^#[0-9A-Fa-f]{6}$/.test(clean)) {
      setColorHex(clean);
      setPresetName(null);
    }
  };

  const handlePreset = (name: string, hex: string) => {
    setColorHex(hex);
    setHexInput(hex);
    setPresetName(name);
  };

  const handleEyedropper = async () => {
    try {
      // @ts-expect-error EyeDropper API
      const dropper = new EyeDropper();
      const result = await dropper.open();
      if (result?.sRGBHex) applyHex(result.sRGBHex);
    } catch { /* cancelled or unsupported */ }
  };

  const colorLabel = presetName || colorHex;

  const visualize = async () => {
    if (!image) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/visualize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image, targetColor: colorLabel }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setResult({ img: data.resultImage });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!result) return;
    const link = document.createElement("a");
    link.href = `data:image/jpeg;base64,${result.img}`;
    link.download = `car-${colorLabel.replace(/[^a-z0-9]/gi, "-").toLowerCase()}.jpg`;
    link.click();
  };

  // ─── Result view ───
  if (result && image) {
    return (
      <div className="h-screen bg-zinc-950 flex flex-col">
        <div className="flex-1 overflow-hidden p-3">
          <BeforeAfterSlider
            beforeImage={image}
            afterImage={`data:image/jpeg;base64,${result.img}`}
            beforeLabel="Original"
            afterLabel={colorLabel}
          />
        </div>
        <div className="flex items-center gap-2 p-3 border-t border-zinc-800/60 bg-zinc-900/50">
          <button
            onClick={() => setResult(null)}
            className="text-xs text-zinc-400 hover:text-white px-3 py-2 rounded-lg hover:bg-zinc-800 transition-colors"
          >
            ← New Color
          </button>
          <div className="flex-1" />
          <button
            onClick={handleDownload}
            className="text-xs bg-white text-zinc-900 px-4 py-2 rounded-lg font-medium hover:bg-zinc-200 transition-colors"
          >
            Download
          </button>
        </div>
      </div>
    );
  }

  // ─── Loading view ───
  if (loading) {
    return (
      <div className="h-screen bg-zinc-950 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  // ─── Upload + color select ───
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

        {/* Color selection — only shows after image uploaded */}
        {image && (
          <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <p className="text-xs text-zinc-500 uppercase tracking-widest font-medium">Select color via hex code or eyedropper</p>

            {/* Hex + eyedropper */}
            <div className="flex items-center gap-3">
              <div className="relative flex-shrink-0">
                <div
                  className="w-10 h-10 rounded-lg cursor-pointer ring-1 ring-white/10 hover:ring-white/25 transition-all"
                  style={{ backgroundColor: colorHex }}
                >
                  <input
                    type="color"
                    value={colorHex}
                    onChange={(e) => applyHex(e.target.value)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>
              </div>

              <input
                type="text"
                value={hexInput}
                onChange={(e) => handleHexInput(e.target.value)}
                placeholder="#000000"
                spellCheck={false}
                className="flex-1 bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-100 font-mono placeholder:text-zinc-600 focus:outline-none focus:border-zinc-600"
              />

              <button
                onClick={handleEyedropper}
                title="Pick from screen"
                className="flex-shrink-0 w-10 h-10 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white hover:border-zinc-600 transition-colors"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <path d="m2 22 1-1h3l9-9" />
                  <path d="M3 21v-3l9-9" />
                  <path d="m15 6 3.4-3.4a2.1 2.1 0 1 1 3 3L18 9l.4.4a2.1 2.1 0 1 1-3 3l-3.8-3.8a2.1 2.1 0 1 1 3-3L15 6" />
                </svg>
              </button>
            </div>

            {/* Presets */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-zinc-800" />
              <span className="text-[10px] text-zinc-700 uppercase tracking-widest">or preset</span>
              <div className="flex-1 h-px bg-zinc-800" />
            </div>

            <div className="flex flex-wrap gap-1.5 justify-center">
              {PRESETS.map((c) => (
                <button
                  key={c.name}
                  title={c.name}
                  onClick={() => handlePreset(c.name, c.hex)}
                  className={`w-6 h-6 rounded-full transition-all hover:scale-125 ${
                    presetName === c.name ? "ring-2 ring-white/40 ring-offset-1 ring-offset-zinc-950" : ""
                  }`}
                  style={{ backgroundColor: c.hex }}
                />
              ))}
            </div>
          </div>
        )}

        {error && <p className="text-red-400 text-xs">{error}</p>}
      </div>

      {/* Sticky CTA — only when image is uploaded */}
      {image && (
        <div className="p-4 border-t border-zinc-800/40 flex-shrink-0">
          <button
            onClick={visualize}
            className="w-full py-3 rounded-xl text-sm font-semibold bg-white text-zinc-900 hover:bg-zinc-100 transition-colors active:scale-[0.98]"
          >
            Visualize
          </button>
        </div>
      )}
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
