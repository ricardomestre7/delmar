import { NextResponse } from 'next/server';
import { STORE_PROFILE } from '@/lib/store-data';

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    store: STORE_PROFILE.name,
    code: STORE_PROFILE.code,
    timestamp: new Date().toISOString(),
  });
}

