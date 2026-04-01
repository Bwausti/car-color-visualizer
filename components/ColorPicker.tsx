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
  const [customHex, setCustomHex] = useState("#ff0000");
  const [customName, setCustomName] = useState("");
  const [showCustom, setShowCustom] = useState(false);

  const handleCustomColorChange = (hex: string) => {
    setCustomHex(hex);
    const name = customName || "Custom Color";
    onColorChange(name, hex);
  };

  const handleCustomNameChange = (name: string) => {
    setCustomName(name);
    if (showCustom) {
      onColorChange(name || "Custom Color", customHex);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
        {CAR_COLORS.map((color: CarColor) => (
          <button
            key={color.name}
            title={color.description}
            onClick={() => {
              setShowCustom(false);
              onColorChange(color.name, color.hex);
            }}
            className={`group relative flex flex-col items-center gap-1.5 p-2 rounded-xl transition-all duration-150 ${
              selectedColor === color.name && !showCustom
                ? "ring-2 ring-blue-500 ring-offset-2 bg-blue-50"
                : "hover:bg-gray-50"
            }`}
          >
            <div
              className="w-10 h-10 rounded-full shadow-md border border-white/50"
              style={{ backgroundColor: color.hex }}
            />
            <span className="text-[10px] text-gray-600 text-center leading-tight font-medium line-clamp-2">
              {color.name}
            </span>
          </button>
        ))}
      </div>

      {/* Custom color option */}
      <div className="border-t pt-4">
        <button
          onClick={() => {
            setShowCustom(!showCustom);
            if (!showCustom) {
              onColorChange(customName || "Custom Color", customHex);
            }
          }}
          className={`text-sm font-medium flex items-center gap-2 mb-3 transition-colors ${
            showCustom ? "text-blue-600" : "text-gray-500 hover:text-gray-700"
          }`}
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
              d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
            />
          </svg>
          Custom Color
        </button>

        {showCustom && (
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <div
                className="w-10 h-10 rounded-full shadow-md border border-gray-200 overflow-hidden cursor-pointer"
                style={{ backgroundColor: customHex }}
              >
                <input
                  type="color"
                  value={customHex}
                  onChange={(e) => handleCustomColorChange(e.target.value)}
                  className="w-full h-full opacity-0 cursor-pointer"
                />
              </div>
              <span className="text-sm text-gray-500 font-mono">
                {customHex}
              </span>
            </div>
            <input
              type="text"
              placeholder="Color name (optional)"
              value={customName}
              onChange={(e) => handleCustomNameChange(e.target.value)}
              className="flex-1 min-w-0 text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}
      </div>
    </div>
  );
}
