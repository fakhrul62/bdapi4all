import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Configuration for standalone server output (optimal for Docker). */
  output: "standalone",

  /* Keep database drivers and Prisma out of the bundled client layer. */
  serverExternalPackages: ["@prisma/client", "@prisma/adapter-pg", "pg"],
};

export default nextConfig;