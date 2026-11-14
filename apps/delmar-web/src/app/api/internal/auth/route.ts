import { NextRequest, NextResponse } from 'next/server';
import { getExpectedPin, isStaffAuthenticated, STAFF_COOKIE_NAME } from '@/lib/internal-auth';

export async function GET() {
  const authenticated = await isStaffAuthenticated();
  return NextResponse.json({ authenticated });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const pin = String(body?.pin ?? '').trim();
    if (pin !== getExpectedPin()) {
      return NextResponse.json({ error: 'PIN incorreto.' }, { status: 401 });
    }

    const res = NextResponse.json({ authenticated: true });
    res.cookies.set(STAFF_COOKIE_NAME, pin, {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });
    return res;
  } catch {
    return NextResponse.json({ error: 'Pedido inválido.' }, { status: 400 });
  }
}

export async function DELETE() {
  const res = NextResponse.json({ authenticated: false });
  res.cookies.delete(STAFF_COOKIE_NAME);
  return res;
}

