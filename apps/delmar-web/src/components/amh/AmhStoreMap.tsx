import React from 'react';
import { Clock, ExternalLink, Mail, MapPin, Navigation, Phone } from 'lucide-react';
import { STORE_PROFILE } from '@/lib/store-data';

export function AmhStoreMap() {
  const { latitude, longitude } = STORE_PROFILE;
  const bbox = `${longitude - 0.008},${latitude - 0.005},${longitude + 0.008},${latitude + 0.005}`;
  const osmUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${latitude},${longitude}`;

  return (
    <section className="bg-white py-14 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-stretch gap-8 lg:grid-cols-12">
          <div className="flex flex-col justify-between rounded-3xl border border-stone-200 bg-amh-cream/50 p-7 lg:col-span-5">
            <div>
              <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amh-red">
                <MapPin className="h-3.5 w-3.5" />
                Localizador de Loja
              </span>
              <h2 className="amh-title mt-2 text-amh-navy">
                {STORE_PROFILE.name}
              </h2>
              <p className="mt-1 text-sm font-semibold text-amh-red">
                Rede Amanhecer · Código de Loja {STORE_PROFILE.code}
              </p>

              <div className="mt-6 space-y-4 text-sm text-amh-slate">
                <div className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-amh-red" />
                  <div>
                    <p className="font-bold text-amh-navy">Morada</p>
                    <p>
                      {STORE_PROFILE.address}
                      <br />
                      {STORE_PROFILE.postalCode} {STORE_PROFILE.locality}, {STORE_PROFILE.city} ({STORE_PROFILE.zone})
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="mt-0.5 h-5 w-5 shrink-0 text-amh-red" />
                  <div>
                    <p className="font-bold text-amh-navy">Horário previsto · a confirmar</p>
                    {STORE_PROFILE.hours.map((h) => (
                      <p key={h.days}>
                        {h.days}: <strong className="text-amh-navy">{h.time}</strong>
                      </p>
                    ))}
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="mt-0.5 h-5 w-5 shrink-0 text-amh-red" />
                  <div>
                    <p className="font-bold text-amh-navy">Telefone</p>
                    <a href={`tel:${STORE_PROFILE.phone}`} className="font-semibold hover:text-amh-red">
                      {STORE_PROFILE.phoneFormatted}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="mt-0.5 h-5 w-5 shrink-0 text-amh-red" />
                  <div>
                    <p className="font-bold text-amh-navy">Email</p>
                    <a href={`mailto:${STORE_PROFILE.email}`} className="break-all hover:text-amh-red">
                      {STORE_PROFILE.email}
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-7 flex flex-wrap gap-3">
              <a
                href={STORE_PROFILE.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-amh-red px-5 py-3 text-sm font-bold text-white transition hover:bg-amh-red-deep"
              >
                <Navigation className="h-4 w-4" />
                Como Chegar (Google Maps)
              </a>
              <a
                href={STORE_PROFILE.facebookPhotosUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-stone-300 bg-white px-5 py-3 text-sm font-bold text-amh-navy transition hover:border-amh-navy"
              >
                Fotos da Loja
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>

          <div className="min-h-[360px] overflow-hidden rounded-3xl border border-stone-200 shadow-sm lg:col-span-7">
            <iframe
              title="Mapa Supermercado Casa Del Mar - Amanhecer Furadouro"
              src={osmUrl}
              className="h-full min-h-[360px] w-full border-0"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
}


