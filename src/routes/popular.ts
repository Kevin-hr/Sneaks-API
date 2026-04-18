import { Hono } from 'hono';
import { stockxSearch } from '../scrapers/stockx.js';
import { goatGetLink } from '../scrapers/goat.js';
import { stadiumGoodsGetLink } from '../scrapers/stadiumgoods.js';
import { flightClubGetLink } from '../scrapers/flightclub.js';
import type { Sneaker } from '../types.js';

const app = new Hono();

app.get('/', async (c) => {
  const limit = Math.min(parseInt(c.req.query('limit') ?? '20'), 100);

  let products: Sneaker[];
  try {
    // StockX empty search returns popular items
    products = await stockxSearch('', limit);
  } catch (e) {
    return c.json({ error: 'Failed to fetch popular items' }, 502);
  }

  for (const p of products) {
    goatGetLink(p);
    stadiumGoodsGetLink(p);
    flightClubGetLink(p);
  }

  return c.json({ products, count: products.length });
});

export default app;
