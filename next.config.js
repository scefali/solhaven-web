/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    async redirects() {
        // Temp for now
        return [{
            source: '/',
            destination: '/account',
            permanent: true,
        }, ]
    },
    experimental: {
        appDir: true,
    }
}

module.exports = nextConfig