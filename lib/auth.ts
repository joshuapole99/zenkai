import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";

export const COOKIE_NAME = "auth-token";

function getKey() {
  const secret = process.env.JWT_SECRET ?? "dev-secret-change-in-production";
  return new TextEncoder().encode(secret);
}

export type SessionUser = {
  userId: number;
  email: string;
  username: string;
};

export async function signToken(payload: SessionUser): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getKey());
}

export async function verifyToken(token: string): Promise<SessionUser> {
  const { payload } = await jwtVerify(token, getKey());
  return payload as unknown as SessionUser;
}

export const hashPassword = (password: string) => bcrypt.hash(password, 12);
export const comparePasswords = (password: string, hash: string) =>
  bcrypt.compare(password, hash);
