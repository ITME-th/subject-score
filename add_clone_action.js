const fs = require('fs');

const cloneCode = `

export async function cloneCourseAction(courseId: string, newYear: string) {
  const teacherId = await getSession();
  if (!teacherId) throw new Error("Unauthorized");

  const originalCourse = await prisma.course.findUnique({
    where: { id: courseId },
    include: {
      rooms: true,
      scoreCategories: true
    }
  });

  if (!originalCourse || originalCourse.teacherId !== teacherId) {
    throw new Error("Course not found or unauthorized");
  }

  const newCourse = await prisma.course.create({
    data: {
      code: originalCourse.code,
      name: originalCourse.name,
      credits: originalCourse.credits,
      year: newYear,
      evalMode: originalCourse.evalMode,
      teacherId: teacherId,
      rooms: {
        create: originalCourse.rooms.map(r => ({
          roomName: r.roomName
        }))
      },
      scoreCategories: {
        create: originalCourse.scoreCategories.map(c => ({
          name: c.name,
          maxScore: c.maxScore,
          term: c.term,
          applicableRooms: c.applicableRooms
        }))
      }
    }
  });

  revalidatePath("/courses");
  return { success: true, newCourseId: newCourse.id };
}
`;

let file = 'src/app/actions/course.ts';
let c = fs.readFileSync(file, 'utf8');
if (!c.includes('cloneCourseAction')) {
  fs.appendFileSync(file, cloneCode);
  console.log('Added cloneCourseAction');
}
