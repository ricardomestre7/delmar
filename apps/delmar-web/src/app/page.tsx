import React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { AmhHeroBanner } from '@/components/amh/AmhHeroBanner';
import { AmhBigNumbers } from '@/components/amh/AmhBigNumbers';
import { AmhHistoria } from '@/components/amh/AmhHistoria';
import { AmhFolhetos } from '@/components/amh/AmhFolhetos';
import { AmhStoreMap } from '@/components/amh/AmhStoreMap';
import { AmhTestimonials } from '@/components/amh/AmhRecipesAndFaqs';
import { CatalogClient } from '@/components/CatalogClient';

export default function HomePage() {
  return (
    <>
      <AmhHeroBanner />
      <AmhBigNumbers />
      <section aria-labelledby="natal-title" className="bg-amh-navy px-4 py-12 text-white sm:px-6">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-6 md:flex-row md:items-center">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-widest text-amh-cream">Natal no Delmar · Furadouro</p>
            <h2 id="natal-title" className="mt-3 text-3xl font-bold sm:text-4xl">Encomende a sua prenda de Natal no Delmar.</h2>
            <p className="mt-4 leading-relaxed text-stone-300">Uma lembrança com sabor e o carinho do comércio local. Fale connosco para conhecer as opções e preparar a sua prenda.</p>
          </div>
          <a href="tel:+351256591235" className="inline-flex shrink-0 items-center justify-center rounded-full bg-amh-red px-7 py-4 font-bold text-white transition hover:bg-amh-red-deep">Falar com a loja →</a>
        </div>
      </section>

      {/* Secção Catálogo & Encomenda Rápida */}
      <section className="bg-white py-14 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amh-red">
                <Sparkles className="h-3.5 w-3.5" />
                Da nossa casa para a sua
              </span>
              <h2 className="amh-h2 mt-2 text-amh-navy">
                Encomende Frescos & Marca Própria
              </h2>
              <p className="mt-2 max-w-2xl text-base text-amh-slate">
                Prepare o seu cesto online e levante na loja da Av. dos Bombeiros Voluntários do
                Porto nº34 ou receba no Furadouro.
              </p>
            </div>
            <Link
              href="/catalogo"
              className="inline-flex items-center gap-2 text-sm font-bold text-amh-red hover:underline"
            >
              Ver catálogo completo <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-8">
            <CatalogClient initialFilterFlyer />
          </div>
        </div>
      </section>

      <AmhFolhetos />
      <AmhHistoria />
      <AmhStoreMap />
      <AmhTestimonials />
    </>
  );
}


