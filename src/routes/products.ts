import { Hono } from 'hono';
import { stockxSearch } from '../scrapers/stockx.js';
import { goatGetLink } from '../scrapers/goat.js';
import { stadiumGoodsGetLink } from '../scrapers/stadiumgoods.js';
import { flightClubGetLink } from '../scrapers/flightclub.js';
import type { Sneaker } from '../types.js';

const app = new Hono();

app.get('/', async (c) => {
  const keyword = c.req.query('keyword') ?? '';
  const limit = Math.min(parseInt(c.req.query('limit') ?? '20'), 100);

  if (!keyword) {
    return c.json({ error: 'keyword query parameter is required' }, 400);
  }

  let products: Sneaker[];
  try {
    products = await stockxSearch(keyword, limit);
  } catch (e) {
    return c.json({ error: 'Search failed', detail: String(e) }, 502);
  }

  // Enrich with links (non-blocking)
  for (const p of products) {
    goatGetLink(p);
    stadiumGoodsGetLink(p);
    flightClubGetLink(p);
  }

  return c.json({ products, count: products.length });
});

export default app;
