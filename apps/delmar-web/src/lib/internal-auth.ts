import { cookies } from 'next/headers';

export const STAFF_COOKIE_NAME = 'delmar_staff_session';

export function getExpectedPin(): string {
  return process.env.ADMIN_PANEL_PIN?.trim() || '3206';
}

export async function isStaffAuthenticated(): Promise<boolean> {
  try {
    const store = await cookies();
    const token = store.get(STAFF_COOKIE_NAME)?.value;
    return Boolean(token && token === getExpectedPin());
  } catch {
    return false;
  }
}

