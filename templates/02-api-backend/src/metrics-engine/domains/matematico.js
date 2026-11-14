'use strict';
// Base matemática e estatística: usada pelos outros domínios (variações, desvios, tendências).
const sum = a => a.reduce((s, v) => s + v, 0);
const mean = a => sum(a) / a.length;
const sd = a => { const m = mean(a); return Math.sqrt(sum(a.map(v => (v - m) ** 2)) / (a.length - 1)); };

module.exports = (define, E) => {
  const serie = (a, min = 1) => {
    if (!Array.isArray(a) || a.length < min || a.some(v => typeof v !== 'number' || !Number.isFinite(v)))
      throw new E(`Série numérica inválida (mínimo ${min} valores)`);
    return a;
  };

  define('matematico', 'media', { nome: 'Média aritmética', formula: 'Σx / n', entradas: ['serie'] },
    ({ serie: s }) => mean(serie(s)));

  define('matematico', 'desvio_padrao', { nome: 'Desvio-padrão amostral', formula: '√(Σ(x−x̄)² / (n−1))', entradas: ['serie'] },
    ({ serie: s }) => sd(serie(s, 2)));

  define('matematico', 'coef_variacao', { nome: 'Coeficiente de variação', formula: '100 · s / |x̄|', unidade: '%', entradas: ['serie'] },
    ({ serie: s }) => { const m = mean(serie(s, 2)); if (m === 0) throw new E('Média zero'); return 100 * sd(s) / Math.abs(m); });

  define('matematico', 'mediana', { nome: 'Mediana', formula: 'valor central da série ordenada', entradas: ['serie'] },
    ({ serie: s }) => { const o = [...serie(s)].sort((a, b) => a - b), h = o.length >> 1; return o.length % 2 ? o[h] : (o[h - 1] + o[h]) / 2; });

  define('matematico', 'percentil', { nome: 'Percentil (interpolação linear)', formula: 'método R-7', unidade: '', entradas: ['serie', 'p'], nota: 'p entre 0 e 100' },
    ({ serie: s, p }) => { const o = [...serie(s)].sort((a, b) => a - b); if (p < 0 || p > 100) throw new E('p fora de 0–100');
      const r = (p / 100) * (o.length - 1), i = Math.floor(r); return o[i] + (r - i) * ((o[i + 1] ?? o[i]) - o[i]); });

  define('matematico', 'zscore', { nome: 'Z-score face a uma série', formula: '(x − x̄) / s', entradas: ['valor', 'serie'] },
    ({ valor, serie: s }) => { const d = sd(serie(s, 2)); if (d === 0) throw new E('Desvio-padrão zero'); return (valor - mean(s)) / d; });

  define('matematico', 'delta_absoluto', { nome: 'Variação absoluta', formula: 'atual − base', entradas: ['base', 'atual'] },
    ({ base, atual }) => atual - base);

  define('matematico', 'delta_percentual', { nome: 'Variação percentual', formula: '100 · (atual − base) / |base|', unidade: '%', entradas: ['base', 'atual'] },
    ({ base, atual }) => { if (base === 0) throw new E('Base zero'); return 100 * (atual - base) / Math.abs(base); });

  define('matematico', 'indice_assimetria', { nome: 'Índice de assimetria esquerda/direita', formula: '100 · (E − D) / ((E + D)/2)', unidade: '%', entradas: ['esquerda', 'direita'],
    nota: 'Positivo = esquerda maior' },
    ({ esquerda, direita }) => { const m = (esquerda + direita) / 2; if (m === 0) throw new E('Soma zero'); return 100 * (esquerda - direita) / m; });

  define('matematico', 'razao', { nome: 'Razão entre duas grandezas', formula: 'a / b', entradas: ['a', 'b'] },
    ({ a, b }) => { if (b === 0) throw new E('Divisor zero'); return a / b; });

  define('matematico', 'media_movel', { nome: 'Média móvel simples', formula: 'média das últimas k amostras', entradas: ['serie', 'janela'] },
    ({ serie: s, janela }) => { serie(s); if (!(janela >= 1 && janela <= s.length)) throw new E('Janela inválida');
      return s.map((_, i) => i + 1 < janela ? null : mean(s.slice(i + 1 - janela, i + 1))); });

  define('matematico', 'normalizacao_minmax', { nome: 'Normalização min-max (0–1)', formula: '(x − min) / (max − min)', entradas: ['valor', 'min', 'max'] },
    ({ valor, min, max }) => { if (max === min) throw new E('max = min'); return (valor - min) / (max - min); });

  define('matematico', 'correlacao_pearson', { nome: 'Correlação de Pearson', formula: 'cov(x,y) / (sx·sy)', entradas: ['x', 'y'] },
    ({ x, y }) => { serie(x, 2); serie(y, 2); if (x.length !== y.length) throw new E('x e y com tamanhos diferentes');
      const mx = mean(x), my = mean(y); const c = sum(x.map((v, i) => (v - mx) * (y[i] - my)));
      const d = Math.sqrt(sum(x.map(v => (v - mx) ** 2)) * sum(y.map(v => (v - my) ** 2))); if (d === 0) throw new E('Variância zero'); return c / d; });

  define('matematico', 'regressao_linear', { nome: 'Regressão linear simples', formula: 'y = a·x + b (mínimos quadrados)', entradas: ['x', 'y'] },
    ({ x, y }) => { serie(x, 2); serie(y, 2); if (x.length !== y.length) throw new E('x e y com tamanhos diferentes');
      const mx = mean(x), my = mean(y); const sxx = sum(x.map(v => (v - mx) ** 2)); if (sxx === 0) throw new E('x constante');
      const a = sum(x.map((v, i) => (v - mx) * (y[i] - my))) / sxx, b = my - a * mx;
      const sst = sum(y.map(v => (v - my) ** 2)), sse = sum(x.map((v, i) => (y[i] - (a * v + b)) ** 2));
      return { inclinacao: a, intercepto: b, r2: sst === 0 ? 1 : 1 - sse / sst }; });

  define('matematico', 'taxa_crescimento_composta', { nome: 'Taxa de crescimento composta (CAGR)', formula: '100 · ((v1/v0)^(1/n) − 1)', unidade: '%/período', entradas: ['inicial', 'final', 'periodos'] },
    ({ inicial, final, periodos }) => { if (inicial <= 0 || final <= 0 || periodos <= 0) throw new E('Valores e períodos devem ser positivos'); return 100 * ((final / inicial) ** (1 / periodos) - 1); });
};
