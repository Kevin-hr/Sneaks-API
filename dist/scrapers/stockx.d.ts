import type { Sneaker, ResellPrices } from '../types.js';
export declare function stockxSearch(keyword: string, limit?: number): Promise<Sneaker[]>;
export declare function stockxGetPrices(urlKey: string): Promise<ResellPrices['stockX']>;
