import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Política de Cookies',
};

export default function PoliticaCookiesPage() {
  return (
    <div className="bg-white py-14">
      <div className="mx-auto max-w-3xl space-y-4 px-4 sm:px-6 lg:px-8">
        <h1 className="amh-h1 text-amh-navy">Política de Cookies</h1>
        <p className="text-sm text-amh-slate">
          Este portal utiliza apenas armazenamento local técnico (<code>localStorage</code>) para
          preservar os artigos do seu cesto de compras entre páginas, sem rastreamento publicitário
          de terceiros.
        </p>
      </div>
    </div>
  );
}

