"use client";
import Link from "next/link";
import { useState, useTransition } from "react";
import { createCourseAction } from "@/app/actions/course";

export default function CreateCoursePage() {
  const [rooms, setRooms] = useState<string[]>(["ป.1/1", "ป.1/2"]);
  const [newRoom, setNewRoom] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleAddRoom = () => {
    if (newRoom.trim() && !rooms.includes(newRoom.trim())) {
      setRooms([...rooms, newRoom.trim()]);
      setNewRoom("");
    }
  };

  const handleRemoveRoom = (roomToRemove: string) => {
    setRooms(rooms.filter(room => room !== roomToRemove));
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-12">
      <div className="flex items-center space-x-4">
        <Link href="/courses" className="text-gray-400 hover:text-gray-600">
          ← กลับ
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">เพิ่มรายวิชาใหม่</h1>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 sm:p-8">
        <form 
          className="space-y-6" 
          action={(formData) => startTransition(() => createCourseAction(formData))}
        >
          {/* ข้อมูลซ่อนสำหรับส่ง State ไปยัง Server */}
          <input type="hidden" name="rooms" value={JSON.stringify(rooms)} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">รหัสวิชา</label>
              <input 
                type="text" 
                name="code"
                placeholder="เช่น ว11101" 
                required
                className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all shadow-sm font-medium" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ชื่อวิชา</label>
              <input 
                type="text" 
                name="name"
                placeholder="เช่น วิทยาศาสตร์พื้นฐาน" 
                required
                className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all shadow-sm font-medium" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">จำนวนหน่วยกิต</label>
              <input 
                type="number" 
                name="credits"
                step="0.5"
                placeholder="เช่น 1.5" 
                required
                className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all shadow-sm font-medium" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ปีการศึกษา</label>
              <input 
                type="text" 
                name="year"
                defaultValue="2567" 
                required
                className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all shadow-sm font-medium" 
              />
            </div>
          </div>

          <div className="pt-2 pb-2">
            <label className="block text-sm font-medium text-gray-700 mb-3">รูปแบบการตัดเกรด (Grading Mode)</label>
            <div className="flex flex-col sm:flex-row sm:space-x-6 space-y-3 sm:space-y-0">
              <label className="flex items-center space-x-3 cursor-pointer p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <input type="radio" name="evalMode" value="yearly" defaultChecked className="w-4 h-4 text-emerald-600 focus:ring-emerald-500" />
                <span className="text-sm text-gray-800">รายปี (เทอม 1 + เทอม 2 = 100 คะแนน)</span>
              </label>
              <label className="flex items-center space-x-3 cursor-pointer p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <input type="radio" name="evalMode" value="termly" className="w-4 h-4 text-emerald-600 focus:ring-emerald-500" />
                <span className="text-sm text-gray-800">รายเทอม (แยกเทอมละ 100 คะแนน)</span>
              </label>
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* ส่วนตั้งค่าห้องเรียนที่สอน */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ห้องเรียนที่สอนในวิชานี้ (Classes / Rooms)
            </label>
            <p className="text-xs text-gray-500 mb-3">พิมพ์ชื่อห้องเรียนแล้วกดปุ่ม "เพิ่ม" เพื่อกำหนดว่าวิชานี้สอนห้องไหนบ้าง</p>
            
            <div className="flex space-x-2 mb-4">
              <input 
                type="text" 
                value={newRoom}
                onChange={(e) => setNewRoom(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddRoom();
                  }
                }}
                placeholder="เช่น ป.1/3, ม.1/1" 
                className="flex-1 px-4 py-2.5 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all shadow-sm font-medium" 
              />
              <button 
                type="button"
                onClick={handleAddRoom}
                className="px-4 py-2 bg-emerald-100 text-emerald-700 hover:bg-blue-200 font-medium rounded-lg transition-colors"
              >
                เพิ่มห้อง
              </button>
            </div>

            {/* แสดงรายการห้องเรียนที่เพิ่มแล้ว */}
            <div className="flex flex-wrap gap-2 p-3 bg-gray-50 border border-gray-100 rounded-lg min-h-[60px]">
              {rooms.length === 0 ? (
                <span className="text-sm text-gray-400">ยังไม่ได้เพิ่มห้องเรียน</span>
              ) : (
                rooms.map((room) => (
                  <div key={room} className="flex items-center space-x-1 bg-white border border-gray-200 px-3 py-1.5 rounded-full shadow-sm">
                    <span className="text-sm font-medium text-gray-700">{room}</span>
                    <button 
                      type="button" 
                      onClick={() => handleRemoveRoom(room)}
                      className="text-gray-400 hover:text-red-500 focus:outline-none ml-1"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="pt-6 border-t border-gray-100 flex justify-end space-x-3">
            <Link 
              href="/courses"
              className="px-6 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition-colors"
            >
              ยกเลิก
            </Link>
            <button 
              type="submit"
              disabled={isPending}
              className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-medium rounded-lg shadow-sm transition-all"
            >
              {isPending ? "กำลังบันทึก..." : "บันทึกรายวิชา"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
