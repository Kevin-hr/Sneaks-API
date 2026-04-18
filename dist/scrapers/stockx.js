import { ofetch } from 'ofetch';
const ALGOLIA_APP_ID = 'XW7SBCT9V6';
const ALGOLIA_API_KEY = '6b5e76b49705eb9f51a06d3c82f7acee';
const ALGOLIA_URL = `https://xw7sbct9v6-1.algolianet.com/1/indexes/products/query?x-algolia-agent=Algolia%20for%20vanilla%20JavaScript%203.32.1&x-algolia-application-id=${ALGOLIA_APP_ID}&x-algolia-api-key=${ALGOLIA_API_KEY}`;
export async function stockxSearch(keyword, limit = 40) {
    const response = await ofetch(ALGOLIA_URL, {
        method: 'POST',
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `{"params":"query=${encodeURIComponent(keyword)}&facets=*&filters=&hitsPerPage=${limit}"}`,
    });
    const hits = response.hits ?? [];
    const sneakers = [];
    for (const hit of hits) {
        if (!hit.style_id || hit.style_id.includes(' '))
            continue;
        sneakers.push({
            shoeName: hit.name ?? '',
            brand: hit.brand ?? '',
            styleID: hit.style_id,
            colorway: hit.colorway ?? '',
            retailPrice: hit.searchable_traits?.['Retail Price'] ?? 0,
            releaseDate: hit.release_date ?? null,
            description: hit.description ?? '',
            thumbnail: hit.media?.imageUrl ?? null,
            urlKey: hit.url ?? '',
            make: hit.make ?? '',
            imageLinks: [],
            resellLinks: {
                stockX: hit.url ? `https://stockx.com/${hit.url}` : null,
                stadiumGoods: null,
                goat: null,
                flightClub: null,
            },
            lowestResellPrice: {
                stockX: hit.lowest_ask ?? null,
                stadiumGoods: null,
                goat: null,
                flightClub: null,
            },
            resellPrices: { stockX: {}, goat: {}, stadiumGoods: {}, flightClub: {} },
        });
    }
    return sneakers;
}
export async function stockxGetPrices(urlKey) {
    const priceMap = {};
    try {
        const response = await ofetch(`https://stockx.com/api/products/${urlKey}?includes=market`, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/605.1.15',
            },
        });
        const children = response.Product?.children ?? {};
        for (const [key, child] of Object.entries(children)) {
            if (!child.market?.lowestAsk || child.market.lowestAsk === 0)
                continue;
            let size = child.shoeSize ?? key;
            if (size.endsWith('W'))
                size = size.slice(0, -1);
            priceMap[size] = child.market.lowestAsk;
        }
    }
    catch (e) {
        // Return empty map on failure
    }
    return priceMap;
}
