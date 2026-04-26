import { NextResponse } from "next/server";
import { clearSessionCookie } from "@/lib/session";

export async function POST() {
  const res = NextResponse.redirect(
    new URL("/", process.env.NEXT_PUBLIC_APP_URL ?? "https://financios.nl")
  );
  res.cookies.set(clearSessionCookie());
  return res;
}
