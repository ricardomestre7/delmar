import { NextRequest, NextResponse } from 'next/server';
import { OrderStatus, updateOrderStatus } from '@/lib/orders-store';

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;
    const body = await req.json();
    const status = body?.status as OrderStatus;
    const updated = await updateOrderStatus(id, status);
    if (!updated) {
      return NextResponse.json({ error: 'Encomenda não encontrada.' }, { status: 404 });
    }
    return NextResponse.json({ order: updated });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erro ao atualizar encomenda.';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

