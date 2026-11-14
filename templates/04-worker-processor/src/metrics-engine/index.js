'use strict';
/**
 * Motor de métricas CylinderMargin
 * Registo único de métricas por domínio. Zero dependências, cálculo determinístico.
 * Cada métrica: { id, dominio, nome, formula, unidade, entradas[], nota?, fn(input) }
 */
const registry = new Map();

function define(dominio, id, meta, fn) {
  const key = `${dominio}.${id}`;
  if (registry.has(key)) throw new Error(`Métrica duplicada: ${key}`);
  registry.set(key, { id: key, dominio, nome: meta.nome, formula: meta.formula,
    unidade: meta.unidade || '', entradas: meta.entradas || [], nota: meta.nota || '', fn });
}

class MetricError extends Error {
  constructor(msg, code = 400) { super(msg); this.code = code; }
}

const DOMINIOS = ['matematico', 'saude', 'integrativo', 'territorio', 'geografico', 'geodesico'];
for (const d of DOMINIOS) require(`./domains/${d}`)(define, MetricError);

function catalogo(dominio) {
  return [...registry.values()]
    .filter(m => !dominio || m.dominio === dominio)
    .map(({ fn, ...meta }) => meta);
}

function dominios() {
  return DOMINIOS.map(d => ({ dominio: d, metricas: catalogo(d).length }));
}

function calcular(id, input = {}) {
  const m = registry.get(id);
  if (!m) throw new MetricError(`Métrica desconhecida: ${id}`, 404);
  const falta = m.entradas.filter(k => input[k] === undefined || input[k] === null);
  if (falta.length) throw new MetricError(`Entradas em falta para ${id}: ${falta.join(', ')}`);
  return { metrica: id, unidade: m.unidade, resultado: m.fn(input) };
}

module.exports = { catalogo, dominios, calcular, MetricError, DOMINIOS };
