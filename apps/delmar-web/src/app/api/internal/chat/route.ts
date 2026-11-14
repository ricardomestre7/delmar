import { NextRequest, NextResponse } from 'next/server';
import { isStaffAuthenticated } from '@/lib/internal-auth';
import {
  InternalChannel,
  listInternalMessages,
  postInternalMessage,
} from '@/lib/internal-chat-store';

export async function GET(req: NextRequest) {
  if (!(await isStaffAuthenticated())) {
    return NextResponse.json({ error: 'Acesso restrito à equipa.' }, { status: 401 });
  }
  const { searchParams } = new URL(req.url);
  const channel = (searchParams.get('channel') as InternalChannel | null) ?? undefined;
  const messages = await listInternalMessages(channel);
  return NextResponse.json({ messages });
}

export async function POST(req: NextRequest) {
  if (!(await isStaffAuthenticated())) {
    return NextResponse.json({ error: 'Acesso restrito à equipa.' }, { status: 401 });
  }
  try {
    const body = await req.json();
    const message = await postInternalMessage({
      channel: body.channel,
      senderName: body.senderName,
      senderRole: body.senderRole,
      text: body.text,
    });
    return NextResponse.json({ message }, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erro ao enviar mensagem.';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

