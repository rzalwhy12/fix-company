// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const token = request.cookies.get('tkn')?.value; 

    const protectedPaths = ['/dashboard']; // Tambahkan semua rute yang perlu dilindungi

    // Cek apakah rute yang diminta termasuk dalam rute yang dilindungi
    const isProtectedPath = protectedPaths.some(path => request.nextUrl.pathname.startsWith(path));

    if (!token && isProtectedPath) {
        return NextResponse.redirect(new URL('/sign-in', request.url));
    }

    return NextResponse.next();
}

// Konfigurasi matcher untuk menentukan rute mana yang akan menjalankan middleware ini.
// Ini adalah regex yang cocok dengan semua rute di folder 'app' kecuali API routes dan file statis.
export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico|sign-in|sign-up).*)',
    ],
};