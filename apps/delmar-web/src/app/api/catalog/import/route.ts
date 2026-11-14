import { NextRequest, NextResponse } from 'next/server';
import { importCatalogRows, parseCsvText } from '@/lib/catalog-store';

const SAMPLE_CSV = [
  'sku;nome;categoria;preco;unidade;promocao;marca_propria;descricao;stock',
  'PAD-001;Pão de Água / Papo-Seco Quente (Pack 4 un.);Padaria & Pastelaria;0.72;pack 4 un.;nao;nao;Fornadas às 08:30 e 16:30;sim',
  'AMH-001;Azeite Virgem Extra Amanhecer 75cl;Marca Própria Amanhecer;5.49;garrafa 75cl;sim;sim;Azeite equilibrado de acidez reduzida;sim',
].join('\n');

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

