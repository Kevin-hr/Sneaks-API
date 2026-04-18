import type { Sneaker } from '../types.js';
export declare function flightClubGetLink(sneaker: Sneaker): void;
export declare function flightClubGetPrices(sneaker: Sneaker): Promise<Record<string, number>>;
