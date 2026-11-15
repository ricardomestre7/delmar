'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import SystemGuide from './SystemGuide';
import type {
  CrmCustomer,
  CustomerPipelineStage,
  CustomerSegment,
  InteractionChannel,
} from '@/lib/crm-store';

type CrmSummary = {
  totalCustomers: number;
  vipCount: number;
  followUpCount: number;
  b2bCount: number;
  totalRevenue: number;
};

const SEGMENT_LABELS: Record<CustomerSegment, string> = {
  habitual: 'Cliente Habitual',
  alojamento: 'Alojamento / Turista',
  restauracao: 'Restauração / HORECA',
  novo: 'Novo Contacto',
};

const STAGE_LABELS: Record<CustomerPipelineStage, string> = {
  ativo: 'Ativo',
  follow_up: 'Follow-up',
  vip: 'VIP / Recorrente',
  inativo: 'Inativo',
};

const CHANNEL_LABELS: Record<InteractionChannel, string> = {
  balcao: 'Balcão',
  whatsapp: 'WhatsApp',
  telefone: 'Telefone',
  encomenda: 'Encomenda',
};

const money = (n: number) =>
  new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(n);

function toWhatsappHref(phone: string, name: string) {
  const digits = phone.replace(/\D/g, '');
  const full = digits.length === 9 ? `351${digits}` : digits;
  const text = encodeURIComponent(
    `Olá ${name}, da Casa Del Mar (Furadouro). Estamos disponíveis para a sua próxima encomenda ou cabaz.`
  );
  return `https://wa.me/${full}?text=${text}`;
}

