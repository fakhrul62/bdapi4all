import * as cheerio from "cheerio";

export type ScrapedExchangeRate = {
  currency_code: string;
  currency_name: string;
  buying_rate: number;
  selling_rate: number;
};

export async function scrapeBangladeshBankRates() {
    const response = await fetch("https://www.bb.org.bd/en/index.php/econdata/exchangerate", {
      cache: "no-store",
      signal: AbortSignal.timeout(15_000),
    });
    if (!response.ok) throw new Error("Exchange-rate source is unavailable.");
    const html = await response.text();
    const $ = cheerio.load(html);
    const rates: ScrapedExchangeRate[] = [];

    $("table tr").each((_, row) => {
      const cells = $(row)
        .find("td")
        .map((__, cell) => $(cell).text().replace(/\s+/g, " ").trim())
        .get();
      const code = cells.find((cell) => /^[A-Z]{3}$/.test(cell));
      const numbers = cells
        .map((cell) => Number(cell.replace(/,/g, "")))
        .filter((value) => Number.isFinite(value) && value > 0);

      if (code && numbers.length >= 2) {
        rates.push({
          currency_code: code,
          currency_name: cells[0] ?? code,
          buying_rate: numbers[0],
          selling_rate: numbers[1],
        });
      }
    });

    if (!rates.length) throw new Error("Exchange-rate source returned no usable rates; existing rates were preserved.");
    return rates;
}
