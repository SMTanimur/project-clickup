/* eslint-disable @typescript-eslint/prefer-as-const */
import { getCookie, setCookie, deleteCookie } from 'cookies-next';


const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: 60 * 60 * 24 * 7, // 7 days
  path: '/',
};

export function getSessionToken(): string | undefined {
  return getCookie('clickup_session') as string | undefined;
}

export function setSessionToken(token: string): void {
  setCookie('clickup_session', token, {
    ...COOKIE_OPTIONS,
    sameSite: 'lax' as 'lax'
  });
}

export function clearSessionToken(): void {
  deleteCookie('clickup_session', {
    ...COOKIE_OPTIONS,
    sameSite: 'lax' as 'lax'
  });
}
