# ========================================================
# CYLINDERMARGIN TEMPLATE T2: API / BACKEND NODE.JS & IA
# Porta 4000 · Endpoint /health · Node 20 Alpine
# ========================================================
FROM node:20-alpine AS base
WORKDIR /app
RUN apk add --no-cache libc6-compat

# Dependências
COPY package.json package-lock.json* ./
RUN if [ -f package-lock.json ]; then npm ci --omit=dev || npm install --omit=dev; else npm install --omit=dev; fi

# Código fonte
COPY . .

ENV NODE_ENV production
ENV PORT 4000
ENV HOST "0.0.0.0"

EXPOSE 4000

# Healthcheck obrigatório na rota /health
HEALTHCHECK --interval=15s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://127.0.0.1:4000/health || exit 1

CMD ["node", "src/server.js"]
