// lib/jwt.ts
import { jwtVerify, SignJWT } from "jose";
import { JwtPayload } from "jsonwebtoken";

// In a real app, this would be in an environment variable
const JWT_SECRET = new TextEncoder().encode("test");

export async function verifyToken(token: string): Promise<JwtPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as JwtPayload;
  } catch (error) {
    console.error("JWT verification failed:", error);
    return null;
  }
}

export async function signToken(
  payload: Omit<JwtPayload, "iat" | "exp">
): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(JWT_SECRET);
}
