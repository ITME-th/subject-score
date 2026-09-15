"use client";
import Link from "next/link";
import { useState, useTransition } from "react";
import { updateCourseAction } from "@/app/actions/course";

export default function EditCourseForm({ course }: { course: any }) {
  const [rooms, setRooms] = useState<string[]>(course.rooms.map((r: any) => r.roomName));
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
        <h1 className="text-2xl font-bold text-gray-900">แก้ไขรายวิชา: {course.name}</h1>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 sm:p-8">
        <form 
          className="space-y-6" 
          action={(formData) => startTransition(() => updateCourseAction(course.id, formData))}
        >
          <input type="hidden" name="rooms" value={JSON.stringify(rooms)} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">รหัสวิชา</label>
              <input 
                type="text" 
                name="code"
                defaultValue={course.code}
                required
                className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all shadow-sm font-medium" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ชื่อวิชา</label>
              <input 
                type="text" 
                name="name"
                defaultValue={course.name}
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
                defaultValue={course.credits}
                required
                className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all shadow-sm font-medium" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ปีการศึกษา</label>
              <input 
                type="text" 
                name="year"
                defaultValue={course.year} 
                required
                className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all shadow-sm font-medium" 
              />
            </div>
          </div>

          <div className="pt-2 pb-2">
            <label className="block text-sm font-medium text-gray-700 mb-3">รูปแบบการตัดเกรด (Grading Mode)</label>
            <div className="flex flex-col sm:flex-row sm:space-x-6 space-y-3 sm:space-y-0">
              <label className="flex items-center space-x-3 cursor-pointer p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <input type="radio" name="evalMode" value="yearly" defaultChecked={course.evalMode === "yearly"} className="w-4 h-4 text-emerald-600 focus:ring-emerald-500" />
                <span className="text-sm text-gray-800">รายปี (เทอม 1 + เทอม 2 = 100 คะแนน)</span>
              </label>
              <label className="flex items-center space-x-3 cursor-pointer p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <input type="radio" name="evalMode" value="termly" defaultChecked={course.evalMode === "termly"} className="w-4 h-4 text-emerald-600 focus:ring-emerald-500" />
                <span className="text-sm text-gray-800">รายเทอม (แยกเทอมละ 100 คะแนน)</span>
              </label>
            </div>
          </div>

          <hr className="border-gray-100" />

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
                placeholder="เช่น ป.1/3" 
                className="flex-1 px-4 py-2.5 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all shadow-sm font-medium" 
              />
              <button 
                type="button"
                onClick={handleAddRoom}
                className="px-4 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 font-medium rounded-lg transition-colors"
              >
                เพิ่ม
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {rooms.length === 0 && (
                <span className="text-sm text-gray-400 italic">ยังไม่มีห้องเรียน (เพิ่มอย่างน้อย 1 ห้อง)</span>
              )}
              {rooms.map(room => (
                <div key={room} className="flex items-center bg-emerald-50 border border-emerald-100 text-emerald-700 px-3 py-1.5 rounded-full text-sm">
                  <span className="font-medium mr-2">{room}</span>
                  <button 
                    type="button" 
                    onClick={() => handleRemoveRoom(room)}
                    className="text-emerald-400 hover:text-emerald-600 flex items-center justify-center w-4 h-4 rounded-full hover:bg-emerald-100 transition-colors"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-6 flex justify-end">
            <button 
              type="submit" 
              disabled={isPending || rooms.length === 0}
              className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg shadow-sm transition-all disabled:bg-emerald-300 flex items-center space-x-2"
            >
              {isPending ? (
                <span>กำลังบันทึก...</span>
              ) : (
                <span>💾 บันทึกการแก้ไข</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
