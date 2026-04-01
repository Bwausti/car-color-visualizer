"use client";

import { useCallback, useState } from "react";

interface ImageUploaderProps {
  onImageSelect: (base64: string, file: File) => void;
  currentImage: string | null;
}

export default function ImageUploader({
  onImageSelect,
  currentImage,
}: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);

  const processFile = useCallback(
    (file: File) => {
      if (!file.type.startsWith("image/")) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        onImageSelect(result, file);
      };
      reader.readAsDataURL(file);
    },
    [onImageSelect]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) processFile(file);
    },
    [processFile]
  );

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  return (
    <div
      className={`relative rounded-xl transition-all duration-300 overflow-hidden ${
        isDragging
          ? "ring-2 ring-blue-500/50 bg-blue-500/5"
          : currentImage
          ? "bg-transparent"
          : "bg-zinc-800/50 hover:bg-zinc-800/80 border border-dashed border-zinc-700 hover:border-zinc-500"
      }`}
      style={{ minHeight: "300px" }}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
    >
      {currentImage ? (
        <div className="relative group">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={currentImage}
            alt="Uploaded car"
            className="w-full h-full object-contain rounded-xl"
            style={{ maxHeight: "400px" }}
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-300 rounded-xl flex items-center justify-center">
            <label className="opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer bg-white/10 backdrop-blur-md text-white px-5 py-2.5 rounded-lg font-medium text-sm border border-white/20 hover:bg-white/20">
              Change Photo
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileInput}
              />
            </label>
          </div>
        </div>
      ) : (
        <label className="flex flex-col items-center justify-center h-full cursor-pointer p-10">
          <div className="w-14 h-14 rounded-full bg-zinc-700/50 flex items-center justify-center mb-5">
            <svg
              className="w-6 h-6 text-zinc-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </div>
          <p className="text-zinc-300 font-medium text-sm mb-1">
            Drop your car photo here
          </p>
          <p className="text-zinc-600 text-xs mb-5">
            JPG, PNG up to 10MB
          </p>
          <span className="text-xs text-zinc-400 border border-zinc-700 px-4 py-2 rounded-lg hover:border-zinc-500 hover:text-zinc-300 transition-colors">
            Browse Files
          </span>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileInput}
          />
        </label>
      )}
    </div>
  );
}
