/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        // This applies the security permission to all paths of your bot
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "frame-ancestors *;", // The asterisk unlocks the iframe for testing!
          },
        ],
      },
    ];
  },
};

export default nextConfig;