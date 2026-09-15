import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isPublicPath = path === '/login' || path === '/register';
  
  // ดึงค่า Cookie session
  const teacherId = request.cookies.get('teacherId')?.value || '';

  // ถ้าพยายามเข้าหน้าส่วนตัว แต่ยังไม่ได้ล็อกอิน ให้เด้งไปหน้า login
  if (!isPublicPath && !teacherId) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // ถ้าล็อกอินแล้ว แต่พยายามเข้าหน้า login/register ให้เด้งไปหน้าหลัก
  if (isPublicPath && teacherId) {
    return NextResponse.redirect(new URL('/', request.url));
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};
