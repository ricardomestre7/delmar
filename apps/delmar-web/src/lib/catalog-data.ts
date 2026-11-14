export type ProductCategory =
  | 'Padaria & Pastelaria'
  | 'Frutas & Legumes'
  | 'Talho & Charcutaria'
  | 'Peixaria & Mar'
  | 'Marca Própria Amanhecer'
  | 'Mercearia & Bebidas';

export interface CatalogProduct {
  id: string;
  sku: string;
  name: string;
  category: ProductCategory;
  price: number;
  unit: string;
  badge?: string;
  isOwnBrand?: boolean;
  isFlyerOffer?: boolean;
  description: string;
  inStock: boolean;
}

export const PRODUCT_CATEGORIES: ProductCategory[] = [
  'Padaria & Pastelaria',
  'Frutas & Legumes',
  'Talho & Charcutaria',
  'Peixaria & Mar',
  'Marca Própria Amanhecer',
  'Mercearia & Bebidas',
];

export const CATALOG_PRODUCTS: CatalogProduct[] = [
  {
    id: 'pao-agua-quente',
    sku: 'PAD-001',
    name: 'Pão de Água / Papo-Seco Quente (Pack 4 un.)',
    category: 'Padaria & Pastelaria',
    price: 0.72,
    unit: 'pack 4 un.',
    badge: 'Fornada Diária',
    description: 'Crocante por fora e macio por dentro. Fornadas às 08:30 e 16:30.',
    inStock: true,
  },
  {
    id: 'broa-milho-ovar',
    sku: 'PAD-002',
    name: 'Broa de Milho Tradicional',
    category: 'Padaria & Pastelaria',
    price: 1.95,
    unit: 'unid. ~500g',
    badge: 'Regional',
    description: 'Broa tradicional de côdea estaladiça, ideal para acompanhar peixe ou caldo verde.',
    inStock: true,
  },
  {
    id: 'pao-de-lo-ovar-fatia',
    sku: 'PAD-003',
    name: 'Pão de Ló Tradicional de Ovar (Pequeno)',
    category: 'Padaria & Pastelaria',
    price: 8.9,
    unit: 'unid. ~450g',
    badge: 'Especialidade Local',
    description: 'Doçaria típica da região de Ovar, húmido e dourado.',
    inStock: true,
  },
  {
    id: 'maca-gala-alcobaca',
    sku: 'FRU-001',
    name: 'Maçã Gala de Alcobaça',
    category: 'Frutas & Legumes',
    price: 1.69,
    unit: 'kg',
    badge: 'Folheto',
    isFlyerOffer: true,
    description: 'Maçã doce e crocante de produção nacional selecionada.',
    inStock: true,
  },
  {
    id: 'tomate-maduro-ramo',
    sku: 'FRU-002',
    name: 'Tomate Maduro em Ramo',
    category: 'Frutas & Legumes',
    price: 2.15,
    unit: 'kg',
    description: 'Ideal para saladas de verão, molhos e caldeiradas.',
    inStock: true,
  },
  {
    id: 'batata-branca-nacional',
    sku: 'FRU-003',
    name: 'Batata Branca Nacional (Saco 2,5 kg)',
    category: 'Frutas & Legumes',
    price: 2.89,
    unit: 'saco 2,5 kg',
    description: 'Versátil para cozer, assar ou fritar.',
    inStock: true,
  },
  {
    id: 'bife-peru-fresco',
    sku: 'TAL-001',
    name: 'Bifes de Peru Frescos ao Corte',
    category: 'Talho & Charcutaria',
    price: 6.89,
    unit: 'kg',
    badge: 'Folheto',
    isFlyerOffer: true,
    description: 'Carne tenra preparada na hora no balcão do talho.',
    inStock: true,
  },
  {
    id: 'queijo-flamengo-corte',
    sku: 'TAL-002',
    name: 'Queijo Flamengo Barra ao Corte',
    category: 'Talho & Charcutaria',
    price: 7.9,
    unit: 'kg',
    description: 'Fatiado na hora com a espessura que preferir.',
    inStock: true,
  },
  {
    id: 'fiambre-perna-extra',
    sku: 'TAL-003',
    name: 'Fiambre da Perna Extra (200g)',
    category: 'Talho & Charcutaria',
    price: 2.29,
    unit: 'cuvete 200g',
    description: 'Fatiado fresco pronto a levar.',
    inStock: true,
  },
  {
    id: 'sardinha-fresca',
    sku: 'PEI-001',
    name: 'Sardinha Fresca da Costa',
    category: 'Peixaria & Mar',
    price: 5.99,
    unit: 'kg',
    badge: 'Frescura Mar',
    isFlyerOffer: true,
    description: 'Selecionada diariamente conforme disponibilidade de lota.',
    inStock: true,
  },
  {
    id: 'lombo-bacalhau-demolhado',
    sku: 'PEI-002',
    name: 'Lombos de Bacalhau Demolhado Ultracongelado',
    category: 'Peixaria & Mar',
    price: 11.49,
    unit: 'emb. 600g',
    description: 'Pronto a cozinhar, lasca alta e sabor tradicional.',
    inStock: true,
  },
  {
    id: 'amh-azeite-virgem-extra',
    sku: 'AMH-001',
    name: 'Azeite Virgem Extra Amanhecer 75cl',
    category: 'Marca Própria Amanhecer',
    price: 5.49,
    unit: 'garrafa 75cl',
    badge: 'Marca Própria',
    isOwnBrand: true,
    isFlyerOffer: true,
    description: 'Azeite equilibrado de acidez reduzida, essencial na cozinha portuguesa.',
    inStock: true,
  },
  {
    id: 'amh-leite-meio-gordo',
    sku: 'AMH-002',
    name: 'Leite Meio-Gordo Amanhecer 1L',
    category: 'Marca Própria Amanhecer',
    price: 0.84,
    unit: 'pacote 1L',
    badge: 'Marca Própria',
    isOwnBrand: true,
    isFlyerOffer: true,
    description: 'Leite UHT nacional de pastagens selecionadas.',
    inStock: true,
  },
  {
    id: 'amh-cafe-torrado',
    sku: 'AMH-003',
    name: 'Café Torrado Moído Clássico Amanhecer 250g',
    category: 'Marca Própria Amanhecer',
    price: 2.39,
    unit: 'emb. 250g',
    badge: 'Marca Própria',
    isOwnBrand: true,
    description: 'Aroma intenso e creme equilibrado para cafeteira ou expresso.',
    inStock: true,
  },
  {
    id: 'amh-arroz-agulha',
    sku: 'AMH-004',
    name: 'Arroz Agulha Extra Longo Amanhecer 1kg',
    category: 'Marca Própria Amanhecer',
    price: 1.29,
    unit: 'emb. 1kg',
    badge: 'Marca Própria',
    isOwnBrand: true,
    description: 'Grão solto ideal para acompanhamentos diários.',
    inStock: true,
  },
  {
    id: 'amh-agua-pack',
    sku: 'MER-001',
    name: 'Água Mineral Natural Amanhecer (Pack 6x1,5L)',
    category: 'Mercearia & Bebidas',
    price: 1.89,
    unit: 'pack 6x1,5L',
    badge: 'Folheto',
    isOwnBrand: true,
    isFlyerOffer: true,
    description: 'Pack económico para casa ou dias de praia no Furadouro.',
    inStock: true,
  },
  {
    id: 'amh-detergente-roupa',
    sku: 'MER-002',
    name: 'Detergente Roupa Líquido Amanhecer 3L (40 doses)',
    category: 'Mercearia & Bebidas',
    price: 4.99,
    unit: 'garrafão 3L',
    isOwnBrand: true,
    isFlyerOffer: true,
    description: 'Limpeza eficaz mesmo a baixas temperaturas.',
    inStock: true,
  },
  {
    id: 'vinho-tinto-bairrada',
    sku: 'MER-003',
    name: 'Vinho Tinto Regional Beira Atlântico 75cl',
    category: 'Mercearia & Bebidas',
    price: 3.79,
    unit: 'garrafa 75cl',
    description: 'Seleção regional equilibrada para acompanhar carnes e queijos.',
    inStock: true,
  },
];

export function formatEur(value: number): string {
  return value.toFixed(2).replace('.', ',') + ' €';
}

