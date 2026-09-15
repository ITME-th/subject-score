"use server";

import { prisma } from "@/lib/prisma";
import { setSession, clearSession } from "@/lib/session";
import { redirect } from "next/navigation";

export async function registerAction(formData: FormData) {
  const name = formData.get("name") as string;
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  if (!name || !username || !password) {
    return { error: "กรุณากรอกข้อมูลให้ครบถ้วน" };
  }

  try {
    const existingUser = await prisma.teacher.findUnique({ where: { username } });
    if (existingUser) {
      return { error: "ชื่อผู้ใช้นี้ถูกใช้งานแล้ว" };
    }

    const teacher = await prisma.teacher.create({
      data: {
        name,
        username,
        password, // Prototype level: storing plaintext. Use bcrypt in production.
      }
    });

    await setSession(teacher.id);
  } catch (error: any) {
    return { error: error.message };
  }
  
  redirect("/");
}

export async function loginAction(formData: FormData) {
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  if (!username || !password) {
    return { error: "กรุณากรอกชื่อผู้ใช้และรหัสผ่าน" };
  }

  try {
    const teacher = await prisma.teacher.findUnique({ where: { username } });
    
    if (!teacher || teacher.password !== password) {
      return { error: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง" };
    }

    await setSession(teacher.id);
  } catch (error: any) {
    return { error: error.message };
  }
  
  redirect("/");
}

export async function logoutAction() {
  await clearSession();
  redirect("/login");
}
