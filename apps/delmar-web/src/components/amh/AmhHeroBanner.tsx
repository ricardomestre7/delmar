'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, MapPin, ShoppingBag, Sparkles } from 'lucide-react';
import { STORE_PROFILE } from '@/lib/store-data';

export function AmhHeroBanner() {
  return (
    <section className="relative overflow-hidden bg-amh-cream">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-14 sm:px-6 lg:grid-cols-12 lg:px-8 lg:py-20">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
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
            No <strong>{STORE_PROFILE.name}</strong> encontra pão quente todos os dias, fruta e
            legumes selecionados, talho e charcutaria ao corte — com os preços e a marca própria
            da rede parceira <strong>Amanhecer</strong>.
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
        </motion.div>

        {/* Cartão visual lateral da loja */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.45, delay: 0.1 }}
          className="lg:col-span-5"
        >
          <div className="relative overflow-hidden rounded-3xl bg-amh-navy text-white shadow-2xl">
            <div className="relative h-48 w-full overflow-hidden">
              <img
                src="/images/historia/fachada-amanhecer.jpg"
                alt="Fachada atual do Supermercado Casa Del Mar Amanhecer no Furadouro"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-amh-navy via-amh-navy/40 to-transparent" />
              <span className="absolute right-4 top-4 rounded-full bg-amh-red px-3 py-1 text-xs font-bold shadow">
                Aberto Hoje
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
                  Fornadas de Pão Quente
                </p>
                <p className="mt-1 text-base font-bold">08:30 (Manhã) · 16:30 (Tarde)</p>
              </div>
              <div className="rounded-2xl bg-white/10 p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-amh-cream">
                  Horário da Loja
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
        </motion.div>
      </div>
    </section>
  );
}

