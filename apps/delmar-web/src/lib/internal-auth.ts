import {cookies} from 'next/headers';
import {createHmac,randomBytes,timingSafeEqual} from 'node:crypto';
export const STAFF_COOKIE_NAME='delmar_staff_session';
export function getExpectedPin(){const v=process.env.ADMIN_PASSWORD?.trim()||process.env.ADMIN_PANEL_PIN?.trim()||'';return v.length>=16?v:'';}
const sign=(s:string)=>createHmac('sha256',getExpectedPin()).update(s).digest('hex');
export function createStaffSession(){const body=Date.now()+8*3600000+'.'+randomBytes(24).toString('hex');return body+'.'+sign(body);}
export function sameSecret(a:string,b:string){const x=Buffer.from(a),y=Buffer.from(b);return x.length===y.length&&timingSafeEqual(x,y);}
export async function isStaffAuthenticated(){try{if(!getExpectedPin())return false;const v=(await cookies()).get(STAFF_COOKIE_NAME)?.value;if(!v)return false;const parts=v.split('.');if(parts.length!==3||Number(parts[0])<Date.now())return false;return sameSecret(parts[2],sign(parts[0]+'.'+parts[1]));}catch{return false;}}
