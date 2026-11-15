import { NextRequest, NextResponse } from 'next/server';
import { isStaffAuthenticated } from '@/lib/internal-auth';
import { readEconomicDays, saveEconomicDay } from '@/lib/economy';
import { listOrders } from '@/lib/orders-store';

function getExpectedOrigin(req: NextRequest): string {
  const proto =
    req.headers.get('x-forwarded-proto')?.split(',')[0]?.trim() ||
    req.nextUrl.protocol.replace(':', '');
  const host =
    req.headers.get('x-forwarded-host')?.split(',')[0]?.trim() ||
    req.headers.get('host');
  return process.env.PUBLIC_ORIGIN || (host ? `${proto}://${host}` : req.nextUrl.origin);
}

async function fetchEuropeIndices() {
  const fallback = {
    source: 'BCE / Eurostat (referência)',
    updatedAt: new Date().toISOString().slice(0, 10),
    eurUsd: 1.06,
    eurGbp: 0.83,
    eurChf: 0.94,
    ecbDepositRate: '3.25%',
    eurozoneHicp: '2.0%',
    portugalFoodCpi: '2.4%',
    euribor12m: '2.65%',
    liveFx: false,
  };

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 2200);
    const res = await fetch('https://api.frankfurter.app/latest?from=EUR&to=USD,GBP,CHF', {
      signal: controller.signal,
      next: { revalidate: 3600 },
    });
    clearTimeout(timer);
    if (!res.ok) return fallback;
    const data = (await res.json()) as {
      date?: string;
      rates?: { USD?: number; GBP?: number; CHF?: number };
    };
    return {
      ...fallback,
      source: 'BCE (Frankfurter API) · Eurostat',
      updatedAt: data.date || fallback.updatedAt,
      eurUsd: data.rates?.USD ?? fallback.eurUsd,
      eurGbp: data.rates?.GBP ?? fallback.eurGbp,
      eurChf: data.rates?.CHF ?? fallback.eurChf,
      liveFx: true,
    };
  } catch {
    return fallback;
  }
}

export async function GET() {
  if (!(await isStaffAuthenticated())) {
    return NextResponse.json({ error: 'Autenticação necessária.' }, { status: 401 });
  }
  const [days, orders, europeIndices] = await Promise.all([
    readEconomicDays(),
    listOrders(),
    fetchEuropeIndices(),
  ]);

  return NextResponse.json(
    {
      days,
      operations: orders.map((o) => ({
        createdAt: o.createdAt,
        status: o.status,
        delivery: o.fulfillment,
        kind: 'pedido',
        amount: o.total,
      })),
      europeIndices,
    },
    { headers: { 'Cache-Control': 'no-store' } }
  );
}

export async function POST(req: NextRequest) {
  if (!(await isStaffAuthenticated())) {
    return NextResponse.json({ error: 'Autenticação necessária.' }, { status: 401 });
  }
  try {
    const o = req.headers.get('origin');
    if (o && o !== getExpectedOrigin(req)) {
      return NextResponse.json({ error: 'Origem inválida.' }, { status: 403 });
    }
    return NextResponse.json({ day: await saveEconomicDay(await req.json()) });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 400 });
  }
}
