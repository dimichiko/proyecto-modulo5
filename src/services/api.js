export async function getCryptos() {
  try {
    const response = await fetch(
      "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1&sparkline=false"
    );
    if (!response.ok) {
      throw new Error("Error fetching cryptocurrencies");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(error.message);
  }
}