# ========================================================
# CYLINDERMARGIN TEMPLATE T1: WEB APP / NEXT.JS STANDALONE
# Multi-stage production build - Node 22 Alpine
# ========================================================
FROM node:22-alpine AS base
WORKDIR /app
RUN apk add --no-cache libc6-compat

# Fase 1: Dependências
FROM base AS deps
COPY package.json package-lock.json* ./
RUN if [ -f package-lock.json ]; then npm ci || npm install; else npm install; fi

# Fase 2: Compilação Next.js
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Garante que a pasta public existe (o COPY do runner falha se o projeto nao a tiver)
RUN mkdir -p public
ENV NEXT_TELEMETRY_DISABLED 1
ENV NODE_ENV production
RUN npm run build

# Fase 3: Imagem Final de Execução (Modo Standalone Otimizado)
FROM base AS runner
WORKDIR /app
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copiar artefactos necessários com permissões restritas
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000

# Healthcheck interno integrado (Start period 20s para evitar falso negativo)
HEALTHCHECK --interval=20s --timeout=5s --start-period=20s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://127.0.0.1:3000/ || exit 1

CMD ["node", "server.js"]