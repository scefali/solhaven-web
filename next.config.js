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

const { withSuperjson } = require('next-superjson')
module.exports = withSuperjson()(nextConfig)