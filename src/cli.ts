#!/usr/bin/env node
import { stockxSearch, stockxGetPrices } from './scrapers/stockx.js';
import { goatGetLink, goatGetPrices } from './scrapers/goat.js';
import { stadiumGoodsGetLink, stadiumGoodsGetPrices } from './scrapers/stadiumgoods.js';
import { flightClubGetLink, flightClubGetPrices } from './scrapers/flightclub.js';
import type { Sneaker } from './types.js';

type CliCommand = 'search' | 'price' | 'popular';

const cmd = process.argv[2] as CliCommand;
const args = process.argv.slice(3);

if (!cmd || !['search', 'price', 'popular'].includes(cmd)) {
  console.error(`Usage: sneaks <command> [args]

Commands:
  sneaks search <keyword> [limit]   Search for sneakers
  sneaks price <styleID>           Get price details for a style ID
  sneaks popular [limit]           Get popular sneakers (StockX curated)

Examples:
  sneaks search "Yeezy 350" 10
  sneaks price FY2903
  sneaks popular 20`);
  process.exit(1);
}

async function printSneakers(products: Sneaker[]) {
  for (const p of products) {
    const price = p.lowestResellPrice.stockX ? `$${p.lowestResellPrice.stockX}` : 'N/A';
    console.log(`  ${p.shoeName}`);
    console.log(`    Style: ${p.styleID} | Colorway: ${p.colorway}`);
    console.log(`    Retail: $${p.retailPrice} | StockX Lowest: ${price}`);
    console.log(`    Links: stockx=${p.resellLinks.stockX ?? 'N/A'}`);
    console.log();
  }
}

async function main() {
  if (cmd === 'search') {
    const keyword = args[0] ?? 'Yeezy';
    const limit = Math.min(parseInt(args[1] ?? '10'), 50);
    console.log(`🔍 Searching for "${keyword}" (limit=${limit})...\n`);
    const products = await stockxSearch(keyword, limit);
    for (const p of products) {
      goatGetLink(p);
      stadiumGoodsGetLink(p);
      flightClubGetLink(p);
    }
    await printSneakers(products);
  } else if (cmd === 'price') {
    const styleID = (args[0] ?? '').toUpperCase();
    if (!styleID) {
      console.error('Style ID required');
      process.exit(1);
    }
    console.log(`💰 Fetching prices for ${styleID}...\n`);
    const products = await stockxSearch(styleID, 1);
    const product = products.find((p) => p.styleID.toUpperCase() === styleID);
    if (!product) {
      console.error('Not found');
      process.exit(1);
    }
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
    console.log(`Sneaker: ${product.shoeName}`);
    console.log(`Colorway: ${product.colorway}\n`);
    console.log('StockX Prices:');
    for (const [size, price] of Object.entries(stockXPrices)) {
      console.log(`  Size ${size}: $${price}`);
    }
  } else if (cmd === 'popular') {
    const limit = Math.min(parseInt(args[0] ?? '10'), 50);
    console.log(`🔥 Popular sneakers (limit=${limit})...\n`);
    const products = await stockxSearch('', limit);
    for (const p of products) {
      goatGetLink(p);
      stadiumGoodsGetLink(p);
      flightClubGetLink(p);
    }
    await printSneakers(products);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
