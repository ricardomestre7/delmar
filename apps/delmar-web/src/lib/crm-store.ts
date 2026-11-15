import fs from 'node:fs/promises';
import path from 'node:path';
import { listOrders } from './orders-store';

export type CustomerSegment = 'habitual' | 'alojamento' | 'restauracao' | 'novo';
export type CustomerPipelineStage = 'ativo' | 'follow_up' | 'vip' | 'inativo';
export type InteractionChannel = 'balcao' | 'whatsapp' | 'telefone' | 'encomenda';

export interface CrmInteraction {
  id: string;
  date: string;
  channel: InteractionChannel;
  note: string;
}

export interface CrmCustomer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  segment: CustomerSegment;
  stage: CustomerPipelineStage;
  address?: string;
  favoriteItems: string[];
  notes: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderAt?: string;
  interactions: CrmInteraction[];
  createdAt: string;
  updatedAt: string;
}

const DATA_FILE = path.join(
  process.env.DATA_DIR || path.join(process.cwd(), 'data'),
  'crm-customers.json'
);

let memoryCustomers: CrmCustomer[] = [];

export function normalizePhone(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.startsWith('351') && digits.length > 9) {
    return digits.slice(3);
  }
  return digits;
}

async function readCustomersFromDisk(): Promise<CrmCustomer[]> {
  try {
    const raw = await fs.readFile(DATA_FILE, 'utf8');
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      memoryCustomers = parsed;
      return parsed;
    }
    return memoryCustomers;
  } catch {
    return memoryCustomers;
  }
}

async function writeCustomersToDisk(customers: CrmCustomer[]): Promise<void> {
  memoryCustomers = customers;
  try {
    await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
    await fs.writeFile(DATA_FILE, JSON.stringify(customers, null, 2), 'utf8');
  } catch {
    // Fallback em memória se o filesystem for read-only
  }
}

export async function listCrmCustomers(): Promise<CrmCustomer[]> {
  const [stored, orders] = await Promise.all([readCustomersFromDisk(), listOrders()]);
  const byPhone = new Map<string, CrmCustomer>();

  for (const c of stored) {
    const key = normalizePhone(c.phone) || c.id;
    byPhone.set(key, {
      ...c,
      favoriteItems: Array.isArray(c.favoriteItems) ? c.favoriteItems : [],
      interactions: Array.isArray(c.interactions) ? c.interactions : [],
    });
  }

  // Sincroniza encomendas online/telefone com a base de clientes
  const orderStats = new Map<
    string,
    {
      name: string;
      phone: string;
      address?: string;
      count: number;
      spent: number;
      lastAt: string;
      items: Map<string, number>;
    }
  >();

  for (const o of orders) {
    const key = normalizePhone(o.customerPhone);
    if (!key) continue;
    const prev = orderStats.get(key) || {
      name: o.customerName,
      phone: o.customerPhone,
      address: o.deliveryAddress,
      count: 0,
      spent: 0,
      lastAt: o.createdAt,
      items: new Map<string, number>(),
    };
    prev.count += 1;
    prev.spent += Number(o.total || 0);
    if (o.createdAt > prev.lastAt) {
      prev.lastAt = o.createdAt;
      if (o.deliveryAddress) prev.address = o.deliveryAddress;
    }
    for (const item of o.items || []) {
      prev.items.set(item.name, (prev.items.get(item.name) || 0) + item.quantity);
    }
    orderStats.set(key, prev);
  }

  for (const [key, st] of orderStats.entries()) {
    const topItems = [...st.items.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4)
      .map(([name]) => name);

    const existing = byPhone.get(key);
    if (existing) {
      existing.totalOrders = Math.max(existing.totalOrders, st.count);
      existing.totalSpent = Math.max(existing.totalSpent, Number(st.spent.toFixed(2)));
      if (!existing.lastOrderAt || st.lastAt > existing.lastOrderAt) {
        existing.lastOrderAt = st.lastAt;
      }
      if (!existing.address && st.address) existing.address = st.address;
      if (existing.favoriteItems.length === 0 && topItems.length > 0) {
        existing.favoriteItems = topItems;
      }
    } else {
      byPhone.set(key, {
        id: `crm_${key}`,
        name: st.name,
        phone: st.phone,
        segment: st.count >= 3 ? 'habitual' : 'novo',
        stage: st.count >= 5 ? 'vip' : 'ativo',
        address: st.address,
        favoriteItems: topItems,
        notes: 'Sincronizado automaticamente a partir de encomendas.',
        totalOrders: st.count,
        totalSpent: Number(st.spent.toFixed(2)),
        lastOrderAt: st.lastAt,
        interactions: [],
        createdAt: st.lastAt,
        updatedAt: st.lastAt,
      });
    }
  }

  return [...byPhone.values()].sort((a, b) =>
    (b.updatedAt || b.createdAt).localeCompare(a.updatedAt || a.createdAt)
  );
}

