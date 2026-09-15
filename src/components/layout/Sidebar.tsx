import Link from "next/link";
import MobileNav from "./MobileNav";

export default function Sidebar() {
  return (
    <>
      {/* Sidebar สำหรับ Desktop */}
      <aside className="hidden md:flex w-72 border-r border-gray-100 bg-white flex-col h-full z-10 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
        <div className="p-6 border-b border-gray-50 flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-emerald-500/20">
            S
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-gray-900 tracking-tight leading-none mb-1">Subject Score</h1>
            <p className="text-[11px] font-medium text-emerald-600 uppercase tracking-wider">Teacher Workspace</p>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 mt-2">Menu</p>
          <Link 
            href="/" 
            className="flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-emerald-50 hover:text-emerald-700 transition-all duration-200 font-medium group"
          >
            <svg className="w-5 h-5 text-gray-400 group-hover:text-emerald-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            <span>ภาพรวม (Dashboard)</span>
          </Link>
          <Link 
            href="/courses" 
            className="flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-emerald-50 hover:text-emerald-700 transition-all duration-200 font-medium group"
          >
            <svg className="w-5 h-5 text-gray-400 group-hover:text-emerald-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <span>รายวิชาที่สอน (Courses)</span>
          </Link>
        </nav>

        <div className="p-6 border-t border-gray-50 bg-gray-50/50">
          <Link 
            href="/courses/create" 
            className="w-full flex items-center justify-center space-x-2 px-4 py-3.5 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white rounded-xl font-semibold shadow-lg shadow-emerald-600/20 transition-all duration-200"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
            <span>เพิ่มรายวิชาใหม่</span>
          </Link>
        </div>
      </aside>

      {/* Navigation สำหรับ Mobile */}
      <MobileNav />
    </>
  );
}
