const http = require('http');
const metrics = require('./metrics-engine');

const PORT = process.env.PORT || 4000;
const HOST = process.env.HOST || '0.0.0.0';

const server = http.createServer((req, res) => {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // Healthcheck endpoint
  if (req.url === '/health' || req.url === '/api/status') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'healthy',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      service: process.env.SERVICE_NAME || 'cylinder-api-engine'
    }));
    return;
  }

  // Motor de métricas CylinderMargin (6 domínios)
  if (req.url.startsWith('/metrics')) {
    const send = (code, body) => { res.writeHead(code, { 'Content-Type': 'application/json; charset=utf-8' }); res.end(JSON.stringify(body)); };
    const path = decodeURIComponent(req.url.split('?')[0]);
    if (req.method === 'GET' && path === '/metrics') return send(200, { dominios: metrics.dominios() });
    const cat = path.match(/^\/metrics\/catalogo(?:\/(\w+))?$/);
    if (req.method === 'GET' && cat) return send(200, { metricas: metrics.catalogo(cat[1]) });
    const calc = path.match(/^\/metrics\/([\w]+\.[\w]+)$/);
    if (req.method === 'POST' && calc) {
      let raw = '';
      req.on('data', c => { raw += c; if (raw.length > 1e6) req.destroy(); });
      req.on('end', () => {
        try { send(200, metrics.calcular(calc[1], raw ? JSON.parse(raw) : {})); }
        catch (e) { send(e.code || 400, { error: e.message }); }
      });
      return;
    }
    return send(404, { error: 'Rota de métricas não encontrada' });
  }

  // Root endpoint
  if (req.url === '/' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      message: 'CylinderMargin API Engine Online',
      version: '1.0.0',
      health: '/health',
      metrics: '/metrics'
    }));
    return;
  }

  // 404
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Endpoint not found' }));
});

server.listen(PORT, HOST, () => {
  console.log(`[CylinderMargin API] Running on http://${HOST}:${PORT}`);
  console.log(`[CylinderMargin API] Healthcheck ready at http://${HOST}:${PORT}/health`);
});
