# ========================================================
# CYLINDERMARGIN TEMPLATE T5: STATIC HTML / NGINX
# Imagem oficial ultra-leve Nginx Alpine (~25MB) · Porta 80
# ========================================================
FROM nginx:alpine

COPY public /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80 3000

HEALTHCHECK --interval=20s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://127.0.0.1:80/ || wget --no-verbose --tries=1 --spider http://127.0.0.1:3000/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
