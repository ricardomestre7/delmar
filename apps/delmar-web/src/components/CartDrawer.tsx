'use client';

import React from 'react';
import Link from 'next/link';
import { Minus, Plus, ShoppingBasket, Trash2, X, ArrowRight } from 'lucide-react';
import { useCart } from './CartContext';
import { formatEur } from '@/lib/catalog-data';

export function CartDrawer() {
  const { items, isDrawerOpen, closeDrawer, updateQty, removeItem, totalAmount, totalCount } = useCart();

  if (!isDrawerOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-sm">
      <div className="flex h-full w-full max-w-md flex-col bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-stone-200 bg-amh-cream px-5 py-4">
          <div className="flex items-center gap-2.5">
            <ShoppingBasket className="h-5 w-5 text-amh-red" />
            <div>
              <h2 className="text-lg font-bold text-amh-navy">O Seu Cesto ({totalCount})</h2>
              <p className="text-xs text-amh-slate">Supermercado Casa Del Mar · Furadouro</p>
            </div>
          </div>
          <button
            type="button"
            onClick={closeDrawer}
            aria-label="Fechar cesto"
            className="rounded-full p-2 text-amh-slate hover:bg-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <ShoppingBasket className="mb-3 h-12 w-12 text-stone-300" />
              <p className="font-semibold text-amh-navy">O cesto está vazio</p>
              <p className="mt-1 text-sm text-amh-slate">
                Adicione pão quente, frescos ou produtos Amanhecer para reservar na loja.
              </p>
              <Link
                href="/catalogo"
                onClick={closeDrawer}
                className="mt-5 inline-flex items-center gap-2 rounded-full bg-amh-red px-5 py-2.5 text-sm font-semibold text-white hover:bg-amh-red-deep"
              >
                Ver Catálogo
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ) : (
            <ul className="space-y-4">
              {items.map(({ product, quantity }) => (
                <li
                  key={product.id}
                  className="flex items-start justify-between gap-3 rounded-2xl border border-stone-200 bg-stone-50/70 p-3.5"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-amh-red">{product.category}</p>
                    <p className="font-semibold text-amh-navy">{product.name}</p>
                    <p className="text-xs text-amh-slate">
                      {formatEur(product.price)} / {product.unit}
                    </p>
                    <div className="mt-2.5 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => updateQty(product.id, quantity - 1)}
                        className="rounded-full border border-stone-300 bg-white p-1 hover:border-amh-red"
                        aria-label="Diminuir quantidade"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="min-w-[1.5rem] text-center text-sm font-bold">{quantity}</span>
                      <button
                        type="button"
                        onClick={() => updateQty(product.id, quantity + 1)}
                        className="rounded-full border border-stone-300 bg-white p-1 hover:border-amh-red"
                        aria-label="Aumentar quantidade"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeItem(product.id)}
                        className="ml-2 text-stone-400 hover:text-amh-red"
                        aria-label="Remover item"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <div className="text-right font-bold text-amh-navy">
                    {formatEur(product.price * quantity)}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-stone-200 bg-amh-cream/60 p-5">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm font-medium text-amh-slate">Total estimado</span>
              <span className="text-xl font-bold text-amh-navy">{formatEur(totalAmount)}</span>
            </div>
            <Link
              href="/encomendar"
              onClick={closeDrawer}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-amh-red px-6 py-3.5 font-semibold text-white shadow-sm transition hover:bg-amh-red-deep"
            >
              Finalizar Encomenda / Reserva
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

