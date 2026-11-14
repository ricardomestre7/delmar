'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { Lock, LogOut, MessageSquareLock, Send, ShieldCheck } from 'lucide-react';
import {
  INTERNAL_CHANNELS,
  InternalChannel,
  InternalMessage,
} from '@/lib/internal-chat-types';

export default function RedeInternaPage() {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [pin, setPin] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);

  const [channel, setChannel] = useState<InternalChannel>('geral-loja');
  const [messages, setMessages] = useState<InternalMessage[]>([]);
  const [senderName, setSenderName] = useState('');
  const [senderRole, setSenderRole] = useState('Balcão / Caixa');
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    try {
      const savedName = localStorage.getItem('delmar_staff_name');
      const savedRole = localStorage.getItem('delmar_staff_role');
      if (savedName) setSenderName(savedName);
      if (savedRole) setSenderRole(savedRole);
    } catch {
      // ignore
    }
    fetch('/api/internal/auth', { cache: 'no-store' })
      .then((r) => r.json())
      .then((d) => setAuthenticated(Boolean(d.authenticated)))
      .catch(() => setAuthenticated(false));
  }, []);

  const loadMessages = useCallback(async () => {
    if (!authenticated) return;
    const res = await fetch(`/api/internal/chat?channel=${channel}`, { cache: 'no-store' });
    if (res.status === 401) {
      setAuthenticated(false);
      return;
    }
    const data = await res.json();
    if (Array.isArray(data.messages)) {
      setMessages(data.messages);
    }
  }, [authenticated, channel]);

  useEffect(() => {
    loadMessages();
    if (!authenticated) return;
    const timer = setInterval(loadMessages, 4000);
    return () => clearInterval(timer);
  }, [authenticated, loadMessages]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setAuthError(null);
    const res = await fetch('/api/internal/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pin }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setAuthError(data.error || 'Senha inválida.');
      return;
    }
    setPin('');
    setAuthenticated(true);
  }

  async function handleLogout() {
    await fetch('/api/internal/auth', { method: 'DELETE' });
    setAuthenticated(false);
    setMessages([]);
  }

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim() || !senderName.trim()) return;
    setSending(true);
    try {
      localStorage.setItem('delmar_staff_name', senderName.trim());
      localStorage.setItem('delmar_staff_role', senderRole);
    } catch {
      // ignore
    }
    try {
      const res = await fetch('/api/internal/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          channel,
          senderName,
          senderRole,
          text,
        }),
      });
      if (res.ok) {
        setText('');
        await loadMessages();
      }
    } finally {
      setSending(false);
    }
  }

  if (authenticated === null) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-amh-navy text-white">
        A verificar acesso interno...
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="flex min-h-[75vh] items-center justify-center bg-amh-navy px-4 py-16">
        <div className="w-full max-w-md rounded-3xl border border-white/15 bg-amh-ink p-8 text-white shadow-2xl">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amh-red">
            <Lock className="h-7 w-7 text-white" />
          </div>
          <h1 className="mt-5 text-center text-2xl font-extrabold">
            Rede Interna — Casa Del Mar
          </h1>
          <p className="mt-2 text-center text-sm text-stone-300">
            Área privada da equipa (Loja 3206). Fora da área pública dos clientes.
          </p>

          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-amh-cream">
                Senha da Loja
              </label>
              <input
                type="password"
                required
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="Introduza a senha própria da loja"
                className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm text-white placeholder-stone-400 outline-none focus:border-amh-red"
              />
            </div>

            {authError && (
              <p className="rounded-xl bg-red-500/20 px-3 py-2 text-xs font-bold text-red-200">
                {authError}
              </p>
            )}

            <button
              type="submit"
              className="w-full rounded-full bg-amh-red py-3 text-sm font-bold text-white transition hover:bg-amh-red-deep"
            >
              Entrar no Chat Interno
            </button>
          </form>
        </div>
      </div>
    );
  }

  const activeChannelMeta = INTERNAL_CHANNELS.find((c) => c.id === channel);

  return (
    <div className="bg-amh-navy py-10 text-white">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/15 pb-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amh-red">
              <MessageSquareLock className="h-5 w-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-extrabold">Rede Interna — Equipa Casa Del Mar</h1>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[11px] font-bold text-emerald-300">
                  <ShieldCheck className="h-3 w-3" /> Privado
                </span>
              </div>
              <p className="text-xs text-stone-300">
                Comunicação direta entre caixa, padaria, armazém e gerência · Loja 3206
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              href="/painel"
              className="rounded-full border border-white/20 px-4 py-2 text-xs font-bold text-white hover:bg-white/10"
            >
              Painel de Encomendas
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-4 py-2 text-xs font-bold text-stone-200 hover:bg-amh-red hover:text-white"
            >
              <LogOut className="h-3.5 w-3.5" />
              Sair
            </button>
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-12">
          {/* Canais */}
          <aside className="space-y-2 lg:col-span-4">
            <p className="px-2 text-xs font-bold uppercase tracking-wider text-stone-400">
              Canais Internos
            </p>
            {INTERNAL_CHANNELS.map((c) => {
              const active = c.id === channel;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setChannel(c.id)}
                  className={`w-full rounded-2xl p-3.5 text-left transition ${
                    active ? 'bg-amh-red text-white' : 'bg-white/5 text-stone-200 hover:bg-white/10'
                  }`}
                >
                  <p className="text-sm font-extrabold">{c.label}</p>
                  <p className={`text-xs ${active ? 'text-white/90' : 'text-stone-400'}`}>
                    {c.description}
                  </p>
                </button>
              );
            })}
          </aside>

          {/* Mensagens */}
          <div className="flex h-[540px] flex-col rounded-3xl border border-white/15 bg-amh-ink lg:col-span-8">
            <div className="border-b border-white/10 px-5 py-3.5">
              <p className="font-extrabold">{activeChannelMeta?.label}</p>
              <p className="text-xs text-stone-400">{activeChannelMeta?.description}</p>
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto p-5">
              {messages.length === 0 ? (
                <p className="text-center text-sm text-stone-400">
                  Ainda sem mensagens neste canal. Escreva a primeira abaixo.
                </p>
              ) : (
                messages.map((m) => (
                  <div key={m.id} className="rounded-2xl bg-white/10 p-3.5">
                    <div className="flex items-center justify-between gap-2 text-xs">
                      <span className="font-extrabold text-amh-cream">
                        {m.senderName}{' '}
                        <span className="font-normal text-stone-300">({m.senderRole})</span>
                      </span>
                      <span className="text-stone-400">
                        {new Date(m.createdAt).toLocaleTimeString('pt-PT', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                    <p className="mt-1.5 text-sm text-white">{m.text}</p>
                  </div>
                ))
              )}
            </div>

            <form onSubmit={handleSend} className="border-t border-white/10 p-4">
              <div className="mb-2.5 grid gap-2 sm:grid-cols-2">
                <input
                  type="text"
                  required
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  placeholder="O seu nome (ex.: João)"
                  className="rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-xs text-white placeholder-stone-400 outline-none focus:border-amh-red"
                />
                <select
                  value={senderRole}
                  onChange={(e) => setSenderRole(e.target.value)}
                  className="rounded-xl border border-white/15 bg-amh-navy px-3 py-2 text-xs text-white outline-none focus:border-amh-red"
                >
                  <option>Balcão / Caixa</option>
                  <option>Padaria / Frescos</option>
                  <option>Talho / Charcutaria</option>
                  <option>Armazém / Reposição</option>
                  <option>Gerência</option>
                </select>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  required
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder={`Escrever em ${activeChannelMeta?.label}...`}
                  className="flex-1 rounded-full border border-white/15 bg-white/10 px-4 py-2.5 text-sm text-white placeholder-stone-400 outline-none focus:border-amh-red"
                />
                <button
                  type="submit"
                  disabled={sending}
                  className="inline-flex items-center gap-1.5 rounded-full bg-amh-red px-5 py-2.5 text-xs font-bold text-white hover:bg-amh-red-deep disabled:opacity-60"
                >
                  <Send className="h-4 w-4" />
                  Enviar
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}


