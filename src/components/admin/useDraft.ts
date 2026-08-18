"use client";

import { useEffect, useRef } from "react";

export function useDraft<T>(
  key: string,
  value: T,
  setValue: (value: T) => void
) {
  const loaded = useRef(false);

  // Load saved draft only once
  useEffect(() => {
    const saved = localStorage.getItem(key);

    if (saved !== null) {
      try {
        setValue(JSON.parse(saved));
      } catch {
        setValue(saved as T);
      }
    }

    loaded.current = true;
  }, [key, setValue]);

  // Save changes after the initial load
  useEffect(() => {
    if (!loaded.current) return;

    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);
}