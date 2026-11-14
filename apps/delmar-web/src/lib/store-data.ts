export interface StoreProfile {
  code: string;
  name: string;
  brand: string;
  tagline: string;
  address: string;
  postalCode: string;
  locality: string;
  city: string;
  zone: string;
  latitude: number;
  longitude: number;
  phone: string;
  phoneFormatted: string;
  email: string;
  facebookPhotosUrl: string;
  googleMapsUrl: string;
  networkUrl: string;
  partnerUrl: string;
  hours: Array<{ days: string; time: string }>;
}

export const STORE_PROFILE: StoreProfile = {
  code: '3206',
  name: 'Supermercado Casa Del Mar',
  brand: 'Furadouro · Rede Amanhecer',
  tagline: 'O seu supermercado de proximidade no Furadouro — pão quente diário, frescos selecionados, atendimento familiar e produtos da rede parceira Amanhecer.',
  address: 'Avenida dos Bombeiros Voluntários do Porto nº34',
  postalCode: '3880-352',
  locality: 'Furadouro',
  city: 'Ovar',
  zone: 'Aveiro',
  latitude: 40.873822,
  longitude: -8.676564,
  phone: '256591235',
  phoneFormatted: '+351 256 591 235',
  email: 'supermercadodelmar.3206@amanhecer.pt',
  facebookPhotosUrl: 'https://www.facebook.com/supermercadocasadelmar/photos',
  googleMapsUrl: 'https://www.google.com/maps?q=40.873822,-8.676564',
  networkUrl: 'https://www.amanhecer.pt/',
  partnerUrl: 'https://www.recheio.pt/portal/pt-PT/amanhecer-torne-se-parceiro',
  hours: [
    { days: 'Terça a Domingo', time: '08:00 – 20:00' },
    { days: 'Segunda-feira', time: 'Encerrado · folga semanal' },
  ],
};

export interface NavItem {
  label: string;
  href: string;
}

export const NAV_ITEMS: NavItem[] = [
  { label: 'Início', href: '/' },
  { label: 'Produtos', href: '/catalogo' },
  { label: 'Folhetos', href: '/folhetos' },
  { label: 'Marca Própria', href: '/marca-propria' },
  { label: 'Novidades', href: '/novidades' },
  { label: 'Visite-nos', href: '/lojas' },
  { label: 'A nossa história', href: '/quem-somos' },
];

export interface BigNumber {
  value: string;
  label: string;
  detail: string;
}

export const BIG_NUMBERS: BigNumber[] = [
  {
    value: 'Pão',
    label: 'Sempre pão fresquinho',
    detail: 'O sabor de uma boa visita começa na nossa padaria.',
  },
  {
    value: 'Horta',
    label: 'Frescura todos os dias',
    detail: 'Saladas vindas da horta diariamente, para levar frescura à sua mesa.',
  },
  {
    value: 'Nº 34',
    label: 'No Coração do Furadouro',
    detail: 'Na Av. dos Bombeiros Voluntários do Porto, a dois passos da praia.',
  },
  {
    value: 'Perto',
    label: 'Atendimento com dedicação',
    detail: 'Profissionalismo, simpatia e o cuidado de quem conhece a vizinhança.',
  },
];

export interface FlyerItem {
  id: string;
  title: string;
  subtitle: string;
  type: 'Nacional' | 'Especial Furadouro' | 'Frescos';
  validUntil: string;
  badge: string;
  highlights: Array<{ product: string; price: string; note: string }>;
}

export const FLYERS: FlyerItem[] = [
  {
    id: 'folheto-diptico-quinzenal',
    title: 'Folheto Quinzenal Amanhecer',
    subtitle: 'Poupança de bairro em mercearia, laticínios, bebidas e higiene.',
    type: 'Nacional',
    validUntil: 'Válido esta quinzena',
    badge: 'Folheto Principal',
    highlights: [
      { product: 'Azeite Virgem Extra Amanhecer 75cl', price: '5,49 €', note: 'Marca Própria' },
      { product: 'Leite Meio-Gordo Amanhecer 1L', price: '0,84 €', note: 'Pack ou unidade' },
      { product: 'Café Torrado Moído Amanhecer 250g', price: '2,39 €', note: 'Lote Clássico' },
      { product: 'Detergente Roupa Líquido 3L', price: '4,99 €', note: '40 doses' },
    ],
  },
  {
    id: 'folheto-frescos-furadouro',
    title: 'Especial Frescos Casa Del Mar',
    subtitle: 'Seleção diária na nossa loja do Furadouro: padaria, fruta da época e talho.',
    type: 'Especial Furadouro',
    validUntil: 'Renovado todas as semanas',
    badge: 'Exclusivo Loja 3206',
    highlights: [
      { product: 'Pão de Água & Papo-Seco Quente', price: '0,18 €', note: 'Fornadas 08:30 e 16:30' },
      { product: 'Maçã Gala de Alcobaça (Kg)', price: '1,69 €', note: 'Origem Nacional' },
      { product: 'Bife de Peru / Frango do Campo (Kg)', price: '6,89 €', note: 'Corte na hora' },
      { product: 'Queijo Flamengo Barra ao Corte (Kg)', price: '7,90 €', note: 'Charcutaria' },
    ],
  },
  {
    id: 'folheto-fim-de-semana',
    title: 'Oportunidades de Fim de Semana',
    subtitle: 'Ofertas rápidas para preparar a mesa em família ou na praia do Furadouro.',
    type: 'Frescos',
    validUntil: 'Sexta a Domingo',
    badge: 'Fim de Semana',
    highlights: [
      { product: 'Água Mineral Amanhecer 6x1,5L', price: '1,89 €', note: 'Pack família' },
      { product: 'Broa de Milho Tradicional', price: '1,95 €', note: 'Padaria local' },
      { product: 'Melão Verde / Melancia (Kg)', price: '1,49 €', note: 'Fruta fresca' },
      { product: 'Sardinha / Carapau Fresco (Kg)', price: '5,99 €', note: 'Conforme lota' },
    ],
  },
];

