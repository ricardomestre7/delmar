'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const m = require('../');
const c = (id, i) => m.calcular(id, i).resultado;
const near = (a, b, t) => assert.ok(Math.abs(a - b) <= t, `${a} vs ${b} (tol ${t})`);

test('saude: exemplo do documento LUMINA 4032 XL (R=500, Xc=60)', () => {
  const r = c('saude.bia_descritores', { R: 500, Xc: 60 });
  near(r.Z, 503.59, 0.01); near(r.fase, 6.84, 0.01); near(r.Y, 1.9858, 0.0001); near(r.G, 1.9716, 0.0001); near(r.B, 0.2366, 0.0001);
  assert.equal(r.integridade, 'OK');
});
test('saude: variação entre duas medições', () => {
  const r = c('saude.bia_variacao', { base: { R: 500, Xc: 60 }, atual: { R: 550, Xc: 60 } });
  near(r.R.delta, 50, 1e-9); near(r.R.delta_pct, 10, 1e-9);
});
test('saude: HRV com série conhecida', () => {
  const r = c('saude.hrv', { rr_ms: [800, 850, 800, 900] });
  near(r.rmssd, Math.sqrt((2500 + 2500 + 10000) / 3), 1e-9); near(r.pnn50, 100 / 3, 1e-9); near(r.fc_media, 60000 / 837.5, 1e-9);
});
test('matematico: estatística e regressão', () => {
  near(c('matematico.media', { serie: [1, 2, 3, 4] }), 2.5, 1e-12);
  near(c('matematico.desvio_padrao', { serie: [2, 4, 4, 4, 5, 5, 7, 9] }), 2.138089935, 1e-8);
  near(c('matematico.percentil', { serie: [1, 2, 3, 4, 5], p: 50 }), 3, 1e-12);
  const r = c('matematico.regressao_linear', { x: [1, 2, 3], y: [2, 4, 6] }); near(r.inclinacao, 2, 1e-12); near(r.r2, 1, 1e-12);
  near(c('matematico.taxa_crescimento_composta', { inicial: 100, final: 121, periodos: 2 }), 10, 1e-9);
  near(c('matematico.indice_assimetria', { esquerda: 11, direita: 9 }), 20, 1e-9);
});
test('integrativo: índice composto e linha de base', () => {
  const r = c('integrativo.indice_composto', { componentes: [{ nome: 'a', valor: 5, min: 0, max: 10, peso: 1 }, { nome: 'b', valor: 2, min: 0, max: 10, peso: 1, inverso: true }] });
  near(r.indice, 65, 1e-9);
  const d = c('integrativo.desvio_linha_base', { valor: 12, historico: [10, 10, 10, 10] }); near(d.delta_pct, 20, 1e-9);
});
test('territorio: gini, cobertura, quociente de localização', () => {
  near(c('territorio.gini', { valores: [1, 1, 1, 1] }), 0, 1e-12);
  near(c('territorio.gini', { valores: [0, 0, 0, 10] }), 0.75, 1e-12);
  near(c('territorio.cobertura', { servidos: 30, total: 120 }), 25, 1e-12);
  near(c('territorio.quociente_localizacao', { local_setor: 20, local_total: 100, ref_setor: 10, ref_total: 100 }), 2, 1e-12);
});
test('geografico: haversine, destino, área', () => {
  near(c('geografico.haversine', { lat1: 0, lon1: 0, lat2: 0, lon2: 1 }), 111.195, 0.001);
  near(c('geografico.rumo_inicial', { lat1: 0, lon1: 0, lat2: 1, lon2: 0 }), 0, 1e-9);
  const p = c('geografico.ponto_destino', { lat: 0, lon: 0, rumo: 90, distancia_km: 111.195 }); near(p.lon, 1, 0.001); near(p.lat, 0, 1e-6);
  near(c('geografico.area_poligono', { pontos: [[0, 0], [0, 1], [1, 1], [1, 0]] }), 12364, 20);
});
test('geodesico: Vincenty (teste original Flinders Peak → Buninyong)', () => {
  const r = c('geodesico.distancia_vincenty', { lat1: -(37 + 57 / 60 + 3.72030 / 3600), lon1: 144 + 25 / 60 + 29.52440 / 3600, lat2: -(37 + 39 / 60 + 10.15610 / 3600), lon2: 143 + 55 / 60 + 35.38390 / 3600 });
  near(r.distancia_m, 54972.271, 0.001); near(r.azimute_inicial, 306 + 52 / 60 + 5.37 / 3600, 1e-4);
});
test('geodesico: ida e volta geodética ↔ ECEF e raios de curvatura', () => {
  const e = c('geodesico.geodetica_para_ecef', { lat: 38.7223, lon: -9.1393, h: 100 }), g = c('geodesico.ecef_para_geodetica', e);
  near(g.lat, 38.7223, 1e-9); near(g.lon, -9.1393, 1e-9); near(g.h, 100, 1e-4);
  near(c('geodesico.raios_curvatura', { lat: 0 }).primeiro_vertical_N, 6378137, 1e-6);
  const enu = c('geodesico.ecef_para_enu', { ponto: e, referencia: { lat: 38.7223, lon: -9.1393, h: 100 } }); near(enu.e, 0, 1e-6); near(enu.u, 0, 1e-6);
});
test('erros: métrica desconhecida, entradas em falta, divisão por zero', () => {
  assert.throws(() => m.calcular('x.y', {}), /desconhecida/);
  assert.throws(() => m.calcular('saude.imc', { peso_kg: 70 }), /em falta/);
  assert.throws(() => c('matematico.razao', { a: 1, b: 0 }), /zero/);
});
