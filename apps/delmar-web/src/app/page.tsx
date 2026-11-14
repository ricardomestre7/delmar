import React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { AmhHeroBanner } from '@/components/amh/AmhHeroBanner';
import { AmhBigNumbers } from '@/components/amh/AmhBigNumbers';
import { AmhFolhetos } from '@/components/amh/AmhFolhetos';
import { AmhStoreMap } from '@/components/amh/AmhStoreMap';
import { AmhTestimonials } from '@/components/amh/AmhRecipesAndFaqs';
import { CatalogClient } from '@/components/CatalogClient';

export default function HomePage() {
  return (
    <>
      <AmhHeroBanner />
      <AmhBigNumbers />

      {/* Secção Catálogo & Encomenda Rápida */}
      <section className="bg-white py-14 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amh-red">
                <Sparkles className="h-3.5 w-3.5" />
                Sistema Próprio Casa Del Mar
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
      <AmhStoreMap />
      <AmhTestimonials />
    </>
  );
}

