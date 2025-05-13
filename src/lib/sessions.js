"use server";
import { cookies } from "next/headers";

export async function createSession(
  userId,
  authMethod = "baseAuth",
  walletAddress = null
) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  const sessionData = JSON.stringify({
    userId,
    authMethod,
    walletAddress,
    expiresAt: expiresAt.toISOString(),
  });

  cookies().set({
    name: "session",
    value: sessionData,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    sameSite: "lax",
    expires: expiresAt,
  });
}