export interface RecipeItem {
  id: string;
  title: string;
  category: string;
  prepTime: string;
  servings: string;
  description: string;
  ingredients: string[];
}

export const RECIPES: RecipeItem[] = [
  {
    id: 'caldeirada-furadouro',
    title: 'Caldeirada à Moda do Furadouro',
    category: 'Peixe & Mar',
    prepTime: '45 min',
    servings: '4 pessoas',
    description: 'Receita tradicional da costa de Ovar com peixe fresco, batata rodela, pimentos e azeite Amanhecer.',
    ingredients: [
      '1 kg de peixe variado para caldeirada',
      '800 g de batata branca nacional',
      '2 cebolas, 3 tomates maduros e 1 pimento verde',
      '1 dl de Azeite Virgem Extra Amanhecer',
      'Coentros frescos, louro e sal marinho',
    ],
  },
  {
    id: 'tosta-pao-caseiro',
    title: 'Tosta de Pão Caseiro com Queijo da Serra e Mel',
    category: 'Pequeno-Almoço & Lanche',
    prepTime: '10 min',
    servings: '2 pessoas',
    description: 'Simples, rápida e perfeita com o pão quente da nossa padaria.',
    ingredients: [
      '2 fatias grossas de pão caseiro ou broa',
      'Queijo amanteigado ou queijo fresco ao corte',
      'Mel de rosmaninho Amanhecer',
      'Nozes picadas a gosto',
    ],
  },
  {
    id: 'arroz-frango-ervas',
    title: 'Arroz de Frango no Forno com Chouriço',
    category: 'Almoço em Família',
    prepTime: '50 min',
    servings: '4 pessoas',
    description: 'Prato reconfortante com arroz agulha Amanhecer e charcutaria tradicional.',
    ingredients: [
      '400 g de Arroz Agulha Amanhecer',
      '600 g de peito ou perna de frango',
      '1 chouriço de carne tradicional',
      'Cebola, alho, salsa e caldo de carne',
    ],
  },
];

export interface FaqItem {
  question: string;
  answer: string;
}

export const FAQS: FaqItem[] = [
  {
    question: 'Onde fica o Supermercado Casa Del Mar (Amanhecer Furadouro)?',
    answer: 'Estamos na Avenida dos Bombeiros Voluntários do Porto nº34, 3880-352 Furadouro, Ovar — mesmo no centro do Furadouro, a poucos passos da praia.',
  },
  {
    question: 'Como funciona o sistema próprio de encomenda e levantamento?',
    answer: 'Pode escolher os produtos no nosso Catálogo Online, enviar o pedido de reserva e optar por levantar na loja sem filas (com horário à sua escolha) ou solicitar entrega local no Furadouro.',
  },
  {
    question: 'Os preços e produtos de Marca Própria Amanhecer estão disponíveis na loja?',
    answer: 'Sim! Enquanto loja oficial da rede Amanhecer (Loja 3206), disponibilizamos os produtos de Marca Própria Amanhecer e as campanhas de folheto, além de seleção própria de frescos e padaria local.',
  },
  {
    question: 'Como posso contactar a loja diretamente ou ver novidades diárias?',
    answer: 'Pode ligar para o 256 591 235, enviar email para supermercadodelmar.3206@amanhecer.pt ou acompanhar as fotos e novidades no nosso Facebook (Supermercado Casa Del Mar).',
  },
];

export interface TestimonialItem {
  name: string;
  role: string;
  quote: string;
}

export const TESTIMONIALS: TestimonialItem[] = [
  {
    name: 'Ana & Rui — Moradores no Furadouro',
    role: 'Clientes habituais',
    quote: 'Ter o Amanhecer Casa Del Mar mesmo abaixo do prédio facilita tudo. Pão quentinho de manhã, fruta sempre fresca e atendimento simpático.',
  },
  {
    name: 'Carlos M. — Veraneante em Ovar',
    role: 'Cliente de fim de semana',
    quote: 'Faço a reserva dos frescos e bebidas antes de chegar à praia e passo só para levantar na Avenida dos Bombeiros. Muito prático.',
  },
  {
    name: 'Helena S. — Ovar',
    role: 'Fã da Marca Própria',
    quote: 'Ótima relação qualidade-preço nos produtos Amanhecer e sempre boas sugestões no talho e charcutaria.',
  },
];


