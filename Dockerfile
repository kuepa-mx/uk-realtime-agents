FROM node:18-alpine AS base

# Instalar dependencias solo si es necesario
FROM base AS deps
WORKDIR /app

# Copiar archivos de configuración de dependencias
COPY package.json package-lock.json ./

# Instalar las dependencias
RUN npm ci

# Construcción de la aplicación
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Eliminar cualquier archivo .env para asegurar que no se incluyen en la imagen
RUN rm -f .env .env.*

# Construir la aplicación
RUN npm run build

# Imagen de producción
FROM base AS runner
WORKDIR /app

# Definir variables de entorno para producción
ENV NODE_ENV production

# Crear usuario no privilegiado para mayor seguridad
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

# Copiar solo los artefactos necesarios del build
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Exponer el puerto que usará la aplicación
EXPOSE 3000

# Definir variables de entorno para la aplicación
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

# Iniciar la aplicación
CMD ["node", "server.js"] 