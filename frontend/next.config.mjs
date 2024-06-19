/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        apiBaseUrl: process.env.API_BASE_URL || 'http://localhost:8000',
    }
};

export default nextConfig;
