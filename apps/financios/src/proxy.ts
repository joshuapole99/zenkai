import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const SECRET = new TextEncoder().encode(process.env.AUTH_SECRET!);

export async function proxy(req: NextRequest) {
  const token = req.cookies.get("fin_session")?.value;

  if (!token) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("next", req.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  try {
    await jwtVerify(token, SECRET);
    return NextResponse.next();
  } catch {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("next", req.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }
}

export const config = {
  matcher: "/dashboard/:path*",
};
