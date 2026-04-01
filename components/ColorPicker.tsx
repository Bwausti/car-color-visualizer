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
  const [customHex, setCustomHex] = useState("#3b82f6");
  const [customName, setCustomName] = useState("");
  const [isCustomActive, setIsCustomActive] = useState(true);

  const handleCustomColorChange = (hex: string) => {
    setCustomHex(hex);
    setIsCustomActive(true);
    onColorChange(customName || `Custom ${hex}`, hex);
  };

  const handleCustomNameChange = (name: string) => {
    setCustomName(name);
    if (isCustomActive) {
      onColorChange(name || `Custom ${customHex}`, customHex);
    }
  };

  const handlePresetClick = (color: CarColor) => {
    setIsCustomActive(false);
    onColorChange(color.name, color.hex);
  };

  return (
    <div className="space-y-5">
      {/* Custom color - always visible, prominent */}
      <div className="flex items-center gap-4">
        <div className="relative group">
          <div
            className={`w-16 h-16 rounded-xl shadow-lg cursor-pointer transition-all duration-200 hover:scale-105 ${
              isCustomActive ? "ring-2 ring-white/30 ring-offset-2 ring-offset-zinc-900" : ""
            }`}
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
        <div className="flex-1 min-w-0">
          <input
            type="text"
            placeholder="Name this color..."
            value={customName}
            onChange={(e) => handleCustomNameChange(e.target.value)}
            className="w-full bg-zinc-800/50 border border-zinc-700/50 rounded-lg px-3 py-2 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500 transition-colors"
          />
          <p className="text-zinc-600 text-[10px] mt-1.5 font-mono">{customHex}</p>
        </div>
      </div>

      {/* Divider */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-zinc-800" />
        <span className="text-[10px] text-zinc-600 uppercase tracking-widest">Presets</span>
        <div className="flex-1 h-px bg-zinc-800" />
      </div>

      {/* Preset colors - compact grid */}
      <div className="grid grid-cols-6 gap-2">
        {CAR_COLORS.map((color: CarColor) => (
          <button
            key={color.name}
            title={color.name}
            onClick={() => handlePresetClick(color)}
            className="group relative"
          >
            <div
              className={`w-full aspect-square rounded-lg transition-all duration-200 hover:scale-110 hover:shadow-lg ${
                selectedColor === color.name && !isCustomActive
                  ? "ring-2 ring-white/40 ring-offset-1 ring-offset-zinc-900 scale-110"
                  : "hover:ring-1 hover:ring-white/20"
              }`}
              style={{ backgroundColor: color.hex }}
            />
            <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-[8px] text-zinc-500 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              {color.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
