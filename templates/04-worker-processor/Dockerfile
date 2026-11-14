# ========================================================
# CYLINDERMARGIN TEMPLATE T4: WORKER / BACKGROUND PROCESSOR
# Sem porta pública · Graceful shutdown · Node 20 Alpine
# ========================================================
FROM node:20-alpine AS base
WORKDIR /app
RUN apk add --no-cache libc6-compat

COPY package.json package-lock.json* ./
RUN if [ -f package-lock.json ]; then npm ci --omit=dev || npm install --omit=dev; else npm install --omit=dev; fi

COPY . .

ENV NODE_ENV production
ENV WORKER_NAME cylinder-task-worker

CMD ["node", "src/worker.js"]
