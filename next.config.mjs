import { withNextVideo } from "next-video/process";
/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.mainFields = ["browser", "module", "main"];
    return config;
  },
};

export default withNextVideo(nextConfig);
