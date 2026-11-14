import React from 'react';
import { BIG_NUMBERS } from '@/lib/store-data';

export function AmhBigNumbers() {
  return (
    <section className="bg-white py-14 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {BIG_NUMBERS.map((item) => (
            <div
              key={item.label}
              className="rounded-3xl border border-stone-200 bg-amh-cream/50 p-6 transition hover:border-amh-red/40"
            >
              <p className="text-4xl font-extrabold tracking-tight text-amh-red sm:text-5xl">
                {item.value}
              </p>
              <h3 className="mt-3 text-base font-bold text-amh-navy">{item.label}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-amh-slate">{item.detail}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

