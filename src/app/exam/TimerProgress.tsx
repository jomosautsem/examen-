"use client";

import { useState, useEffect } from 'react';

type TimerProgressProps = {
  duration: number; // Duration in seconds
};

export function TimerProgress({ duration }: TimerProgressProps) {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev <= 0) {
          clearInterval(interval);
          return 0;
        }
        return prev - (100 / duration);
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [duration]);

  return (
    <div
      className="relative h-20 w-20"
    >
      <svg className="h-full w-full" viewBox="0 0 100 100">
        {/* Background circle */}
        <circle
          className="stroke-current text-gray-200 dark:text-gray-700"
          strokeWidth="10"
          cx="50"
          cy="50"
          r="40"
          fill="transparent"
        ></circle>
        {/* Progress circle */}
        <circle
          className="stroke-current text-primary transition-all duration-1000 ease-linear"
          strokeWidth="10"
          strokeLinecap="round"
          cx="50"
          cy="50"
          r="40"
          fill="transparent"
          strokeDasharray="251.2"
          strokeDashoffset={`calc(251.2 - (251.2 * ${progress}) / 100)`}
          transform="rotate(-90 50 50)"
        ></circle>
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-foreground">
        {Math.ceil((progress / 100) * duration)}
      </span>
    </div>
  );
}
