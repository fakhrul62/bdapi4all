import { prisma } from "@/lib/db";
import { scrapeBangladeshBankRates } from "@/lib/scraper";
import { optionsResponse, successResponse } from "@/lib/response";

import { requireCronResponse } from "@/lib/cron-auth";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const unauthorized = requireCronResponse(request);
  if (unauthorized) return unauthorized;

  const date = new Date();
  date.setUTCHours(0, 0, 0, 0);
  const rates = await scrapeBangladeshBankRates();

  await Promise.all(
    rates.map((rate) =>
      prisma.exchangeRate.upsert({
        where: {
          currency_code_date: {
            currency_code: rate.currency_code,
            date,
          },
        },
        create: {
          ...rate,
          date,
        },
        update: {
          currency_name: rate.currency_name,
          buying_rate: rate.buying_rate,
          selling_rate: rate.selling_rate,
        },
      }),
    ),
  );

  return successResponse({
    date,
    imported: rates.length,
  });
}

export function OPTIONS() {
  return optionsResponse();
}
