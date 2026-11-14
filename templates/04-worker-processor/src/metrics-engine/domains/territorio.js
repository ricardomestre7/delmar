'use strict';
// Território: indicadores de base territorial (densidade, cobertura, desigualdade, especialização).
module.exports = (define, E) => {
  define('territorio', 'densidade', { nome: 'Densidade por área', formula: 'valor / área', unidade: 'por km²', entradas: ['valor', 'area_km2'] },
    ({ valor, area_km2 }) => { if (!(area_km2 > 0)) throw new E('área deve ser > 0'); return valor / area_km2; });

  define('territorio', 'per_capita', { nome: 'Taxa por população', formula: 'valor / população × base', unidade: 'por base habitantes', entradas: ['valor', 'populacao'], nota: 'base (opcional, por defeito 1000)' },
    ({ valor, populacao, base = 1000 }) => { if (!(populacao > 0)) throw new E('população deve ser > 0'); return valor / populacao * base; });

  define('territorio', 'cobertura', { nome: 'Taxa de cobertura', formula: '100 · servidos / total', unidade: '%', entradas: ['servidos', 'total'] },
    ({ servidos, total }) => { if (!(total > 0) || servidos < 0 || servidos > total) throw new E('servidos deve estar entre 0 e total'); return 100 * servidos / total; });

  define('territorio', 'gini', { nome: 'Índice de Gini (desigualdade)', formula: 'Σᵢ(2i − n − 1)·xᵢ / (n · Σx), xᵢ ordenados', unidade: '0–1', entradas: ['valores'], nota: 'Valores não negativos, ex.: rendimento ou serviços por freguesia.' },
    ({ valores: v }) => { if (!Array.isArray(v) || v.length < 2 || v.some(x => !(x >= 0))) throw new E('valores: mínimo 2, não negativos');
      const o = [...v].sort((a, b) => a - b), n = o.length, t = o.reduce((s, x) => s + x, 0); if (t === 0) throw new E('soma zero');
      return o.reduce((s, x, i) => s + (2 * (i + 1) - n - 1) * x, 0) / (n * t); });

  define('territorio', 'quociente_localizacao', {
    nome: 'Quociente de localização (especialização)', formula: '(vᵢ/Vᵢ) / (v_ref/V_ref)', entradas: ['local_setor', 'local_total', 'ref_setor', 'ref_total'],
    nota: '>1 indica especialização do território nesse setor face à referência.'
  }, ({ local_setor, local_total, ref_setor, ref_total }) => { if (!(local_total > 0 && ref_total > 0 && ref_setor > 0)) throw new E('totais e referência devem ser > 0');
    return (local_setor / local_total) / (ref_setor / ref_total); });

  define('territorio', 'variacao_territorial', {
    nome: 'Variação de um indicador entre dois períodos', formula: 'Δ = atual − anterior;  Δ% = 100·Δ/|anterior|', entradas: ['anterior', 'atual']
  }, ({ anterior, atual }) => ({ delta: atual - anterior, delta_pct: anterior === 0 ? null : 100 * (atual - anterior) / Math.abs(anterior) }));
};
