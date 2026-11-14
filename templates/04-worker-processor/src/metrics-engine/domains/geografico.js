'use strict';
// Cálculo geográfico em esfera (R média = 6371.0088 km). Para precisão elipsoidal use o domínio "geodesico".
const R = 6371.0088, rad = d => d * Math.PI / 180, deg = r => r * 180 / Math.PI;
const norm360 = d => ((d % 360) + 360) % 360;

module.exports = (define, E) => {
  const lat = v => { if (!(v >= -90 && v <= 90)) throw new E('latitude fora de −90..90'); return rad(v); };
  const lon = v => { if (!(v >= -180 && v <= 180)) throw new E('longitude fora de −180..180'); return rad(v); };
  const pts = (p, min) => { if (!Array.isArray(p) || p.length < min || p.some(q => !Array.isArray(q) || q.length !== 2)) throw new E(`pontos: lista de [lat, lon], mínimo ${min}`); return p; };
  const hav = (a, b, c, d) => { const s = Math.sin((c - a) / 2) ** 2 + Math.cos(a) * Math.cos(c) * Math.sin((d - b) / 2) ** 2; return 2 * R * Math.asin(Math.min(1, Math.sqrt(s))); };

  define('geografico', 'haversine', { nome: 'Distância de círculo máximo (Haversine)', formula: '2R·asin(√(sin²(Δφ/2) + cosφ₁·cosφ₂·sin²(Δλ/2)))', unidade: 'km', entradas: ['lat1', 'lon1', 'lat2', 'lon2'] },
    ({ lat1, lon1, lat2, lon2 }) => hav(lat(lat1), lon(lon1), lat(lat2), lon(lon2)));

  define('geografico', 'rumo_inicial', { nome: 'Rumo inicial (azimute) entre dois pontos', formula: 'atan2(sinΔλ·cosφ₂, cosφ₁·sinφ₂ − sinφ₁·cosφ₂·cosΔλ)', unidade: '° (0–360, desde o Norte)', entradas: ['lat1', 'lon1', 'lat2', 'lon2'] },
    ({ lat1, lon1, lat2, lon2 }) => { const a = lat(lat1), c = lat(lat2), dl = lon(lon2) - lon(lon1);
      return norm360(deg(Math.atan2(Math.sin(dl) * Math.cos(c), Math.cos(a) * Math.sin(c) - Math.sin(a) * Math.cos(c) * Math.cos(dl)))); });

  define('geografico', 'ponto_destino', { nome: 'Ponto de destino (rumo e distância)', formula: 'problema direto na esfera', unidade: '° (lat, lon)', entradas: ['lat', 'lon', 'rumo', 'distancia_km'] },
    ({ lat: la, lon: lo, rumo, distancia_km }) => { const p = lat(la), l = lon(lo), t = rad(rumo), d = distancia_km / R;
      const p2 = Math.asin(Math.sin(p) * Math.cos(d) + Math.cos(p) * Math.sin(d) * Math.cos(t));
      const l2 = l + Math.atan2(Math.sin(t) * Math.sin(d) * Math.cos(p), Math.cos(d) - Math.sin(p) * Math.sin(p2));
      return { lat: deg(p2), lon: ((deg(l2) + 540) % 360) - 180 }; });

  define('geografico', 'ponto_medio', { nome: 'Ponto médio geodésico esférico', formula: 'média vetorial 3D normalizada', unidade: '°', entradas: ['lat1', 'lon1', 'lat2', 'lon2'] },
    ({ lat1, lon1, lat2, lon2 }) => centro([[lat1, lon1], [lat2, lon2]], lat, lon));

  define('geografico', 'centroide_pontos', { nome: 'Centro de um conjunto de pontos', formula: 'média vetorial 3D normalizada', unidade: '°', entradas: ['pontos'], nota: 'pontos: [[lat, lon], …]' },
    ({ pontos }) => centro(pts(pontos, 1), lat, lon));

  function centro(p, la, lo) {
    let x = 0, y = 0, z = 0;
    for (const [a, b] of p) { const f = la(a), l = lo(b); x += Math.cos(f) * Math.cos(l); y += Math.cos(f) * Math.sin(l); z += Math.sin(f); }
    if (!x && !y && !z) throw new E('Centro indefinido (pontos antipodais)');
    return { lat: deg(Math.atan2(z, Math.hypot(x, y))), lon: deg(Math.atan2(y, x)) };
  }

  define('geografico', 'caixa_envolvente', { nome: 'Caixa envolvente (bounding box)', formula: 'mín/máx de lat e lon', unidade: '°', entradas: ['pontos'], nota: 'Não trata o cruzamento do antimeridiano.' },
    ({ pontos }) => { pts(pontos, 1); const la = pontos.map(p => p[0]), lo = pontos.map(p => p[1]);
      return { lat_min: Math.min(...la), lat_max: Math.max(...la), lon_min: Math.min(...lo), lon_max: Math.max(...lo) }; });

  define('geografico', 'area_poligono', { nome: 'Área de polígono esférico', formula: 'R²/2 · |Σ(λ₂−λ₁)(2 + sinφ₁ + sinφ₂)|', unidade: 'km²', entradas: ['pontos'], nota: 'Anel simples, sem repetir o primeiro ponto; precisão esférica (erro típico < 0,5 %).' },
    ({ pontos }) => { pts(pontos, 3); let s = 0;
      for (let i = 0; i < pontos.length; i++) { const [a, b] = pontos[i], [c, d] = pontos[(i + 1) % pontos.length];
        s += (lon(d) - lon(b)) * (2 + Math.sin(lat(a)) + Math.sin(lat(c))); }
      return Math.abs(s) * R * R / 2; });

  define('geografico', 'comprimento_percurso', { nome: 'Comprimento de um percurso', formula: 'Σ haversine entre pontos consecutivos', unidade: 'km', entradas: ['pontos'] },
    ({ pontos }) => { pts(pontos, 2); let s = 0;
      for (let i = 1; i < pontos.length; i++) s += hav(lat(pontos[i - 1][0]), lon(pontos[i - 1][1]), lat(pontos[i][0]), lon(pontos[i][1])); return s; });
};
