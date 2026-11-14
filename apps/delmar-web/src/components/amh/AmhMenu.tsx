'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MapPin, Menu, Phone, ShoppingBasket, X } from 'lucide-react';
import { NAV_ITEMS, STORE_PROFILE } from '@/lib/store-data';
import { useCart } from '@/components/CartContext';

export function AmhMenu() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { totalCount, openDrawer } = useCart();

  return (
    <header className="sticky top-0 z-40 border-b border-stone-200/80 bg-white/95 backdrop-blur-md">
      {/* Barra superior de proximidade */}
      <div className="bg-amh-navy text-xs text-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2 px-4 py-2 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1.5 text-amh-cream">
              <MapPin className="h-3.5 w-3.5 text-amh-red" />
              {STORE_PROFILE.address}, {STORE_PROFILE.locality} ({STORE_PROFILE.city})
            </span>
            <span className="hidden items-center gap-1.5 text-stone-300 md:inline-flex">
              <Phone className="h-3.5 w-3.5 text-amh-red" />
              {STORE_PROFILE.phoneFormatted}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/painel" className="text-stone-300 transition hover:text-white">
              Painel da Loja
            </Link>
            <a
              href={STORE_PROFILE.facebookPhotosUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-amh-cream transition hover:text-white"
            >
              Fotos & Novidades (Facebook)
            </a>
          </div>
        </div>
      </div>

      {/* Navegação principal (c/amh_Menu) */}
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3.5 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amh-red text-white shadow-sm">
            <span className="text-xl font-extrabold tracking-tight">A</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-extrabold tracking-tight text-amh-navy">
                amanhecer
              </span>
              <span className="rounded-full bg-amh-cream px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider text-amh-red">
                Furadouro
              </span>
            </div>
            <p className="text-xs font-medium text-amh-slate">
              {STORE_PROFILE.name} · Loja {STORE_PROFILE.code}
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-full px-3.5 py-2 text-sm font-semibold transition ${
                  active
                    ? 'bg-amh-cream text-amh-red'
                    : 'text-amh-slate hover:bg-stone-100 hover:text-amh-navy'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={openDrawer}
            className="inline-flex items-center gap-2 rounded-full bg-amh-red px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-amh-red-deep"
          >
            <ShoppingBasket className="h-4 w-4" />
            <span className="hidden sm:inline">Encomendar</span>
            <span className="inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-white px-1.5 text-xs font-extrabold text-amh-red">
              {totalCount}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            className="rounded-xl border border-stone-200 p-2 text-amh-navy lg:hidden"
            aria-label="Abrir menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Menu Mobile */}
      {mobileOpen && (
        <div className="border-t border-stone-200 bg-white px-4 py-4 lg:hidden">
          <nav className="flex flex-col gap-1.5">
            {NAV_ITEMS.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`rounded-xl px-4 py-2.5 text-sm font-semibold ${
                    active ? 'bg-amh-cream text-amh-red' : 'text-amh-navy hover:bg-stone-100'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
            <Link
              href="/encomendar"
              onClick={() => setMobileOpen(false)}
              className="mt-2 rounded-xl bg-amh-navy px-4 py-2.5 text-center text-sm font-semibold text-white"
            >
              Acompanhar Encomenda
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}

