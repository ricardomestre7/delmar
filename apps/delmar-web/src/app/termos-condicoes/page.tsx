import type { Metadata } from 'next';
import { STORE_PROFILE } from '@/lib/store-data';

export const metadata: Metadata = {
  title: 'Termos e Condições',
};

export default function TermosCondicoesPage() {
  return (
    <div className="bg-white py-14">
      <div className="mx-auto max-w-3xl space-y-4 px-4 sm:px-6 lg:px-8">
        <h1 className="amh-h1 text-amh-navy">Termos e Condições</h1>
        <p className="text-sm text-amh-slate">
          As reservas submetidas no portal do <strong>{STORE_PROFILE.name}</strong> constituem
          pedidos de preparação de compras para levantamento na loja ({STORE_PROFILE.address}) ou
          entrega local no Furadouro.
        </p>
        <p className="text-sm text-amh-slate">
          Produtos vendidos ao peso (frutas, legumes, talho, peixaria e charcutaria ao corte) têm
          valor final ajustado na balança da loja no momento do pagamento.
        </p>
      </div>
    </div>
  );
}

