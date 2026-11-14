'use strict';
// Saúde: transformações determinísticas e métodos publicados. Sem uso diagnóstico.
const deg = r => r * 180 / Math.PI;
const sum = a => a.reduce((s, v) => s + v, 0);

function descritoresBIA(R, Xc, E) {
  if (!(R > 0) || !(Xc >= 0)) throw new E('R deve ser > 0 e Xc ≥ 0 (convenção Z = R − jXc, Xc > 0)');
  const z2 = R * R + Xc * Xc, Z = Math.sqrt(z2);
  const d = { Z, fase: deg(Math.atan2(Xc, R)), R, Xc, Y: 1000 / Z, G: 1000 * R / z2, B: 1000 * Xc / z2 };
  // Verificação de integridade (documento técnico LUMINA 4032 XL): G·|Z|² = 1000·R e |Y|·|Z| = 1000
  const tol = 1e-9;
  d.integridade = Math.abs(d.G * z2 - 1000 * R) <= tol * Math.max(1, 1000 * R) && Math.abs(d.Y * Z - 1000) <= tol * 1000 ? 'OK' : 'ERRO';
  return d;
}

module.exports = (define, E) => {
  define('saude', 'bia_descritores', {
    nome: 'Sete descritores bioelétricos de um canal', unidade: 'Ω · ° · mS',
    formula: '|Z|=√(R²+Xc²); φ=atan2(Xc,R); R; Xc; |Y|=1000/|Z|; G=1000·R/|Z|²; B=1000·Xc/|Z|²',
    entradas: ['R', 'Xc'], nota: 'Z = R − jXc. Unidades: Ω e mS. Inclui verificação de integridade.'
  }, ({ R, Xc }) => descritoresBIA(R, Xc, E));

  define('saude', 'bia_variacao', {
    nome: 'Variação dos 7 descritores entre duas medições', unidade: 'Ω · ° · mS · %',
    formula: 'Δ e Δ% de |Z|, φ, R, Xc, |Y|, G, B entre base e atual',
    entradas: ['base', 'atual'], nota: 'base e atual: { R, Xc }. Serve para frequência vs frequência, tempo vs tempo, ou lado vs lado.'
  }, ({ base, atual }) => {
    const a = descritoresBIA(base.R, base.Xc, E), b = descritoresBIA(atual.R, atual.Xc, E), out = {};
    for (const k of ['Z', 'fase', 'R', 'Xc', 'Y', 'G', 'B'])
      out[k] = { base: a[k], atual: b[k], delta: b[k] - a[k], delta_pct: a[k] === 0 ? null : 100 * (b[k] - a[k]) / Math.abs(a[k]) };
    return out;
  });

  define('saude', 'razao_impedancia_bandas', {
    nome: 'Razão de impedância baixa/alta frequência', formula: '|Z|(baixa) / |Z|(alta)', entradas: ['baixa', 'alta'],
    nota: 'baixa e alta: { R, Xc }. Em BIA multifrequência reflete a distribuição entre água extra e total.'
  }, ({ baixa, alta }) => descritoresBIA(baixa.R, baixa.Xc, E).Z / descritoresBIA(alta.R, alta.Xc, E).Z);

  define('saude', 'hrv', {
    nome: 'Variabilidade da frequência cardíaca (domínio do tempo)', unidade: 'ms · % · bpm',
    formula: 'SDNN; RMSSD=√(Σ(ΔRR)²/(n−1)); pNN50=100·#{|ΔRR|>50}/(n−1); FC=60000/RR̄',
    entradas: ['rr_ms'], nota: 'Task Force ESC/NASPE 1996. rr_ms já filtrado de artefactos; mínimo 3 intervalos.'
  }, ({ rr_ms: rr }) => {
    if (!Array.isArray(rr) || rr.length < 3 || rr.some(v => !(v > 250 && v < 2500))) throw new E('rr_ms: mínimo 3 intervalos entre 250 e 2500 ms');
    const m = sum(rr) / rr.length, dif = rr.slice(1).map((v, i) => v - rr[i]);
    return { sdnn: Math.sqrt(sum(rr.map(v => (v - m) ** 2)) / (rr.length - 1)),
      rmssd: Math.sqrt(sum(dif.map(v => v * v)) / dif.length),
      pnn50: 100 * dif.filter(v => Math.abs(v) > 50).length / dif.length, fc_media: 60000 / m };
  });

  define('saude', 'imc', { nome: 'Índice de massa corporal', formula: 'peso / altura²', unidade: 'kg/m²', entradas: ['peso_kg', 'altura_m'] },
    ({ peso_kg, altura_m }) => { if (!(peso_kg > 0 && altura_m > 0.5 && altura_m < 2.8)) throw new E('Peso ou altura fora do intervalo'); return peso_kg / altura_m ** 2; });

  define('saude', 'pat_ptt', {
    nome: 'PAT e PTT (tempos de chegada e trânsito de pulso)', unidade: 'ms',
    formula: 'PAT = t(pé PPG dedo) − t(onda R); PTT = t(pé PPG hálux) − t(pé PPG dedo)',
    entradas: ['t_r_ms', 't_ppg_dedo_ms', 't_ppg_halux_ms'], nota: 'PAT inclui PEP; PTT não. Indicadores indiretos, sem valor tensional sem calibração individual.'
  }, ({ t_r_ms, t_ppg_dedo_ms, t_ppg_halux_ms }) => ({ pat: t_ppg_dedo_ms - t_r_ms, ptt: t_ppg_halux_ms - t_ppg_dedo_ms }));
};
