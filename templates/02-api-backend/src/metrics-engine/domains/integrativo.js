'use strict';
// Integrativo: índices compostos e comparação com a linha de base do próprio indivíduo.
// Não implementa fórmulas proprietárias (ex.: ICC): fornece o enquadramento configurável.
const sum = a => a.reduce((s, v) => s + v, 0);
const mean = a => sum(a) / a.length;
const sd = a => { const m = mean(a); return Math.sqrt(sum(a.map(v => (v - m) ** 2)) / (a.length - 1)); };

module.exports = (define, E) => {
  define('integrativo', 'indice_composto', {
    nome: 'Índice composto ponderado (0–100)',
    formula: '100 · Σ(pᵢ · nᵢ) / Σpᵢ, com nᵢ = (xᵢ − minᵢ)/(maxᵢ − minᵢ) limitado a [0,1]; inverso: 1 − nᵢ',
    unidade: 'pontos', entradas: ['componentes'],
    nota: 'componentes: [{ nome, valor, min, max, peso, inverso? }]. Os pesos e limites são escolha do utilizador. Índice de apoio, sem valor diagnóstico.'
  }, ({ componentes: c }) => {
    if (!Array.isArray(c) || !c.length) throw new E('componentes: lista vazia');
    let pesos = 0, acc = 0; const detalhe = [];
    for (const k of c) {
      if (k.max === k.min || !(k.peso > 0)) throw new E(`Componente inválido: ${k.nome ?? '?'}`);
      let n = Math.min(1, Math.max(0, (k.valor - k.min) / (k.max - k.min))); if (k.inverso) n = 1 - n;
      pesos += k.peso; acc += k.peso * n; detalhe.push({ nome: k.nome, normalizado: n, contribuicao: k.peso * n });
    }
    return { indice: 100 * acc / pesos, detalhe: detalhe.map(d => ({ ...d, contribuicao_pct: 100 * d.contribuicao / acc || 0 })) };
  });

  define('integrativo', 'desvio_linha_base', {
    nome: 'Desvio face à linha de base do próprio indivíduo', formula: 'z = (x − x̄ₕ) / sₕ;  Δ% = 100·(x − x̄ₕ)/|x̄ₕ|',
    entradas: ['valor', 'historico'], nota: 'historico: mínimo 3 medições anteriores da mesma grandeza.'
  }, ({ valor, historico: h }) => {
    if (!Array.isArray(h) || h.length < 3) throw new E('historico: mínimo 3 valores');
    const m = mean(h), s = sd(h);
    return { media_base: m, desvio_base: s, delta: valor - m, delta_pct: m === 0 ? null : 100 * (valor - m) / Math.abs(m), z: s === 0 ? null : (valor - m) / s };
  });

  define('integrativo', 'tendencia', {
    nome: 'Tendência de uma série ao longo do tempo', formula: 'inclinação por mínimos quadrados; classe por limiar relativo',
    entradas: ['serie'], nota: 'limiar_pct (opcional, por defeito 1): variação relativa por passo abaixo da qual a série é estável.'
  }, ({ serie: s, limiar_pct = 1 }) => {
    if (!Array.isArray(s) || s.length < 3) throw new E('serie: mínimo 3 valores');
    const x = s.map((_, i) => i), mx = mean(x), my = mean(s);
    const a = sum(x.map((v, i) => (v - mx) * (s[i] - my))) / sum(x.map(v => (v - mx) ** 2));
    const rel = my === 0 ? 0 : 100 * a / Math.abs(my);
    return { inclinacao_por_passo: a, variacao_relativa_por_passo_pct: rel, classe: Math.abs(rel) < limiar_pct ? 'estavel' : rel > 0 ? 'subida' : 'descida' };
  });
};
