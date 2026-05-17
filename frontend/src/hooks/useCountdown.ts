import { useState, useEffect } from "react";

const NOW = new Date().getTime();
export function useCountdown(targetEpoch: number) {
  const [timeLeft, setTimeLeft] = useState(targetEpoch - NOW);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(targetEpoch - Date.now());
    }, 1000);
    return () => clearInterval(interval);
  }, [targetEpoch]);

  const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
  const hours = Math.floor((timeLeft / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((timeLeft / 1000 / 60) % 60);
  const seconds = Math.floor((timeLeft / 1000) % 60);

  return {
    days: Math.max(0, days),
    hours: Math.max(0, hours),
    minutes: Math.max(0, minutes),
    seconds: Math.max(0, seconds),
    isPast: timeLeft < 0,
  };
}
