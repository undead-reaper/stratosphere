import type { NextConfig } from "next";


const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    reactCompiler: true,
    serverActions: {
      bodySizeLimit: "50mb",
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ui-avatars.com",
        port: "",
        pathname: "/api/**",
        search: "background=random",
      },
    ],
  },
};

export default nextConfig;
