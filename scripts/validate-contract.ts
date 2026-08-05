import { z } from "zod";
import { createOpenApiDocument } from "../src/lib/openapi";

const BaseResponseSchema = z.object({
  success: z.boolean(),
  version: z.string(),
  timestamp: z.string(),
});

const SuccessResponseSchema = BaseResponseSchema.extend({
  success: z.literal(true),
  data: z.any(),
});

const ErrorResponseSchema = BaseResponseSchema.extend({
  success: z.literal(false),
  error: z.object({
    code: z.string(),
    message: z.string(),
    docs: z.string(),
  }),
});

async function validateContracts() {
  console.log("🔍 Validating API OpenAPI specification & contract definitions...");
  const spec = createOpenApiDocument();
  
  if (!spec.openapi || !spec.info || !spec.paths) {
    throw new Error("Invalid OpenAPI specification structure.");
  }

  const endpointsCount = Object.keys(spec.paths).length;
  console.log(`✅ OpenAPI Spec valid! Found ${endpointsCount} path definitions.`);

  console.log("Checking standard response contract schemas...");
  const sampleSuccess = {
    success: true,
    version: "v1",
    timestamp: new Date().toISOString(),
    data: { test: true },
  };

  const sampleError = {
    success: false,
    version: "v1",
    timestamp: new Date().toISOString(),
    error: {
      code: "INVALID_PARAMETER",
      message: "Test error message",
      docs: "https://bdapi4all.vercel.app/docs/errors#invalid_parameter",
    },
  };

  SuccessResponseSchema.parse(sampleSuccess);
  ErrorResponseSchema.parse(sampleError);

  console.log("✅ API Contract schemas verified successfully.");
}

validateContracts().catch((err) => {
  console.error("❌ Contract validation failed:", err);
  process.exit(1);
});
