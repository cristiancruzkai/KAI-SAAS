/** @type {import('next').NextConfig} */
const nextConfig = {
  // Optimizaciones para App Hosting
  output: 'standalone',

  // Configuración de imágenes
  images: {
    domains: ['firebasestorage.googleapis.com'],
  },

  // Variables de entorno públicas
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_FIREBASE_PROJECT_ID: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  },

  // Optimizaciones de Turbo
  experimental: {
    turbo: {
      resolveExtensions: ['.tsx', '.ts', '.jsx', '.js', '.json'],
    },
  },
}

module.exports = nextConfig
