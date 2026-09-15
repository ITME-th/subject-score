import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import EditCourseForm from "./EditCourseForm";

export default async function EditCoursePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const course = await prisma.course.findUnique({
    where: { id: resolvedParams.id },
    include: { rooms: true }
  });

  if (!course) notFound();

  return <EditCourseForm course={course} />;
}
