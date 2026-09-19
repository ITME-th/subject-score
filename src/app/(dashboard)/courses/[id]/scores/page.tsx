import { prisma } from "@/lib/prisma";
import ScoreTable from "@/components/courses/ScoreTable";
import { notFound } from "next/navigation";

export default async function ScoreEntryPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  
  const course = await prisma.course.findUnique({
    where: { id: resolvedParams.id },
    include: {
      rooms: true,
      scoreCategories: {
        orderBy: { id: 'asc' }
      },
      enrollments: {
        include: {
          student: {
            include: {
              scores: {
                where: { courseId: resolvedParams.id }
              }
            }
          }
        },
        orderBy: {
          student: { studentId: 'asc' }
        }
      }
    }
  });

  if (!course) notFound();

  return <ScoreTable course={course} />;
}
