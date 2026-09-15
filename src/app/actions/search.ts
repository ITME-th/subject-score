"use server";
import { prisma } from "@/lib/prisma";

export async function searchStudentAction(term: string) {
  if (!term || term.trim() === "") return null;
  
  // 1. ค้นหานักเรียน (รหัส หรือ ชื่อ)
  const student = await prisma.student.findFirst({
    where: {
      OR: [
        { studentId: term.trim() },
        { name: { contains: term.trim() } }
      ]
    },
    include: {
      scores: true,
      enrollments: {
        include: {
          course: {
            include: {
              scoreCategories: true
            }
          }
        }
      }
    }
  });

  if (!student) return null;

  // 2. จัดรูปแบบข้อมูลให้แสดงผลง่าย
  let totalGradePoints = 0;
  let totalCredits = 0;

  const courseResults = student.enrollments.map(en => {
    const course = en.course;
    
    // กรองหมวดหมู่คะแนนตามเทอม
    // Note: ต้องเช็ค applicableRooms ด้วย ว่าคะแนนช่องนี้ใช้กับห้องของเด็กคนนี้ไหม
    const filterApplicable = (cat: any) => 
      cat.applicableRooms === "all" || 
      (cat.applicableRooms && JSON.parse(cat.applicableRooms).includes(student.room));

    const t1Cats = course.scoreCategories.filter(c => c.term === 1 && filterApplicable(c));
    const t2Cats = course.scoreCategories.filter(c => c.term === 2 && filterApplicable(c));

    let t1Total = 0;
    let t1Max = 0;
    t1Cats.forEach(cat => {
      t1Max += cat.maxScore;
      const score = student.scores.find(s => s.scoreCategoryId === cat.id && s.courseId === course.id);
      if (score) t1Total += score.value;
    });

    let t2Total = 0;
    let t2Max = 0;
    t2Cats.forEach(cat => {
      t2Max += cat.maxScore;
      const score = student.scores.find(s => s.scoreCategoryId === cat.id && s.courseId === course.id);
      if (score) t2Total += score.value;
    });

    const total = t1Total + t2Total;
    
    // คำนวณเกรด
    let gradeNum = 0;
    if (total >= 80) gradeNum = 4;
    else if (total >= 75) gradeNum = 3.5;
    else if (total >= 70) gradeNum = 3;
    else if (total >= 65) gradeNum = 2.5;
    else if (total >= 60) gradeNum = 2;
    else if (total >= 55) gradeNum = 1.5;
    else if (total >= 50) gradeNum = 1;

    totalGradePoints += (gradeNum * course.credits);
    totalCredits += course.credits;

    return {
      id: course.id,
      code: course.code,
      name: course.name,
      t1Total, t1Max,
      t2Total, t2Max,
      total,
      grade: gradeNum > 0 ? gradeNum.toString() : "0"
    };
  });

  const gpa = totalCredits > 0 ? (totalGradePoints / totalCredits).toFixed(2) : "0.00";

  return {
    id: student.id,
    studentId: student.studentId,
    name: student.name,
    room: student.room,
    courses: courseResults,
    gpa
  };
}
