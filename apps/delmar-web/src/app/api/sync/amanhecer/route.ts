import { NextResponse } from 'next/server';

const AMANHECER_FOLHETOS_VIEW =
  'https://www.amanhecer.pt/webruntime/view/e5f6293f4ef2f3eef4e8e668bceaf0b1/prod/en-US/folhetos_view';

export async function GET() {
  try {
    const res = await fetch(AMANHECER_FOLHETOS_VIEW, {
      headers: { 'User-Agent': 'CasaDelMar-Sync/1.0' },
      cache: 'no-store',
    });

    if (!res.ok) {
      return NextResponse.json(
        {
          ok: false,
          status: res.status,
          error: 'Não foi possível contactar o portal amanhecer.pt neste momento.',
        },
        { status: 502 },
      );
    }

    const text = await res.text();
    const flyerLinks = [
      ...new Set(
        [...text.matchAll(/https:\/\/folhetos\.amanhecer\.pt\/[^"'\s`\\)]+/g)].map((m) => m[0]),
      ),
    ];

    return NextResponse.json({
      ok: true,
      checkedAt: new Date().toISOString(),
      source: 'https://www.amanhecer.pt/folhetos',
      flyerLinks,
      note: 'Links extraídos do bundle público folhetos_view da rede Amanhecer.',
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: 'Falha de rede ao consultar amanhecer.pt.' },
      { status: 502 },
    );
  }
}

