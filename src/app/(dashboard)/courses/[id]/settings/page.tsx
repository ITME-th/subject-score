import { prisma } from "@/lib/prisma";
import SettingsForm from "@/components/courses/SettingsForm";
import { notFound } from "next/navigation";

export default async function CourseSettingsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  
  // ดึงข้อมูลวิชาจากฐานข้อมูล
  const course = await prisma.course.findUnique({
    where: { id: resolvedParams.id },
    include: {
      scoreCategories: true
    }
  });

  if (!course) {
    notFound();
  }

  // แปลงข้อมูลให้อยู่ในรูปแบบที่ Client Component ใช้งานได้ง่าย
  const initialCategories = course.scoreCategories.map(cat => ({
    id: cat.id as any, // ในฝั่ง client เราอนุญาตให้ id เป็น Date.now() ชั่วคราวได้
    name: cat.name,
    max: cat.maxScore,
    term: cat.term as 1 | 2
  }));

  return (
    <SettingsForm course={course} initialCategories={initialCategories} />
  );
}
