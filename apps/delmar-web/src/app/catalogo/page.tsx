import type { Metadata } from 'next';
import { CatalogClient } from '@/components/CatalogClient';

export const metadata: Metadata = {
  title: 'Catálogo & Frescos',
  description: 'Encomende pão quente, frescos, talho e marca própria Amanhecer no Supermercado Casa Del Mar Furadouro.',
};

export default async function CatalogoPage({
  searchParams,
}: {
  searchParams: Promise<{ flyer?: string; ownBrand?: string }>;
}) {
  const params = await searchParams;
  return (
    <div className="bg-white py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <span className="text-xs font-bold uppercase tracking-wider text-amh-red">
          Supermercado Casa Del Mar · Loja 3206
        </span>
        <h1 className="amh-h1 mt-2 text-amh-navy">Catálogo & Frescos Diários</h1>
        <p className="mt-3 max-w-2xl text-base text-amh-slate">
          Adicione os artigos ao cesto e envie a sua reserva para levantamento rápido na loja ou
          entrega no Furadouro.
        </p>

        <div className="mt-8">
          <CatalogClient
            initialFilterFlyer={params.flyer === 'true'}
            initialFilterOwnBrand={params.ownBrand === 'true'}
          />
        </div>
      </div>
    </div>
  );
}

