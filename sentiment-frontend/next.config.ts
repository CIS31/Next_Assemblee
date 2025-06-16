// import type { NextConfig } from "next";

// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   output: 'standalone',
// }

// module.exports = nextConfig
// // const nextConfig: NextConfig = {
// //   output: "standalone",
// // };

// // export default nextConfig;
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  outputFileTracingIncludes: {
    '/': ['./public/**/*'],
  },
  images: {
    unoptimized: true,
  },
  // Configuration pour Azure App Service
  serverExternalPackages: []
};

export default nextConfig;