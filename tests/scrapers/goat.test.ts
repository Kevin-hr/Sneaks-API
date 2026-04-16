import { describe, it, expect } from 'vitest';
import type { Sneaker } from '../../src/types.js';
import { goatGetLink, goatGetPrices } from '../../src/scrapers/goat.js';

describe('Goat Scraper', () => {
  it('sets goat resell link', () => {
    const sneaker: Sneaker = {
      shoeName: 'Yeezy Boost 350 V2',
      brand: 'Adidas',
      styleID: 'FY2903',
      colorway: 'Onyx',
      retailPrice: 230,
      releaseDate: '2022-06',
      description: '',
      thumbnail: null,
      urlKey: 'yeezy-boost-350-v2-onyx',
      make: 'Adidas',
      imageLinks: [],
      resellLinks: { stockX: null, stadiumGoods: null, goat: null, flightClub: null },
      lowestResellPrice: { stockX: null, stadiumGoods: null, goat: null, flightClub: null },
      resellPrices: { stockX: {}, goat: {}, stadiumGoods: {}, flightClub: {} },
    };
    goatGetLink(sneaker);
    expect(sneaker.resellLinks.goat).toContain('goat.com');
  });

  it('returns price map', async () => {
    const prices = await goatGetPrices({} as Sneaker);
    expect(typeof prices).toBe('object');
  });
});
