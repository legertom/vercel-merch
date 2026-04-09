"use server";

import { cookies } from "next/headers";

const COOKIE_NAME = "admin-session";
const SESSION_VALUE = "authenticated";

export async function adminLogin(password: string): Promise<{ success: boolean }> {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected || password !== expected) {
    return { success: false };
  }
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, SESSION_VALUE, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24, // 24 hours
    path: "/",
  });
  return { success: true };
}

export async function adminLogout() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  return cookieStore.get(COOKIE_NAME)?.value === SESSION_VALUE;
}
