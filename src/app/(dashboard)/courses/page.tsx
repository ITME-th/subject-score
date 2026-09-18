import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import CourseRowActions from "@/components/courses/CourseRowActions";

export default async function CoursesPage() {
  const teacherId = await getSession();
  if (!teacherId) redirect("/login");

  // ดึงข้อมูลรายวิชาจากฐานข้อมูลจริง (เฉพาะของครูที่ล็อกอิน)
  const courses = await prisma.course.findMany({
    where: { teacherId },
    include: {
      rooms: true, // ดึงข้อมูลห้องเรียนที่สอนด้วย
    },
    orderBy: {
      createdAt: "desc"
    }
  });

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12 w-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">รายวิชาที่สอน</h1>
          <p className="text-sm text-gray-500 mt-2 font-medium">จัดการรายวิชาเรียน ห้องเรียน และตั้งค่าการเก็บคะแนน</p>
        </div>
        <Link 
          href="/courses/create" 
          className="w-full md:w-auto justify-center flex items-center space-x-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white rounded-xl font-semibold shadow-lg shadow-emerald-500/20 transition-all duration-200"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          <span>เพิ่มรายวิชาใหม่</span>
        </Link>
      </div>

      <div className="bg-white border border-gray-100 rounded-3xl shadow-[0_4px_24px_rgba(0,0,0,0.02)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="hidden md:table w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100 text-xs text-gray-500 uppercase tracking-wider font-semibold">
                <th className="px-6 py-5">รหัสวิชา</th>
                <th className="px-6 py-5">ชื่อวิชา</th>
                <th className="px-6 py-5 text-center">หน่วยกิต</th>
                <th className="px-6 py-5 text-center">ปีการศึกษา</th>
                <th className="px-6 py-5 text-center">ห้องเรียนที่สอน</th>
                <th className="px-6 py-5 text-right">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100/80">
              {courses.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center justify-center space-y-4">
                      <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-400">
                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                      </div>
                      <p className="text-gray-500 font-medium">ยังไม่มีรายวิชา คลิกปุ่ม "+ เพิ่มรายวิชาใหม่" เพื่อเริ่มต้นใช้งาน</p>
                    </div>
                  </td>
                </tr>
              ) : (
                courses.map((course) => (
                  <tr key={course.id} className="hover:bg-emerald-50/30 transition-colors group">
                    <td className="px-6 py-5 font-bold text-gray-900">{course.code}</td>
                    <td className="px-6 py-5 font-medium text-gray-700">{course.name}</td>
                    <td className="px-6 py-5 text-center text-gray-500 font-medium">{course.credits.toFixed(1)}</td>
                    <td className="px-6 py-5 text-center text-gray-500 font-medium">{course.year}</td>
                    <td className="px-6 py-5">
                      <div className="flex flex-wrap justify-center gap-1.5">
                        {course.rooms.length === 0 ? (
                          <span className="text-gray-300 text-sm">-</span>
                        ) : (
                          course.rooms.map(r => (
                            <span key={r.id} className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
                              {r.roomName}
                            </span>
                          ))
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-5"><CourseRowActions courseId={course.id} /></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile View */}
        <div className="md:hidden grid grid-cols-1 gap-4 p-4 bg-gray-50/30">
          {courses.length === 0 ? (
            <div className="flex flex-col items-center justify-center space-y-4 py-12">
               <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-400">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
               </div>
               <p className="text-gray-500 font-medium text-sm text-center">ยังไม่มีรายวิชา<br/>คลิกปุ่ม "+ เพิ่มรายวิชาใหม่"</p>
            </div>
          ) : (
            courses.map((course) => (
              <div key={course.id} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex flex-col space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg leading-tight">{course.code}</h3>
                    <p className="text-emerald-700 font-semibold text-sm mt-1">{course.name}</p>
                  </div>
                  <span className="bg-gray-100 text-gray-600 text-xs px-2.5 py-1 rounded-md font-bold tracking-wider">{course.year}</span>
                </div>
                
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <span className="font-medium bg-gray-50 px-2 py-1 rounded border border-gray-100">หน่วยกิต: {course.credits.toFixed(1)}</span>
                </div>

                <div className="space-y-2 pt-1">
                  <p className="text-xs text-gray-400 font-medium">ห้องเรียนที่สอน:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {course.rooms.length === 0 ? (
                      <span className="text-gray-300 text-sm">-</span>
                    ) : (
                      course.rooms.map(r => (
                        <span key={r.id} className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
                          {r.roomName}
                        </span>
                      ))
                    )}
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-50 mt-2">
                  <CourseRowActions courseId={course.id} />
                </div>
              </div>
            ))
          )}
        </div>

      </div>
      </div>
    </div>
  );
}
