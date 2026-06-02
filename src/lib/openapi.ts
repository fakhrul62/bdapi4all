import { API_BASE_URL, endpointDefinitions } from "@/lib/developer-content";

const schemas = {
  ApiSuccess: {
    type: "object",
    required: ["success", "version", "timestamp", "data"],
    properties: {
      success: { type: "boolean", example: true },
      version: { type: "string", example: "v1" },
      timestamp: { type: "string", format: "date-time" },
      data: {},
    },
  },
  ApiError: {
    type: "object",
    required: ["success", "version", "timestamp", "error"],
    properties: {
      success: { type: "boolean", example: false },
      version: { type: "string", example: "v1" },
      timestamp: { type: "string", format: "date-time" },
      error: {
        type: "object",
        required: ["code", "message", "docs"],
        properties: {
          code: { type: "string" },
          message: { type: "string" },
          docs: { type: "string", format: "uri" },
        },
      },
    },
  },
};

function openApiType(type: string) {
  if (type === "integer") return { type: "integer" };
  if (type === "number") return { type: "number" };
  return { type: "string" };
}

export function createOpenApiDocument() {
  return {
    openapi: "3.1.0",
    info: {
      title: "BDApi4All",
      version: "1.0.0",
      description: "Free Bangladesh REST API for geo data, prayer times, holidays, exchange rates, mobile operators, validators, and Bengali utilities.",
      license: { name: "MIT" },
    },
    servers: [{ url: API_BASE_URL }],
    tags: Array.from(new Set(endpointDefinitions.map((endpoint) => endpoint.group))).map((name) => ({
      name,
    })),
    paths: Object.fromEntries(
      endpointDefinitions.map((endpoint) => [
        endpoint.path,
        {
          get: {
            tags: [endpoint.group],
            summary: endpoint.summary,
            description: `${endpoint.description}\n\nCache TTL: ${endpoint.cacheTtl}.`,
            operationId: endpoint.slug.replace(/-/g, "_"),
            parameters: endpoint.parameters.map((parameter) => ({
              name: parameter.name,
              in: parameter.location,
              required: parameter.required,
              description: parameter.description,
              schema: openApiType(parameter.type),
              example: parameter.example,
            })),
            responses: {
              "200": {
                description: "Successful response",
                content: {
                  "application/json": {
                    schema: { $ref: "#/components/schemas/ApiSuccess" },
                    example: {
                      success: true,
                      version: "v1",
                      timestamp: "2026-06-02T00:00:00.000Z",
                      data: endpoint.sampleResponse,
                    },
                  },
                },
              },
              "400": { $ref: "#/components/responses/BadRequest" },
              "422": { $ref: "#/components/responses/UnprocessableEntity" },
              "429": { $ref: "#/components/responses/RateLimited" },
              "500": { $ref: "#/components/responses/ServerError" },
            },
          },
        },
      ]),
    ),
    components: {
      schemas,
      responses: {
        BadRequest: {
          description: "Bad request",
          content: { "application/json": { schema: { $ref: "#/components/schemas/ApiError" } } },
        },
        UnprocessableEntity: {
          description: "Invalid parameter",
          content: { "application/json": { schema: { $ref: "#/components/schemas/ApiError" } } },
        },
        RateLimited: {
          description: "Rate limit exceeded",
          content: { "application/json": { schema: { $ref: "#/components/schemas/ApiError" } } },
        },
        ServerError: {
          description: "Server error",
          content: { "application/json": { schema: { $ref: "#/components/schemas/ApiError" } } },
        },
      },
    },
  };
}
