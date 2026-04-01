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
  const [customHex, setCustomHex] = useState("#1a3a5c");
  const [customName, setCustomName] = useState("");
  const [isCustomActive, setIsCustomActive] = useState(false);

  const handleCustomColorChange = (hex: string) => {
    setCustomHex(hex);
    setIsCustomActive(true);
    const name = customName || "Custom Color";
    onColorChange(name, hex);
  };

  const handleCustomNameChange = (name: string) => {
    setCustomName(name);
    if (isCustomActive) {
      onColorChange(name || "Custom Color", customHex);
    }
  };

  const handleCustomClick = () => {
    setIsCustomActive(true);
    onColorChange(customName || "Custom Color", customHex);
  };

  return (
    <div className="space-y-5">
      {/* Custom Color — Primary, always visible */}
      <div
        className={`rounded-2xl border-2 transition-all duration-200 overflow-hidden ${
          isCustomActive
            ? "border-zinc-400 bg-zinc-800"
            : "border-zinc-700 bg-zinc-800/60"
        }`}
        onClick={handleCustomClick}
      >
        <div className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-1.5 h-4 bg-zinc-400 rounded-full" />
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-widest">
              Custom Color
            </span>
          </div>

          <div className="flex items-center gap-4">
            {/* Large color swatch / native picker */}
            <div className="relative flex-shrink-0">
              <div
                className="w-16 h-16 rounded-xl shadow-lg border-2 border-white/10 overflow-hidden cursor-pointer transition-transform hover:scale-105"
                style={{ backgroundColor: customHex }}
              >
                <input
                  type="color"
                  value={customHex}
                  onChange={(e) => handleCustomColorChange(e.target.value)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>
            </div>

            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-sm text-zinc-500 font-mono">{customHex}</span>
              </div>
              <input
                type="text"
                placeholder="Name this color (optional)"
                value={customName}
                onChange={(e) => handleCustomNameChange(e.target.value)}
                onClick={(e) => e.stopPropagation()}
                className="w-full text-sm bg-zinc-700/60 border border-zinc-600 rounded-lg px-3 py-2 text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-zinc-400 transition-colors"
              />
            </div>
          </div>

          <p className="text-xs text-zinc-500 mt-3">
            Click the swatch to open the color picker
          </p>
        </div>
      </div>

      {/* Quick Picks — Secondary */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-1.5 h-4 bg-zinc-600 rounded-full" />
          <span className="text-xs font-semibold text-zinc-500 uppercase tracking-widest">
            Popular Colors
          </span>
        </div>
        <div className="grid grid-cols-5 sm:grid-cols-7 gap-2.5">
          {CAR_COLORS.map((color: CarColor) => (
            <button
              key={color.name}
              title={color.description}
              onClick={() => {
                setIsCustomActive(false);
                onColorChange(color.name, color.hex);
              }}
              className={`group relative flex flex-col items-center gap-1.5 p-2 rounded-xl transition-all duration-150 ${
                selectedColor === color.name && !isCustomActive
                  ? "ring-2 ring-zinc-400 ring-offset-2 ring-offset-zinc-900 bg-zinc-700"
                  : "hover:bg-zinc-800"
              }`}
            >
              <div
                className="w-8 h-8 rounded-full shadow-md border border-white/10"
                style={{ backgroundColor: color.hex }}
              />
              <span className="text-[9px] text-zinc-500 text-center leading-tight font-medium line-clamp-2 group-hover:text-zinc-300 transition-colors">
                {color.name}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
