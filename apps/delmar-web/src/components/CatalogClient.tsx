'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Plus, Search, Sparkles } from 'lucide-react';
import {
  CATALOG_PRODUCTS,
  CatalogProduct,
  PRODUCT_CATEGORIES,
  ProductCategory,
  formatEur,
} from '@/lib/catalog-data';
import { useCart } from '@/components/CartContext';

interface CatalogClientProps {
  initialFilterOwnBrand?: boolean;
  initialFilterFlyer?: boolean;
}

export function CatalogClient({
  initialFilterOwnBrand = false,
  initialFilterFlyer = false,
}: CatalogClientProps) {
  const { addItem } = useCart();
  const [products, setProducts] = useState<CatalogProduct[]>(CATALOG_PRODUCTS);
  const [selectedCategory, setSelectedCategory] = useState<'Todas' | ProductCategory>('Todas');
  const [query, setQuery] = useState('');
  const [onlyOwnBrand, setOnlyOwnBrand] = useState(initialFilterOwnBrand);
  const [onlyFlyer, setOnlyFlyer] = useState(initialFilterFlyer);

  useEffect(() => {
    fetch('/api/catalog', { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data && Array.isArray(data.items) && data.items.length > 0) {
          setProducts(data.items);
        }
      })
      .catch(() => {});
  }, []);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (!p.inStock) return false;
      if (selectedCategory !== 'Todas' && p.category !== selectedCategory) return false;
      if (onlyOwnBrand && !p.isOwnBrand) return false;
      if (onlyFlyer && !p.isFlyerOffer) return false;
      if (query.trim()) {
        const q = query.trim().toLowerCase();
        const text = `${p.name} ${p.description} ${p.category} ${p.sku}`.toLowerCase();
        if (!text.includes(q)) return false;
      }
      return true;
    });
  }, [products, selectedCategory, query, onlyOwnBrand, onlyFlyer]);

  return (
    <div>
      {/* Barra de pesquisa e filtros */}
      <div className="rounded-3xl border border-stone-200 bg-amh-cream/50 p-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Pesquisar pão, fruta, talho, azeite, leite..."
              className="w-full rounded-full border border-stone-300 bg-white py-2.5 pl-10 pr-4 text-sm text-amh-navy outline-none focus:border-amh-red"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setOnlyOwnBrand((v) => !v)}
              className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold transition ${
                onlyOwnBrand
                  ? 'bg-amh-purple text-white'
                  : 'border border-stone-300 bg-white text-amh-navy'
              }`}
            >
              <Sparkles className="h-3.5 w-3.5" />
              Marca Própria Amanhecer
            </button>
            <button
              type="button"
              onClick={() => setOnlyFlyer((v) => !v)}
              className={`rounded-full px-4 py-2 text-xs font-bold transition ${
                onlyFlyer
                  ? 'bg-amh-red text-white'
                  : 'border border-stone-300 bg-white text-amh-navy'
              }`}
            >
              Ofertas de Folheto
            </button>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setSelectedCategory('Todas')}
            className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition ${
              selectedCategory === 'Todas'
                ? 'bg-amh-navy text-white'
                : 'bg-white text-amh-slate hover:bg-stone-100'
            }`}
          >
            Todas ({CATALOG_PRODUCTS.length})
          </button>
          {PRODUCT_CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition ${
                selectedCategory === cat
                  ? 'bg-amh-navy text-white'
                  : 'bg-white text-amh-slate hover:bg-stone-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grelha de produtos */}
      {filtered.length === 0 ? (
        <div className="mt-8 rounded-3xl border border-stone-200 bg-white p-10 text-center">
          <p className="font-bold text-amh-navy">Nenhum produto encontrado para este filtro.</p>
          <p className="mt-1 text-sm text-amh-slate">
            Experimente limpar a pesquisa ou selecionar outra categoria.
          </p>
        </div>
      ) : (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((product: CatalogProduct) => (
            <article
              key={product.id}
              className="flex flex-col justify-between rounded-3xl border border-stone-200 bg-white p-5 shadow-sm transition hover:border-amh-red/40 hover:shadow-md"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-amh-red">
                    {product.category}
                  </span>
                  {product.badge && (
                    <span className="rounded-full bg-amh-cream px-2.5 py-0.5 text-[11px] font-bold text-amh-navy">
                      {product.badge}
                    </span>
                  )}
                </div>
                <h3 className="mt-2.5 text-lg font-extrabold text-amh-navy">{product.name}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-amh-slate">
                  {product.description}
                </p>
              </div>

              <div className="mt-5 flex items-end justify-between border-t border-stone-100 pt-4">
                <div>
                  <p className="text-2xl font-extrabold text-amh-navy">
                    {formatEur(product.price)}
                  </p>
                  <p className="text-xs text-stone-500">
                    por {product.unit} · Ref. {product.sku}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => addItem(product, 1)}
                  className="inline-flex items-center gap-1.5 rounded-full bg-amh-red px-4 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-amh-red-deep"
                >
                  <Plus className="h-4 w-4" />
                  Adicionar
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

