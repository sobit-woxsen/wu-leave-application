import { withNextVideo } from "next-video/process";
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "outgatebucket.s3.us-east-1.amazonaws.com",
      },
    ],
  },
};

export default withNextVideo(nextConfig);
