import type { Sneaker } from '../types.js';

export function flightClubGetLink(sneaker: Sneaker): void {
  const slug = sneaker.shoeName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  sneaker.resellLinks.flightClub = `https://www.flightclub.com/${slug}-${sneaker.styleID}`;
}

export async function flightClubGetPrices(sneaker: Sneaker): Promise<Record<string, number>> {
  return {};
}
