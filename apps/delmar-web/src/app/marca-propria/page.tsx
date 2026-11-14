import type { Metadata } from 'next';
import { CatalogClient } from '@/components/CatalogClient';

export const metadata: Metadata = {
  title: 'Marca Própria Amanhecer',
  description: 'Produtos de Marca Própria Amanhecer disponíveis no Supermercado Casa Del Mar Furadouro.',
};

export default function MarcaPropriaPage() {
  return (
    <div className="bg-white py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <span className="inline-block rounded-full bg-amh-purple/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-amh-purple">
          Qualidade Garantida Amanhecer
        </span>
        <h1 className="amh-h1 mt-3 text-amh-navy">Marca Própria Amanhecer</h1>
        <p className="mt-3 max-w-2xl text-base text-amh-slate">
          Mais de 400 referências selecionadas com rigor para o dia a dia da sua família, sempre
          ao melhor preço no Supermercado Casa Del Mar.
        </p>

        <div className="mt-8">
          <CatalogClient initialFilterOwnBrand />
        </div>
      </div>
    </div>
  );
}

