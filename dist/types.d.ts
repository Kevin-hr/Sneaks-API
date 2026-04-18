export interface Sneaker {
    shoeName: string;
    brand: string;
    styleID: string;
    colorway: string;
    retailPrice: number;
    releaseDate: string | null;
    description: string;
    thumbnail: string | null;
    urlKey: string;
    make: string;
    imageLinks: string[];
    resellLinks: ResellLinks;
    lowestResellPrice: LowestResellPrice;
    resellPrices: ResellPrices;
}
export interface ResellLinks {
    stockX: string | null;
    stadiumGoods: string | null;
    goat: string | null;
    flightClub: string | null;
}
export interface LowestResellPrice {
    stockX: number | null;
    stadiumGoods: number | null;
    goat: number | null;
    flightClub: number | null;
}
export interface ResellPrices {
    stockX: Record<string, number>;
    goat: Record<string, number>;
    stadiumGoods: Record<string, number>;
    flightClub: Record<string, number>;
}
export interface SearchResult {
    products: Sneaker[];
    count: number;
}
