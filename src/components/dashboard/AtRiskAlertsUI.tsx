"use client";
import { useState } from "react";
import Link from "next/link";

export default function AtRiskAlertsUI({ alerts }: { alerts: any[] }) {
  const [isOpen, setIsOpen] = useState(false);

  if (alerts.length === 0) return null;

  return (
    <>
      {/* Small Floating/Inline Icon Button */}
      <button 
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center space-x-2 px-4 py-2 bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 rounded-full text-sm font-semibold shadow-sm transition-all animate-pulse-slow"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <span>เด็กเสี่ยง ({alerts.length})</span>
      </button>

      {/* Modal Popup */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-red-50/30">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 bg-red-100 text-red-600 rounded-xl">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-red-900">รายชื่อนักเรียนที่ต้องเฝ้าระวัง</h2>
                  <p className="text-sm text-red-700/80">คะแนนปัจจุบันต่ำกว่า 50%</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 rounded-full transition-colors"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Body (Scrollable) */}
            <div className="p-6 overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {alerts.map((alert, idx) => (
                  <div key={idx} className="bg-white p-5 rounded-2xl shadow-sm border border-red-100 hover:border-red-200 transition-colors">
                    <div className="font-bold text-gray-900 text-base">{alert.student.name}</div>
                    <div className="text-sm text-gray-500 mb-3 mt-1">ชั้น {alert.student.room} | รหัส {alert.student.studentId}</div>
                    <div className="text-xs font-medium text-red-700 bg-red-50/80 px-2.5 py-1.5 rounded-lg inline-block border border-red-100">
                      วิชา: {alert.course.code}
                    </div>
                    <div className="mt-4 text-sm text-gray-600 bg-gray-50 p-2.5 rounded-xl border border-gray-100 flex justify-between items-center">
                      <span>คะแนนปัจจุบัน:</span>
                      <span className="font-bold text-red-600 text-base">{alert.total} <span className="text-gray-400 text-sm font-normal">/ {alert.maxPossible}</span></span>
                    </div>
                    <div className="mt-4">
                      <Link href={`/courses/${alert.course.id}/scores`} className="inline-flex items-center justify-center w-full py-2 text-sm font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition-colors">
                        ดูและแก้ไขคะแนน
                        <svg className="w-4 h-4 ml-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Modal Footer */}
            <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end">
              <button 
                onClick={() => setIsOpen(false)}
                className="px-6 py-2 bg-white border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
              >
                ปิดหน้าต่าง
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
