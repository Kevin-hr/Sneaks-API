import { stockxSearch, stockxGetPrices } from './scrapers/stockx.js';
import { goatGetLink, goatGetPrices } from './scrapers/goat.js';
import { stadiumGoodsGetLink, stadiumGoodsGetPrices } from './scrapers/stadiumgoods.js';
import { flightClubGetLink, flightClubGetPrices } from './scrapers/flightclub.js';
/**
 * Sneaks-API MCP Server
 *
 * Start: npx tsx src/mcp.ts
 * Or build: npm run build && node dist/mcp.js
 *
 * Tools exposed:
 *   sneaks_search(keyword, limit?)   — search sneakers
 *   sneaks_price(styleID)           — get price map for a style ID
 *   sneaks_popular(limit?)           — get popular sneakers
 */
const TOOLS = [
    {
        name: 'sneaks_search',
        description: 'Search for sneakers by keyword across StockX, Goat, Stadium Goods, and Flight Club',
        inputSchema: {
            type: 'object',
            properties: {
                keyword: { type: 'string', description: 'Search keyword (e.g. "Yeezy 350", "Jordan 1")' },
                limit: {
                    type: 'number',
                    description: 'Maximum number of results (default: 20, max: 100)',
                    default: 20,
                },
            },
            required: ['keyword'],
        },
    },
    {
        name: 'sneaks_price',
        description: 'Get detailed price map (size → price) for a specific sneaker style ID',
        inputSchema: {
            type: 'object',
            properties: {
                styleID: { type: 'string', description: 'Style ID (e.g. "FY2903")' },
            },
            required: ['styleID'],
        },
    },
    {
        name: 'sneaks_popular',
        description: 'Get currently popular sneakers curated by StockX',
        inputSchema: {
            type: 'object',
            properties: {
                limit: { type: 'number', description: 'Maximum number of results (default: 20)', default: 20 },
            },
        },
    },
];
async function handleTool(name, args) {
    switch (name) {
        case 'sneaks_search': {
            const keyword = String(args.keyword ?? '');
            const limit = Math.min(Number(args.limit ?? 20), 100);
            const products = await stockxSearch(keyword, limit);
            for (const p of products) {
                goatGetLink(p);
                stadiumGoodsGetLink(p);
                flightClubGetLink(p);
            }
            return { products, count: products.length };
        }
        case 'sneaks_price': {
            const styleID = String(args.styleID ?? '').toUpperCase();
            const products = await stockxSearch(styleID, 1);
            const product = products.find((p) => p.styleID.toUpperCase() === styleID);
            if (!product)
                return { error: 'Not found' };
            const [stockXPrices, goatPrices] = await Promise.all([
                stockxGetPrices(product.urlKey),
                goatGetPrices(product),
            ]);
            const stadiumPrices = await stadiumGoodsGetPrices(product);
            const flightPrices = await flightClubGetPrices(product);
            product.resellPrices = {
                stockX: stockXPrices,
                goat: goatPrices,
                stadiumGoods: stadiumPrices,
                flightClub: flightPrices,
            };
            return product;
        }
        case 'sneaks_popular': {
            const limit = Math.min(Number(args.limit ?? 20), 100);
            const products = await stockxSearch('', limit);
            for (const p of products) {
                goatGetLink(p);
                stadiumGoodsGetLink(p);
                flightClubGetLink(p);
            }
            return { products, count: products.length };
        }
    }
}
// STDIO mode for MCP integration
const STDIO = process.env.MCP_STDIO === 'true';
if (STDIO) {
    process.stdin.on('data', async (chunk) => {
        try {
            const msg = JSON.parse(chunk.toString());
            if (msg.method === 'tools/list') {
                process.stdout.write(JSON.stringify({ jsonrpc: '2.0', id: msg.id, result: { tools: TOOLS } }) + '\n');
            }
            else if (msg.method === 'tools/call') {
                const { name, arguments: args } = msg.params;
                const result = await handleTool(name, args ?? {});
                process.stdout.write(JSON.stringify({ jsonrpc: '2.0', id: msg.id, result }) + '\n');
            }
        }
        catch { }
    });
}
else {
    console.log('Sneaks MCP Server running on http://localhost:3001');
    console.log('Tools:', TOOLS.map((t) => t.name).join(', '));
    console.log('\nRun with MCP_STDIO=true for stdio mode');
}
