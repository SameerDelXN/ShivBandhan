/** @type {import('next').NextConfig} */
const nextConfig = {
     experimental: {
    serverActions: true,
    outputFileTracingExcludes: {
      '*': ['./api/session']
    }
  },
};

export default nextConfig;
