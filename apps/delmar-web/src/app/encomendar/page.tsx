'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { CheckCircle2, Search, ShoppingBasket, Store, Truck } from 'lucide-react';
import { useCart } from '@/components/CartContext';
import { formatEur } from '@/lib/catalog-data';
import { STORE_PROFILE } from '@/lib/store-data';
import type { FulfillmentMode, StoreOrder } from '@/lib/orders-store';

const STATUS_LABELS: Record<StoreOrder['status'], string> = {
  pendente: 'Recebida — A aguardar confirmação',
  em_preparacao: 'Em preparação na loja',
  pronto: 'Pronta para levantamento / entrega',
  entregue: 'Entregue',
};

export default function EncomendarPage() {
  const { items, totalAmount, clearCart } = useCart();

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [fulfillment, setFulfillment] = useState<FulfillmentMode>('levantamento');
  const [pickupWindow, setPickupWindow] = useState('Hoje — Próxima hora disponível');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createdOrder, setCreatedOrder] = useState<StoreOrder | null>(null);

  // Acompanhamento por código
  const [trackCode, setTrackCode] = useState('');
  const [trackedOrder, setTrackedOrder] = useState<StoreOrder | null>(null);
  const [trackError, setTrackError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName,
          customerPhone,
          fulfillment,
          pickupWindow,
          deliveryAddress: fulfillment === 'entrega_furadouro' ? deliveryAddress : undefined,
          notes,
          items: items.map((i) => ({ productId: i.product.id, quantity: i.quantity })),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Não foi possível enviar a encomenda.');
        return;
      }
      setCreatedOrder(data.order);
      clearCart();
    } catch {
      setError('Erro de ligação ao servidor. Tente novamente.');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleTrack(e: React.FormEvent) {
    e.preventDefault();
    setTrackError(null);
    setTrackedOrder(null);
    if (!trackCode.trim()) return;
    const res = await fetch(`/api/orders?code=${encodeURIComponent(trackCode.trim())}`);
    const data = await res.json();
    if (!res.ok) {
      setTrackError(data.error || 'Código não encontrado.');
      return;
    }
    setTrackedOrder(data.order);
  }

  return (
    <div className="bg-amh-cream/35 py-12 sm:py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <span className="text-xs font-bold uppercase tracking-wider text-amh-red">
          Sistema Próprio Casa Del Mar
        </span>
        <h1 className="amh-h1 mt-2 text-amh-navy">Encomendar & Acompanhar</h1>

        <div className="mt-8 grid gap-8 lg:grid-cols-12">
          {/* Coluna principal: Checkout */}
          <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8 lg:col-span-7">
            {createdOrder ? (
              <div className="py-6 text-center">
                <CheckCircle2 className="mx-auto h-14 w-14 text-emerald-600" />
                <h2 className="mt-4 text-2xl font-extrabold text-amh-navy">
                  Encomenda Registada: {createdOrder.code}
                </h2>
                <p className="mt-2 text-sm text-amh-slate">
                  Guarde este código para acompanhar o estado da preparação no Supermercado Casa Del
                  Mar ({STORE_PROFILE.phoneFormatted}).
                </p>
                <div className="mt-6 rounded-2xl bg-amh-cream/60 p-4 text-left text-sm">
                  <p>
                    <strong>Cliente:</strong> {createdOrder.customerName} ({createdOrder.customerPhone})
                  </p>
                  <p className="mt-1">
                    <strong>Modalidade:</strong>{' '}
                    {createdOrder.fulfillment === 'levantamento'
                      ? `Levantamento na loja (${STORE_PROFILE.address})`
                      : `Entrega no Furadouro (${createdOrder.deliveryAddress})`}
                  </p>
                  <p className="mt-1">
                    <strong>Total:</strong> {formatEur(createdOrder.total)} (pagamento na loja /
                    entrega)
                  </p>
                </div>
                <div className="mt-6 flex flex-wrap justify-center gap-3">
                  <Link
                    href="/catalogo"
                    className="rounded-full bg-amh-red px-6 py-3 text-sm font-bold text-white"
                  >
                    Fazer Nova Encomenda
                  </Link>
                  <Link
                    href="/painel"
                    className="rounded-full border border-stone-300 px-6 py-3 text-sm font-bold text-amh-navy"
                  >
                    Ver no Painel da Loja
                  </Link>
                </div>
              </div>
            ) : items.length === 0 ? (
              <div className="py-10 text-center">
                <ShoppingBasket className="mx-auto h-12 w-12 text-stone-300" />
                <h2 className="mt-3 text-xl font-bold text-amh-navy">O seu cesto está vazio</h2>
                <p className="mt-1 text-sm text-amh-slate">
                  Escolha primeiro os produtos no catálogo para enviar uma reserva à loja.
                </p>
                <Link
                  href="/catalogo"
                  className="mt-5 inline-block rounded-full bg-amh-red px-6 py-3 text-sm font-bold text-white"
                >
                  Ir para o Catálogo
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <h2 className="text-xl font-extrabold text-amh-navy">Dados da Reserva</h2>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-xs font-bold uppercase text-amh-slate">
                      Nome completo *
                    </label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Ex.: Maria Silva"
                      className="w-full rounded-xl border border-stone-300 px-4 py-2.5 text-sm outline-none focus:border-amh-red"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-bold uppercase text-amh-slate">
                      Telemóvel *
                    </label>
                    <input
                      type="tel"
                      required
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="Ex.: 912 345 678"
                      className="w-full rounded-xl border border-stone-300 px-4 py-2.5 text-sm outline-none focus:border-amh-red"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-xs font-bold uppercase text-amh-slate">
                    Como prefere receber?
                  </label>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <button
                      type="button"
                      onClick={() => setFulfillment('levantamento')}
                      className={`flex items-center gap-3 rounded-2xl border p-3.5 text-left text-sm transition ${
                        fulfillment === 'levantamento'
                          ? 'border-amh-red bg-amh-cream/60 font-bold text-amh-navy'
                          : 'border-stone-200 text-amh-slate'
                      }`}
                    >
                      <Store className="h-5 w-5 shrink-0 text-amh-red" />
                      <div>
                        <p>Levantar na Loja</p>
                        <p className="text-xs font-normal">Av. Bombeiros nº34</p>
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setFulfillment('entrega_furadouro')}
                      className={`flex items-center gap-3 rounded-2xl border p-3.5 text-left text-sm transition ${
                        fulfillment === 'entrega_furadouro'
                          ? 'border-amh-red bg-amh-cream/60 font-bold text-amh-navy'
                          : 'border-stone-200 text-amh-slate'
                      }`}
                    >
                      <Truck className="h-5 w-5 shrink-0 text-amh-red" />
                      <div>
                        <p>Entrega no Furadouro</p>
                        <p className="text-xs font-normal">Prédio / Zona local</p>
                      </div>
                    </button>
                  </div>
                </div>

                {fulfillment === 'entrega_furadouro' && (
                  <div>
                    <label className="mb-1.5 block text-xs font-bold uppercase text-amh-slate">
                      Morada / Andar no Furadouro *
                    </label>
                    <input
                      type="text"
                      required
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      placeholder="Rua, nº, andar / apartamento"
                      className="w-full rounded-xl border border-stone-300 px-4 py-2.5 text-sm outline-none focus:border-amh-red"
                    />
                  </div>
                )}

                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase text-amh-slate">
                    Janela horária
                  </label>
                  <select
                    value={pickupWindow}
                    onChange={(e) => setPickupWindow(e.target.value)}
                    className="w-full rounded-xl border border-stone-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-amh-red"
                  >
                    <option>Hoje — Próxima hora disponível</option>
                    <option>Hoje — Manhã (09:00 – 12:30)</option>
                    <option>Hoje — Tarde (15:00 – 19:30)</option>
                    <option>Amanhã — Manhã (Fornada 08:30)</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase text-amh-slate">
                    Observações (ex.: espessura do fiambre, ponto do pão)
                  </label>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full rounded-xl border border-stone-300 px-4 py-2.5 text-sm outline-none focus:border-amh-red"
                  />
                </div>

                <div className="rounded-2xl bg-stone-50 p-4">
                  <p className="text-xs font-bold uppercase text-amh-slate">Resumo do Cesto</p>
                  <ul className="mt-2 space-y-1.5 text-sm">
                    {items.map(({ product, quantity }) => (
                      <li key={product.id} className="flex justify-between">
                        <span>
                          {quantity}x {product.name}
                        </span>
                        <span className="font-bold">{formatEur(product.price * quantity)}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-3 flex justify-between border-t border-stone-200 pt-3 text-base font-extrabold text-amh-navy">
                    <span>Total estimado</span>
                    <span>{formatEur(totalAmount)}</span>
                  </div>
                </div>

                {error && (
                  <p className="rounded-xl bg-red-50 px-4 py-2.5 text-sm font-semibold text-amh-red">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full rounded-full bg-amh-red px-6 py-3.5 text-base font-bold text-white shadow-sm transition hover:bg-amh-red-deep disabled:opacity-60"
                >
                  {submitting ? 'A enviar reserva...' : 'Confirmar Encomenda na Loja'}
                </button>
              </form>
            )}
          </div>

          {/* Coluna lateral: Acompanhar encomenda */}
          <div className="space-y-6 lg:col-span-5">
            <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-extrabold text-amh-navy">Acompanhar Encomenda</h2>
              <p className="mt-1 text-sm text-amh-slate">
                Introduza o código (ex.: <code className="font-bold">DM-1234</code>) para ver o
                estado atual.
              </p>
              <form onSubmit={handleTrack} className="mt-4 flex gap-2">
                <input
                  type="text"
                  value={trackCode}
                  onChange={(e) => setTrackCode(e.target.value)}
                  placeholder="DM-XXXX"
                  className="flex-1 rounded-full border border-stone-300 px-4 py-2 text-sm uppercase outline-none focus:border-amh-red"
                />
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 rounded-full bg-amh-navy px-4 py-2 text-sm font-bold text-white hover:bg-amh-red"
                >
                  <Search className="h-4 w-4" />
                  Consultar
                </button>
              </form>

              {trackError && (
                <p className="mt-3 text-sm font-semibold text-amh-red">{trackError}</p>
              )}

              {trackedOrder && (
                <div className="mt-4 rounded-2xl bg-amh-cream/60 p-4 text-sm">
                  <p className="font-extrabold text-amh-navy">
                    {trackedOrder.code}
                  </p>
                  <p className="mt-1 font-semibold text-amh-red">
                    Estado: {STATUS_LABELS[trackedOrder.status]}
                  </p>
                  <p className="mt-1 text-xs text-amh-slate">
                    Janela: {trackedOrder.pickupWindow} · Total: {formatEur(trackedOrder.total)}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


