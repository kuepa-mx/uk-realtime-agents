# Guía de Despliegue para WebRTC Agents App

Esta guía proporciona los pasos necesarios para desplegar la aplicación en un entorno de producción para múltiples usuarios.

## Requisitos Previos

- Node.js (versión 18.x o superior)
- Una cuenta de OpenAI con acceso a la API de Realtime Agents
- Una clave API de OpenAI con permisos para el servicio de Realtime Agents

## Preparación para el Despliegue

### 1. Configuración de Variables de Entorno

Crea un archivo `.env.production` con las siguientes variables:

```
OPENAI_API_KEY=tu_clave_api_de_openai
# API_BASE_URL=https://api.openai.com (opcional)
# PORT=3000 (opcional)
```

**IMPORTANTE**: Nunca comitees tu archivo `.env.production` a un repositorio público.

### 2. Construir la Aplicación

```bash
npm run build
```

Este comando generará una versión optimizada de la aplicación en la carpeta `.next`.

## Opciones de Despliegue

### Despliegue en Vercel (Recomendado)

1. Instala Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Despliega la aplicación:
   ```bash
   vercel --prod
   ```

3. Configura las variables de entorno en el dashboard de Vercel.

### Despliegue con Docker

1. Crea un archivo `Dockerfile`:
   ```dockerfile
   FROM node:18-alpine AS base
   
   # Instala dependencias
   FROM base AS deps
   WORKDIR /app
   COPY package.json package-lock.json ./
   RUN npm ci
   
   # Construye la aplicación
   FROM base AS builder
   WORKDIR /app
   COPY --from=deps /app/node_modules ./node_modules
   COPY . .
   RUN npm run build
   
   # Configuración de producción
   FROM base AS runner
   WORKDIR /app
   ENV NODE_ENV=production
   COPY --from=builder /app/public ./public
   COPY --from=builder /app/.next/standalone ./
   COPY --from=builder /app/.next/static ./.next/static
   
   # Expone el puerto y ejecuta la aplicación
   EXPOSE 3000
   CMD ["node", "server.js"]
   ```

2. Construye la imagen Docker:
   ```bash
   docker build -t webrtc-agents-app .
   ```

3. Ejecuta el contenedor:
   ```bash
   docker run -p 3000:3000 -e OPENAI_API_KEY=tu_clave_api webrtc-agents-app
   ```

### Despliegue en un Servidor Express (Node.js)

1. Crea un servidor personalizado:
   ```javascript
   // server.js
   const { createServer } = require("http");
   const { parse } = require("url");
   const next = require("next");
   
   const dev = process.env.NODE_ENV !== "production";
   const app = next({ dev });
   const handle = app.getRequestHandler();
   const port = process.env.PORT || 3000;
   
   app.prepare().then(() => {
     createServer((req, res) => {
       const parsedUrl = parse(req.url, true);
       handle(req, res, parsedUrl);
     }).listen(port, (err) => {
       if (err) throw err;
       console.log(`> Ready on http://localhost:${port}`);
     });
   });
   ```

2. Añade el script al package.json:
   ```json
   "scripts": {
     "start:custom": "NODE_ENV=production node server.js"
   }
   ```

3. Ejecuta el servidor:
   ```bash
   npm run start:custom
   ```

## Consideraciones para Multi-usuario

### Escalabilidad

- La aplicación utiliza WebRTC para comunicaciones en tiempo real, lo que funciona de manera eficiente para múltiples usuarios simultáneos.
- Para alta concurrencia, considera implementar balanceo de carga con múltiples instancias.

### Monitoreo

- Implementa herramientas de monitoreo como Sentry, LogRocket o New Relic para seguimiento de errores y rendimiento.
- Configura alertas para detectar problemas de conectividad o errores frecuentes.

### Seguridad

- Asegúrate de que la API Key de OpenAI esté almacenada de forma segura.
- Considera implementar autenticación de usuarios si es necesario.
- Mantén actualizadas todas las dependencias para prevenir vulnerabilidades.

## Depuración en Producción

Para habilitar logs adicionales en producción, configure:

```
DEBUG=nextjs:*,app:*
```

## Actualizaciones y Mantenimiento

1. Realiza actualizaciones regulares de dependencias:
   ```bash
   npm outdated
   npm update
   ```

2. Prueba cambios en un entorno de staging antes de producción.

3. Implementa un proceso de integración continua para automatizar pruebas y despliegues. 