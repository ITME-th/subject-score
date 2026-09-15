"use server";
import { prisma } from "@/lib/prisma";

export async function updateStudentScore(
  studentId: string, 
  courseId: string, 
  scoreCategoryId: string, 
  value: number
) {
  try {
    await prisma.score.upsert({
      where: {
        studentId_scoreCategoryId: { studentId, scoreCategoryId }
      },
      update: {
        value
      },
      create: {
        studentId,
        scoreCategoryId,
        courseId,
        value
      }
    });
    return { success: true };
  } catch (error: any) {
    console.error("Error saving score:", error);
    return { success: false, error: error.message };
  }
}

export async function addScoreColumn(
  courseId: string,
  name: string,
  maxScore: number,
  term: number,
  applicableRooms: string = "all"
) {
  try {
    await prisma.scoreCategory.create({
      data: {
        courseId,
        name,
        maxScore,
        term,
        applicableRooms
      }
    });
    // ต้องอิมพอร์ต revalidatePath จาก next/cache
    const { revalidatePath } = require("next/cache");
    revalidatePath(`/courses/${courseId}/scores`);
    return { success: true };
  } catch (error: any) {
    console.error("Error adding column:", error);
    return { success: false, error: error.message };
  }
}

export async function deleteScoreColumn(categoryId: string, courseId: string) {
  try {
    await prisma.scoreCategory.delete({
      where: { id: categoryId }
    });
    const { revalidatePath } = require("next/cache");
    revalidatePath(`/courses/${courseId}/scores`);
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting column:", error);
    return { success: false, error: error.message };
  }
}
