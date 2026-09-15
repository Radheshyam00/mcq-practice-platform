"use client";
import { useEffect, useState } from "react";

export function useTimer(initialSeconds: number, running = true, onComplete?: () => void) {
  const [seconds, setSeconds] = useState(initialSeconds);

  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => {
      setSeconds((current) => {
        if (current <= 1) {
          window.clearInterval(id);
          onComplete?.();
          return 0;
        }
        return current - 1;
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [running, onComplete]);

  return { seconds, setSeconds };
}
