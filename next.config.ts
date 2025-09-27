// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   /* config options here */
// };

// export default nextConfig;

/** @type {import('next').NextConfig} */
// const nextConfig = {
//   experimental: {
//     serverActions: {
//       allowedOrigins: ["*"]
//     }
//   },
//   env: {
//     NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
//     NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
//   }
// }

// module.exports = nextConfig

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  experimental: {
    runtime: 'nodejs'
  }
}

module.exports = nextConfig

