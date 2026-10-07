/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID || "rzp_live_Tl05XPZnqWHlxe",
    NEXT_PUBLIC_RAZORPAY_KEY_ID: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_live_Tl05XPZnqWHlxe",
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
