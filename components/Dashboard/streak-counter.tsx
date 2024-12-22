// components/SimpleCountdown.tsx
import React, { useEffect, useState } from 'react';

export default function StreakCountdown({
  latestEntryTime,
  streakDuration,
}: {
  latestEntryTime: string;
  streakDuration: number;
}) {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const entryTime = new Date(latestEntryTime).getTime();
      const endTime = entryTime + streakDuration; // Add streak duration in milliseconds
      const difference = endTime - now;

      if (difference <= 0) {
        setTimeLeft('00:00:00');
        return;
      }

      const hours = String(
        Math.floor((difference / (1000 * 60 * 60)) % 24)
      ).padStart(2, '0');
      const minutes = String(
        Math.floor((difference / (1000 * 60)) % 60)
      ).padStart(2, '0');
      const seconds = String(Math.floor((difference / 1000) % 60)).padStart(
        2,
        '0'
      );

      setTimeLeft(`${hours}:${minutes}:${seconds}`);
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(interval);
  }, [latestEntryTime, streakDuration]);

  return (
    <h1 className="text-sm font-medium text-muted-foreground">
      Resets in {timeLeft}
    </h1>
  );
}
