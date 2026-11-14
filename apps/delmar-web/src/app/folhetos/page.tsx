import type { Metadata } from 'next';
import { AmhFolhetos } from '@/components/amh/AmhFolhetos';

export const metadata: Metadata = {
  title: 'Folhetos & Ofertas',
  description: 'Consulte os folhetos Amanhecer e as promoções semanais do Supermercado Casa Del Mar no Furadouro.',
};

export default function FolhetosPage() {
  return (
    <div className="bg-white">
      <AmhFolhetos showSearch />
    </div>
  );
}

