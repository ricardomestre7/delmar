import fs from 'node:fs/promises';
import path from 'node:path';
import {
  CATALOG_PRODUCTS,
  CatalogProduct,
  PRODUCT_CATEGORIES,
  ProductCategory,
} from './catalog-data';

const CATALOG_FILE = path.join(process.cwd(), 'data', 'catalog.json');
let memoryCatalog: CatalogProduct[] | null = null;

export async function getCatalogProducts(): Promise<CatalogProduct[]> {
  try {
    const raw = await fs.readFile(CATALOG_FILE, 'utf8');
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      memoryCatalog = parsed;
      return parsed;
    }
  } catch {
    // Fallback para memória ou catálogo base
  }
  return memoryCatalog ?? CATALOG_PRODUCTS;
}

async function saveCatalogProducts(products: CatalogProduct[]): Promise<void> {
  memoryCatalog = products;
  try {
    await fs.mkdir(path.dirname(CATALOG_FILE), { recursive: true });
    await fs.writeFile(CATALOG_FILE, JSON.stringify(products, null, 2), 'utf8');
  } catch {
    // Mantém em memória se o sistema de ficheiros for read-only
  }
}

function normalizeCategory(raw?: string): ProductCategory {
  if (!raw) return 'Mercearia & Bebidas';
  const lower = raw.trim().toLowerCase();
  const exact = PRODUCT_CATEGORIES.find((c) => c.toLowerCase() === lower);
  if (exact) return exact;
  if (lower.includes('padaria') || lower.includes('pastel')) return 'Padaria & Pastelaria';
  if (lower.includes('fruta') || lower.includes('legum')) return 'Frutas & Legumes';
  if (lower.includes('talho') || lower.includes('charcut')) return 'Talho & Charcutaria';
  if (lower.includes('peix') || lower.includes('mar')) return 'Peixaria & Mar';
  if (lower.includes('amanhecer') || lower.includes('propria') || lower.includes('própria')) {
    return 'Marca Própria Amanhecer';
  }
  return 'Mercearia & Bebidas';
}

function parseBool(val?: string | boolean): boolean {
  if (typeof val === 'boolean') return val;
  if (!val) return false;
  const v = val.trim().toLowerCase();
  return v === 'true' || v === '1' || v === 'sim' || v === 's' || v === 'yes';
}

function parsePrice(val: string | number): number {
  if (typeof val === 'number') return Number.isFinite(val) ? Number(val.toFixed(2)) : NaN;
  const cleaned = val.replace(/[€\s]/g, '').replace(',', '.');
  const num = Number(cleaned);
  return Number.isFinite(num) ? Number(num.toFixed(2)) : NaN;
}

export interface ImportSummary {
  added: number;
  updated: number;
  skipped: number;
  total: number;
}

export function parseCsvText(csvText: string): Array<Record<string, string>> {
  const lines = csvText
    .replace(/^\uFEFF/, '')
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  if (lines.length < 2) {
    throw new Error('O ficheiro CSV precisa de cabeçalho e pelo menos uma linha de produto.');
  }

  const delimiter = lines[0].includes(';') ? ';' : ',';
  const headers = lines[0].split(delimiter).map((h) => h.trim().toLowerCase());

  return lines.slice(1).map((line) => {
    const cols = line.split(delimiter).map((c) => c.trim().replace(/^"|"$/g, ''));
    const row: Record<string, string> = {};
    headers.forEach((h, idx) => {
      row[h] = cols[idx] ?? '';
    });
    return row;
  });
}

export async function importCatalogRows(
  rows: Array<Record<string, string | number | boolean>>,
): Promise<ImportSummary> {
  const current = [...(await getCatalogProducts())];
  let added = 0;
  let updated = 0;
  let skipped = 0;

  for (const raw of rows) {
    const sku = String(raw.sku ?? raw.codigo ?? '').trim();
    const name = String(raw.name ?? raw.nome ?? raw.produto ?? '').trim();
    const price = parsePrice(String(raw.price ?? raw.preco ?? raw.preço ?? ''));

    if (!sku || !name || !Number.isFinite(price) || price <= 0) {
      skipped++;
      continue;
    }

    const category = normalizeCategory(String(raw.category ?? raw.categoria ?? ''));
    const unit = String(raw.unit ?? raw.unidade ?? 'unid.').trim() || 'unid.';
    const description =
      String(raw.description ?? raw.descricao ?? raw.descrição ?? '').trim() ||
      `${name} — disponível no Supermercado Casa Del Mar.`;
    const badge = String(raw.badge ?? raw.etiqueta ?? '').trim() || undefined;
    const isFlyerOffer = parseBool(
      (raw.isFlyerOffer ?? raw.promocao ?? raw.promoção ?? raw.folheto) as string | boolean,
    );
    const isOwnBrand = parseBool(
      (raw.isOwnBrand ?? raw.marca_propria ?? raw.marcapropria) as string | boolean,
    );
    const inStock =
      raw.inStock !== undefined || raw.stock !== undefined
        ? parseBool((raw.inStock ?? raw.stock) as string | boolean)
        : true;

    const existingIdx = current.findIndex(
      (p) => p.sku.toLowerCase() === sku.toLowerCase(),
    );

    if (existingIdx !== -1) {
      current[existingIdx] = {
        ...current[existingIdx],
        name,
        category,
        price,
        unit,
        description,
        badge: badge ?? (isFlyerOffer ? 'Folheto' : current[existingIdx].badge),
        isFlyerOffer,
        isOwnBrand,
        inStock,
      };
      updated++;
    } else {
      const id = sku
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
      current.push({
        id: id || `prod-${Date.now()}-${added}`,
        sku,
        name,
        category,
        price,
        unit,
        badge: badge ?? (isFlyerOffer ? 'Folheto' : undefined),
        isFlyerOffer,
        isOwnBrand,
        description,
        inStock,
      });
      added++;
    }
  }

  await saveCatalogProducts(current);
  return { added, updated, skipped, total: current.length };
}

