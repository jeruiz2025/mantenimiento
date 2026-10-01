import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(req) {
  const { pathname } = req.nextUrl;
  const isPublic = pathname === "/login" || pathname.startsWith("/api/auth");

  if (isPublic) {
    return NextResponse.next();
  }

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!token) {
    if (pathname.startsWith("/api")) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.search = "";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api/auth|_next/static|_next/image|favicon.ico|login).*)",
  ],
};
