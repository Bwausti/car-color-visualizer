"use client";

import { useEffect } from "react";
import BeforeAfterSlider from "./BeforeAfterSlider";
import LoadingSpinner from "./LoadingSpinner";

interface ResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  originalImage: string;
  resultImage: string | null;
  colorName: string;
  resultId: string;
  onShare: () => void;
  onDownload: () => void;
  shareUrl: string | null;
  copied: boolean;
  isLoading?: boolean;
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
  isLoading,
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
      if (e.key === "Escape" && !isLoading) onClose();
    };
    if (isOpen) window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose, isLoading]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/85 backdrop-blur-md"
        onClick={isLoading ? undefined : onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-zinc-900 rounded-2xl border border-zinc-800 shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800/60">
          <div>
            <h3 className="text-white font-semibold">{isLoading ? "Generating..." : colorName}</h3>
            <p className="text-zinc-600 text-xs mt-0.5">
              {isLoading ? "AI is recoloring your vehicle" : "Drag the slider to compare"}
            </p>
          </div>
          {!isLoading && (
            <div className="flex items-center gap-2">
              <button
                onClick={onDownload}
                className="text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-4 py-2 rounded-lg transition-colors font-medium"
              >
                Download
              </button>
              <button
                onClick={onShare}
                className="text-xs bg-white hover:bg-zinc-200 text-zinc-900 px-4 py-2 rounded-lg transition-colors font-medium"
              >
                {copied ? "Copied!" : "Share Link"}
              </button>
              <button
                onClick={onClose}
                className="ml-1 w-8 h-8 flex items-center justify-center rounded-lg text-zinc-600 hover:text-white hover:bg-zinc-800 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}
        </div>

        {/* Share URL */}
        {shareUrl && !isLoading && (
          <div className="mx-6 mt-3 bg-zinc-800/50 rounded-lg p-2.5 flex items-center gap-2">
            <svg className="w-3.5 h-3.5 text-zinc-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
            <span className="text-xs text-zinc-500 truncate font-mono flex-1">{shareUrl}</span>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          {isLoading ? (
            <LoadingSpinner />
          ) : resultImage ? (
            <BeforeAfterSlider
              beforeImage={originalImage}
              afterImage={`data:image/jpeg;base64,${resultImage}`}
              beforeLabel="Original"
              afterLabel={colorName}
            />
          ) : null}
        </div>

        {/* Footer */}
        {!isLoading && (
          <div className="px-6 py-3 border-t border-zinc-800/60 text-center">
            <button
              onClick={onClose}
              className="text-xs text-zinc-600 hover:text-zinc-400 font-medium transition-colors"
            >
              ← Try a different color
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
