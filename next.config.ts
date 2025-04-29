import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [{
            protocol: 'https',
            hostname: '**.soundcloud.com',
            port: '',
            pathname: '**',
            search: '',
        },
        {
            protocol: 'https',
            hostname: '**.sndcdn.com',
            port: '',
            pathname: '**',
            search: '',
        }],
    },
};

export default nextConfig;
