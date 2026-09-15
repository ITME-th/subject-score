"use client";
import Link from "next/link";
import { useState, useTransition } from "react";
import { saveCourseSettings } from "@/app/actions/settings";

type Category = { id: number; name: string; max: number; term: 1 | 2 };

export default function SettingsForm({ 
  course, 
  initialCategories 
}: { 
  course: any, 
  initialCategories: Category[] 
}) {
  const [evalMode, setEvalMode] = useState<"yearly" | "termly">(course.evalMode || "yearly");
  const [isPending, startTransition] = useTransition();
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "success">("idle");

  // แยกข้อมูลตามเทอม
  const initT1 = initialCategories.filter(c => c.term === 1);
  const initT2 = initialCategories.filter(c => c.term === 2);

  const [t1Categories, setT1Categories] = useState<Category[]>(
    initT1.length > 0 ? initT1 : [
      { id: Date.now(), name: "จิตพิสัย", max: 10, term: 1 },
      { id: Date.now()+1, name: "สอบกลางภาค", max: 20, term: 1 }
    ]
  );

  const [t2Categories, setT2Categories] = useState<Category[]>(
    initT2.length > 0 ? initT2 : [
      { id: Date.now()+2, name: "จิตพิสัย", max: 10, term: 2 },
      { id: Date.now()+3, name: "สอบปลายภาค", max: 20, term: 2 }
    ]
  );

  const maxLimit = evalMode === "yearly" ? 50 : 100;
  const t1Sum = t1Categories.reduce((acc, cat) => acc + (cat.max || 0), 0);
  const t2Sum = t2Categories.reduce((acc, cat) => acc + (cat.max || 0), 0);

  const handleAdd = (term: 1 | 2) => {
    const newCat: Category = { id: Date.now(), name: "งานใหม่...", max: 0, term };
    if (term === 1) setT1Categories([...t1Categories, newCat]);
    else setT2Categories([...t2Categories, newCat]);
  };

  const handleUpdate = (term: 1 | 2, id: number, field: string, value: string | number) => {
    const updater = (cats: Category[]) => cats.map(c => c.id === id ? { ...c, [field]: value } : c);
    if (term === 1) setT1Categories(updater(t1Categories));
    else setT2Categories(updater(t2Categories));
  };

  const handleRemove = (term: 1 | 2, id: number) => {
    if (term === 1) setT1Categories(t1Categories.filter(c => c.id !== id));
    else setT2Categories(t2Categories.filter(c => c.id !== id));
  };

  const handleSave = () => {
    startTransition(async () => {
      setSaveStatus("saving");
      const allCats = [...t1Categories, ...t2Categories];
      await saveCourseSettings(course.id, evalMode, allCats);
      setSaveStatus("success");
      setTimeout(() => setSaveStatus("idle"), 3000);
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <div className="flex justify-between items-end">
        <div className="space-y-1">
          <Link href="/courses" className="text-sm text-gray-400 hover:text-gray-600 mb-2 inline-block">
            ← กลับไปหน้ารายวิชา
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">ตั้งค่าโครงสร้างคะแนน</h1>
          <p className="text-sm text-gray-500">{course.name} ({course.code}) - {course.year}</p>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">รูปแบบการประเมินผล (Evaluation Mode)</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${evalMode === "yearly" ? "border-blue-500 bg-blue-50/50" : "border-gray-200"}`} onClick={() => setEvalMode("yearly")}>
            <div className="flex items-center space-x-3">
              <input type="radio" checked={evalMode === "yearly"} readOnly className="w-4 h-4 text-blue-600" />
              <span className="font-semibold text-gray-800">แบบรายปี (Yearly)</span>
            </div>
            <p className="text-xs text-gray-500 mt-2 ml-7">คะแนนเต็มเทอมละ 50 คะแนน (รวม 100 นำไปตัดเกรด)</p>
          </label>
          <label className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${evalMode === "termly" ? "border-blue-500 bg-blue-50/50" : "border-gray-200"}`} onClick={() => setEvalMode("termly")}>
            <div className="flex items-center space-x-3">
              <input type="radio" checked={evalMode === "termly"} readOnly className="w-4 h-4 text-blue-600" />
              <span className="font-semibold text-gray-800">แบบรายเทอม (Termly)</span>
            </div>
            <p className="text-xs text-gray-500 mt-2 ml-7">คะแนนเต็มเทอมละ 100 คะแนน (ตัดเกรดแยกแต่ละเทอม)</p>
          </label>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-800">กำหนดหัวข้อเก็บคะแนน (อิสระ)</h2>
          <p className="text-sm text-gray-500 mt-1">ยอดรวมต้องไม่เกิน <strong className="text-gray-700">{maxLimit} คะแนนต่อเทอม</strong></p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* เทอม 1 */}
          <div className="space-y-4">
            <div className={`flex justify-between items-center px-4 py-2 rounded-lg border ${t1Sum === maxLimit ? "bg-green-50 border-green-200" : t1Sum > maxLimit ? "bg-red-50 border-red-200" : "bg-orange-50 border-orange-200"}`}>
              <span className="font-semibold text-gray-800">เทอม 1</span>
              <span className={`font-bold ${t1Sum === maxLimit ? "text-green-600" : t1Sum > maxLimit ? "text-red-600" : "text-orange-600"}`}>รวม: {t1Sum} / {maxLimit}</span>
            </div>
            {t1Categories.map((cat, idx) => (
              <div key={cat.id} className="flex items-center space-x-2 group">
                <span className="text-gray-300 text-sm">{idx + 1}.</span>
                <input type="text" value={cat.name} onChange={(e) => handleUpdate(1, cat.id, 'name', e.target.value)} className="flex-1 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg outline-none text-sm focus:border-blue-500 focus:bg-white" />
                <input type="number" value={cat.max === 0 ? '' : cat.max} onChange={(e) => handleUpdate(1, cat.id, 'max', parseInt(e.target.value) || 0)} className="w-16 text-center px-2 py-1.5 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-blue-500 focus:bg-white text-sm" placeholder="คะแนน" />
                <button onClick={() => handleRemove(1, cat.id)} className="text-red-400 hover:text-red-600 p-1 opacity-0 group-hover:opacity-100">✕</button>
              </div>
            ))}
            <button onClick={() => handleAdd(1)} className="w-full py-2 border border-dashed border-gray-300 text-gray-500 rounded-lg hover:bg-gray-50 text-sm font-medium">+ เพิ่มหัวข้อคะแนน (เทอม 1)</button>
          </div>

          {/* เทอม 2 */}
          <div className="space-y-4">
            <div className={`flex justify-between items-center px-4 py-2 rounded-lg border ${t2Sum === maxLimit ? "bg-green-50 border-green-200" : t2Sum > maxLimit ? "bg-red-50 border-red-200" : "bg-orange-50 border-orange-200"}`}>
              <span className="font-semibold text-gray-800">เทอม 2</span>
              <span className={`font-bold ${t2Sum === maxLimit ? "text-green-600" : t2Sum > maxLimit ? "text-red-600" : "text-orange-600"}`}>รวม: {t2Sum} / {maxLimit}</span>
            </div>
            {t2Categories.map((cat, idx) => (
              <div key={cat.id} className="flex items-center space-x-2 group">
                <span className="text-gray-300 text-sm">{idx + 1}.</span>
                <input type="text" value={cat.name} onChange={(e) => handleUpdate(2, cat.id, 'name', e.target.value)} className="flex-1 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg outline-none text-sm focus:border-blue-500 focus:bg-white" />
                <input type="number" value={cat.max === 0 ? '' : cat.max} onChange={(e) => handleUpdate(2, cat.id, 'max', parseInt(e.target.value) || 0)} className="w-16 text-center px-2 py-1.5 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-blue-500 focus:bg-white text-sm" placeholder="คะแนน" />
                <button onClick={() => handleRemove(2, cat.id)} className="text-red-400 hover:text-red-600 p-1 opacity-0 group-hover:opacity-100">✕</button>
              </div>
            ))}
            <button onClick={() => handleAdd(2)} className="w-full py-2 border border-dashed border-gray-300 text-gray-500 rounded-lg hover:bg-gray-50 text-sm font-medium">+ เพิ่มหัวข้อคะแนน (เทอม 2)</button>
          </div>
        </div>
      </div>

      {/* เกณฑ์ตัดเกรด */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-800">เกณฑ์การตัดเกรด</h2>
          <p className="text-sm text-gray-500">
            {evalMode === "yearly" 
              ? "คำนวณจากผลรวมคะแนน 2 เทอม (100 คะแนน)" 
              : "คำนวณจากคะแนนรวมแต่ละเทอม (เทอมละ 100 คะแนน)"}
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { grade: "4", min: "80" },
            { grade: "3.5", min: "75" },
            { grade: "3", min: "70" },
            { grade: "2.5", min: "65" },
            { grade: "2", min: "60" },
            { grade: "1.5", min: "55" },
            { grade: "1", min: "50" },
            { grade: "0", min: "0" },
          ].map((item) => (
            <div key={item.grade} className="flex items-center justify-between p-3 border border-gray-100 bg-gray-50 rounded-lg hover:border-blue-200 transition-all">
              <span className="font-bold text-blue-700">เกรด {item.grade}</span>
              <div className="flex items-center space-x-1">
                <span className="text-xs text-gray-400">≥</span>
                <input 
                  type="number" 
                  defaultValue={item.min} 
                  className="w-14 text-center px-2 py-1.5 bg-white border border-gray-200 rounded-md outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm font-medium" 
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end pt-2 space-x-4 items-center">
        {saveStatus === "success" && <span className="text-green-600 font-medium">บันทึกเรียบร้อยแล้ว!</span>}
        <button 
          onClick={handleSave}
          disabled={t1Sum !== maxLimit || t2Sum !== maxLimit || isPending}
          className="px-8 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium rounded-lg shadow-sm transition-all"
        >
          {isPending ? "กำลังบันทึก..." : (t1Sum !== maxLimit || t2Sum !== maxLimit ? "จัดคะแนนให้พอดีเกณฑ์" : "บันทึกการตั้งค่า")}
        </button>
      </div>
    </div>
  );
}
