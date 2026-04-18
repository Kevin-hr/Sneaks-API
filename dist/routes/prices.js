import { Hono } from 'hono';
import { stockxSearch, stockxGetPrices } from '../scrapers/stockx.js';
import { goatGetPrices } from '../scrapers/goat.js';
import { stadiumGoodsGetPrices } from '../scrapers/stadiumgoods.js';
import { flightClubGetPrices } from '../scrapers/flightclub.js';
const app = new Hono();
app.get('/:styleID', async (c) => {
    const styleID = c.req.param('styleID').toUpperCase();
    const [products] = await Promise.all([stockxSearch(styleID, 1)]);
    const product = products.find((p) => p.styleID.toUpperCase() === styleID);
    if (!product) {
        return c.json({ error: 'Sneaker not found' }, 404);
    }
    // Fetch all prices concurrently
    const [stockXPrices, goatPrices, stadiumPrices, flightPrices] = await Promise.all([
        stockxGetPrices(product.urlKey),
        goatGetPrices(product),
        stadiumGoodsGetPrices(product),
        flightClubGetPrices(product),
    ]);
    product.resellPrices = {
        stockX: stockXPrices,
        goat: goatPrices,
        stadiumGoods: stadiumPrices,
        flightClub: flightPrices,
    };
    return c.json({ product });
});
export default app;
