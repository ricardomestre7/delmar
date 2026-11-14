import type { Metadata } from 'next';
import { STORE_PROFILE } from '@/lib/store-data';

export const metadata: Metadata = {
  title: 'Política de Privacidade',
};

export default function PoliticaPrivacidadePage() {
  return (
    <div className="bg-white py-14">
      <div className="mx-auto max-w-3xl space-y-4 px-4 sm:px-6 lg:px-8">
        <h1 className="amh-h1 text-amh-navy">Política de Privacidade</h1>
        <p className="text-sm text-amh-slate">
          O <strong>{STORE_PROFILE.name}</strong> ({STORE_PROFILE.address}, {STORE_PROFILE.postalCode}{' '}
          {STORE_PROFILE.locality}) recolhe apenas os dados estritamente necessários para processar
          reservas e encomendas efetuadas neste portal (nome, telefone e morada quando aplicável).
        </p>
        <p className="text-sm text-amh-slate">
          Para exercer direitos de acesso, retificação ou eliminação de dados (RGPD), contacte{' '}
          <a href={`mailto:${STORE_PROFILE.email}`} className="font-semibold text-amh-red underline">
            {STORE_PROFILE.email}
          </a>{' '}
          ou ligue para {STORE_PROFILE.phoneFormatted}.
        </p>
      </div>
    </div>
  );
}

