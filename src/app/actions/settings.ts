"use server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function saveCourseSettings(
  courseId: string, 
  evalMode: string, 
  categories: { name: string; max: number; term: 1 | 2 }[]
) {
  try {
    // 1. อัปเดตโหมดการประเมินผลของวิชา
    await prisma.course.update({
      where: { id: courseId },
      data: { evalMode }
    });

    // 2. ลบหัวข้อคะแนนเก่าทิ้งทั้งหมด (เพื่อบันทึกชุดใหม่ทับลงไป)
    await prisma.scoreCategory.deleteMany({
      where: { courseId }
    });

    // 3. สร้างหัวข้อคะแนนใหม่ตามที่ครูกำหนด
    if (categories.length > 0) {
      await prisma.scoreCategory.createMany({
        data: categories.map(c => ({
          name: c.name,
          maxScore: c.max,
          term: c.term,
          courseId: courseId
        }))
      });
    }

    revalidatePath(`/courses/${courseId}/settings`);
    revalidatePath(`/courses/${courseId}/scores`);
    return { success: true };
  } catch (error) {
    console.error("Error saving settings:", error);
    return { success: false, error: "เกิดข้อผิดพลาดในการบันทึกข้อมูล" };
  }
}
