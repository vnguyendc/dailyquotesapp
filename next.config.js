/** @type {import('next').NextConfig} */
const nextConfig = {
  // Existing config...
  
  // PWA Configuration
  experimental: {
    webpackBuildWorker: true,
  },
  
  // Enable static exports for better PWA support
  output: 'standalone',
  
  // Image optimization
  images: {
    unoptimized: true
  }
}

module.exports = nextConfig 