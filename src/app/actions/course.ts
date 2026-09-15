"use server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";

export async function createCourseAction(formData: FormData) {
  const code = formData.get("code") as string;
  const name = formData.get("name") as string;
  const creditsRaw = formData.get("credits") as string;
  const year = formData.get("year") as string;
  const evalMode = formData.get("evalMode") as string || "yearly";
  const roomsRaw = formData.get("rooms") as string;

  if (!code || !name) {
    return { error: "กรุณากรอกรหัสและชื่อวิชาให้ครบถ้วน" };
  }

  const credits = parseFloat(creditsRaw) || 1.0;
  const rooms: string[] = roomsRaw ? JSON.parse(roomsRaw) : [];

  const teacherId = await getSession();
  if (!teacherId) {
    return { error: "กรุณาเข้าสู่ระบบก่อนทำรายการ" };
  }

  // สร้างรายวิชาลงฐานข้อมูล
  await prisma.course.create({
    data: {
      code,
      name,
      credits,
      year: year || "2567",
      evalMode,
      teacherId: teacherId,
      rooms: {
        create: rooms.map(room => ({ roomName: room }))
      }
    }
  });

  // ล้าง Cache ของหน้ารายการวิชา แล้วเด้งกลับไปหน้านั้น
  revalidatePath("/courses");
  redirect("/courses");
}

export async function updateCourseAction(courseId: string, formData: FormData) {
  const code = formData.get("code") as string;
  const name = formData.get("name") as string;
  const creditsRaw = formData.get("credits") as string;
  const year = formData.get("year") as string;
  const evalMode = formData.get("evalMode") as string || "yearly";
  const roomsRaw = formData.get("rooms") as string;

  if (!code || !name) {
    return { error: "กรุณากรอกรหัสและชื่อวิชาให้ครบถ้วน" };
  }

  const credits = parseFloat(creditsRaw) || 1.0;
  const rooms: string[] = roomsRaw ? JSON.parse(roomsRaw) : [];

  await prisma.course.update({
    where: { id: courseId },
    data: { code, name, credits, year, evalMode }
  });

  await prisma.courseRoom.deleteMany({ where: { courseId } });
  if (rooms.length > 0) {
    await prisma.courseRoom.createMany({
      data: rooms.map(roomName => ({
        roomName,
        courseId
      }))
    });
  }

  revalidatePath("/courses");
  revalidatePath(`/courses/${courseId}`);
  redirect(`/courses`);
}


export async function cloneCourseAction(courseId: string, newYear: string) {
  const teacherId = await getSession();
  if (!teacherId) throw new Error("Unauthorized");

  const originalCourse = await prisma.course.findUnique({
    where: { id: courseId },
    include: {
      rooms: true,
      scoreCategories: true
    }
  });

  if (!originalCourse || originalCourse.teacherId !== teacherId) {
    throw new Error("Course not found or unauthorized");
  }

  const newCourse = await prisma.course.create({
    data: {
      code: originalCourse.code,
      name: originalCourse.name,
      credits: originalCourse.credits,
      year: newYear,
      evalMode: originalCourse.evalMode,
      teacherId: teacherId,
      rooms: {
        create: originalCourse.rooms.map(r => ({
          roomName: r.roomName
        }))
      },
      scoreCategories: {
        create: originalCourse.scoreCategories.map(c => ({
          name: c.name,
          maxScore: c.maxScore,
          term: c.term,
          applicableRooms: c.applicableRooms
        }))
      }
    }
  });

  revalidatePath("/courses");
  return { success: true, newCourseId: newCourse.id };
}
