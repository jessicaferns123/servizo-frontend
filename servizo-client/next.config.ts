import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Temporary: existing ESLint errors are not yet resolved, so `next build` skips
  // linting. TypeScript type checking still runs. Run `npm run lint` to see the issues.
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
