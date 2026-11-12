"use client";

import Image from "next/image";

interface MediaLibraryProps {
  images: string[];
  onSelect: (image: string) => void;
}

export default function MediaLibrary({
  images,
  onSelect,
}: MediaLibraryProps) {
  return (
    <div className="rounded-xl bg-white p-6 shadow">
      <h2 className="mb-4 text-xl font-bold">
        Media Library
      </h2>

      {images.length === 0 ? (
        <p className="text-gray-500">
          No images uploaded yet.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {images.map((image) => (
            <button
              key={image}
              type="button"
              onClick={() => onSelect(image)}
              className="overflow-hidden rounded-lg border hover:border-emerald-600"
            >
              <Image
                src={image}
                alt="Media"
                width={400}
                height={200}
                unoptimized
                className="h-32 w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}