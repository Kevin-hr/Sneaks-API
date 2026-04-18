export function stadiumGoodsGetLink(sneaker) {
    const slug = sneaker.shoeName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    sneaker.resellLinks.stadiumGoods = `https://www.stadiumgoods.com/${slug}-${sneaker.styleID}`;
}
export async function stadiumGoodsGetPrices(sneaker) {
    return {};
}
