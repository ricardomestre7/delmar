'use client';

import BusinessDashboard from '@/components/BusinessDashboard';
import React, { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { Download, Globe, MessageSquareLock, RefreshCw, Upload } from 'lucide-react';
import { formatEur } from '@/lib/catalog-data';
import type { OrderStatus, StoreOrder } from '@/lib/orders-store';

const STATUS_OPTIONS: Array<{ value: OrderStatus; label: string; color: string }> = [
  { value: 'pendente', label: 'Pendente', color: 'bg-amber-100 text-amber-900' },
  { value: 'em_preparacao', label: 'Em Preparação', color: 'bg-blue-100 text-blue-900' },
  { value: 'pronto', label: 'Pronta', color: 'bg-emerald-100 text-emerald-900' },
  { value: 'entregue', label: 'Entregue', color: 'bg-stone-200 text-stone-700' },
];

export default function PainelLojaPage() {
  const [authenticated,setAuthenticated]=useState<boolean|null>(null);
  const [password,setPassword]=useState('');
  const [authError,setAuthError]=useState('');
  const [orders, setOrders] = useState<StoreOrder[]>([]);
  const [loading, setLoading] = useState(true);

  const [importMsg, setImportMsg] = useState<string | null>(null);
  const [importErr, setImportErr] = useState<string | null>(null);
  const [importing, setImporting] = useState(false);

  const [syncResult, setSyncResult] = useState<{
    checkedAt?: string;
    flyerLinks?: string[];
    error?: string;
  } | null>(null);
  const [syncing, setSyncing] = useState(false);

  const loadOrders = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/orders', { cache: 'no-store' });
      const data = await res.json();
      if(!res.ok){setAuthenticated(false);setOrders([]);return;}
      if (Array.isArray(data.orders)) {
        setOrders(data.orders);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch('/api/internal/auth',{cache:'no-store'}).then(r=>r.json()).then(v=>setAuthenticated(v.authenticated===true)).catch(()=>setAuthenticated(false));
  }, []);
  useEffect(()=>{if(authenticated)loadOrders();},[authenticated,loadOrders]);

  async function handleCsvUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImportMsg(null);
    setImportErr(null);
    setImporting(true);
    try {
      const text = await file.text();
      const isJson = file.name.toLowerCase().endsWith('.json');
      const res = await fetch('/api/catalog/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: isJson ? text : JSON.stringify({ csv: text }),
      });
      const data = await res.json();
      if (!res.ok) {
        setImportErr(data.error || 'Erro ao importar ficheiro.');
      } else {
        const s = data.summary;
        setImportMsg(
          `Catálogo atualizado: ${s.added} novos, ${s.updated} atualizados, ${s.skipped} ignorados (total: ${s.total} artigos).`,
        );
      }
    } catch {
      setImportErr('Falha ao ler ou enviar o ficheiro.');
    } finally {
      setImporting(false);
      e.target.value = '';
    }
  }

  async function handleSyncAmanhecer() {
    setSyncing(true);
    setSyncResult(null);
    try {
      const res = await fetch('/api/sync/amanhecer', { cache: 'no-store' });
      const data = await res.json();
      setSyncResult(data);
    } catch {
      setSyncResult({ error: 'Falha ao consultar amanhecer.pt.' });
    } finally {
      setSyncing(false);
    }
  }

  async function changeStatus(id: string, status: OrderStatus) {
    const res = await fetch(`/api/orders/${encodeURIComponent(id)}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      await loadOrders();
    }
  }

  if(authenticated===null)return <div className="mx-auto max-w-xl px-6 py-16">A verificar acesso…</div>;
  if(!authenticated)return <div className="mx-auto max-w-lg px-6 py-16"><h1 className="text-3xl font-bold text-amh-navy">Área privada do Delmar</h1><p className="mt-3 text-sm text-amh-slate">Resultados e gestão do Sr. Pedro. Entre com a senha própria da loja.</p><form className="mt-6 space-y-4" onSubmit={async e=>{e.preventDefault();setAuthError('');try{const r=await fetch('/api/internal/auth',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({password})});const v=await r.json();if(!r.ok)throw Error(v.error);setPassword('');setAuthenticated(true);}catch(e){setAuthError((e as Error).message)}}}><label className="block text-sm font-bold">Senha<input type="password" autoComplete="current-password" required value={password} onChange={e=>setPassword(e.target.value)} className="mt-2 w-full rounded-xl border border-stone-200 px-4 py-3"/></label><button className="rounded-full bg-amh-red px-6 py-3 font-bold text-white">Entrar</button>{authError&&<p role="alert">{authError}</p>}</form></div>;
  return (
    <div className="bg-amh-cream/35 py-12 sm:py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amh-red">
              Operação Interna · Loja 3206
            </span>
            <h1 className="amh-h1 mt-1 text-amh-navy">Resultados & Encomendas</h1>
          </div>
          <div className="flex flex-wrap items-center gap-2.5">
            <Link
              href="/rede-interna"
              className="inline-flex items-center gap-2 rounded-full bg-amh-red px-5 py-2.5 text-sm font-bold text-white hover:bg-amh-red-deep"
            >
              <MessageSquareLock className="h-4 w-4" />
              Chat Interno (Equipa)
            </Link>
            <button
              type="button"
              onClick={loadOrders}
              className="inline-flex items-center gap-2 rounded-full bg-amh-navy px-5 py-2.5 text-sm font-bold text-white hover:bg-amh-red"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              Atualizar
            </button>
          </div>
        </div>

        <div className="mt-4 text-right"><button className="text-sm font-bold text-amh-red" onClick={async()=>{await fetch('/api/internal/auth',{method:'DELETE'});setAuthenticated(false);setOrders([])}}>Terminar sessão</button></div>
        <BusinessDashboard name="Delmar · Sr. Pedro" />
        {/* Ferramentas de Catálogo & Sincronização */}
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-extrabold text-amh-navy">
              Importar Preços & Promoções (CSV / JSON)
            </h2>
            <p className="mt-1 text-sm text-amh-slate">
              Carregue a tabela exportada do POS da loja ou do portal Recheio para atualizar preços,
              stock e destaques de folheto.
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <label className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-amh-red px-5 py-2.5 text-xs font-bold text-white hover:bg-amh-red-deep">
                <Upload className="h-4 w-4" />
                {importing ? 'A importar...' : 'Carregar CSV / JSON'}
                <input
                  type="file"
                  accept=".csv,.json,text/csv,application/json"
                  onChange={handleCsvUpload}
                  disabled={importing}
                  className="hidden"
                />
              </label>
              <a
                href="/api/catalog/import"
                className="inline-flex items-center gap-1.5 rounded-full border border-stone-300 bg-stone-50 px-4 py-2.5 text-xs font-bold text-amh-navy hover:bg-stone-100"
              >
                <Download className="h-3.5 w-3.5" />
                Descarregar Modelo CSV
              </a>
            </div>
            {importMsg && (
              <p className="mt-3 rounded-xl bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-800">
                {importMsg}
              </p>
            )}
            {importErr && (
              <p className="mt-3 rounded-xl bg-red-50 px-3 py-2 text-xs font-semibold text-amh-red">
                {importErr}
              </p>
            )}
          </div>

          <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-extrabold text-amh-navy">
              Monitor de Folhetos da Rede (amanhecer.pt)
            </h2>
            <p className="mt-1 text-sm text-amh-slate">
              Verifica o bundle público da rede Amanhecer para detetar novos links de folhetos
              publicados.
            </p>
            <div className="mt-4">
              <button
                type="button"
                onClick={handleSyncAmanhecer}
                disabled={syncing}
                className="inline-flex items-center gap-2 rounded-full bg-amh-navy px-5 py-2.5 text-xs font-bold text-white hover:bg-amh-red disabled:opacity-60"
              >
                <Globe className="h-4 w-4" />
                {syncing ? 'A consultar amanhecer.pt...' : 'Verificar Folhetos da Rede'}
              </button>
            </div>
            {syncResult?.error && (
              <p className="mt-3 rounded-xl bg-red-50 px-3 py-2 text-xs font-semibold text-amh-red">
                {syncResult.error}
              </p>
            )}
            {syncResult?.flyerLinks && (
              <div className="mt-3 rounded-xl bg-amh-cream/60 p-3 text-xs text-amh-navy">
                <p className="font-bold">
                  {syncResult.flyerLinks.length} links encontrados em amanhecer.pt:
                </p>
                <ul className="mt-1.5 space-y-1">
                  {syncResult.flyerLinks.map((link) => (
                    <li key={link} className="truncate text-amh-slate">
                      {link}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="mt-8 rounded-3xl border border-stone-200 bg-white p-10 text-center">
            <p className="font-bold text-amh-navy">Ainda não existem encomendas registadas.</p>
            <p className="mt-1 text-sm text-amh-slate">
              As reservas submetidas em /encomendar aparecem aqui automaticamente.
            </p>
          </div>
        ) : (
          <div className="mt-8 space-y-4">
            {orders.map((order) => {
              const badge = STATUS_OPTIONS.find((s) => s.value === order.status);
              return (
                <article
                  key={order.id}
                  className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2.5">
                        <span className="text-lg font-extrabold text-amh-navy">{order.code}</span>
                        <span
                          className={`rounded-full px-3 py-0.5 text-xs font-bold ${
                            badge?.color ?? 'bg-stone-100'
                          }`}
                        >
                          {badge?.label ?? order.status}
                        </span>
                      </div>
                      <p className="mt-1 text-sm font-semibold text-amh-navy">
                        {order.customerName} · {order.customerPhone}
                      </p>
                      <p className="text-xs text-amh-slate">
                        {order.fulfillment === 'levantamento'
                          ? 'Levantamento na Loja'
                          : `Entrega Furadouro: ${order.deliveryAddress}`}{' '}
                        · {order.pickupWindow}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      {STATUS_OPTIONS.map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => changeStatus(order.id, opt.value)}
                          className={`rounded-full px-3 py-1.5 text-xs font-bold transition ${
                            order.status === opt.value
                              ? 'bg-amh-red text-white'
                              : 'border border-stone-200 bg-stone-50 text-amh-slate hover:bg-stone-100'
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <ul className="mt-4 space-y-1 border-t border-stone-100 pt-3 text-sm">
                    {order.items.map((item) => (
                      <li key={item.productId} className="flex justify-between">
                        <span>
                          {item.quantity}x {item.name}
                        </span>
                        <span className="font-bold">{formatEur(item.lineTotal)}</span>
                      </li>
                    ))}
                  </ul>
                  {order.notes && (
                    <p className="mt-2 rounded-xl bg-amh-cream/50 px-3 py-2 text-xs text-amh-navy">
                      <strong>Nota:</strong> {order.notes}
                    </p>
                  )}
                  <div className="mt-3 text-right text-base font-extrabold text-amh-navy">
                    Total: {formatEur(order.total)}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}


