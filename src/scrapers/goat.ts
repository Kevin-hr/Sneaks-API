import { ofetch } from 'ofetch';
import type { Sneaker } from '../types.js';

export function goatGetLink(sneaker: Sneaker): void {
  // Goat link is typically constructed from shoe name
  const slug = sneaker.shoeName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  sneaker.resellLinks.goat = `https://www.goat.com/sneakers/${slug}-${sneaker.styleID}`;
}

export async function goatGetPrices(sneaker: Sneaker): Promise<Record<string, number>> {
  // Goat prices require authenticated API — mark as placeholder
  return {};
}

export async function goatGetPictures(sneaker: Sneaker): Promise<string[]> {
  if (sneaker.thumbnail) return [sneaker.thumbnail];
  return [];
}