export default function CrmMercadoPanel() {
  const [customers, setCustomers] = useState<CrmCustomer[]>([]);
  const [summary, setSummary] = useState<CrmSummary>({
    totalCustomers: 0,
    vipCount: 0,
    followUpCount: 0,
    b2bCount: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);
  const [statusMsg, setStatusMsg] = useState('');
  const [search, setSearch] = useState('');
  const [segmentFilter, setSegmentFilter] = useState<string>('todos');
  const [stageFilter, setStageFilter] = useState<string>('todos');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Formulário de registo / edição diária
  const [editingId, setEditingId] = useState<string | undefined>(undefined);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [segment, setSegment] = useState<CustomerSegment>('habitual');
  const [stage, setStage] = useState<CustomerPipelineStage>('ativo');
  const [address, setAddress] = useState('');
  const [favoriteItemsText, setFavoriteItemsText] = useState('');
  const [totalOrders, setTotalOrders] = useState('');
  const [totalSpent, setTotalSpent] = useState('');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  // Registo de contacto / follow-up
  const [interactionChannel, setInteractionChannel] =
    useState<InteractionChannel>('balcao');
  const [interactionNote, setInteractionNote] = useState('');

  async function loadCrm() {
    setLoading(true);
    try {
      const r = await fetch('/api/crm', { cache: 'no-store' });
      const data = await r.json();
      if (!r.ok) throw new Error(data.error || 'Erro ao carregar CRM.');
      setCustomers(data.customers || []);
      if (data.summary) setSummary(data.summary);
    } catch (e) {
      setStatusMsg((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCrm();
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return customers.filter((c) => {
      if (segmentFilter !== 'todos' && c.segment !== segmentFilter) return false;
      if (stageFilter !== 'todos' && c.stage !== stageFilter) return false;
      if (!q) return true;
      return (
        c.name.toLowerCase().includes(q) ||
        c.phone.toLowerCase().includes(q) ||
        (c.address || '').toLowerCase().includes(q) ||
        c.favoriteItems.some((item) => item.toLowerCase().includes(q)) ||
        (c.notes || '').toLowerCase().includes(q)
      );
    });
  }, [customers, search, segmentFilter, stageFilter]);

  const selectedCustomer = useMemo(
    () => customers.find((c) => c.id === selectedId) || null,
    [customers, selectedId]
  );

  function resetForm() {
    setEditingId(undefined);
    setName('');
    setPhone('');
    setSegment('habitual');
    setStage('ativo');
    setAddress('');
    setFavoriteItemsText('');
    setTotalOrders('');
    setTotalSpent('');
    setNotes('');
  }

  function loadIntoForm(c: CrmCustomer) {
    setEditingId(c.id);
    setName(c.name);
    setPhone(c.phone);
    setSegment(c.segment);
    setStage(c.stage);
    setAddress(c.address || '');
    setFavoriteItemsText(c.favoriteItems.join(', '));
    setTotalOrders(c.totalOrders ? String(c.totalOrders) : '');
    setTotalSpent(c.totalSpent ? String(c.totalSpent) : '');
    setNotes(c.notes || '');
  }

  async function handleSaveCustomer(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setStatusMsg('');
    try {
      const r = await fetch('/api/crm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingId,
          name,
          phone,
          segment,
          stage,
          address,
          favoriteItems: favoriteItemsText
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean),
          totalOrders: totalOrders ? Number(totalOrders) : undefined,
          totalSpent: totalSpent ? Number(totalSpent) : undefined,
          notes,
        }),
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data.error || 'Não foi possível guardar.');
      setStatusMsg(
        editingId
          ? `Ficha de ${data.customer.name} atualizada.`
          : `Cliente ${data.customer.name} registado no CRM.`
      );
      resetForm();
      await loadCrm();
    } catch (e) {
      setStatusMsg((e as Error).message);
    } finally {
      setSaving(false);
    }
  }

  async function handleQuickStage(c: CrmCustomer, nextStage: CustomerPipelineStage) {
    setStatusMsg('');
    try {
      const r = await fetch('/api/crm', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update_status',
          id: c.id,
          stage: nextStage,
          snapshot: {
            name: c.name,
            phone: c.phone,
            segment: c.segment,
            stage: nextStage,
            address: c.address,
            favoriteItems: c.favoriteItems,
            notes: c.notes,
            totalOrders: c.totalOrders,
            totalSpent: c.totalSpent,
          },
        }),
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data.error || 'Erro ao atualizar estado.');
      await loadCrm();
    } catch (e) {
      setStatusMsg((e as Error).message);
    }
  }

  async function handleAddInteraction(e: FormEvent) {
    e.preventDefault();
    if (!selectedCustomer || !interactionNote.trim()) return;
    setStatusMsg('');
    try {
      const r = await fetch('/api/crm', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'add_interaction',
          id: selectedCustomer.id,
          channel: interactionChannel,
          note: interactionNote,
          snapshot: {
            name: selectedCustomer.name,
            phone: selectedCustomer.phone,
            segment: selectedCustomer.segment,
            stage: selectedCustomer.stage,
            address: selectedCustomer.address,
            favoriteItems: selectedCustomer.favoriteItems,
            notes: selectedCustomer.notes,
            totalOrders: selectedCustomer.totalOrders,
            totalSpent: selectedCustomer.totalSpent,
          },
        }),
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data.error || 'Erro ao registar contacto.');
      setInteractionNote('');
      setStatusMsg(`Contacto registado na ficha de ${selectedCustomer.name}.`);
      await loadCrm();
    } catch (e) {
      setStatusMsg((e as Error).message);
    }
  }

  return (
    <div style={{ marginTop: 18 }}>
      <SystemGuide mode="crm" />
      <div className="bd-metrics" style={{ marginTop: 14 }}>
        <article>
          <small>Base de clientes CRM</small>
          <strong>{summary.totalCustomers}</strong>
        </article>
        <article>
          <small>Clientes VIP / Recorrentes</small>
          <strong>{summary.vipCount}</strong>
        </article>
        <article>
          <small>Alojamentos &amp; Restauração</small>
          <strong>{summary.b2bCount}</strong>
        </article>
        <article>
          <small>Em Follow-up / Inativos</small>
          <strong>{summary.followUpCount}</strong>
        </article>
        <article>
          <small>Receita CRM acumulada</small>
          <strong>{money(summary.totalRevenue)}</strong>
        </article>
      </div>

      {/* Formulário diário de clientes */}
      <form className="bd-form" onSubmit={handleSaveCustomer} style={{ marginTop: 18 }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 10,
            flexWrap: 'wrap',
            marginBottom: 10,
          }}
        >
          <h3 style={{ margin: 0 }}>
            {editingId
              ? 'Editar ficha de cliente'
              : 'Registo diário de cliente / contacto de mercado'}
          </h3>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              style={{ background: '#4d6b62', padding: '6px 12px', fontSize: 12 }}
            >
              Cancelar edição
            </button>
          )}
        </div>

        <div className="bd-grid">
          <label>
            Nome do cliente / empresa *
            <input
              type="text"
              required
              placeholder="Ex.: Restaurante Maré Viva ou Maria Silva"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </label>
          <label>
            Telemóvel / WhatsApp *
            <input
              type="text"
              required
              placeholder="Ex.: 912 345 678"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </label>
          <label>
            Perfil no mercado
            <select
              value={segment}
              onChange={(e) => setSegment(e.target.value as CustomerSegment)}
            >
              <option value="habitual">Cliente Habitual</option>
              <option value="alojamento">Alojamento / Turista</option>
              <option value="restauracao">Restauração / HORECA</option>
              <option value="novo">Novo Contacto</option>
            </select>
          </label>
          <label>
            Estado comercial
            <select
              value={stage}
              onChange={(e) => setStage(e.target.value as CustomerPipelineStage)}
            >
              <option value="ativo">Ativo</option>
              <option value="vip">VIP / Recorrente</option>
              <option value="follow_up">Follow-up</option>
              <option value="inativo">Inativo</option>
            </select>
          </label>
          <label>
            Morada / Zona (Furadouro)
            <input
              type="text"
              placeholder="Ex.: Av. da Praia, lote 12"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </label>
          <label>
            Produtos habituais (separados por vírgula)
            <input
              type="text"
              placeholder="Ex.: Pão de mistura, Fruta, Leite, Café"
              value={favoriteItemsText}
              onChange={(e) => setFavoriteItemsText(e.target.value)}
            />
          </label>
          <label>
            N.º compras (opcional)
            <input
              type="number"
              min="0"
              placeholder="0"
              value={totalOrders}
              onChange={(e) => setTotalOrders(e.target.value)}
            />
          </label>
          <label>
            Total acumulado € (opcional)
            <input
              type="number"
              min="0"
              step="0.01"
              placeholder="0.00"
              value={totalSpent}
              onChange={(e) => setTotalSpent(e.target.value)}
            />
          </label>
        </div>

        <label style={{ display: 'grid', gap: 4, fontSize: 12, marginTop: 10 }}>
          Notas de atendimento / preferências
          <input
            type="text"
            placeholder="Ex.: Prefere entregas antes das 11h; cliente semanal de frescos"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </label>

        <div className="bd-actions">
          <button type="submit" disabled={saving}>
            {saving
              ? 'A guardar…'
              : editingId
                ? 'Atualizar ficha'
                : 'Guardar no CRM'}
          </button>
          {statusMsg && <span role="status">{statusMsg}</span>}
        </div>
      </form>

      {/* Pesquisa e filtros operacionais */}
      <div
        className="bd-toolbar"
        style={{ marginTop: 18, justifyContent: 'space-between' }}
      >
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
          <input
            type="search"
            placeholder="Pesquisar nome, telemóvel, produto ou morada…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              minWidth: 250,
              padding: '7px 10px',
              borderRadius: 8,
              border: '1px solid #c9d6d0',
              fontSize: 13,
            }}
          />
          <select
            value={segmentFilter}
            onChange={(e) => setSegmentFilter(e.target.value)}
            style={{
              padding: '7px 10px',
              borderRadius: 8,
              border: '1px solid #c9d6d0',
              fontSize: 13,
            }}
          >
            <option value="todos">Todos os perfis</option>
            <option value="habitual">Cliente Habitual</option>
            <option value="alojamento">Alojamento / Turista</option>
            <option value="restauracao">Restauração / HORECA</option>
            <option value="novo">Novo Contacto</option>
          </select>
          <select
            value={stageFilter}
            onChange={(e) => setStageFilter(e.target.value)}
            style={{
              padding: '7px 10px',
              borderRadius: 8,
              border: '1px solid #c9d6d0',
              fontSize: 13,
            }}
          >
            <option value="todos">Todos os estados</option>
            <option value="ativo">Ativo</option>
            <option value="vip">VIP / Recorrente</option>
            <option value="follow_up">Follow-up</option>
            <option value="inativo">Inativo</option>
          </select>
        </div>
        <span>
          {loading ? 'A atualizar…' : `${filtered.length} cliente(s) encontrados`}
        </span>
      </div>

      {/* Lista operacional de clientes */}
      <div
        style={{
          marginTop: 14,
          display: 'grid',
          gridTemplateColumns: selectedCustomer ? 'minmax(0, 1.6fr) minmax(280px, 1fr)' : '1fr',
          gap: 14,
          alignItems: 'start',
        }}
      >
        <div style={{ overflowX: 'auto' }}>
          <table>
            <thead>
              <tr>
                <th>Cliente</th>
                <th>Perfil</th>
                <th>Estado</th>
                <th>Compras</th>
                <th>Total</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', color: '#5b756d' }}>
                    Sem clientes registados com estes filtros. Adicione o primeiro no formulário acima.
                  </td>
                </tr>
              ) : (
                filtered.map((c) => (
                  <tr key={c.id}>
                    <td>
                      <strong>{c.name}</strong>
                      <div style={{ fontSize: 12, color: '#4d6b62' }}>{c.phone}</div>
                      {c.favoriteItems.length > 0 && (
                        <div style={{ fontSize: 11, color: '#5b756d', marginTop: 2 }}>
                          Habituais: {c.favoriteItems.join(', ')}
                        </div>
                      )}
                    </td>
                    <td>{SEGMENT_LABELS[c.segment]}</td>
                    <td>
                      <select
                        aria-label={`Estado de ${c.name}`}
                        value={c.stage}
                        onChange={(e) =>
                          handleQuickStage(c, e.target.value as CustomerPipelineStage)
                        }
                        style={{
                          padding: '4px 8px',
                          borderRadius: 6,
                          border: '1px solid #c9d6d0',
                          fontSize: 12,
                          background: '#fff',
                        }}
                      >
                        {Object.entries(STAGE_LABELS).map(([k, label]) => (
                          <option key={k} value={k}>
                            {label}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>{c.totalOrders}</td>
                    <td>{money(c.totalSpent)}</td>
                    <td>
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                        <a
                          href={toWhatsappHref(c.phone, c.name)}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            padding: '5px 9px',
                            borderRadius: 6,
                            background: '#1c6b48',
                            color: '#fff',
                            fontSize: 11,
                            fontWeight: 600,
                            textDecoration: 'none',
                          }}
                        >
                          WhatsApp
                        </a>
                        <button
                          type="button"
                          onClick={() => setSelectedId(c.id)}
                          style={{
                            padding: '5px 9px',
                            borderRadius: 6,
                            background: '#17322a',
                            color: '#fff',
                            fontSize: 11,
                          }}
                        >
                          Histórico ({c.interactions.length})
                        </button>
                        <button
                          type="button"
                          onClick={() => loadIntoForm(c)}
                          style={{
                            padding: '5px 9px',
                            borderRadius: 6,
                            background: '#e5eeea',
                            color: '#17322a',
                            fontSize: 11,
                          }}
                        >
                          Editar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Painel lateral de histórico diário e follow-up */}
        {selectedCustomer && (
          <aside
            style={{
              background: '#f7faf8',
              border: '1px solid #dce5e1',
              borderRadius: 12,
              padding: 16,
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <h3 style={{ margin: 0, fontSize: 16 }}>{selectedCustomer.name}</h3>
              <button
                type="button"
                onClick={() => setSelectedId(null)}
                style={{
                  background: '#e5eeea',
                  color: '#17322a',
                  padding: '4px 8px',
                  fontSize: 11,
                }}
              >
                Fechar
              </button>
            </div>
            <p style={{ fontSize: 12, color: '#4d6b62', margin: '6px 0 10px' }}>
              {selectedCustomer.phone}
              {selectedCustomer.address ? ` · ${selectedCustomer.address}` : ''}
            </p>
            {selectedCustomer.notes && (
              <p
                style={{
                  fontSize: 12,
                  background: '#fff',
                  border: '1px solid #dce5e1',
                  borderRadius: 8,
                  padding: 8,
                  margin: '0 0 12px',
                }}
              >
                {selectedCustomer.notes}
              </p>
            )}

            <form onSubmit={handleAddInteraction} style={{ display: 'grid', gap: 8 }}>
              <label style={{ fontSize: 12, fontWeight: 600 }}>
                Registar contacto de hoje
              </label>
              <select
                value={interactionChannel}
                onChange={(e) =>
                  setInteractionChannel(e.target.value as InteractionChannel)
                }
                style={{
                  padding: '7px 10px',
                  borderRadius: 8,
                  border: '1px solid #c9d6d0',
                  fontSize: 12,
                  background: '#fff',
                }}
              >
                <option value="balcao">Balcão</option>
                <option value="whatsapp">WhatsApp</option>
                <option value="telefone">Telefone</option>
                <option value="encomenda">Encomenda</option>
              </select>
              <input
                type="text"
                required
                placeholder="Ex.: Enviado folheto semanal / pediu cabaz sexta"
                value={interactionNote}
                onChange={(e) => setInteractionNote(e.target.value)}
                style={{
                  padding: '7px 10px',
                  borderRadius: 8,
                  border: '1px solid #c9d6d0',
                  fontSize: 12,
                }}
              />
              <button type="submit" style={{ fontSize: 12 }}>
                Adicionar nota ao histórico
              </button>
            </form>

            <div style={{ marginTop: 14, display: 'grid', gap: 8 }}>
              <strong style={{ fontSize: 12 }}>Últimos registos</strong>
              {selectedCustomer.interactions.length === 0 ? (
                <small style={{ color: '#5b756d' }}>
                  Ainda sem contactos registados manualmente.
                </small>
              ) : (
                selectedCustomer.interactions.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      background: '#fff',
                      border: '1px solid #dce5e1',
                      borderRadius: 8,
                      padding: 8,
                      fontSize: 12,
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        color: '#4d6b62',
                        fontSize: 11,
                        marginBottom: 3,
                      }}
                    >
                      <span>{CHANNEL_LABELS[item.channel]}</span>
                      <span>
                        {new Date(item.date).toLocaleDateString('pt-PT')}{' '}
                        {new Date(item.date).toLocaleTimeString('pt-PT', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                    <div>{item.note}</div>
                  </div>
                ))
              )}
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}

