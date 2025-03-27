/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: '/monthly-reporting',
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
