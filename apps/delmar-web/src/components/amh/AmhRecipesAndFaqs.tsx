'use client';

import React, { useState } from 'react';
import { ChevronDown, ChefHat, Quote } from 'lucide-react';
import { FAQS, RECIPES, TESTIMONIALS } from '@/lib/store-data';

export function AmhRecipes() {
  return (
    <section className="bg-white py-14 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amh-red">
          <ChefHat className="h-4 w-4" />
          Cozinha do Bairro
        </div>
        <h2 className="amh-h2 mt-2 text-amh-navy">Receitas com Produtos Amanhecer</h2>
        <p className="mt-2 max-w-2xl text-base text-amh-slate">
          Ideias práticas para cozinhar com os frescos e ingredientes que encontra todos os dias no
          Supermercado Casa Del Mar.
        </p>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {RECIPES.map((recipe) => (
            <article
              key={recipe.id}
              className="rounded-3xl border border-stone-200 bg-amh-cream/40 p-6 transition hover:border-amh-red/40"
            >
              <div className="flex items-center justify-between text-xs font-bold text-amh-red">
                <span>{recipe.category}</span>
                <span className="text-amh-slate">
                  {recipe.prepTime} · {recipe.servings}
                </span>
              </div>
              <h3 className="mt-3 text-xl font-extrabold text-amh-navy">{recipe.title}</h3>
              <p className="mt-2 text-sm text-amh-slate">{recipe.description}</p>
              <ul className="mt-4 space-y-1.5 border-t border-stone-200/80 pt-3 text-xs text-amh-navy">
                {recipe.ingredients.map((ing) => (
                  <li key={ing} className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amh-red" />
                    <span>{ing}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function AmhTestimonials() {
  return (
    <section className="bg-amh-navy py-14 text-white sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="amh-h2 text-white">Quem compra no Furadouro recomenda</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <blockquote
              key={t.name}
              className="flex flex-col justify-between rounded-3xl bg-white/10 p-6"
            >
              <div>
                <Quote className="h-6 w-6 text-amh-red" />
                <p className="mt-3 text-sm leading-relaxed text-stone-200">&ldquo;{t.quote}&rdquo;</p>
              </div>
              <footer className="mt-5 border-t border-white/10 pt-3">
                <p className="text-sm font-bold text-white">{t.name}</p>
                <p className="text-xs text-amh-cream">{t.role}</p>
              </footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}

export function AmhFaqs() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <section className="bg-amh-cream/40 py-14 sm:py-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <h2 className="amh-h2 text-center text-amh-navy">Perguntas Frequentes</h2>
        <div className="mt-8 space-y-3">
          {FAQS.map((faq, idx) => {
            const open = openIdx === idx;
            return (
              <div
                key={faq.question}
                className="overflow-hidden rounded-2xl border border-stone-200 bg-white"
              >
                <button
                  type="button"
                  onClick={() => setOpenIdx(open ? null : idx)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left font-bold text-amh-navy"
                >
                  <span>{faq.question}</span>
                  <ChevronDown
                    className={`h-5 w-5 shrink-0 text-amh-red transition-transform ${
                      open ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {open && (
                  <div className="border-t border-stone-100 px-5 py-4 text-sm leading-relaxed text-amh-slate">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

