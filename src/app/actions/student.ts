"use server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function importStudentsToCourse(courseId: string, studentsData: { id: string; name: string; room: string }[]) {
  try {
    let importedCount = 0;
    
    for (const s of studentsData) {
      if (!s.id || !s.name) continue; // ข้ามบรรทัดที่ข้อมูลไม่ครบ

      // หาหรือสร้างนักเรียน
      let student = await prisma.student.findUnique({ where: { studentId: s.id.toString() }});
      if (!student) {
        student = await prisma.student.create({ 
          data: { studentId: s.id.toString(), name: s.name, room: s.room || "-" }
        });
      } else {
        // อัปเดตห้องเรียนเผื่อเปลี่ยนห้อง
        await prisma.student.update({
          where: { id: student.id },
          data: { room: s.room || student.room }
        });
      }

      // นำเข้าสู่วิชา (Enrollment)
      const existingEnroll = await prisma.enrollment.findUnique({
        where: { studentId_courseId: { studentId: student.id, courseId } }
      });

      if (!existingEnroll) {
        await prisma.enrollment.create({
          data: { studentId: student.id, courseId }
        });
      }
      importedCount++;
    }

    revalidatePath(`/courses/${courseId}/scores`);
    return { success: true, count: importedCount };
  } catch (error: any) {
    console.error("Error importing students:", error);
    return { success: false, error: error.message };
  }
}
