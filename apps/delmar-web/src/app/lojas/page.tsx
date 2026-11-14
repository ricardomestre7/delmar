import type { Metadata } from 'next';
import { AmhStoreMap } from '@/components/amh/AmhStoreMap';
import { AmhFaqs } from '@/components/amh/AmhRecipesAndFaqs';

export const metadata: Metadata = {
  title: 'Loja Furadouro — Mapa & Horários',
  description: 'Localização exata, horários e contactos do Supermercado Casa Del Mar (Amanhecer 3206) no Furadouro, Ovar.',
};

export default function LojasPage() {
  return (
    <div className="bg-white">
      <AmhStoreMap />
      <AmhFaqs />
    </div>
  );
}

