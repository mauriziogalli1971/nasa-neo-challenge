import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCloseApproachDate(closeApproachDate: string): string {
  return format(parseISO(closeApproachDate), "dd MMM yyyy", { locale: it });
}

import { Asteroid, CloseApproachDatum } from "@/src/types/types";
import { format, isAfter, parseISO, startOfDay } from "date-fns";
import { it } from "date-fns/locale";

/**
 * Trova il passaggio ravvicinato più vicino nel futuro rispetto ad oggi.
 * Se non ci sono passaggi futuri, restituisce l'ultimo passaggio registrato.
 */
export const findNextCloseApproach = (data: CloseApproachDatum[]): CloseApproachDatum | null => {
  if (!data || data.length === 0) return null;

  const today = startOfDay(new Date());
  const futureApproaches = data.filter((approach) => {
    const approachDate = parseISO(approach.closeApproachDate);
    return isAfter(approachDate, today) || approachDate.getTime() === today.getTime();
  });

  if (futureApproaches.length > 0) {
    return futureApproaches.sort((a, b) => a.epochDateCloseApproach - b.epochDateCloseApproach)[0];
  }

  // Fallback: se non ci sono date future (raro), prendiamo la più recente nel passato
  return [...data.sort((a, b) => b.epochDateCloseApproach - a.epochDateCloseApproach)][0];
};

// Utility per il calcolo della velocità massima dei NEO
export const getMaxVelocity = (asteroids: Asteroid[]): number => {
  const fastest = asteroids.reduce((a, b) => {
    const velocityA = a.closeApproachData[0]?.relativeVelocity.kilometersPerHour || 0;
    const velocityB = b.closeApproachData[0]?.relativeVelocity.kilometersPerHour || 0;
    return velocityA > velocityB ? a : b;
  }, asteroids[0]);
  const STEP = 10000;
  let maxVelocity = fastest.closeApproachData[0]?.relativeVelocity.kilometersPerHour || 0;
  maxVelocity = Math.ceil(maxVelocity / STEP) * STEP;
  return maxVelocity;
};
