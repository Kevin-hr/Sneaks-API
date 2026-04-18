import { describe, it, expect } from 'vitest';
import { Hono } from 'hono';
import products from '../src/routes/products.js';

const app = new Hono().route('/products', products);

describe('GET /products', () => {
  it('returns 400 when keyword is missing', async () => {
    const res = await app.request('/products');
    expect(res.status).toBe(400);
    const json = await res.json() as any;
    expect(json.error).toBeDefined();
  });

  it('returns products array for valid keyword', async () => {
    const res = await app.request('/products?keyword=Yeezy&limit=3');
    expect(res.status).toBe(200);
    const json = await res.json() as any;
    expect(Array.isArray(json.products)).toBe(true);
    expect(json.count).toBeGreaterThan(0);
  }, 20000);

  it('respects limit parameter', async () => {
    const res = await app.request('/products?keyword=Yeezy&limit=2');
    expect(res.status).toBe(200);
    const json = await res.json() as any;
    expect(json.products.length).toBeLessThanOrEqual(2);
  }, 20000);
});
