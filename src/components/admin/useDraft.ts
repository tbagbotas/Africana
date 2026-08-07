"use client";

import { useEffect } from "react";

export function useDraft<T>(
  key: string,
  value: T,
  setValue: (value: T) => void
) {
  // Load saved draft
  useEffect(() => {
    const saved = localStorage.getItem(key);

    if (saved !== null) {
      try {
        setValue(JSON.parse(saved));
      } catch {
        setValue(saved as T);
      }
    }
  }, [key, setValue]);

  // Save draft whenever it changes
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);
}