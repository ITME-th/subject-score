const fs = require('fs');

let file = 'src/app/actions/student.ts';
let c = fs.readFileSync(file, 'utf8');

if (!c.includes('removeStudentFromCourse')) {
  let newActions = `
export async function removeStudentFromCourse(studentId: string, courseId: string) {
  try {
    // ลบการลงทะเบียน (Enrollment)
    await prisma.enrollment.delete({
      where: { studentId_courseId: { studentId, courseId } }
    });
    // ลบคะแนนของเด็กคนนี้ในวิชานี้ด้วย
    await prisma.score.deleteMany({
      where: { studentId, courseId }
    });
    
    revalidatePath(\`/courses/\${courseId}/scores\`);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function removeAllStudentsFromCourse(courseId: string) {
  try {
    // ลบการลงทะเบียนทั้งหมดในวิชานี้
    await prisma.enrollment.deleteMany({
      where: { courseId }
    });
    // ลบคะแนนทั้งหมดของทุกคนในวิชานี้
    await prisma.score.deleteMany({
      where: { courseId }
    });
    
    revalidatePath(\`/courses/\${courseId}/scores\`);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
`;
  fs.writeFileSync(file, c + newActions);
  console.log('Added remove student actions');
}
