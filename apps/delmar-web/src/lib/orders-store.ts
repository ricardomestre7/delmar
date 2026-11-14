import fs from 'node:fs/promises';
import path from 'node:path';
import { getCatalogProducts } from './catalog-store';

export type OrderStatus = 'pendente' | 'em_preparacao' | 'pronto' | 'entregue';
export type FulfillmentMode = 'levantamento' | 'entrega_furadouro';

export interface OrderItemInput {
  productId: string;
  quantity: number;
}

export interface OrderLineItem {
  productId: string;
  sku: string;
  name: string;
  unit: string;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
}

export interface StoreOrder {
  id: string;
  code: string;
  customerName: string;
  customerPhone: string;
  fulfillment: FulfillmentMode;
  pickupWindow: string;
  deliveryAddress?: string;
  notes?: string;
  items: OrderLineItem[];
  total: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
}

const DATA_FILE = path.join(process.env.DATA_DIR || path.join(process.cwd(), 'data'), 'orders.json');

// Fallback em memória caso o sistema de ficheiros seja read-only
let memoryOrders: StoreOrder[] = [];

async function readOrdersFromDisk(): Promise<StoreOrder[]> {
  try {
    const raw = await fs.readFile(DATA_FILE, 'utf8');
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      memoryOrders = parsed;
      return parsed;
    }
    return memoryOrders;
  } catch {
    return memoryOrders;
  }
}

async function writeOrdersToDisk(orders: StoreOrder[]): Promise<void> {
  memoryOrders = orders;
  try {
    await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
    await fs.writeFile(DATA_FILE, JSON.stringify(orders, null, 2), 'utf8');
  } catch {
    // Mantém em memória se o volume não permitir escrita
  }
}

export async function listOrders(): Promise<StoreOrder[]> {
  const orders = await readOrdersFromDisk();
  return [...orders].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function findOrderByCode(code: string): Promise<StoreOrder | null> {
  const normalized = code.trim().toUpperCase();
  const orders = await readOrdersFromDisk();
  return orders.find((o) => o.code.toUpperCase() === normalized || o.id === code) ?? null;
}

export interface CreateOrderPayload {
  customerName: string;
  customerPhone: string;
  fulfillment: FulfillmentMode;
  pickupWindow: string;
  deliveryAddress?: string;
  notes?: string;
  items: OrderItemInput[];
}

export async function createOrder(payload: CreateOrderPayload): Promise<StoreOrder> {
  const customerName = payload.customerName.trim();
  const customerPhone = payload.customerPhone.trim();
  if (!customerName || customerName.length < 2) {
    throw new Error('Indique o seu nome completo.');
  }
  if (!customerPhone || customerPhone.length < 9) {
    throw new Error('Indique um número de telefone válido.');
  }
  if (payload.fulfillment === 'entrega_furadouro' && !payload.deliveryAddress?.trim()) {
    throw new Error('Indique a morada no Furadouro para entrega.');
  }
  if (!Array.isArray(payload.items) || payload.items.length === 0) {
    throw new Error('Adicione pelo menos um produto à encomenda.');
  }

  const catalog = await getCatalogProducts();
  const lineItems: OrderLineItem[] = [];
  for (const reqItem of payload.items) {
    const product = catalog.find((p) => p.id === reqItem.productId);
    if (!product) {
      throw new Error(`Produto inválido: ${reqItem.productId}`);
    }
    const qty = Math.max(1, Math.min(50, Math.floor(Number(reqItem.quantity) || 0)));
    if (qty <= 0) continue;
    const lineTotal = Number((product.price * qty).toFixed(2));
    lineItems.push({
      productId: product.id,
      sku: product.sku,
      name: product.name,
      unit: product.unit,
      unitPrice: product.price,
      quantity: qty,
      lineTotal,
    });
  }

  if (lineItems.length === 0) {
    throw new Error('Nenhum item válido na encomenda.');
  }

  const total = Number(lineItems.reduce((sum, item) => sum + item.lineTotal, 0).toFixed(2));
  const now = new Date().toISOString();
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const code = `DM-${randomSuffix}`;

  const order: StoreOrder = {
    id: `${Date.now()}-${randomSuffix}`,
    code,
    customerName,
    customerPhone,
    fulfillment: payload.fulfillment,
    pickupWindow: payload.pickupWindow || 'Hoje — Próxima hora disponível',
    deliveryAddress: payload.deliveryAddress?.trim() || undefined,
    notes: payload.notes?.trim() || undefined,
    items: lineItems,
    total,
    status: 'pendente',
    createdAt: now,
    updatedAt: now,
  };

  const orders = await readOrdersFromDisk();
  orders.unshift(order);
  await writeOrdersToDisk(orders);
  return order;
}

export async function updateOrderStatus(idOrCode: string, status: OrderStatus): Promise<StoreOrder | null> {
  const validStatuses: OrderStatus[] = ['pendente', 'em_preparacao', 'pronto', 'entregue'];
  if (!validStatuses.includes(status)) {
    throw new Error('Estado de encomenda inválido.');
  }
  const orders = await readOrdersFromDisk();
  const idx = orders.findIndex(
    (o) => o.id === idOrCode || o.code.toUpperCase() === idOrCode.trim().toUpperCase(),
  );
  if (idx === -1) return null;

  orders[idx] = {
    ...orders[idx],
    status,
    updatedAt: new Date().toISOString(),
  };
  await writeOrdersToDisk(orders);
  return orders[idx];
}


