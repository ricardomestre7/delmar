import { NextRequest, NextResponse } from 'next/server';
import {isStaffAuthenticated} from '@/lib/internal-auth';
import { createOrder, findOrderByCode, listOrders } from '@/lib/orders-store';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code');

  if (code) {
    const order = await findOrderByCode(code);
    if (!order) {
      return NextResponse.json({ error: 'Encomenda não encontrada.' }, { status: 404 });
    }
    return NextResponse.json({ order: {code:order.code,status:order.status,pickupWindow:order.pickupWindow,total:order.total} }, {headers:{'Cache-Control':'no-store'}});
  }

  if(!(await isStaffAuthenticated()))return NextResponse.json({error:'Autenticação necessária.'},{status:401});
  const orders = await listOrders();
  return NextResponse.json({ count: orders.length, orders },{headers:{'Cache-Control':'no-store'}});
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const order = await createOrder(body);
    return NextResponse.json({ order }, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erro ao registar encomenda.';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}


