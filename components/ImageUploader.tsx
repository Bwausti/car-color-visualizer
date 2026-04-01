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
      className={`relative border-2 border-dashed rounded-2xl transition-all duration-200 overflow-hidden ${
        isDragging
          ? "border-blue-500 bg-blue-50"
          : currentImage
          ? "border-transparent"
          : "border-gray-300 hover:border-gray-400 bg-gray-50 hover:bg-gray-100"
      }`}
      style={{ minHeight: "280px" }}
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
            className="w-full h-full object-contain rounded-2xl"
            style={{ maxHeight: "400px" }}
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-200 rounded-2xl flex items-center justify-center">
            <label className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer bg-white text-gray-800 px-4 py-2 rounded-full font-medium text-sm shadow-lg">
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
          <div className="w-16 h-16 bg-gray-200 rounded-2xl flex items-center justify-center mb-4">
            <svg
              className="w-8 h-8 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
          <p className="text-gray-700 font-semibold text-lg mb-1">
            Drop your car photo here
          </p>
          <p className="text-gray-400 text-sm mb-4">
            or click to browse files
          </p>
          <span className="bg-blue-600 text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-blue-700 transition-colors">
            Choose Photo
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
