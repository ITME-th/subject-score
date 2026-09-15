"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function MobileNav() {
  const pathname = usePathname();

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 pb-safe shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
      <div className="flex justify-around items-center h-16 px-4">
        <Link 
          href="/" 
          className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${pathname === '/' ? 'text-emerald-600' : 'text-gray-500 hover:text-gray-900'}`}
        >
          <span className="text-xl">📊</span>
          <span className="text-[10px] font-medium">หน้าหลัก</span>
        </Link>
        <Link 
          href="/courses" 
          className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${pathname?.startsWith('/courses') && pathname !== '/courses/create' ? 'text-emerald-600' : 'text-gray-500 hover:text-gray-900'}`}
        >
          <span className="text-xl">📚</span>
          <span className="text-[10px] font-medium">รายวิชา</span>
        </Link>
        <Link 
          href="/courses/create" 
          className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${pathname === '/courses/create' ? 'text-emerald-600' : 'text-gray-500 hover:text-gray-900'}`}
        >
          <span className="text-xl">✨</span>
          <span className="text-[10px] font-medium">เพิ่มวิชา</span>
        </Link>
      </div>
    </div>
  );
}
