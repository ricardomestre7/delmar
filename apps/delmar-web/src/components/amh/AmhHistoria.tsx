import React from 'react';
import Link from 'next/link';
import { History, HeartHandshake, ArrowRight } from 'lucide-react';
import { STORE_PROFILE } from '@/lib/store-data';

const TIMELINE_ITEMS = [
  {
    era: 'Origens',
    title: 'Raízes no Furadouro',
    image: '/images/historia/origens-furadouro.jpg',
    caption: 'O edifício original que viu crescer o comércio de proximidade junto ao mar.',
  },
  {
    era: 'Tradição',
    title: '“A Casa Delmar Vende de Tudo”',
    image: '/images/historia/casa-delmar-antiga.jpg',
    caption: 'Ponto de encontro de gerações de moradores e veraneantes no centro do Furadouro.',
  },
  {
    era: 'Evolução',
    title: 'Supermercado Delmar',
    image: '/images/historia/delmar-ha-11-anos.png',
    caption: 'A fachada de há 11 anos: uma memória da casa que continua a acompanhar o Furadouro.',
  },
  {
    era: 'Presente',
    title: 'Rede Amanhecer · Loja 3206',
    image: '/images/historia/fachada-amanhecer.jpg',
    caption: 'A força da rede nacional Amanhecer unida ao atendimento familiar de sempre.',
  },
];

export function AmhHistoria() {
  return (
    <section id="historia" className="bg-amh-cream/55 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amh-red">
              <History className="h-3.5 w-3.5" />
              Memória & Identidade Local
            </span>
            <h2 className="amh-h2 mt-2 text-amh-navy">
              A História da Casa Del Mar no Furadouro
            </h2>
            <p className="mt-3 max-w-2xl text-base leading-relaxed text-amh-slate">
              Mais do que um supermercado, a <strong>Casa Del Mar</strong> faz parte da história da{' '}
              <strong>{STORE_PROFILE.address}</strong> — atravessando gerações de vizinho para
              vizinho.
            </p>
          </div>
          <Link
            href="/quem-somos"
            className="inline-flex items-center gap-2 text-sm font-bold text-amh-red hover:underline"
          >
            Conhecer a nossa história <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {TIMELINE_ITEMS.map((item) => (
            <article
              key={item.title}
              className="group overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm transition hover:border-amh-red/40 hover:shadow-md"
            >
              <div className="relative aspect-square overflow-hidden bg-stone-100">
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
                <span className="absolute left-3 top-3 rounded-full bg-amh-navy/90 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white">
                  {item.era}
                </span>
              </div>
              <div className="p-5">
                <h3 className="text-lg font-extrabold text-amh-navy">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-amh-slate">{item.caption}</p>
              </div>
            </article>
          ))}
        </div>

        {/* Destaque De Vizinho para Vizinho */}
        <div className="mt-8 grid items-center gap-6 rounded-3xl border border-stone-200 bg-white p-6 shadow-sm md:grid-cols-12 md:p-8">
          <div className="overflow-hidden rounded-2xl md:col-span-4">
            <img
              src="/images/historia/comunidade-vizinhos.jpg"
              alt="De Vizinho para Vizinho — Supermercado Casa Del Mar"
              className="h-56 w-full object-cover"
            />
          </div>
          <div className="md:col-span-8">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amh-cream px-3 py-1 text-xs font-bold text-amh-red">
              <HeartHandshake className="h-3.5 w-3.5" />
              De Vizinho para Vizinho
            </span>
            <h3 className="mt-3 text-2xl font-extrabold text-amh-navy">
              Atendimento próximo, agora também online
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-amh-slate sm:text-base">
              Do balcão tradicional à reserva digital sem filas: mantemos o mesmo cuidado na
              escolha da fruta, do pão quente e da charcutaria ao corte, agora com portal próprio
              para os moradores do prédio, do Furadouro e de Ovar.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                href="/catalogo"
                className="rounded-full bg-amh-red px-5 py-2.5 text-sm font-bold text-white transition hover:bg-amh-red-deep"
              >
                Fazer Reserva na Loja
              </Link>
              <a
                href={STORE_PROFILE.facebookPhotosUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-stone-300 px-5 py-2.5 text-sm font-bold text-amh-navy transition hover:border-amh-navy"
              >
                Ver Mais Fotos no Facebook
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


