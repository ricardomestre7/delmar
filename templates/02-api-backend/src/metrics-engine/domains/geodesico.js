'use strict';
// Geodesia no elipsoide WGS84.
const a = 6378137.0, f = 1 / 298.257223563, b = a * (1 - f), e2 = f * (2 - f), ep2 = e2 / (1 - e2);
const rad = d => d * Math.PI / 180, deg = r => r * 180 / Math.PI;
const norm360 = d => ((d % 360) + 360) % 360;

module.exports = (define, E) => {
  const chk = (la, lo) => { if (!(la >= -90 && la <= 90 && lo >= -180 && lo <= 180)) throw new E('coordenadas fora do intervalo'); };

  function vincenty(la1, lo1, la2, lo2) {
    chk(la1, lo1); chk(la2, lo2);
    const U1 = Math.atan((1 - f) * Math.tan(rad(la1))), U2 = Math.atan((1 - f) * Math.tan(rad(la2))), L = rad(lo2 - lo1);
    const sU1 = Math.sin(U1), cU1 = Math.cos(U1), sU2 = Math.sin(U2), cU2 = Math.cos(U2);
    let lam = L, it = 0, sS, cS, sig, sA, c2A, c2SM, dl;
    do {
      const sl = Math.sin(lam), cl = Math.cos(lam);
      sS = Math.hypot(cU2 * sl, cU1 * sU2 - sU1 * cU2 * cl);
      if (sS === 0) return { distancia_m: 0, azimute_inicial: 0, azimute_final: 0 };
      cS = sU1 * sU2 + cU1 * cU2 * cl; sig = Math.atan2(sS, cS);
      sA = cU1 * cU2 * sl / sS; c2A = 1 - sA * sA;
      c2SM = c2A !== 0 ? cS - 2 * sU1 * sU2 / c2A : 0;
      const C = f / 16 * c2A * (4 + f * (4 - 3 * c2A));
      dl = lam; lam = L + (1 - C) * f * sA * (sig + C * sS * (c2SM + C * cS * (-1 + 2 * c2SM * c2SM)));
    } while (Math.abs(lam - dl) > 1e-12 && ++it < 200);
    if (it >= 200) throw new E('Vincenty não convergiu (pontos quase antipodais); use o domínio geografico');
    const u2 = c2A * (a * a - b * b) / (b * b), A = 1 + u2 / 16384 * (4096 + u2 * (-768 + u2 * (320 - 175 * u2))), B = u2 / 1024 * (256 + u2 * (-128 + u2 * (74 - 47 * u2)));
    const ds = B * sS * (c2SM + B / 4 * (cS * (-1 + 2 * c2SM * c2SM) - B / 6 * c2SM * (-3 + 4 * sS * sS) * (-3 + 4 * c2SM * c2SM)));
    const sl = Math.sin(lam), cl = Math.cos(lam);
    return { distancia_m: b * A * (sig - ds),
      azimute_inicial: norm360(deg(Math.atan2(cU2 * sl, cU1 * sU2 - sU1 * cU2 * cl))),
      azimute_final: norm360(deg(Math.atan2(cU1 * sl, -sU1 * cU2 + cU1 * sU2 * cl))) };
  }

  define('geodesico', 'distancia_vincenty', { nome: 'Distância geodésica no elipsoide WGS84 (Vincenty inverso)', formula: 'iteração de Vincenty (1975)', unidade: 'm · °', entradas: ['lat1', 'lon1', 'lat2', 'lon2'], nota: 'Exatidão sub-milimétrica. Falha em pontos quase antipodais.' },
    ({ lat1, lon1, lat2, lon2 }) => vincenty(lat1, lon1, lat2, lon2));

  define('geodesico', 'geodetica_para_ecef', { nome: 'Coordenadas geodésicas → ECEF (X, Y, Z)', formula: 'N = a/√(1−e²sin²φ); X=(N+h)cosφcosλ; Y=(N+h)cosφsinλ; Z=(N(1−e²)+h)sinφ', unidade: 'm', entradas: ['lat', 'lon', 'h'], nota: 'h: altura elipsoidal em metros.' },
    ({ lat, lon, h }) => { chk(lat, lon); const p = rad(lat), l = rad(lon), N = a / Math.sqrt(1 - e2 * Math.sin(p) ** 2);
      return { x: (N + h) * Math.cos(p) * Math.cos(l), y: (N + h) * Math.cos(p) * Math.sin(l), z: (N * (1 - e2) + h) * Math.sin(p) }; });

  define('geodesico', 'ecef_para_geodetica', { nome: 'ECEF → coordenadas geodésicas', formula: 'método iterativo de Bowring', unidade: '° · m', entradas: ['x', 'y', 'z'] },
    ({ x, y, z }) => { const p = Math.hypot(x, y); if (p === 0 && z === 0) throw new E('Origem inválida');
      let phi = Math.atan2(z, p * (1 - e2)), N = a, h = 0;
      for (let i = 0; i < 10; i++) { N = a / Math.sqrt(1 - e2 * Math.sin(phi) ** 2); h = p / Math.cos(phi) - N; phi = Math.atan2(z, p * (1 - e2 * N / (N + h))); }
      return { lat: deg(phi), lon: deg(Math.atan2(y, x)), h }; });

  define('geodesico', 'raios_curvatura', { nome: 'Raios de curvatura do elipsoide', formula: 'M = a(1−e²)/(1−e²sin²φ)^(3/2);  N = a/√(1−e²sin²φ)', unidade: 'm', entradas: ['lat'] },
    ({ lat }) => { chk(lat, 0); const s = Math.sin(rad(lat)) ** 2; return { meridiano_M: a * (1 - e2) / (1 - e2 * s) ** 1.5, primeiro_vertical_N: a / Math.sqrt(1 - e2 * s) }; });

  define('geodesico', 'comprimento_grau', { nome: 'Comprimento de 1° de latitude e de longitude', formula: '(π/180)·M e (π/180)·N·cosφ', unidade: 'm', entradas: ['lat'] },
    ({ lat }) => { chk(lat, 0); const p = rad(lat), s = Math.sin(p) ** 2, M = a * (1 - e2) / (1 - e2 * s) ** 1.5, N = a / Math.sqrt(1 - e2 * s);
      return { lat_m: Math.PI / 180 * M, lon_m: Math.PI / 180 * N * Math.cos(p) }; });

  define('geodesico', 'ecef_para_enu', { nome: 'ECEF → plano local ENU (Este, Norte, Cima)', formula: 'rotação ECEF→ENU em torno de (φ₀, λ₀)', unidade: 'm', entradas: ['ponto', 'referencia'], nota: 'ponto: {x,y,z}; referencia: {lat, lon, h}.' },
    ({ ponto, referencia }) => { const r = referencia; chk(r.lat, r.lon);
      const p = rad(r.lat), l = rad(r.lon), N = a / Math.sqrt(1 - e2 * Math.sin(p) ** 2);
      const x0 = (N + r.h) * Math.cos(p) * Math.cos(l), y0 = (N + r.h) * Math.cos(p) * Math.sin(l), z0 = (N * (1 - e2) + r.h) * Math.sin(p);
      const dx = ponto.x - x0, dy = ponto.y - y0, dz = ponto.z - z0;
      return { e: -Math.sin(l) * dx + Math.cos(l) * dy,
        n: -Math.sin(p) * Math.cos(l) * dx - Math.sin(p) * Math.sin(l) * dy + Math.cos(p) * dz,
        u: Math.cos(p) * Math.cos(l) * dx + Math.cos(p) * Math.sin(l) * dy + Math.sin(p) * dz }; });
};
