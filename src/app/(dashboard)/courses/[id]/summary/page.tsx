import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function CourseSummaryPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const teacherId = await getSession();
  if (!teacherId) redirect("/login");

  const course = await prisma.course.findUnique({
    where: { id: resolvedParams.id },
    include: {
      rooms: true,
      scoreCategories: true,
      enrollments: { include: { student: true } },
      scores: true
    }
  });

  if (!course || course.teacherId !== teacherId) redirect("/courses");

  const grades = { "4": 0, "3.5": 0, "3": 0, "2.5": 0, "2": 0, "1.5": 0, "1": 0, "0": 0 };
  let totalScoreSum = 0;
  let maxTotalPossible = 0;
  let studentCount = 0;

  for (const en of course.enrollments) {
    const student = en.student;
    let total = 0;
    
    const cats = course.scoreCategories.filter(c => c.applicableRooms === "all" || (c.applicableRooms && JSON.parse(c.applicableRooms).includes(student.room)));
    
    let studentMax = 0;
    for (const cat of cats) {
      studentMax += cat.maxScore;
      const score = course.scores.find(s => s.studentId === student.id && s.scoreCategoryId === cat.id);
      if (score) total += score.value;
    }

    if (studentMax > maxTotalPossible) maxTotalPossible = studentMax;

    if (studentMax > 0) {
      let grade = "0";
      if (total >= 80) grade = "4";
      else if (total >= 75) grade = "3.5";
      else if (total >= 70) grade = "3";
      else if (total >= 65) grade = "2.5";
      else if (total >= 60) grade = "2";
      else if (total >= 55) grade = "1.5";
      else if (total >= 50) grade = "1";
      
      // @ts-ignore
      grades[grade]++;
      totalScoreSum += total;
      studentCount++;
    }
  }

  const averageScore = studentCount > 0 ? (totalScoreSum / studentCount).toFixed(1) : 0;
  const maxGradeCount = Math.max(...Object.values(grades), 1); // Avoid div by 0

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12 w-full">
      <div className="flex items-center space-x-4 mb-6">
        <Link href="/courses" className="text-gray-400 hover:text-gray-600">
          ← กลับหน้ารายวิชา
        </Link>
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">สรุปผลการเรียน: {course.name} ({course.code})</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex flex-col items-center justify-center text-center">
          <div className="text-sm font-semibold text-gray-500 uppercase tracking-wider">นักเรียนทั้งหมด</div>
          <div className="text-5xl font-extrabold text-gray-900 mt-3">{studentCount} <span className="text-xl font-medium text-gray-400">คน</span></div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex flex-col items-center justify-center text-center">
          <div className="text-sm font-semibold text-gray-500 uppercase tracking-wider">คะแนนเฉลี่ยรวม</div>
          <div className="text-5xl font-extrabold text-emerald-600 mt-3">{averageScore} <span className="text-xl font-medium text-gray-400">/ {maxTotalPossible}</span></div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex flex-col items-center justify-center text-center">
          <div className="text-sm font-semibold text-gray-500 uppercase tracking-wider">ผู้ที่ผ่านเกณฑ์ (เกรด 1 ขึ้นไป)</div>
          <div className="text-5xl font-extrabold text-blue-600 mt-3">
            {studentCount - grades["0"]} <span className="text-xl font-medium text-gray-400">คน</span>
          </div>
        </div>
      </div>

      <div className="bg-white p-10 rounded-3xl border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)] mt-8">
        <h2 className="text-xl font-bold text-gray-900 mb-10 text-center">การกระจายตัวของเกรด (Grade Distribution)</h2>
        
        <div className="flex items-end justify-center h-72 space-x-2 sm:space-x-4 md:space-x-8 mb-6 relative">
          {/* Grid lines */}
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-10">
            <div className="w-full h-px bg-gray-900"></div>
            <div className="w-full h-px bg-gray-900"></div>
            <div className="w-full h-px bg-gray-900"></div>
            <div className="w-full h-px bg-gray-900"></div>
          </div>

          {Object.entries(grades).reverse().map(([grade, count]) => {
            const heightPct = (count / maxGradeCount) * 100;
            return (
              <div key={grade} className="flex flex-col items-center w-12 sm:w-16 group z-10">
                <span className="text-sm font-bold text-emerald-600 mb-2 opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:-translate-y-1">{count} คน</span>
                <div 
                  className="w-full bg-gradient-to-t from-emerald-500 to-emerald-300 rounded-t-xl transition-all duration-500 group-hover:from-emerald-600 group-hover:to-emerald-400 shadow-sm"
                  style={{ height: `${heightPct}%`, minHeight: count > 0 ? '4px' : '0' }}
                ></div>
                <span className="mt-4 font-bold text-gray-700 bg-gray-50 border border-gray-100 px-3 py-1.5 rounded-xl shadow-sm">{grade}</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  );
}
