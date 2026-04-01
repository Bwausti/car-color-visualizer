"use client";

import { useState } from "react";
import { CAR_COLORS, CarColor } from "@/lib/colors";

interface ColorPickerProps {
  selectedColor: string;
  onColorChange: (colorName: string, hex: string) => void;
}

export default function ColorPicker({
  selectedColor,
  onColorChange,
}: ColorPickerProps) {
  const [hex, setHex] = useState("#3b82f6");
  const [hexInput, setHexInput] = useState("#3b82f6");
  const [presetActive, setPresetActive] = useState(false);

  const applyHex = (newHex: string) => {
    setHex(newHex);
    setHexInput(newHex);
    setPresetActive(false);
    onColorChange(newHex, newHex);
  };

  const handleHexInputChange = (val: string) => {
    setHexInput(val);
    // Auto-apply if valid hex
    const clean = val.startsWith("#") ? val : `#${val}`;
    if (/^#[0-9A-Fa-f]{6}$/.test(clean)) {
      applyHex(clean);
    }
  };

  const handlePresetClick = (color: CarColor) => {
    setHex(color.hex);
    setHexInput(color.hex);
    setPresetActive(true);
    onColorChange(color.name, color.hex);
  };

  const handleEyedropper = async () => {
    try {
      // @ts-expect-error EyeDropper API not in all TS libs
      const dropper = new EyeDropper();
      const result = await dropper.open();
      if (result?.sRGBHex) {
        applyHex(result.sRGBHex);
      }
    } catch {
      // user cancelled or unsupported
    }
  };

  return (
    <div className="space-y-4">
      {/* Primary: Color picker + hex input */}
      <div className="flex items-center gap-3">
        {/* Color swatch (opens native picker) */}
        <div className="relative flex-shrink-0">
          <div
            className="w-12 h-12 rounded-xl shadow-lg cursor-pointer ring-2 ring-white/10 ring-offset-2 ring-offset-zinc-900 hover:ring-white/25 transition-all"
            style={{ backgroundColor: hex }}
          >
            <input
              type="color"
              value={hex}
              onChange={(e) => applyHex(e.target.value)}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          </div>
        </div>

        {/* Hex input */}
        <div className="flex-1">
          <input
            type="text"
            value={hexInput}
            onChange={(e) => handleHexInputChange(e.target.value)}
            placeholder="#000000"
            spellCheck={false}
            className="w-full bg-zinc-800/60 border border-zinc-700/50 rounded-lg px-3 py-2.5 text-sm text-zinc-100 font-mono placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500 transition-colors"
          />
        </div>

        {/* Eyedropper button */}
        <button
          onClick={handleEyedropper}
          title="Pick color from screen"
          className="flex-shrink-0 w-10 h-10 rounded-lg bg-zinc-800/60 border border-zinc-700/50 flex items-center justify-center text-zinc-400 hover:text-white hover:border-zinc-500 transition-colors"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <path d="m2 22 1-1h3l9-9" />
            <path d="M3 21v-3l9-9" />
            <path d="m15 6 3.4-3.4a2.1 2.1 0 1 1 3 3L18 9l.4.4a2.1 2.1 0 1 1-3 3l-3.8-3.8a2.1 2.1 0 1 1 3-3L15 6" />
          </svg>
        </button>
      </div>

      {/* Divider */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-zinc-800" />
        <span className="text-[10px] text-zinc-600 uppercase tracking-widest">or pick a preset</span>
        <div className="flex-1 h-px bg-zinc-800" />
      </div>

      {/* Preset colors — small dots */}
      <div className="flex flex-wrap gap-2 justify-center">
        {CAR_COLORS.map((color: CarColor) => (
          <button
            key={color.name}
            title={color.name}
            onClick={() => handlePresetClick(color)}
            className="group relative"
          >
            <div
              className={`w-7 h-7 rounded-full transition-all duration-150 hover:scale-125 ${
                selectedColor === color.name && presetActive
                  ? "ring-2 ring-white/40 ring-offset-1 ring-offset-zinc-900 scale-110"
                  : ""
              }`}
              style={{ backgroundColor: color.hex }}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
