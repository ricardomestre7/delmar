'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, MapPin, ShoppingBag, Sparkles } from 'lucide-react';
import { STORE_PROFILE } from '@/lib/store-data';

export function AmhHeroBanner() {
  return (
    <section className="relative overflow-hidden bg-amh-cream">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-14 sm:px-6 lg:grid-cols-12 lg:px-8 lg:py-20">
        <div
          className="lg:col-span-7"
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-amh-red shadow-sm">
            <Sparkles className="h-3.5 w-3.5" />
            Supermercado Casa Del Mar · {STORE_PROFILE.locality}, {STORE_PROFILE.city}
          </div>

          <h1 className="amh-display mt-5 text-amh-navy">
            O supermercado da{' '}
            <span className="text-amh-red">sua casa</span> no Furadouro.
          </h1>

          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-amh-slate sm:text-xl">
            Pão fresquinho, saladas vindas da horta diariamente e o atendimento próximo de
            quem faz parte do Furadouro. No <strong>Delmar</strong>, cada visita tem o cuidado
            de uma casa de família.
          </p>

          <div className="mt-8 flex flex-wrap gap-3.5">
            <Link
              href="/catalogo"
              className="inline-flex items-center gap-2 rounded-full bg-amh-red px-7 py-3.5 text-base font-bold text-white shadow-md transition hover:bg-amh-red-deep"
            >
              <ShoppingBag className="h-5 w-5" />
              Fazer Encomenda / Reserva
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/folhetos"
              className="inline-flex items-center gap-2 rounded-full border-2 border-amh-navy bg-white px-7 py-3.5 text-base font-bold text-amh-navy transition hover:bg-amh-navy hover:text-white"
            >
              Ver Folhetos da Semana
            </Link>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm font-medium text-amh-slate">
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-amh-red" />
              {STORE_PROFILE.address}, {STORE_PROFILE.postalCode} {STORE_PROFILE.city}
            </span>
            <span>Tel: {STORE_PROFILE.phoneFormatted}</span>
          </div>
        </div>

        {/* Cartão visual lateral da loja */}
        <div
          className="lg:col-span-5"
        >
          <div className="relative overflow-hidden rounded-3xl bg-amh-navy text-white shadow-2xl">
            <div className="relative flex min-h-64 flex-col items-center justify-center gap-5 bg-black px-8 py-8">
              <img src="/images/delmar-logo.jpeg" alt="Supermercado Delmar" width={1080} height={540} className="h-auto w-full max-w-sm object-contain" fetchPriority="high" />
              <img
                src="/images/historia/fachada-amanhecer.jpg"
                alt="Fachada atual do Supermercado Casa Del Mar Amanhecer no Furadouro"
                width={147} height={148}
                className="h-36 w-36 rounded-xl border border-white/20 object-contain"
              />

              <span className="absolute right-4 top-4 rounded-full bg-amh-red px-3 py-1 text-xs font-bold shadow">
                No coração do Furadouro
              </span>
            </div>

            <div className="p-7 pt-3">
              <div className="border-b border-white/15 pb-4">
                <p className="text-xs font-bold uppercase tracking-wider text-amh-cream">
                  {STORE_PROFILE.locality} · {STORE_PROFILE.city}
                </p>
                <p className="mt-0.5 text-xl font-extrabold">{STORE_PROFILE.name}</p>
              </div>

            <div className="mt-5 space-y-3.5 text-sm">
              <div className="rounded-2xl bg-white/10 p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-amh-cream">
                  Sempre pão fresquinho
                </p>
                <p className="mt-1 text-base font-bold">O sabor de todos os dias, aqui tão perto.</p>
              </div>
              <div className="rounded-2xl bg-white/10 p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-amh-cream">
                  Horário previsto · a confirmar
                </p>
                {STORE_PROFILE.hours.map((h) => (
                  <p key={h.days} className="mt-1 flex justify-between text-stone-200">
                    <span>{h.days}</span>
                    <span className="font-bold text-white">{h.time}</span>
                  </p>
                ))}
              </div>
              <div className="flex items-center justify-between pt-2">
                <a
                  href={STORE_PROFILE.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-bold text-amh-cream underline underline-offset-4 hover:text-white"
                >
                  Abrir no Google Maps
                </a>
                <a
                  href={STORE_PROFILE.facebookPhotosUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-white px-4 py-2 text-xs font-bold text-amh-navy transition hover:bg-amh-cream"
                >
                  Ver Fotos no Facebook
                </a>
              </div>
            </div>
          </div>
          </div>
        </div>
      </div>
    </section>
  );
}


