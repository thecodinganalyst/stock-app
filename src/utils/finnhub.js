const basePath = "https://finnhub.io/api/v1";

export const fetchStockSymbols = async (exchange) => {
    const url = `${basePath}/stock/symbol?exchange=${exchange}&token=${process.env.REACT_APP_API_KEY}`;
    const response = await fetch(url);

    if (!response.ok) {
        const message = `An error has occurred: ${response.status}`;
        throw new Error(message);
    }
    return await response.json();
};

export const fetchStockCandles = async (symbol, from, to, resolution="D") => {
    console.log(`fetching stock candles for ${symbol} from ${from} to ${to}`);
    const url = `${basePath}/stock/candle?symbol=${symbol}&resolution=${resolution}&from=${from}&to=${to}&token=${process.env.REACT_APP_API_KEY}`;
    const response = await fetch(url);

    if (!response.ok) {
        const message = `An error has occurred: ${response.status}`;
        throw new Error(message);
    }
    return await response.json();
}

export const searchStockSymbols = async (query) => {
    const url = `${basePath}/stock/symbol?q=${query}&token=${process.env.REACT_APP_API_KEY}`;
    const response = await fetch(url);

    if (!response.ok) {
        const message = `An error has occurred: ${response.status}`;
        throw new Error(message);
    }
    return await response.json();
};
