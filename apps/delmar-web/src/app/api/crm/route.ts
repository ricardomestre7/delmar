import { NextRequest, NextResponse } from 'next/server';
import { isStaffAuthenticated } from '@/lib/internal-auth';
import {
  addCrmInteraction,
  deleteCrmCustomer,
  listCrmCustomers,
  upsertCrmCustomer,
  type CustomerPipelineStage,
  type CustomerSegment,
  type InteractionChannel,
} from '@/lib/crm-store';

function getExpectedOrigin(req: NextRequest): string {
  const proto =
    req.headers.get('x-forwarded-proto')?.split(',')[0]?.trim() ||
    req.nextUrl.protocol.replace(':', '');
  const host =
    req.headers.get('x-forwarded-host')?.split(',')[0]?.trim() ||
    req.headers.get('host');
  return process.env.PUBLIC_ORIGIN || (host ? `${proto}://${host}` : req.nextUrl.origin);
}

function checkOrigin(req: NextRequest): NextResponse | null {
  const o = req.headers.get('origin');
  if (o && o !== getExpectedOrigin(req)) {
    return NextResponse.json({ error: 'Origem inválida.' }, { status: 403 });
  }
  return null;
}

export async function GET() {
  if (!(await isStaffAuthenticated())) {
    return NextResponse.json({ error: 'Autenticação necessária.' }, { status: 401 });
  }
  const customers = await listCrmCustomers();
  const totalCustomers = customers.length;
  const vipCount = customers.filter((c) => c.stage === 'vip').length;
  const followUpCount = customers.filter(
    (c) => c.stage === 'follow_up' || c.stage === 'inativo'
  ).length;
  const b2bCount = customers.filter(
    (c) => c.segment === 'alojamento' || c.segment === 'restauracao'
  ).length;
  const totalRevenue = customers.reduce((sum, c) => sum + Number(c.totalSpent || 0), 0);

  return NextResponse.json(
    {
      customers,
      summary: {
        totalCustomers,
        vipCount,
        followUpCount,
        b2bCount,
        totalRevenue: Number(totalRevenue.toFixed(2)),
      },
    },
    { headers: { 'Cache-Control': 'no-store' } }
  );
}

export async function POST(req: NextRequest) {
  if (!(await isStaffAuthenticated())) {
    return NextResponse.json({ error: 'Autenticação necessária.' }, { status: 401 });
  }
  const originErr = checkOrigin(req);
  if (originErr) return originErr;

  try {
    const body = await req.json();
    const customer = await upsertCrmCustomer(body);
    return NextResponse.json({ customer });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 400 });
  }
}

export async function PATCH(req: NextRequest) {
  if (!(await isStaffAuthenticated())) {
    return NextResponse.json({ error: 'Autenticação necessária.' }, { status: 401 });
  }
  const originErr = checkOrigin(req);
  if (originErr) return originErr;

  try {
    const body = (await req.json()) as {
      action?: 'add_interaction' | 'update_status';
      id: string;
      channel?: InteractionChannel;
      note?: string;
      stage?: CustomerPipelineStage;
      segment?: CustomerSegment;
      notes?: string;
      snapshot?: {
        name: string;
        phone: string;
        segment?: CustomerSegment;
        stage?: CustomerPipelineStage;
        address?: string;
        favoriteItems?: string[];
        notes?: string;
        totalOrders?: number;
        totalSpent?: number;
      };
    };

    if (body.action === 'add_interaction') {
      const customer = await addCrmInteraction(
        body.id,
        body.channel || 'balcao',
        body.note || '',
        body.snapshot
      );
      return NextResponse.json({ customer });
    }

    if (!body.snapshot?.name || !body.snapshot?.phone) {
      return NextResponse.json({ error: 'Dados do cliente em falta.' }, { status: 400 });
    }

    const customer = await upsertCrmCustomer({
      id: body.id,
      name: body.snapshot.name,
      phone: body.snapshot.phone,
      segment: body.segment ?? body.snapshot.segment,
      stage: body.stage ?? body.snapshot.stage,
      address: body.snapshot.address,
      favoriteItems: body.snapshot.favoriteItems,
      notes: body.notes !== undefined ? body.notes : body.snapshot.notes,
      totalOrders: body.snapshot.totalOrders,
      totalSpent: body.snapshot.totalSpent,
    });
    return NextResponse.json({ customer });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest) {
  if (!(await isStaffAuthenticated())) {
    return NextResponse.json({ error: 'Autenticação necessária.' }, { status: 401 });
  }
  const originErr = checkOrigin(req);
  if (originErr) return originErr;

  const id = req.nextUrl.searchParams.get('id');
  if (!id) {
    return NextResponse.json({ error: 'ID em falta.' }, { status: 400 });
  }
  const removed = await deleteCrmCustomer(id);
  return NextResponse.json({ removed });
}

