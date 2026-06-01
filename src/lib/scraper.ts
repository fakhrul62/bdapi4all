import * as cheerio from "cheerio";

export type ScrapedExchangeRate = {
  currency_code: string;
  currency_name: string;
  buying_rate: number;
  selling_rate: number;
};

const fallbackRates: ScrapedExchangeRate[] = [
  {
    currency_code: "USD",
    currency_name: "US Dollar",
    buying_rate: 117.5,
    selling_rate: 118.2,
  },
  {
    currency_code: "EUR",
    currency_name: "Euro",
    buying_rate: 127.8,
    selling_rate: 128.6,
  },
  {
    currency_code: "GBP",
    currency_name: "British Pound",
    buying_rate: 149.1,
    selling_rate: 150.2,
  },
  {
    currency_code: "INR",
    currency_name: "Indian Rupee",
    buying_rate: 1.4,
    selling_rate: 1.42,
  },
];

export async function scrapeBangladeshBankRates() {
  try {
    const response = await fetch("https://www.bb.org.bd/en/index.php/econdata/exchangerate", {
      next: { revalidate: 3600 },
    });
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

    return rates.length ? rates : fallbackRates;
  } catch {
    return fallbackRates;
  }
}
