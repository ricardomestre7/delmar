# Motor de Métricas CylinderMargin

Módulo único, sem dependências e determinístico, com **6 domínios** e 44 métricas. Cada métrica declara nome, fórmula, unidade, entradas e nota. O catálogo é gerado a partir do próprio código.

| Domínio | Métricas |
| :--- | :--- |
| `matematico` | média, desvio-padrão, coef. de variação, mediana, percentil, z-score, Δ absoluto, Δ %, assimetria E/D, razão, média móvel, min-max, Pearson, regressão linear, CAGR |
| `saude` | 7 descritores bioelétricos (|Z|, φ, R, Xc, |Y|, G, B) com verificação de integridade, variação entre medições, razão entre bandas, HRV (SDNN, RMSSD, pNN50), IMC, PAT/PTT |
| `integrativo` | índice composto ponderado 0–100, desvio face à linha de base do próprio indivíduo, tendência |
| `territorio` | densidade, taxa per capita, cobertura, Gini, quociente de localização, variação territorial |
| `geografico` (esfera) | Haversine, rumo inicial, ponto de destino, ponto médio, centro de pontos, caixa envolvente, área de polígono, comprimento de percurso |
| `geodesico` (WGS84) | distância de Vincenty, geodésica↔ECEF, ECEF→ENU, raios de curvatura, comprimento do grau |

## Uso
```js
const m = require('./metrics-engine');
m.calcular('saude.bia_descritores', { R: 500, Xc: 60 });   // → { metrica, unidade, resultado }
m.catalogo('geodesico');                                   // lista de métricas do domínio
```

## Na API (template T2)
```
GET  /metrics                       domínios e nº de métricas
GET  /metrics/catalogo[/dominio]    catálogo completo ou de um domínio
POST /metrics/<dominio>.<metrica>   corpo JSON com as entradas
```
Exemplo: `curl -X POST :4000/metrics/saude.bia_descritores -d '{"R":500,"Xc":60}'`

## Como acrescentar uma métrica
1. Editar `domains/<dominio>.js` e adicionar um `define(...)`.
2. Acrescentar um teste em `test/engine.test.js` com um valor de referência conhecido.
3. `npm test` e depois `./scripts/sync-metrics-engine.sh` (copia o módulo para T2 e T4, que têm de ser autónomos no build).

## Limites declarados
- Saúde e integrativo são cálculo de apoio, **sem uso diagnóstico**. O índice composto é um enquadramento configurável: pesos e limites são decisão do utilizador. Não contém fórmulas proprietárias (ex.: ICC).
- `geografico` usa esfera (erro até ~0,5 %). Para precisão use `geodesico`.
- `bia_*`: convenção Z = R − jXc (Xc > 0), tal como no Projeto Técnico LUMINA 4032 XL rev. D.
