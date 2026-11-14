'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, Tag, ArrowRight } from 'lucide-react';
import { FLYERS, FlyerItem } from '@/lib/store-data';

export function AmhFolhetos({ showSearch = true }: { showSearch?: boolean }) {
  const [query, setQuery] = useState('');
  const [selectedType, setSelectedType] = useState<'Todos' | FlyerItem['type']>('Todos');

  const types: Array<'Todos' | FlyerItem['type']> = [
    'Todos',
    'Nacional',
    'Especial Furadouro',
    'Frescos',
  ];

  const filtered = FLYERS.filter((f) => {
    if (selectedType !== 'Todos' && f.type !== selectedType) return false;
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      const text = `${f.title} ${f.subtitle} ${f.highlights.map((h) => h.product).join(' ')}`.toLowerCase();
      if (!text.includes(q)) return false;
    }
    return true;
  });

  return (
    <section className="bg-amh-cream/55 py-14 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amh-red">
              <Tag className="h-3.5 w-3.5" />
              Poupança da Semana
            </span>
            <h2 className="amh-h2 mt-2 text-amh-navy">Ofertas Casa Del Mar & Folhetos</h2>
            <p className="mt-2 max-w-2xl text-base text-amh-slate">
              Destaques de frescos e padaria do Supermercado Casa Del Mar, em conjunto com os
              folhetos da rede parceira Amanhecer.
            </p>
          </div>

          {showSearch && (
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Procurar produto no folheto..."
                  className="w-full rounded-full border border-stone-300 bg-white py-2.5 pl-10 pr-4 text-sm text-amh-navy outline-none focus:border-amh-red sm:w-64"
                />
              </div>
            </div>
          )}
        </div>

        {showSearch && (
          <div className="mt-6 flex flex-wrap gap-2">
            {types.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setSelectedType(t)}
                className={`rounded-full px-4 py-2 text-xs font-bold transition ${
                  selectedType === t
                    ? 'bg-amh-red text-white'
                    : 'bg-white text-amh-slate hover:bg-stone-100'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        )}

        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          {filtered.map((flyer) => (
            <article
              key={flyer.id}
              className="flex flex-col justify-between rounded-3xl border border-stone-200 bg-white p-6 shadow-sm transition hover:shadow-md"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="rounded-full bg-amh-cream px-3 py-1 text-xs font-bold text-amh-red">
                    {flyer.badge}
                  </span>
                  <span className="text-xs font-medium text-amh-slate">{flyer.validUntil}</span>
                </div>
                <h3 className="mt-4 text-xl font-extrabold text-amh-navy">{flyer.title}</h3>
                <p className="mt-1.5 text-sm text-amh-slate">{flyer.subtitle}</p>

                <ul className="mt-5 space-y-2.5 border-t border-stone-100 pt-4">
                  {flyer.highlights.map((h) => (
                    <li
                      key={h.product}
                      className="flex items-center justify-between gap-2 text-sm"
                    >
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-amh-navy">{h.product}</p>
                        <p className="text-xs text-stone-500">{h.note}</p>
                      </div>
                      <span className="shrink-0 rounded-lg bg-amh-cream px-2.5 py-1 font-extrabold text-amh-red">
                        {h.price}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6 pt-2">
                <Link
                  href="/catalogo?flyer=true"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-amh-navy px-5 py-3 text-sm font-bold text-white transition hover:bg-amh-red"
                >
                  Encomendar Ofertas
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

