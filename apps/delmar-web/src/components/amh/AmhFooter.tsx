import React from 'react';
import Link from 'next/link';
import { ExternalLink, Mail, MapPin, Phone } from 'lucide-react';
import { STORE_PROFILE } from '@/lib/store-data';

export function AmhFooter() {
  return (
    <footer className="bg-amh-navy text-stone-300">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
        <div>
          <div className="flex flex-col items-start gap-3">
            <img src="/images/delmar-logo-novo.webp" alt="Supermercado Delmar" width={1919} height={820} className="h-auto w-full max-w-64 rounded-xl bg-amh-cream object-contain" loading="lazy" />
            <div>
              <p className="text-lg font-extrabold text-white">Casa Del Mar</p>
              <p className="text-xs text-amh-cream">Supermercado · Furadouro (Rede Amanhecer)</p>
            </div>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-stone-400">
            {STORE_PROFILE.tagline}
          </p>
          <div className="mt-5 flex flex-wrap gap-3 text-xs font-semibold">
            <a
              href={STORE_PROFILE.facebookPhotosUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1.5 text-white transition hover:bg-amh-red"
            >
              Facebook Casa Del Mar <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-white">
            Loja no Furadouro
          </h3>
          <ul className="mt-4 space-y-3 text-sm">
            <li className="flex items-start gap-2.5">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-amh-red" />
              <span>
                {STORE_PROFILE.address}
                <br />
                {STORE_PROFILE.postalCode} {STORE_PROFILE.locality}, {STORE_PROFILE.city}
              </span>
            </li>
            <li className="flex items-center gap-2.5">
              <Phone className="h-4 w-4 shrink-0 text-amh-red" />
              <a href={`tel:${STORE_PROFILE.phone}`} className="hover:text-white">
                {STORE_PROFILE.phoneFormatted}
              </a>
            </li>
            <li className="flex items-center gap-2.5">
              <Mail className="h-4 w-4 shrink-0 text-amh-red" />
              <a href={`mailto:${STORE_PROFILE.email}`} className="break-all hover:text-white">
                {STORE_PROFILE.email}
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-white">
            Navegação
          </h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li><Link href="/quem-somos" className="hover:text-white">A nossa história</Link></li>
            <li><Link href="/catalogo" className="hover:text-white">Catálogo & Frescos</Link></li>
            <li><Link href="/folhetos" className="hover:text-white">Folhetos & Ofertas</Link></li>
            <li><Link href="/marca-propria" className="hover:text-white">Marca Própria Amanhecer</Link></li>
            <li><Link href="/novidades" className="hover:text-white">Novidades & Receitas</Link></li>
            <li><Link href="/lojas" className="hover:text-white">Mapa & Horários</Link></li>
            <li><Link href="/encomendar" className="hover:text-white">Encomendar / Reservar</Link></li>
            <li><Link href="/painel" className="hover:text-white">Painel Operacional</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-white">
            Horários & Informação
          </h3>
          <div className="mt-4 mb-5 space-y-1 text-sm">
            {STORE_PROFILE.hours.map((h) => <p key={h.days}>{h.days}: <span className="text-white">{h.time}</span></p>)}
            <p className="text-xs text-stone-400">Horário previsto, sujeito a confirmação.</p>
          </div>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li>
              <a href={STORE_PROFILE.networkUrl} target="_blank" rel="noopener noreferrer" className="hover:text-white">
                Portal Nacional Amanhecer
              </a>
            </li>
            <li>
              <a href={STORE_PROFILE.partnerUrl} target="_blank" rel="noopener noreferrer" className="hover:text-white">
                Rede Recheio / Parceiros
              </a>
            </li>
            <li>
              <a href="https://www.livroreclamacoes.pt" target="_blank" rel="noopener noreferrer" className="hover:text-white">
                Livro de Reclamações Eletrónico
              </a>
            </li>
            <li><Link href="/politica-privacidade" className="hover:text-white">Política de Privacidade</Link></li>
            <li><Link href="/termos-condicoes" className="hover:text-white">Termos e Condições</Link></li>
            <li><Link href="/politica-cookies" className="hover:text-white">Política de Cookies</Link></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-5 text-xs text-stone-400 sm:flex-row sm:px-6 lg:px-8">
          <p>
            © {new Date().getFullYear()} {STORE_PROFILE.name} — Loja Amanhecer {STORE_PROFILE.code} ({STORE_PROFILE.locality}, {STORE_PROFILE.city}).
          </p>
          <p>Da nossa casa para a sua · Tecnologia CylinderMargin</p>
        </div>
      </div>
    </footer>
  );
}


