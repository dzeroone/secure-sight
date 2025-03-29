/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || "/",
  async redirects() {
    return [
      {
        source: "/dashboard",
        destination: "/dashboard/monthly-report",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
