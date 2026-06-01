import { z } from "zod";
import { CACHE_TTL, withCache } from "@/lib/cache";
import { handleApi } from "@/lib/api-handler";
import { detectOperator } from "@/lib/mobile";
import { errorResponse, optionsResponse } from "@/lib/response";
import {
  isValidBdMobile,
  isValidNid,
  isValidPostcode,
  isValidTin,
  normalizeMobileNumber,
  parseSearchParams,
} from "@/lib/validators";

export const runtime = "nodejs";

const schemas = {
  nid: z.object({ nid: z.string().trim().min(1) }),
  tin: z.object({ tin: z.string().trim().min(1) }),
  mobile: z.object({ number: z.string().trim().min(1) }),
  postcode: z.object({ postcode: z.string().trim().min(1) }),
};

export async function GET(request: Request, ctx: RouteContext<"/api/v1/validate/[type]">) {
  return handleApi(request, async () => {
    const { type } = await ctx.params;

    if (!["nid", "tin", "mobile", "postcode"].includes(type)) {
      throw errorResponse(
        "NOT_FOUND",
        "Supported validators are nid, tin, mobile, and postcode.",
        404,
        { docsPath: "/docs/validators" },
      );
    }

    const { data } = await withCache(
      `validate:${type}:${new URL(request.url).search}`,
      CACHE_TTL.validators,
      async () => {
        if (type === "nid") {
          const query = parseSearchParams(request, schemas.nid);
          return {
            nid: query.nid,
            valid: isValidNid(query.nid),
            format:
              query.nid.length === 10
                ? "smart-card"
                : query.nid.length === 13 || query.nid.length === 17
                  ? "legacy"
                  : "unknown",
          };
        }

        if (type === "tin") {
          const query = parseSearchParams(request, schemas.tin);
          return {
            tin: query.tin,
            valid: isValidTin(query.tin),
            format: "12-digit-e-tin",
          };
        }

        if (type === "mobile") {
          const query = parseSearchParams(request, schemas.mobile);
          const normalized = normalizeMobileNumber(query.number);
          return {
            number: query.number,
            normalized,
            valid: isValidBdMobile(normalized),
            operator: detectOperator(normalized),
          };
        }

        const query = parseSearchParams(request, schemas.postcode);
        return {
          postcode: query.postcode,
          valid: isValidPostcode(query.postcode),
          format: "4-digit",
        };
      },
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
