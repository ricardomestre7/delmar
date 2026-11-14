import {isStaffAuthenticated} from '@/lib/internal-auth';
import { NextRequest, NextResponse } from 'next/server';
import { importCatalogRows, parseCsvText } from '@/lib/catalog-store';

const SAMPLE_CSV = 'sku;nome;categoria;preco;unidade;promocao;marca_propria;descricao;stock'+String.fromCharCode(13,10);

export async function GET() {
  return new NextResponse(SAMPLE_CSV, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': 'attachment; filename="modelo-catalogo-delmar.csv"',
    },
  });
}

export async function POST(req: NextRequest) {
  if(!(await isStaffAuthenticated()))return NextResponse.json({error:'Autenticação necessária.'},{status:401});
  try {
    const contentType = req.headers.get('content-type') || '';
    let rows: Array<Record<string, string | number | boolean>> = [];

    if (contentType.includes('application/json')) {
      const body = await req.json();
      if (typeof body?.csv === 'string') {
        rows = parseCsvText(body.csv);
      } else if (Array.isArray(body?.items)) {
        rows = body.items;
      } else {
        return NextResponse.json(
          { error: 'Envie { csv: "..." } ou { items: [...] }.' },
          { status: 400 },
        );
      }
    } else {
      const text = await req.text();
      rows = parseCsvText(text);
    }

    const summary = await importCatalogRows(rows);
    return NextResponse.json({ ok: true, summary });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erro ao importar catálogo.';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}


