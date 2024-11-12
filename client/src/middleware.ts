// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import handler from './app/api/auth/verify';
export async function middleware(request: NextRequest) {
    const token = request.cookies.get('token')?.value;

    if (!token) {
        return NextResponse.redirect(new URL('/forms/signin', request.url));
    }

    // Call the API route to verify the token
    const response = handler({ cookies: { token } }, {} as any);

    if (response.status !== 200) {
        return NextResponse.redirect(new URL('/signin', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/forms/:path*'],
};
