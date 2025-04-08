# Deployment Guide for WebRTC Agents App

This guide provides the necessary steps to deploy the application in a production environment for multiple users.

## Prerequisites

- Node.js (version 18.x or higher)
- An OpenAI account with access to the Realtime Agents API
- An OpenAI API key with permissions for the Realtime Agents service

## Preparation for Deployment

### 1. Environment Variables Configuration

Create a `.env.production` file with the following variables:

```
OPENAI_API_KEY=your_openai_api_key
# API_BASE_URL=https://api.openai.com (optional)
# PORT=3000 (optional)
```

**IMPORTANT**: Never commit your `.env.production` file to a public repository.

### 2. Build the Application

```bash
npm run build
```

This command will generate an optimized version of the application in the `.next` folder.

## Deployment Options

### Deployment on Vercel (Recommended)

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Deploy the application:
   ```bash
   vercel --prod
   ```

3. Configure environment variables in the Vercel dashboard.

### Deployment with Docker

1. Create a `Dockerfile`:
   ```dockerfile
   FROM node:18-alpine AS base
   
   # Install dependencies
   FROM base AS deps
   WORKDIR /app
   COPY package.json package-lock.json ./
   RUN npm ci
   
   # Build the application
   FROM base AS builder
   WORKDIR /app
   COPY --from=deps /app/node_modules ./node_modules
   COPY . .
   RUN npm run build
   
   # Production configuration
   FROM base AS runner
   WORKDIR /app
   ENV NODE_ENV=production
   COPY --from=builder /app/public ./public
   COPY --from=builder /app/.next/standalone ./
   COPY --from=builder /app/.next/static ./.next/static
   
   # Expose the port and run the application
   EXPOSE 3000
   CMD ["node", "server.js"]
   ```

2. Build the Docker image:
   ```bash
   docker build -t webrtc-agents-app .
   ```

3. Run the container:
   ```bash
   docker run -p 3000:3000 -e OPENAI_API_KEY=your_api_key webrtc-agents-app
   ```

### Deployment on an Express Server (Node.js)

1. Create a custom server:
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

2. Add the script to package.json:
   ```json
   "scripts": {
     "start:custom": "NODE_ENV=production node server.js"
   }
   ```

3. Run the server:
   ```bash
   npm run start:custom
   ```

## Considerations for Multi-user

### Scalability

- The application uses WebRTC for real-time communications, which works efficiently for multiple simultaneous users.
- For high concurrency, consider implementing load balancing with multiple instances.

### Monitoring

- Implement monitoring tools like Sentry, LogRocket, or New Relic for error tracking and performance monitoring.
- Configure alerts to detect connectivity issues or frequent errors.

### Security

- Ensure that the OpenAI API Key is stored securely.
- Consider implementing user authentication if necessary.
- Keep all dependencies updated to prevent vulnerabilities.

## Debugging in Production

To enable additional logs in production, configure:

```
DEBUG=nextjs:*,app:*
```

## Updates and Maintenance

1. Perform regular dependency updates:
   ```bash
   npm outdated # Check outdated dependencies
   npm update # Update dependencies that can be updated without breaking changes
   ```

2. Monitor the official Next.js and OpenAI documentation for important updates and new features.

3. Implement a version control strategy and maintain a changelog to track changes.

4. Periodically test the application in different environments to ensure compatibility.

5. Set up automated testing if possible to catch regressions early. 

# DEPLOY
1. ```bash
docker build --platform linux/amd64 -t uk-realtime-agents:latest .
```

2. ```bash
docker tag uk-realtime-agents:latest us-central1-docker.pkg.dev/kuepa-datos/production/uk-realtime-agents:latest
```

3. ```bash
docker push us-central1-docker.pkg.dev/kuepa-datos/production/uk-realtime-agents:latest
```

