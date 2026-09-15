"use client";
import Link from "next/link";
import { useState, useTransition } from "react";
import { searchStudentAction } from "@/app/actions/search";

export default function SearchBox() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isPending, startTransition] = useTransition();
  const [showResult, setShowResult] = useState(false);
  const [studentData, setStudentData] = useState<any>(null);
  const [error, setError] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (searchTerm.trim() !== "") {
      startTransition(async () => {
        const res = await searchStudentAction(searchTerm);
        if (res) {
          setStudentData(res);
          setShowResult(true);
        } else {
          setStudentData(null);
          setShowResult(false);
          setError("ไม่พบข้อมูลนักเรียน กรุณาตรวจสอบรหัสหรือชื่ออีกครั้ง");
        }
      });
    }
  };

  const clearSearch = () => {
    setSearchTerm("");
    setShowResult(false);
    setStudentData(null);
    setError("");
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm relative overflow-hidden">
      {/* ลวดลายตกแต่ง */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-bl-full -z-10 opacity-50"></div>
      
      <h2 className="text-lg font-semibold text-gray-800 mb-2">🔍 ค้นหาผลการเรียนรายบุคคล</h2>
      <p className="text-sm text-gray-500 mb-4">สำหรับครูประจำชั้น ดูเกรดและคะแนนของนักเรียนแบบรวมทุกวิชา</p>
      
      <form onSubmit={handleSearch} className="flex space-x-3 relative z-10">
        <input 
          type="text" 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="กรอกชื่อ, นามสกุล หรือรหัสประจำตัวนักเรียน (เช่น 67001)" 
          className="flex-1 px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all shadow-sm font-medium"
        />
        <button 
          type="submit"
          disabled={isPending || !searchTerm.trim()}
          className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-medium rounded-lg shadow-sm transition-all flex items-center space-x-2"
        >
          {isPending ? (
            <span>กำลังค้นหา...</span>
          ) : (
            <span>ค้นหา</span>
          )}
        </button>
      </form>

      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-lg">
          {error}
        </div>
      )}

      {/* ผลลัพธ์การค้นหา */}
      {showResult && studentData && (
        <div className="mt-6 pt-6 border-t border-gray-100 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="flex items-center space-x-3">
                <div className="h-12 w-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-xl">
                  {studentData.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{studentData.name}</h3>
                  <p className="text-sm text-gray-500">รหัส: {studentData.studentId} | ชั้นเรียน: ห้อง {studentData.room}</p>
                </div>
              </div>
            </div>
            <button onClick={clearSearch} className="text-sm text-gray-400 hover:text-gray-600">
              ✕ ปิดหน้าต่าง
            </button>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm whitespace-nowrap min-w-[700px]">
                <thead>
                  <tr className="bg-gray-100/50 border-b border-gray-200 text-gray-600">
                    <th className="px-4 py-3 font-medium">วิชา</th>
                    <th className="px-4 py-3 font-medium">รายละเอียดคะแนน (เก็บ / สอบ)</th>
                    <th className="px-4 py-3 font-medium text-center w-24">รวม (100)</th>
                    <th className="px-4 py-3 font-bold text-center text-emerald-700 w-16">เกรด</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {studentData.courses.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                        ยังไม่มีข้อมูลการลงทะเบียนรายวิชา
                      </td>
                    </tr>
                  ) : (
                    studentData.courses.map((course: any) => (
                      <tr key={course.id} className="hover:bg-gray-50/50">
                        <td className="px-4 py-4">
                          <div className="font-medium text-gray-900">{course.name}</div>
                          <div className="text-xs text-gray-500 mt-0.5">{course.code}</div>
                        </td>
                        <td className="px-4 py-4 text-xs text-gray-600 space-y-2">
                          <div className="flex items-center space-x-2">
                            <span className="font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">เทอม 1</span>
                            <span>คะแนน: <span className="font-medium text-gray-800">{course.t1Total}</span>/{course.t1Max}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="font-medium text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-100">เทอม 2</span>
                            <span>คะแนน: <span className="font-medium text-gray-800">{course.t2Total}</span>/{course.t2Max}</span>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-center font-bold text-gray-800 text-base bg-gray-50/30">
                          {course.total}
                        </td>
                        <td className="px-4 py-4 text-center font-bold text-emerald-600 text-lg bg-gray-50/30">
                          {course.grade}
                        </td>
                      </tr>
                    ))
                  )}

                  <tr className="bg-gray-50 border-t border-gray-200">
                    <td colSpan={2} className="px-4 py-4 text-right font-medium text-gray-700 text-base">เกรดเฉลี่ยสะสม (GPA):</td>
                    <td colSpan={2} className="px-4 py-4 text-center font-bold text-emerald-600 text-2xl">{studentData.gpa}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="mt-4 flex justify-end">
             <Link href={`/student/${studentData.studentId}/report`} target="_blank" className="text-sm px-4 py-2 bg-emerald-600 border border-emerald-700 text-white hover:bg-emerald-700 rounded-lg shadow-sm flex items-center space-x-2 font-medium">
               <span>🖨️ พิมพ์ใบรายงานผล (ปพ.6)</span>
             </Link>
          </div>
        </div>
      )}
    </div>
  );
}
