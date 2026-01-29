import { NextResponse } from 'next/server';

export async function POST() {
  // Elimina la cookie de sesión (ejemplo: 'session')
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
    ?? (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');
  const response = NextResponse.redirect(`${baseUrl}/login`);
  response.cookies.set('session', '', { path: '/', expires: new Date(0) });
  return response;
}
