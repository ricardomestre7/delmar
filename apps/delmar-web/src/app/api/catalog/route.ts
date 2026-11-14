import { NextRequest, NextResponse } from 'next/server';
import { getCatalogProducts } from '@/lib/catalog-store';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get('category');
  const query = searchParams.get('q')?.trim().toLowerCase();
  const ownBrand = searchParams.get('ownBrand') === 'true';
  const flyer = searchParams.get('flyer') === 'true';

  const catalog = await getCatalogProducts();
  const items = catalog.filter((p) => {
    if (category && category !== 'Todas' && p.category !== category) return false;
    if (ownBrand && !p.isOwnBrand) return false;
    if (flyer && !p.isFlyerOffer) return false;
    if (query) {
      const hay = `${p.name} ${p.description} ${p.category} ${p.sku}`.toLowerCase();
      if (!hay.includes(query)) return false;
    }
    return true;
  });

  return NextResponse.json({ count: items.length, items });
}
