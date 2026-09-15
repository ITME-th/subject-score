import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { logoutAction } from "@/app/actions/auth";

export default async function Header() {
  const teacherId = await getSession();
  let teacherName = "ผู้ใช้งาน";
  
  if (teacherId) {
    const teacher = await prisma.teacher.findUnique({ where: { id: teacherId } });
    if (teacher) {
      teacherName = teacher.name;
    }
  }

  return (
    <header className="h-20 bg-white border-b border-gray-100/50 bg-white/80 backdrop-blur-xl flex items-center justify-between md:justify-end px-4 md:px-6 shadow-sm z-10 sticky top-0">
      <div className="md:hidden flex items-center space-x-2">
        <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-white font-bold text-lg">S</div>
        <span className="font-bold text-gray-800">Subject Score</span>
      </div>
      <div className="flex items-center space-x-4">
        <div className="text-right hidden md:block">
          <p className="text-sm font-bold text-gray-800">{teacherName}</p>
          <p className="text-xs text-gray-500 font-medium">Teacher Portal</p>
        </div>
        <div className="h-9 w-9 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold border border-emerald-200 uppercase">
          {teacherName.charAt(0) || "T"}
        </div>
        <form action={logoutAction}>
          <button type="submit" className="text-xs text-red-500 hover:text-red-700 font-medium ml-2 border border-red-200 px-2 py-1 rounded-md hover:bg-red-50 transition-colors">
            ออกจากระบบ
          </button>
        </form>
      </div>
    </header>
  );
}
