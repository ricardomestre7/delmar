"use client";
import { useEffect, useState } from 'react';
import './business-dashboard.css';

type Day = {
  date: string;
  revenue: number;
  goods: number;
  expenses: number;
  transactions: number;
  receipts: number;
  payments: number;
  updatedAt: string;
};

type Operation = {
  createdAt: string;
  status: string;
  delivery?: string;
  kind?: string;
  amount?: number;
};

type EuropeIndices = {
  source: string;
  updatedAt: string;
  eurUsd: number;
  eurGbp: number;
  eurChf: number;
  ecbDepositRate: string;
  eurozoneHicp: string;
  portugalFoodCpi: string;
  euribor12m: string;
  liveFx: boolean;
};

const key = (d: Date) =>
  new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Lisbon',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(d);

const shift = (s: string, n: number) => {
  const d = new Date(s + 'T12:00:00Z');
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
};

const money = (n: number) =>
  new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(n);

export default function BusinessDashboard({ name }: { name: string }) {
  const [days, setDays] = useState<Day[]>([]);
  const [ops, setOps] = useState<Operation[]>([]);
  const [europe, setEurope] = useState<EuropeIndices | null>(null);
  const [end, setEnd] = useState(key(new Date()));
  const [span, setSpan] = useState(7);
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(true);
  const [updated, setUpdated] = useState('');

  async function load() {
    setLoading(true);
    try {
      const r = await fetch('/api/economia', { cache: 'no-store' });
      const v = await r.json();
      if (!r.ok) throw Error(v.error);
      setDays(v.days);
      setOps(v.operations);
      if (v.europeIndices) setEurope(v.europeIndices);
      setUpdated(new Date().toLocaleTimeString('pt-PT'));
    } catch (e) {
      setMsg((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const start = shift(end, 1 - span);
  const previousStart = shift(start, -span);
  const previousEnd = shift(start, -1);
  const visible = days.filter((d) => d.date >= start && d.date <= end);
  const before = days.filter((d) => d.date >= previousStart && d.date <= previousEnd);
  const sum = (rows: Day[], field: keyof Day) =>
    rows.reduce((n, d) => n + Number(d[field] || 0), 0);

  const revenue = sum(visible, 'revenue');
  const goods = sum(visible, 'goods');
  const expenses = sum(visible, 'expenses');
  const transactions = sum(visible, 'transactions');
  const receipts = sum(visible, 'receipts');
  const payments = sum(visible, 'payments');
  const previous = sum(before, 'revenue');
  const complete = visible.length === span && before.length === span;
  const growth =
    complete && previous > 0 ? ((revenue - previous) / previous) * 100 : null;

  const periodOps = ops.filter((x) => {
    const d = key(new Date(x.createdAt));
    return d >= start && d <= end;
  });
  const done = periodOps.filter((x) =>
    ['entregue', 'concluido'].includes(x.status)
  ).length;
  const dates = Array.from({ length: span }, (_, i) => shift(start, i));
  const max = Math.max(1, ...visible.flatMap((d) => [d.revenue, d.goods + d.expenses]));

  // Série acumulada para o gráfico de crescimento e resultado líquido
  let accRev = 0;
  let accProfit = 0;
  const cumulativeSeries = dates.map((date) => {
    const d = visible.find((x) => x.date === date);
    if (d) {
      accRev += d.revenue;
      accProfit += d.revenue - d.goods - d.expenses;
    }
    return { date, accRev, accProfit };
  });
  const maxAcc = Math.max(
    1,
    ...cumulativeSeries.map((p) => Math.max(Math.abs(p.accRev), Math.abs(p.accProfit)))
  );
  const buildPolyline = (values: number[]) =>
    values
      .map((val, idx) => {
        const x = values.length > 1 ? (idx / (values.length - 1)) * 560 + 20 : 300;
        const y = 135 - Math.max(-20, Math.min(120, (val / maxAcc) * 115));
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(' ');

  // Estrutura contabilística (%)
  const baseRev = Math.max(1, revenue);
  const goodsPct = revenue > 0 ? Math.min(100, (goods / baseRev) * 100) : 0;
  const expensesPct = revenue > 0 ? Math.min(100, (expenses / baseRev) * 100) : 0;
  const netResult = revenue - goods - expenses;
  const netPct = revenue > 0 ? (netResult / baseRev) * 100 : 0;
  const treasuryMax = Math.max(1, receipts, payments);

  async function save(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMsg('');
    const form = e.currentTarget;
    const raw = Object.fromEntries(new FormData(form));
    const data: Record<string, unknown> = { date: raw.date };
    for (const k of [
      'revenue',
      'goods',
      'expenses',
      'transactions',
      'receipts',
      'payments',
    ]) {
      data[k] = Number(String(raw[k]).replace(',', '.'));
    }
    try {
      const r = await fetch('/api/economia', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const v = await r.json();
      if (!r.ok) throw Error(v.error);
      await load();
      setMsg(
        'Fecho diário guardado. A data substitui o registo anterior, sem duplicar valores.'
      );
    } catch (e) {
      setMsg((e as Error).message);
    }
  }

  const metrics = [
    ['Faturação sem IVA', visible.length ? money(revenue) : 'Sem registos'],
    ['Ticket médio', transactions ? money(revenue / transactions) : 'Sem base de cálculo'],
    [
      'Margem bruta',
      revenue ? (((revenue - goods) / revenue) * 100).toFixed(1) + '%' : 'Sem base de cálculo',
    ],
    [
      'Resultado operacional simplificado',
      visible.length ? money(netResult) : 'Sem registos',
    ],
    [
      'Fluxo de caixa do período',
      visible.length ? money(receipts - payments) : 'Sem registos',
    ],
    [
      'Variação da faturação',
      growth === null
        ? 'Sem comparação completa'
        : (growth > 0 ? '+' : '') + growth.toFixed(1) + '%',
    ],
  ];

  if (!updated) {
    return (
      <section className="business-dashboard">
        <p role="status">{msg || 'A carregar os resultados privados…'}</p>
        <button type="button" onClick={load}>
          Tentar atualizar
        </button>
      </section>
    );
  }

  return (
    <section className="business-dashboard" aria-label={'Resultados internos de ' + name}>
      <div className="bd-heading">
        <div>
          <small>ÁREA PRIVADA · {name}</small>
          <h2>Compreender o negócio. Decidir com dados.</h2>
          <p>
            Indicadores RENASCENTIA: contabilidade, crescimento e contexto macroeconómico europeu.
            Os lançamentos financeiros são independentes dos pedidos online.
          </p>
        </div>
        <button type="button" onClick={load} disabled={loading}>
          Atualizar
        </button>
      </div>

      {/* Índices Económicos da Europa */}
      {europe && (
        <div
          style={{
            marginTop: 18,
            padding: 18,
            borderRadius: 12,
            border: '1px solid #dbe8e0',
            background: '#f2f7f4',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 8,
              marginBottom: 12,
            }}
          >
            <h3 style={{ margin: 0 }}>
              Índices Económicos da Europa &amp; Retalho
            </h3>
            <small style={{ color: '#4d6b62' }}>
              {europe.source} · {europe.updatedAt}{' '}
              {europe.liveFx ? '· Câmbio ao vivo' : '· Referência'}
            </small>
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
              gap: 10,
            }}
          >
            {[
              ['EUR / USD', europe.eurUsd.toFixed(4)],
              ['EUR / GBP', europe.eurGbp.toFixed(4)],
              ['Taxa Depósito BCE', europe.ecbDepositRate],
              ['Euribor 12M', europe.euribor12m],
              ['Inflação Zona Euro (IHPC)', europe.eurozoneHicp],
              ['Inflação Alimentar PT', europe.portugalFoodCpi],
            ].map(([label, val]) => (
              <div
                key={label}
                style={{
                  background: '#fff',
                  border: '1px solid #dce5e1',
                  borderRadius: 10,
                  padding: '12px 14px',
                }}
              >
                <small style={{ display: 'block', fontSize: 10, color: '#5b756d' }}>
                  {label}
                </small>
                <strong style={{ display: 'block', fontSize: 18, marginTop: 4 }}>
                  {val}
                </strong>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bd-toolbar">
        <label>
          Período
          <select value={span} onChange={(e) => setSpan(Number(e.target.value))}>
            <option value={1}>Dia selecionado</option>
            <option value={7}>7 dias</option>
            <option value={30}>30 dias</option>
          </select>
        </label>
        <label>
          Até ao dia
          <input
            type="date"
            value={end}
            onChange={(e) => {
              if (e.target.value) setEnd(e.target.value);
            }}
          />
        </label>
        <span>
          {start} a {end} · {visible.length}/{span} dias registados
          {updated ? ' · atualizado às ' + updated : ''}
        </span>
      </div>

      <div className="bd-metrics">
        {metrics.map(([label, value]) => (
          <article key={label}>
            <small>{label}</small>
            <strong>{value}</strong>
          </article>
        ))}
      </div>

      {/* Gráfico 1: Barras diárias */}
      <div className="bd-chart">
        <h3>Evolução diária · faturação e custos (€)</h3>
        <div className="bd-legend">
          <span>● Faturação</span>
          <span>● Mercadoria + despesas operacionais</span>
        </div>
        <div
          className="bd-bars"
          role="img"
          aria-label="Comparação diária; valores exatos disponíveis na tabela abaixo"
        >
          {dates.map((date) => {
            const d = visible.find((x) => x.date === date);
            return (
              <div
                key={date}
                title={
                  d
                    ? date + ': ' + money(d.revenue) + ' / ' + money(d.goods + d.expenses)
                    : date + ': sem registo'
                }
              >
                <div className="bd-bar-pair">
                  {d ? (
                    <>
                      <span style={{ height: Math.max(2, (d.revenue / max) * 140) }} />
                      <span
                        style={{
                          height: Math.max(2, ((d.goods + d.expenses) / max) * 140),
                        }}
                      />
                    </>
                  ) : (
                    <i>—</i>
                  )}
                </div>
                <small>{date.slice(8)}</small>
              </div>
            );
          })}
        </div>

        <details>
          <summary>Consultar os valores e as fórmulas</summary>
          <div className="bd-table">
            <table>
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Faturação</th>
                  <th>Mercadoria</th>
                  <th>Despesas</th>
                  <th>Vendas</th>
                  <th>Recebimentos</th>
                  <th>Pagamentos</th>
                </tr>
              </thead>
              <tbody>
                {dates.map((date) => {
                  const d = visible.find((x) => x.date === date);
                  return (
                    <tr key={date}>
                      <td>{date}</td>
                      {d ? (
                        <>
                          <td>{money(d.revenue)}</td>
                          <td>{money(d.goods)}</td>
                          <td>{money(d.expenses)}</td>
                          <td>{d.transactions}</td>
                          <td>{money(d.receipts)}</td>
                          <td>{money(d.payments)}</td>
                        </>
                      ) : (
                        <td colSpan={6}>Sem registo</td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p>
            Ticket = faturação / vendas. Margem bruta = (faturação − custo da mercadoria vendida) /
            faturação. Resultado simplificado = faturação − custo da mercadoria − despesas
            operacionais. Fluxo de caixa = recebimentos − pagamentos.
          </p>
        </details>
      </div>

      {/* Gráficos 2 e 3: Crescimento Acumulado + Estrutura Contabilística */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 16,
          marginTop: 20,
        }}
      >
        <div className="bd-chart" style={{ marginTop: 0 }}>
          <h3>Crescimento acumulado · Receita vs. Resultado</h3>
          <div className="bd-legend">
            <span>● Faturação acumulada ({money(accRev)})</span>
            <span>● Resultado acumulado ({money(accProfit)})</span>
          </div>
          <svg
            viewBox="0 0 600 155"
            style={{ width: '100%', height: 155, marginTop: 10 }}
            role="img"
            aria-label="Curva de crescimento acumulado no período"
          >
            <line x1="20" y1="135" x2="580" y2="135" stroke="#dce5e1" strokeWidth="1" />
            <line x1="20" y1="75" x2="580" y2="75" stroke="#edf2ef" strokeWidth="1" strokeDasharray="4 4" />
            <polyline
              fill="none"
              stroke="#33876c"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={buildPolyline(cumulativeSeries.map((p) => p.accRev))}
            />
            <polyline
              fill="none"
              stroke="#c69c67"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={buildPolyline(cumulativeSeries.map((p) => p.accProfit))}
            />
          </svg>
        </div>

        <div className="bd-chart" style={{ marginTop: 0 }}>
          <h3>Estrutura contabilística &amp; Tesouraria</h3>
          <div style={{ display: 'grid', gap: 12, marginTop: 12 }}>
            {[
              ['Custo Mercadoria (CMV)', goodsPct, money(goods), '#c69c67'],
              ['Despesas Operacionais', expensesPct, money(expenses), '#b45309'],
              [
                'Margem Operacional',
                Math.max(0, netPct),
                `${netPct.toFixed(1)}% (${money(netResult)})`,
                '#1e6155',
              ],
            ].map(([label, pct, textVal, color]) => (
              <div key={String(label)}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: 11,
                    marginBottom: 4,
                  }}
                >
                  <span>{label}</span>
                  <strong>{textVal}</strong>
                </div>
                <div
                  style={{
                    height: 10,
                    background: '#eef3f0',
                    borderRadius: 999,
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      width: `${Math.min(100, Math.max(0, Number(pct))).toFixed(1)}%`,
                      height: '100%',
                      background: String(color),
                    }}
                  />
                </div>
              </div>
            ))}

            <div style={{ borderTop: '1px solid #e1e9e4', paddingTop: 10 }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: 11,
                  marginBottom: 6,
                }}
              >
                <span>Tesouraria: Recebimentos vs. Pagamentos</span>
                <strong>
                  {money(receipts)} / {money(payments)}
                </strong>
              </div>
              <div style={{ display: 'grid', gap: 6 }}>
                <div
                  style={{
                    height: 8,
                    width: `${(receipts / treasuryMax) * 100}%`,
                    background: '#33876c',
                    borderRadius: 999,
                  }}
                />
                <div
                  style={{
                    height: 8,
                    width: `${(payments / treasuryMax) * 100}%`,
                    background: '#c69c67',
                    borderRadius: 999,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bd-operations">
        <h3>Operação online no período</h3>
        <div className="bd-metrics">
          <article>
            <small>Pedidos recebidos</small>
            <strong>{periodOps.length}</strong>
          </article>
          <article>
            <small>Concluídos / entregues</small>
            <strong>{done}</strong>
          </article>
          <article>
            <small>Entregas solicitadas</small>
            <strong>{periodOps.filter((x) => x.delivery?.includes('entrega')).length}</strong>
          </article>
        </div>
        <p className="bd-note">
          Contagem por data de entrada. Um pedido não é uma venda nem comprova pagamento.{' '}
          {periodOps.some((x) => x.amount !== undefined)
            ? 'Valor das encomendas online: ' +
              money(periodOps.reduce((s, x) => s + (x.amount || 0), 0)) +
              '; não somado à faturação.'
            : ''}
        </p>
      </div>

      <div className="bd-evaluation">
        <h3>Depurar · leitura dos dados</h3>
        {!visible.length ? (
          <p>Introduza o primeiro fecho diário para medir resultados.</p>
        ) : (
          <ul>
            {visible.length < span && (
              <li>
                Faltam {span - visible.length} dias no período; a leitura financeira é parcial.
              </li>
            )}
            {netResult < 0 && (
              <li>
                Os custos registados superam a faturação em {money(goods + expenses - revenue)}.
              </li>
            )}
            {receipts < payments && (
              <li>
                Os pagamentos superam os recebimentos em {money(payments - receipts)}.
              </li>
            )}
            {growth !== null && (
              <li>
                A faturação variou {growth.toFixed(1)}% face ao período anterior equivalente.
              </li>
            )}
            <li>
              Antes de definir metas, confira os custos, a base sem IVA e a cobertura dos registos.
            </li>
          </ul>
        )}
      </div>

      <details className="bd-entry">
        <summary>Aplicar · registar ou corrigir um fecho diário</summary>
        <form onSubmit={save}>
          <p>
            Introduza totais consolidados do programa de vendas, na mesma base sem IVA. Não some
            de novo os pedidos do site. Ao repetir uma data, substitui o fecho anterior.
          </p>
          <label>
            Data
            <input name="date" type="date" defaultValue={end} required />
          </label>
          <div className="bd-form-grid">
            {[
              ['revenue', 'Faturação sem IVA (€)'],
              ['goods', 'Custo da mercadoria vendida (€)'],
              ['expenses', 'Despesas operacionais (€)'],
              ['transactions', 'Número de vendas'],
              ['receipts', 'Recebimentos (€)'],
              ['payments', 'Pagamentos (€)'],
            ].map(([field, label]) => (
              <label key={field}>
                {label}
                <input
                  name={field}
                  type="number"
                  min="0"
                  step={field === 'transactions' ? '1' : '0.01'}
                  required
                />
              </label>
            ))}
          </div>
          <p>
            Para corrigir uma data, consulte primeiro os valores na tabela e preencha o fecho
            completo. Os restantes dias são preservados.
          </p>
          <button>Guardar fecho diário</button>
        </form>
      </details>

      {msg && (
        <p className="bd-message" role="status">
          {msg}
        </p>
      )}
    </section>
  );
}
