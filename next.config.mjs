// /** @type {import('next').NextConfig} */
// const nextConfig = {
//      experimental: {
//     serverActions: true,
//     outputFileTracingExcludes: {
//       '*': ['./api/session']
//     }
//   },
// };

// export default nextConfig;




/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
    outputFileTracingExcludes: {
      '*': ['./api/session'],
    },
  },
  images: {
    domains: [
      'randomuser.me',
      'images.unsplash.com',
      'plus.unsplash.com',
      'lh3.googleusercontent.com',
      'res.cloudinary.com', // for your own uploads if you ever use Cloudinary
    ],
  },
};

export default nextConfig;