export interface UpsertCustomerInput {
  id?: string;
  name: string;
  phone: string;
  email?: string;
  segment?: CustomerSegment;
  stage?: CustomerPipelineStage;
  address?: string;
  favoriteItems?: string[];
  notes?: string;
  totalOrders?: number;
  totalSpent?: number;
}

export async function upsertCrmCustomer(input: UpsertCustomerInput): Promise<CrmCustomer> {
  const name = String(input.name || '').trim();
  const phone = String(input.phone || '').trim();
  if (!name || !phone) {
    throw new Error('Nome e telemóvel do cliente são obrigatórios.');
  }

  const customers = await readCustomersFromDisk();
  const norm = normalizePhone(phone);
  const now = new Date().toISOString();

  const idx = customers.findIndex(
    (c) => (input.id && c.id === input.id) || (norm && normalizePhone(c.phone) === norm)
  );

  const favoriteItems = Array.isArray(input.favoriteItems)
    ? input.favoriteItems.map((s) => s.trim()).filter(Boolean)
    : [];

  if (idx >= 0) {
    const current = customers[idx];
    const updated: CrmCustomer = {
      ...current,
      name,
      phone,
      email: input.email?.trim() || current.email,
      segment: input.segment || current.segment,
      stage: input.stage || current.stage,
      address: input.address !== undefined ? input.address.trim() : current.address,
      favoriteItems: favoriteItems.length > 0 ? favoriteItems : current.favoriteItems,
      notes: input.notes !== undefined ? input.notes.trim() : current.notes,
      totalOrders:
        input.totalOrders !== undefined ? Number(input.totalOrders) : current.totalOrders,
      totalSpent:
        input.totalSpent !== undefined ? Number(input.totalSpent) : current.totalSpent,
      updatedAt: now,
    };
    customers[idx] = updated;
    await writeCustomersToDisk(customers);
    return updated;
  }

  const created: CrmCustomer = {
    id: `crm_${norm || Date.now()}`,
    name,
    phone,
    email: input.email?.trim() || undefined,
    segment: input.segment || 'novo',
    stage: input.stage || 'ativo',
    address: input.address?.trim() || undefined,
    favoriteItems,
    notes: input.notes?.trim() || '',
    totalOrders: Number(input.totalOrders || 0),
    totalSpent: Number(input.totalSpent || 0),
    interactions: [],
    createdAt: now,
    updatedAt: now,
  };

  customers.unshift(created);
  await writeCustomersToDisk(customers);
  return created;
}

export async function addCrmInteraction(
  customerId: string,
  channel: InteractionChannel,
  note: string,
  customerSnapshot?: Partial<UpsertCustomerInput>
): Promise<CrmCustomer> {
  const cleanNote = String(note || '').trim();
  if (!cleanNote) {
    throw new Error('Escreva uma nota de atendimento ou contacto.');
  }

  let customers = await readCustomersFromDisk();
  let idx = customers.findIndex((c) => c.id === customerId);

  // Se o cliente veio apenas das encomendas e ainda não foi gravado no JSON, materializa-o primeiro
  if (idx < 0 && customerSnapshot?.name && customerSnapshot?.phone) {
    await upsertCrmCustomer({
      id: customerId,
      name: customerSnapshot.name,
      phone: customerSnapshot.phone,
      segment: customerSnapshot.segment,
      stage: customerSnapshot.stage,
      address: customerSnapshot.address,
      favoriteItems: customerSnapshot.favoriteItems,
      notes: customerSnapshot.notes,
      totalOrders: customerSnapshot.totalOrders,
      totalSpent: customerSnapshot.totalSpent,
    });
    customers = await readCustomersFromDisk();
    idx = customers.findIndex((c) => c.id === customerId);
  }

  if (idx < 0) {
    throw new Error('Cliente não encontrado.');
  }

  const now = new Date().toISOString();
  const interaction: CrmInteraction = {
    id: `int_${Date.now()}`,
    date: now,
    channel,
    note: cleanNote,
  };

  customers[idx] = {
    ...customers[idx],
    interactions: [interaction, ...(customers[idx].interactions || [])].slice(0, 50),
    updatedAt: now,
  };

  await writeCustomersToDisk(customers);
  return customers[idx];
}

export async function deleteCrmCustomer(customerId: string): Promise<boolean> {
  const customers = await readCustomersFromDisk();
  const next = customers.filter((c) => c.id !== customerId);
  if (next.length === customers.length) return false;
  await writeCustomersToDisk(next);
  return true;
}

