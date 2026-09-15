import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import AtRiskAlertsUI from "./AtRiskAlertsUI";

export default async function AtRiskAlerts() {
  const teacherId = await getSession();
  if (!teacherId) return null;

  // Fetch all courses for this teacher
  const courses = await prisma.course.findMany({
    where: { teacherId },
    include: {
      scoreCategories: true,
      enrollments: {
        include: { student: true }
      },
      scores: true
    }
  });

  const alerts: any[] = [];

  for (const course of courses) {
    for (const en of course.enrollments) {
      const student = en.student;
      let total = 0;
      let maxPossible = 0;
      
      for (const cat of course.scoreCategories) {
        const isApplicable = cat.applicableRooms === "all" || (cat.applicableRooms && JSON.parse(cat.applicableRooms).includes(student.room));
        if (isApplicable) {
          maxPossible += cat.maxScore;
          const score = course.scores.find(s => s.studentId === student.id && s.scoreCategoryId === cat.id);
          if (score) {
            total += score.value;
          }
        }
      }

      if (maxPossible > 0 && (total / maxPossible) < 0.5) {
        alerts.push({
          student,
          course,
          total,
          maxPossible
        });
      }
    }
  }

  alerts.sort((a, b) => (a.total / a.maxPossible) - (b.total / b.maxPossible));
  const topAlerts = alerts.slice(0, 5);

  if (topAlerts.length === 0) return null;

  return <AtRiskAlertsUI alerts={topAlerts} />;
}
