import { cookies } from "next/headers";

export async function setSession(teacherId: string) {
  const cookieStore = await cookies();
  cookieStore.set("teacherId", teacherId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7, // 1 week
    path: "/",
  });
}

export async function getSession() {
  const cookieStore = await cookies();
  return cookieStore.get("teacherId")?.value;
}

export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.delete("teacherId");
}
