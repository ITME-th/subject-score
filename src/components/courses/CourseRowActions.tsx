"use client";
import Link from "next/link";
import { useTransition } from "react";
import { cloneCourseAction } from "@/app/actions/course";

export default function CourseRowActions({ courseId }: { courseId: string }) {
  const [isPending, startTransition] = useTransition();

  const handleClone = () => {
    const newYear = window.prompt("กรุณาระบุปีการศึกษาใหม่ที่ต้องการคัดลอกวิชานี้ไป (เช่น 2568)");
    if (newYear && newYear.trim() !== "") {
      startTransition(async () => {
        try {
          const res = await cloneCourseAction(courseId, newYear.trim());
          if (res.success) {
            alert("คัดลอกรายวิชาสำเร็จ!");
          }
        } catch (error) {
          alert("เกิดข้อผิดพลาดในการคัดลอก");
        }
      });
    }
  };

  return (
    <td className="px-6 py-5 text-right space-x-2">
      <Link href={`/courses/${courseId}/scores`} className="inline-flex items-center px-3 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 hover:text-emerald-800 rounded-lg text-sm font-semibold transition-colors">
        <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
        กรอกคะแนน
      </Link>
      <Link href={`/courses/${courseId}/summary`} className="inline-flex items-center px-3 py-1.5 bg-purple-50 text-purple-700 hover:bg-purple-100 hover:text-purple-800 rounded-lg text-sm font-semibold transition-colors">
        <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
        สรุปผล
      </Link>
      <button 
        onClick={handleClone} 
        disabled={isPending}
        className="inline-flex items-center p-1.5 text-gray-400 hover:bg-blue-100 hover:text-blue-700 rounded-lg transition-colors disabled:opacity-50" 
        title="คัดลอกวิชาสำหรับปีการศึกษาใหม่"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
        </svg>
      </button>
      <Link href={`/courses/${courseId}/edit`} className="inline-flex items-center p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700 rounded-lg transition-colors" title="แก้ไข">
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
      </Link>
    </td>
  );
}
