import { z } from "zod";
import { CACHE_TTL, withCache } from "@/lib/cache";
import { handleApi } from "@/lib/api-handler";
import { detectOperator } from "@/lib/mobile";
import { errorResponse, optionsResponse } from "@/lib/response";
import { isValidBdMobile, normalizeMobileNumber, parseSearchParams } from "@/lib/validators";

export const runtime = "nodejs";

const querySchema = z.object({
  number: z.string().trim().min(8),
});

export async function GET(request: Request) {
  return handleApi(request, async () => {
    const query = parseSearchParams(request, querySchema);
    const normalized = normalizeMobileNumber(query.number);

    if (!isValidBdMobile(normalized)) {
      throw errorResponse(
        "INVALID_PARAMETER",
        "The number must be a valid Bangladeshi mobile number.",
        422,
        { docsPath: "/docs/mobile" },
      );
    }

    const { data } = await withCache(
      `mobile:operator:${normalized}`,
      CACHE_TTL.validators,
      async () => ({
        number: query.number,
        normalized,
        operator: detectOperator(normalized),
      }),
    );

    return {
      data,
      cacheControl: "public, s-maxage=600, stale-while-revalidate=300",
    };
  });
}

export function OPTIONS() {
  return optionsResponse();
}
