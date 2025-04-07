import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: 'standalone', // Optimizado para despliegues en contenedores
  compress: true, // Habilitar compresión de respuestas
  poweredByHeader: false, // Eliminar el header X-Powered-By por seguridad
  images: {
    domains: [], // Añade aquí dominios permitidos para imágenes remotas si necesitas
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60, // Cache de imágenes en segundos
  },
  // Configuraciones para optimización
  experimental: {
    optimizeCss: true, // Optimizar CSS
    scrollRestoration: true, // Restauración de scroll al navegar
  },
};

export default nextConfig;
