import type { Sneaker } from '../types.js';
export declare function goatGetLink(sneaker: Sneaker): void;
export declare function goatGetPrices(sneaker: Sneaker): Promise<Record<string, number>>;
export declare function goatGetPictures(sneaker: Sneaker): Promise<string[]>;
