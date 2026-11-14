import {NextRequest,NextResponse} from 'next/server';
import {isStaffAuthenticated} from '@/lib/internal-auth';
import {readEconomicDays,saveEconomicDay} from '@/lib/economy';
import {listOrders} from '@/lib/orders-store';
export async function GET(){if(!(await isStaffAuthenticated()))return NextResponse.json({error:'Autenticação necessária.'},{status:401});return NextResponse.json({days:await readEconomicDays(),operations:(await listOrders()).map(o=>({createdAt:o.createdAt,status:o.status,delivery:o.fulfillment,kind:'pedido',amount:o.total}))},{headers:{'Cache-Control':'no-store'}})}
export async function POST(req:NextRequest){if(!(await isStaffAuthenticated()))return NextResponse.json({error:'Autenticação necessária.'},{status:401});try{const o=req.headers.get('origin');if(o&&o!==(process.env.PUBLIC_ORIGIN||req.nextUrl.origin))return NextResponse.json({error:'Origem inválida.'},{status:403});return NextResponse.json({day:await saveEconomicDay(await req.json())});}catch(e){return NextResponse.json({error:(e as Error).message},{status:400})}}
