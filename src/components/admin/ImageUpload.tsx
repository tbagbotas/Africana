"use client";

import Image from "next/image";
import { useRef, useState } from "react";

interface ImageUploadProps {
  image: string;
  setImage: (value: string) => void;
}

export default function ImageUpload({
  image,
  setImage,
}: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  async function handleFileChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (!file) return;

    try {
      setUploading(true);

      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Upload failed.");
      }

      setImage(data.imageUrl);

      const saved = JSON.parse(
        localStorage.getItem("media-library") || "[]"
      );

      if (!saved.includes(data.imageUrl)) {
        localStorage.setItem(
          "media-library",
          JSON.stringify([...saved, data.imageUrl])
        );
      }
    } catch (error) {
      console.error(error);
      alert("Failed to upload image.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <h2 className="mb-4 text-xl font-bold">
        Featured Image
      </h2>

      <div
        onClick={() =>
          !uploading && fileInputRef.current?.click()
        }
        className="relative flex h-56 cursor-pointer items-center justify-center overflow-hidden rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:border-emerald-600"
      >
        {uploading ? (
          <p className="text-lg font-semibold">
            Uploading...
          </p>
        ) : image ? (
          <Image
            src={image}
            alt="Featured image preview"
            fill
            sizes="100vw"
            unoptimized
            className="rounded-lg object-cover"
          />
        ) : (
          <div className="text-center">
            <p className="text-5xl">📷</p>

            <p className="mt-3 font-medium">
              Click to choose a featured image
            </p>

            <p className="text-sm text-gray-500">
              JPG, PNG or WebP
            </p>
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}