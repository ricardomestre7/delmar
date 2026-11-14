FROM node:24-alpine
ENV NODE_ENV=production PORT=3000 DATA_DIR=/app/data
WORKDIR /app
COPY --chown=node:node package.json server.mjs ./
COPY --chown=node:node dist ./dist
RUN mkdir -p /app/data && chown node:node /app/data
USER node
VOLUME ["/app/data"]
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 CMD node -e "fetch('http://127.0.0.1:3000/health').then(r=>{if(!r.ok)process.exit(1)}).catch(()=>process.exit(1))"
CMD ["node", "server.mjs"]
