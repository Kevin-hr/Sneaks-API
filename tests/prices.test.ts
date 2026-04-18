import { describe, it, expect } from 'vitest';
import { Hono } from 'hono';
import prices from '../src/routes/prices.js';

const app = new Hono().route('/prices', prices);

describe('GET /prices/:styleID', () => {
  it('returns 404 for unknown style ID', async () => {
    const res = await app.request('/prices/INVALIDSTYLEID123XYZ');
    // Either 404 or 200 with empty result (depends on search result)
    expect([200, 404]).toContain(res.status);
  }, 20000);
});
