import { Asteroid } from "../types/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";

export const asteroidService = {
  async getAsteroids(startDate: string, endDate: string): Promise<Asteroid[]> {
    const response = await fetch(`${API_BASE_URL}/asteroids?startDate=${startDate}&endDate=${endDate}`, {
      next: { revalidate: 3600 }, // Opzionale: Next.js cache di 1 ora
    });

    if (!response.ok) {
      throw new Error(`Errore API: ${response.statusText}`);
    }

    return response.json();
  },

  async getAsteroidById(id: string): Promise<Asteroid> {
    const response = await fetch(`${API_BASE_URL}/asteroids/${id}`);
    if (!response.ok) throw new Error("Asteroide non trovato");
    return response.json();
  },
};
