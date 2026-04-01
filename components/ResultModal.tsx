"use client";

import { useEffect } from "react";
import BeforeAfterSlider from "./BeforeAfterSlider";

interface ResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  originalImage: string;
  resultImage: string;
  colorName: string;
  resultId: string;
  onShare: () => void;
  onDownload: () => void;
  shareUrl: string | null;
  copied: boolean;
}

export default function ResultModal({
  isOpen,
  onClose,
  originalImage,
  resultImage,
  colorName,
  onShare,
  onDownload,
  shareUrl,
  copied,
}: ResultModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-[95vw] max-w-4xl max-h-[90vh] bg-zinc-900 rounded-2xl border border-zinc-700/50 shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800">
          <div>
            <h3 className="text-white font-semibold text-lg">{colorName}</h3>
            <p className="text-zinc-500 text-sm">Drag the slider to compare</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onDownload}
              className="text-sm bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-4 py-2 rounded-lg transition-colors font-medium"
            >
              Download
            </button>
            <button
              onClick={onShare}
              className="text-sm bg-white hover:bg-zinc-200 text-zinc-900 px-4 py-2 rounded-lg transition-colors font-medium"
            >
              {copied ? "Copied!" : "Share Link"}
            </button>
            <button
              onClick={onClose}
              className="ml-2 w-8 h-8 flex items-center justify-center rounded-lg text-zinc-500 hover:text-white hover:bg-zinc-800 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Share URL */}
        {shareUrl && (
          <div className="mx-6 mt-3 bg-zinc-800 rounded-lg p-3 flex items-center gap-2">
            <svg className="w-4 h-4 text-zinc-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
            <span className="text-sm text-zinc-400 truncate font-mono flex-1">{shareUrl}</span>
          </div>
        )}

        {/* Slider */}
        <div className="flex-1 overflow-auto p-6">
          <BeforeAfterSlider
            beforeImage={originalImage}
            afterImage={`data:image/jpeg;base64,${resultImage}`}
            beforeLabel="Original"
            afterLabel={colorName}
          />
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-zinc-800 text-center">
          <button
            onClick={onClose}
            className="text-sm text-zinc-500 hover:text-zinc-300 font-medium transition-colors"
          >
            ← Try a different color
          </button>
        </div>
      </div>
    </div>
  );
}
