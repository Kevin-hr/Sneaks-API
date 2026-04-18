import { Hono } from 'hono';
import products from './routes/products.js';
import prices from './routes/prices.js';
import popular from './routes/popular.js';
const app = new Hono();
app.route('/products', products);
app.route('/prices', prices);
app.route('/popular', popular);
app.get('/health', (c) => c.json({ status: 'ok', timestamp: new Date().toISOString() }));
export default app;
// Run as HTTP server
if (process.argv[1] && import.meta.url.endsWith(process.argv[1].replace(/^.*[\\/]/, ''))) {
    const port = parseInt(process.env.PORT ?? '3000');
    console.log(`Sneaks-API listening on http://localhost:${port}`);
    // Use Bun or Node adapter
    // Bun: Bun.serve({ fetch: app.fetch, port });
    // Node + tsx: auto-started via `npm run dev`
}
