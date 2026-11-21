import type { Equipment, Review } from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

async function getList<T>(path: string): Promise<T[]> {
  try {
    const res = await fetch(`${API_URL}${path}`, { cache: "no-store" });
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

export const getFeaturedEquipment = () =>
  getList<Equipment>("/equipment/featured");

export const getReviews = () => getList<Review>("/reviews");