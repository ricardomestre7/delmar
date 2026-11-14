import type { Metadata } from 'next';
import Link from 'next/link';
import { AmhBigNumbers } from '@/components/amh/AmhBigNumbers';
import { AmhHistoria } from '@/components/amh/AmhHistoria';
import { STORE_PROFILE } from '@/lib/store-data';

export const metadata: Metadata = {
  title: 'Quem Somos',
  description: 'Conheça o Supermercado Casa Del Mar, a sua loja Amanhecer no Furadouro, Ovar.',
};

export default function QuemSomosPage() {
  return (
    <div className="bg-white">
      <section className="bg-amh-cream py-14 sm:py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <span className="text-xs font-bold uppercase tracking-wider text-amh-red">
            Proximidade & Confiança
          </span>
          <h1 className="amh-h1 mt-2 text-amh-navy">
            {STORE_PROFILE.name} — O seu Amanhecer no Furadouro
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-amh-slate">
            Localizado na <strong>{STORE_PROFILE.address}</strong>, mesmo no coração do Furadouro
            (Ovar), o <strong>{STORE_PROFILE.name}</strong> (Loja <strong>{STORE_PROFILE.code}</strong>)
            alia o atendimento próximo de um supermercado familiar à força logística e à qualidade
            da rede nacional <strong>Amanhecer / Recheio</strong>.
          </p>
          <p className="mt-4 text-base leading-relaxed text-amh-slate">
            Este portal próprio foi desenhado para dar aos moradores do prédio, vizinhos do
            Furadouro e visitantes de Ovar uma forma rápida de consultar ofertas, reservar pão
            quente e frescos e levantar a compra sem filas.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/catalogo"
              className="rounded-full bg-amh-red px-6 py-3 text-sm font-bold text-white transition hover:bg-amh-red-deep"
            >
              Explorar Catálogo
            </Link>
            <Link
              href="/lojas"
              className="rounded-full border border-amh-navy bg-white px-6 py-3 text-sm font-bold text-amh-navy transition hover:bg-amh-navy hover:text-white"
            >
              Ver Mapa e Horários
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <p className="text-xs font-bold uppercase tracking-wider text-amh-red">A família Delmar, hoje</p>
        <h2 className="amh-h2 mt-3 text-amh-navy">Rostos de uma casa com história.</h2>
        <p className="mt-4 max-w-2xl leading-relaxed text-amh-slate">Sr. Pedro, Alice, Paula, Eduarda e Luísa fazem parte desta história de proximidade. Em breve, partilharemos mais memórias, fotografias e testemunhos da família.</p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {['Sr. Pedro', 'Alice', 'Paula', 'Eduarda', 'Luísa'].map((name) => (
            <article key={name} className="rounded-2xl border border-stone-200 bg-amh-cream/50 p-6">
              <h3 className="text-xl font-bold text-amh-navy">{name}</h3>
              <p className="mt-2 text-sm text-amh-slate">As suas memórias, em breve.</p>
            </article>
          ))}
        </div>
      </section>
      <AmhHistoria />
      <AmhBigNumbers />
    </div>
  );
}


