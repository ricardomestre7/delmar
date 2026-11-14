import type { Metadata } from 'next';
import { ExternalLink } from 'lucide-react';
import { AmhRecipes } from '@/components/amh/AmhRecipesAndFaqs';
import { STORE_PROFILE } from '@/lib/store-data';

export const metadata: Metadata = {
  title: 'Novidades & Receitas',
  description: 'Receitas práticas e novidades diárias do Supermercado Casa Del Mar no Furadouro.',
};

export default function NovidadesPage() {
  return (
    <div className="bg-white">
      <section className="bg-amh-cream py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <span className="text-xs font-bold uppercase tracking-wider text-amh-red">
            Dia a Dia no Furadouro
          </span>
          <h1 className="amh-h1 mt-2 text-amh-navy">Novidades & Receitas</h1>
          <p className="mt-3 max-w-2xl text-base text-amh-slate">
            Acompanhe as chegadas diárias de fruta, peixe, pão quente e sugestões da nossa equipa no
            Facebook oficial do Supermercado Casa Del Mar.
          </p>
          <a
            href={STORE_PROFILE.facebookPhotosUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-amh-red px-6 py-3 text-sm font-bold text-white transition hover:bg-amh-red-deep"
          >
            Ver Álbum de Fotos no Facebook
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </section>

      <AmhRecipes />
    </div>
  );
}

