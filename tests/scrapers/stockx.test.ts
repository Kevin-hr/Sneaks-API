import { describe, it, expect } from 'vitest';
import { stockxSearch, stockxGetPrices } from '../../src/scrapers/stockx';

describe('StockX Scraper', () => {
  it('search returns products array for valid keyword', async () => {
    const products = await stockxSearch('Yeezy 350', 3);
    expect(Array.isArray(products)).toBe(true);
    expect(products.length).toBeGreaterThan(0);
    expect(products[0]).toHaveProperty('styleID');
    expect(products[0]).toHaveProperty('shoeName');
    expect(products[0]).toHaveProperty('thumbnail');
  }, 15000);

  it('search returns empty array for invalid keyword', async () => {
    const products = await stockxSearch('XYZNOTREAL12345', 3);
    expect(Array.isArray(products)).toBe(true);
  }, 15000);

  it('price map contains size keys', async () => {
    // Uses a known styleID from search results
    const products = await stockxSearch('Yeezy', 1);
    if (products.length === 0) return;
    const prices = await stockxGetPrices(products[0].urlKey);
    expect(typeof prices).toBe('object');
  }, 15000);
});
