"use client";
import Link from "next/link";
import { useState, useRef, useTransition } from "react";
import * as XLSX from "xlsx";
import { importStudentsToCourse } from "@/app/actions/student";
import { updateStudentScore, addScoreColumn, deleteScoreColumn } from "@/app/actions/score";

export default function ScoreTable({ course }: { course: any }) {
  const [isPending, startTransition] = useTransition();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // State สำหรับ Modal ก๊อปปี้/วาง
  const [showPasteModal, setShowPasteModal] = useState(false);
  const [pasteText, setPasteText] = useState("");

  // State สำหรับ Modal เพิ่มช่องคะแนนด่วน
  const [showAddColModal, setShowAddColModal] = useState(false);
  const [newColTerm, setNewColTerm] = useState<1|2>(1);
  const [newColName, setNewColName] = useState("");
  const [newColMax, setNewColMax] = useState("");
  const [newColRooms, setNewColRooms] = useState<string[]>([]);

  // State สำหรับการกรองห้องเรียน
  const [selectedRoom, setSelectedRoom] = useState<string>("all");
  const [localOverrides, setLocalOverrides] = useState<Record<string, number>>({});
  
  // ข้อมูลที่มาจาก Server
  const term1Categories = course.scoreCategories.filter((c: any) => c.term === 1 && (c.applicableRooms === "all" || (selectedRoom !== "all" ? JSON.parse(c.applicableRooms).includes(selectedRoom) : true)));
  const term2Categories = course.scoreCategories.filter((c: any) => c.term === 2 && (c.applicableRooms === "all" || (selectedRoom !== "all" ? JSON.parse(c.applicableRooms).includes(selectedRoom) : true)));
  const t1Max = term1Categories.reduce((acc: number, c: any) => acc + c.maxScore, 0);
  const t2Max = term2Categories.reduce((acc: number, c: any) => acc + c.maxScore, 0);
  
  const students = course.enrollments.map((e: any) => ({
    ...e.student,
    scoreMap: e.student.scores.reduce((acc: any, s: any) => {
      acc[s.scoreCategoryId] = s.value;
      return acc;
    }, {})
  }));

  const availableRooms = Array.from(new Set(students.map((s: any) => s.room))).filter(r => r && r !== "-").sort() as string[];
  const filteredStudents = selectedRoom === "all" ? students : students.filter((s: any) => s.room === selectedRoom);

  // นำเข้าผ่านไฟล์ Excel
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: "binary" });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws);
        
        const formattedData = data.map((row: any) => {
          const keys = Object.keys(row);
          const findKey = (keywords: string[]) => keys.find(k => keywords.some(kw => k.toLowerCase().includes(kw.toLowerCase())));
          
          const idKey = findKey(["รหัส", "id", "เลข", "ประจำตัว"]);
          const nameKey = findKey(["ชื่อ", "name", "สกุล"]); 
          const roomKey = findKey(["ห้อง", "ชั้น", "room", "class"]);

          return {
            id: idKey ? String(row[idKey]) : undefined,
            name: nameKey ? String(row[nameKey]) : undefined,
            room: roomKey ? String(row[roomKey]) : "-"
          };
        }).filter(r => r.id && r.name); 

        if (formattedData.length === 0) {
          alert("ไม่พบข้อมูลนักเรียน! โปรดตรวจสอบว่าไฟล์ Excel มีหัวคอลัมน์คำว่า 'รหัส', 'ชื่อ', และ 'ห้อง' หรือไม่");
          return;
        }

        startTransition(async () => {
          const res = await importStudentsToCourse(course.id, formattedData as any);
          if (res.success) alert(`นำเข้านักเรียนสำเร็จ ${res.count} คน`);
          else alert(`นำเข้าไม่สำเร็จ: ${res.error}`);
        });
      } catch (err) {
        alert("ไฟล์ Excel ไม่ถูกต้อง");
      }
    };
    reader.readAsBinaryString(file);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // นำเข้าผ่านการ ก๊อปปี้/วาง (Copy & Paste)
  const handlePasteImport = () => {
    const lines = pasteText.trim().split('\n');
    const formattedData: any[] = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      // แยกด้วย Tab (ค่าเริ่มต้นของ Excel), เครื่องหมายคอมมา, หรือช่องว่างหลายๆ ช่อง
      let cols = line.split('\t');
      if (cols.length < 2) cols = line.split(','); 
      if (cols.length < 2) cols = line.split(/\s{2,}/); 

      // ถ้าเป็นบรรทัดแรกและเป็นชื่อหัวคอลัมน์ให้ข้ามไป
      if (i === 0 && (cols[0].includes('รหัส') || cols[1]?.includes('ชื่อ'))) {
        continue;
      }

      if (cols.length >= 2) {
        formattedData.push({
          id: cols[0].trim(),
          name: cols[1].trim(),
          room: cols[2] ? cols[2].trim() : "-"
        });
      }
    }

    if (formattedData.length === 0) {
      alert("ไม่พบรูปแบบข้อมูลที่ถูกต้อง กรุณาวางข้อมูลที่มีอย่างน้อย 2 คอลัมน์ (รหัส, ชื่อ)");
      return;
    }

    startTransition(async () => {
      const res = await importStudentsToCourse(course.id, formattedData);
      if (res.success) {
         alert(`เพิ่มนักเรียนสำเร็จ ${res.count} คน`);
         setShowPasteModal(false);
         setPasteText("");
      } else {
         alert(`เพิ่มไม่สำเร็จ: ${res.error}`);
      }
    });
  };

  // การบันทึกคะแนน (Auto-save) เมื่อครูพิมพ์และเปลี่ยนช่อง
  const handleScoreChange = async (studentId: string, categoryId: string, value: string, maxScore: number, target: HTMLInputElement) => {
    let isBlank = value.trim() === "";
    let numVal = parseFloat(value) || 0;
    
    if (numVal > maxScore) {
      alert(`⚠️ แจ้งเตือน: กรอกคะแนน (${numVal}) เกินคะแนนเต็ม (${maxScore} คะแนน)\nระบบได้ปรับเป็นคะแนนสูงสุดให้อัตโนมัติ`);
      numVal = maxScore;
    }
    if (numVal < 0) numVal = 0;
    
    // อัปเดตตัวเลขในช่องกรอกให้ถูกต้อง
    if (target) {
      target.value = isBlank && numVal === 0 ? "" : numVal.toString();
    }
    
    setLocalOverrides(prev => ({
      ...prev,
      [`${studentId}_${categoryId}`]: numVal
    }));
    
    await updateStudentScore(studentId, course.id, categoryId, numVal);
  };

  const calculateGrade = (total: number) => {
    if (total >= 80) return "4";
    if (total >= 75) return "3.5";
    if (total >= 70) return "3";
    if (total >= 65) return "2.5";
    if (total >= 60) return "2";
    if (total >= 55) return "1.5";
    if (total >= 50) return "1";
    return "0";
  };

  // ระบบนำทางด้วยคีย์บอร์ด (ลูกศรขึ้น/ลง/ซ้าย/ขวา และ Enter) แบบ Excel
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, rowIndex: number, colIndex: number) => {
    let nextRow = rowIndex;
    let nextCol = colIndex;

    switch (e.key) {
      case 'ArrowDown':
      case 'Enter':
        nextRow = rowIndex + 1;
        e.preventDefault(); // ป้องกันไม่ให้เลื่อนจอ หรือเพิ่ม/ลดตัวเลข
        break;
      case 'ArrowUp':
        nextRow = rowIndex - 1;
        e.preventDefault();
        break;
      case 'ArrowRight':
        nextCol = colIndex + 1;
        break;
      case 'ArrowLeft':
        nextCol = colIndex - 1;
        break;
      default:
        return; 
    }

    if (nextRow !== rowIndex || nextCol !== colIndex) {
      const nextInput = document.querySelector(`input[data-row="${nextRow}"][data-col="${nextCol}"]`) as HTMLInputElement;
      if (nextInput) {
        nextInput.focus();
        nextInput.select(); // คลุมดำตัวเลขทันทีที่เปลี่ยนช่อง (เพื่อพิมพ์ทับได้เลย)
      }
    }
  };

  const handleAddColumn = () => {
    if (!newColName.trim() || !newColMax) return;
    const maxScore = parseFloat(newColMax);
    if (maxScore <= 0) return;

    startTransition(async () => {
      const res = await addScoreColumn(course.id, newColName, maxScore, newColTerm, newColRooms.length === availableRooms.length ? "all" : JSON.stringify(newColRooms));
      if (res.success) {
        setShowAddColModal(false);
        setNewColName("");
        setNewColMax("");
        setNewColRooms(availableRooms);
      } else {
        alert(`เพิ่มช่องคะแนนไม่สำเร็จ: ${res.error}`);
      }
    });
  };

  const handleDeleteColumn = (categoryId: string, name: string) => {
    if (!window.confirm(`คุณแน่ใจหรือไม่ว่าต้องการลบช่องคะแนน "${name}"?\n(คะแนนของนักเรียนทุกคนในช่องนี้จะถูกลบไปด้วยและไม่สามารถกู้คืนได้)`)) return;
    
    startTransition(async () => {
      const res = await deleteScoreColumn(categoryId, course.id);
      if (!res.success) alert(`ลบไม่สำเร็จ: ${res.error}`);
    });
  };

  
  const exportToExcel = () => {
    // 1. หัวตาราง (Headers)
    const dataHeaders = [
      "ลำดับ", 
      "รหัสนักเรียน", 
      "ชื่อ-นามสกุล", 
      ...term1Categories.map((c: any) => `(T1) ${c.name} (${c.maxScore})`), 
      "รวมเทอม 1",
      ...term2Categories.map((c: any) => `(T2) ${c.name} (${c.maxScore})`),
      "รวมเทอม 2",
      "รวมทั้งหมด",
      "เกรด"
    ];

    // 2. ข้อมูลนักเรียน (Data Rows)
    const rows = filteredStudents.map((student: any, idx: number) => {
      let t1Total = 0;
      let t2Total = 0;
      
      const t1Scores = term1Categories.map((c: any) => {
        const val = localOverrides[`${student.id}_${c.id}`] ?? student.scoreMap[c.id] ?? 0;
        const isApplicable = c.applicableRooms === "all" || (c.applicableRooms && JSON.parse(c.applicableRooms).includes(student.room));
        if(isApplicable) t1Total += val;
        return isApplicable ? val : "-";
      });
      
      const t2Scores = term2Categories.map((c: any) => {
        const val = localOverrides[`${student.id}_${c.id}`] ?? student.scoreMap[c.id] ?? 0;
        const isApplicable = c.applicableRooms === "all" || (c.applicableRooms && JSON.parse(c.applicableRooms).includes(student.room));
        if(isApplicable) t2Total += val;
        return isApplicable ? val : "-";
      });

      const total = t1Total + t2Total;
      let grade = "0";
      if (total >= 80) grade = "4";
      else if (total >= 75) grade = "3.5";
      else if (total >= 70) grade = "3";
      else if (total >= 65) grade = "2.5";
      else if (total >= 60) grade = "2";
      else if (total >= 55) grade = "1.5";
      else if (total >= 50) grade = "1";

      return [
        idx + 1,
        student.studentId,
        student.name,
        ...t1Scores,
        t1Total,
        ...t2Scores,
        t2Total,
        total,
        grade
      ];
    });

    // 3. จัดฟอร์มเอกสารมาตรฐาน (Top Titles)
    const roomText = selectedRoom === 'all' ? 'รวมทุกห้อง' : `ห้อง ${selectedRoom}`;
    const finalData = [
      ["แบบรายงานผลการพัฒนาคุณภาพผู้เรียนรายวิชา (ปพ.5)"],
      [`รหัสวิชา: ${course.code}      ชื่อวิชา: ${course.name}      ปีการศึกษา: ${course.year}`],
      [`ชั้นเรียน: ${roomText}      หน่วยกิต: ${course.credits}`],
      [], // Blank row
      dataHeaders,
      ...rows
    ];

    const ws = XLSX.utils.aoa_to_sheet(finalData);

    // 4. ตั้งค่าความกว้างคอลัมน์ (Column Widths)
    const colWidths = [
      { wch: 8 },  // ลำดับ
      { wch: 15 }, // รหัสนักเรียน
      { wch: 30 }, // ชื่อ-นามสกุล
    ];
    // เพิ่มความกว้างให้คอลัมน์คะแนน
    for (let i = 3; i < dataHeaders.length; i++) {
      colWidths.push({ wch: 12 });
    }
    ws['!cols'] = colWidths;

    // 5. ผสานเซลล์หัวตาราง (Merge Title Cells)
    const totalCols = dataHeaders.length;
    ws['!merges'] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: totalCols - 1 } }, // Title 1
      { s: { r: 1, c: 0 }, e: { r: 1, c: totalCols - 1 } }, // Title 2
      { s: { r: 2, c: 0 }, e: { r: 2, c: totalCols - 1 } }, // Title 3
    ];

    // 6. สร้างไฟล์และดาวน์โหลด
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "แบบบันทึกผลการเรียน");
    
    // ตั้งชื่อไฟล์ให้ดูเป็นทางการ
    const fileName = `แบบบันทึกผลการเรียน_${course.code}_${roomText.replace('/', '-')}.xlsx`;
    XLSX.writeFile(wb, fileName);
  };

  return (

    <div className="max-w-[1400px] mx-auto space-y-6 pb-12">
      <div className="flex justify-between items-end">
        <div className="space-y-1">
          <Link href="/courses" className="text-sm text-gray-400 hover:text-gray-600 mb-2 inline-block">
            ← กลับไปหน้ารายวิชา
          </Link>
          <div className="flex items-center space-x-4 mt-2">
            <h1 className="text-2xl font-bold text-gray-900">กรอกคะแนน: {course.name} ({course.code})</h1>
            {availableRooms.length > 0 && (
              <select 
                value={selectedRoom}
                onChange={(e) => setSelectedRoom(e.target.value)}
                className="bg-white border border-gray-300 text-gray-700 py-1.5 px-3 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none shadow-sm cursor-pointer"
              >
                <option value="all">แสดงทุกห้องเรียน</option>
                {availableRooms.map((r: string) => (
                  <option key={r} value={r}>ห้อง {r}</option>
                ))}
              </select>
            )}
            <button
              onClick={exportToExcel}
              className="flex items-center space-x-1.5 bg-white border border-gray-300 text-gray-700 py-1.5 px-3 rounded-lg text-sm hover:bg-gray-50 focus:ring-2 focus:ring-emerald-500 outline-none shadow-sm transition-colors"
            >
              <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              <span>ดาวน์โหลด Excel</span>
            </button>

          </div>
        </div>
        
        <div className="flex space-x-3">
          <input 
            type="file" 
            accept=".xlsx, .xls, .csv" 
            className="hidden" 
            ref={fileInputRef}
            onChange={handleFileUpload}
          />
          <button 
            onClick={() => setShowPasteModal(true)}
            disabled={isPending}
            className="flex items-center space-x-2 px-4 py-2 bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 rounded-lg font-medium shadow-sm transition-all"
          >
            <span>📋 วางรายชื่อ (Copy/Paste)</span>
          </button>
          <button 
            onClick={() => fileInputRef.current?.click()}
            disabled={isPending}
            className="flex items-center space-x-2 px-4 py-2 bg-green-50 text-green-700 border border-green-200 hover:bg-green-100 rounded-lg font-medium shadow-sm transition-all"
          >
            <span>📥 นำเข้าจาก Excel</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 rounded-lg font-medium shadow-sm transition-all">
            <span>📤 ส่งออก ปพ.5</span>
          </button>
        </div>
      </div>

      {/* Modal ก๊อปปี้/วาง รายชื่อ */}
      {showPasteModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-3xl animate-in fade-in zoom-in duration-200">
            <h3 className="text-xl font-bold text-gray-900 mb-2">เพิ่มรายชื่อนักเรียนด้วยการ Copy & Paste</h3>
            <p className="text-sm text-gray-500 mb-4">
              คุณครูสามารถคลุมดำข้อมูลจาก Excel หรือ Word แล้วนำมาวางที่นี่ได้เลย 
              โดยระบบจะอ่านตามคอลัมน์: <span className="font-semibold text-gray-700">รหัสประจำตัว | ชื่อ-นามสกุล | ห้องเรียน</span> (ห้องเรียนไม่บังคับ)
            </p>
            <textarea
              value={pasteText}
              onChange={(e) => setPasteText(e.target.value)}
              rows={12}
              className="w-full border border-gray-300 rounded-xl p-4 text-sm font-mono focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none whitespace-pre"
              placeholder={`ตัวอย่างการวางข้อมูล:\n67001\tด.ช.สมชาย ใจดี\tป.1/1\n67002\tด.ญ.สมหญิง สวยงาม\tป.1/1\n67003\tด.ช.ใจดี รักเรียน`}
            ></textarea>
            <div className="mt-6 flex justify-end space-x-3">
              <button 
                onClick={() => {
                  setShowPasteModal(false);
                  setPasteText("");
                }} 
                className="px-5 py-2.5 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition-colors"
              >
                ยกเลิก
              </button>
              <button 
                onClick={handlePasteImport}
                disabled={isPending || !pasteText.trim()}
                className="px-6 py-2.5 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 disabled:bg-emerald-300 shadow-sm transition-all"
              >
                {isPending ? "กำลังเพิ่มรายชื่อ..." : "ยืนยันการเพิ่มรายชื่อ"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal เพิ่มช่องคะแนนด่วน */}
      {showAddColModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-sm animate-in fade-in zoom-in duration-200">
            <h3 className="text-xl font-bold text-gray-900 mb-1">เพิ่มช่องคะแนนใหม่</h3>
            <p className="text-sm text-gray-500 mb-4">เทอม {newColTerm}</p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ชื่อหัวข้องาน</label>
                <input 
                  type="text" 
                  value={newColName}
                  onChange={(e) => setNewColName(e.target.value)}
                  placeholder="เช่น ใบงาน 1, สอบย่อย"
                  className="w-full border border-gray-300 rounded-xl p-2.5 text-sm text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-emerald-500 outline-none font-medium bg-white shadow-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">คะแนนเต็ม</label>
                <input 
                  type="number" 
                  value={newColMax}
                  onChange={(e) => setNewColMax(e.target.value)}
                  placeholder="เช่น 10, 20"
                  className="w-full border border-gray-300 rounded-xl p-2.5 text-sm text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-emerald-500 outline-none font-medium bg-white shadow-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 mt-4 border-t pt-4">เลือกห้องที่จะเพิ่มช่องคะแนน</label>
                <div className="grid grid-cols-2 gap-2 mt-2 bg-gray-50 p-3 rounded-lg border border-gray-100">
                  <label className="flex items-center space-x-2 text-sm cursor-pointer">
                    <input type="checkbox" checked={newColRooms.length === availableRooms.length} onChange={(e) => {
                      if (e.target.checked) setNewColRooms(availableRooms);
                      else setNewColRooms([]);
                    }} className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4" />
                    <span className="font-medium text-gray-800">ทุกห้อง</span>
                  </label>
                  {availableRooms.map(r => (
                    <label key={r} className="flex items-center space-x-2 text-sm cursor-pointer">
                      <input type="checkbox" checked={newColRooms.includes(r)} onChange={(e) => {
                        if (e.target.checked) setNewColRooms([...newColRooms, r]);
                        else setNewColRooms(newColRooms.filter(room => room !== r));
                      }} className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4" />
                      <span className="text-gray-700">{r}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button 
                onClick={() => {
                  setShowAddColModal(false);
                  setNewColName("");
                  setNewColMax("");
        setNewColRooms(availableRooms);
                }} 
                className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition-colors"
              >
                ยกเลิก
              </button>
              <button 
                onClick={handleAddColumn}
                disabled={isPending || !newColName.trim() || !newColMax}
                className="px-4 py-2 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 disabled:bg-emerald-300 transition-all"
              >
                {isPending ? "กำลังบันทึก..." : "ยืนยันการเพิ่ม"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-gray-100 border-b border-gray-200 text-sm text-gray-700 divide-x divide-gray-200">
                <th colSpan={3} className="px-4 py-2 text-center bg-gray-50">ข้อมูลนักเรียน</th>
                <th colSpan={term1Categories.length + 2} className="px-4 py-2 text-center bg-emerald-50">เทอม 1 ({t1Max} คะแนน)</th>
                <th colSpan={term2Categories.length + 2} className="px-4 py-2 text-center bg-teal-50">เทอม 2 ({t2Max} คะแนน)</th>
                <th colSpan={2} className="px-4 py-2 text-center bg-gray-200">สรุปผลรวม</th>
              </tr>
              <tr className="bg-gray-50 border-b border-gray-200 text-xs text-gray-600 divide-x divide-gray-200">
                <th className="px-4 py-3 font-medium text-center w-12">ลำดับ</th>
                <th className="px-4 py-3 font-medium w-24">รหัส</th>
                <th className="px-4 py-3 font-medium min-w-[200px]">ชื่อ-นามสกุล</th>
                
                {term1Categories.map((cat: any) => (
                  <th key={cat.id} className="px-4 py-2 font-medium text-center bg-emerald-50/50 relative group min-w-[80px]">
                    <button 
                      onClick={() => handleDeleteColumn(cat.id, cat.name)}
                      disabled={isPending}
                      className="absolute top-1 right-1 text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity p-1 bg-emerald-50 rounded-full hover:bg-red-50"
                      title="ลบช่องคะแนน"
                    >
                      ✕
                    </button>
                    <div className="mt-3">{cat.name}</div>
                    <div className="text-emerald-600 font-bold">({cat.maxScore})</div>
                  </th>
                ))}
                <th className="px-2 py-2 text-center bg-emerald-50/30">
                  <button onClick={() => { setNewColTerm(1); setShowAddColModal(true); setNewColRooms(availableRooms); }} className="text-[10px] bg-emerald-100 hover:bg-emerald-200 text-emerald-700 font-medium px-2 py-1 rounded w-full border border-emerald-200 transition-colors">
                    + เพิ่มงาน
                  </button>
                </th>
                <th className="px-4 py-3 font-medium text-center bg-emerald-100/50 text-emerald-800">รวม T1</th>
                
                {term2Categories.map((cat: any) => (
                  <th key={cat.id} className="px-4 py-2 font-medium text-center bg-teal-50/50 relative group min-w-[80px]">
                    <button 
                      onClick={() => handleDeleteColumn(cat.id, cat.name)}
                      disabled={isPending}
                      className="absolute top-1 right-1 text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity p-1 bg-teal-50 rounded-full hover:bg-red-50"
                      title="ลบช่องคะแนน"
                    >
                      ✕
                    </button>
                    <div className="mt-3">{cat.name}</div>
                    <div className="text-teal-600 font-bold">({cat.maxScore})</div>
                  </th>
                ))}
                <th className="px-2 py-2 text-center bg-teal-50/30">
                  <button onClick={() => { setNewColTerm(2); setShowAddColModal(true); setNewColRooms(availableRooms); }} className="text-[10px] bg-teal-100 hover:bg-teal-200 text-teal-700 font-medium px-2 py-1 rounded w-full border border-teal-200 transition-colors">
                    + เพิ่มงาน
                  </button>
                </th>
                <th className="px-4 py-3 font-medium text-center bg-teal-100/50 text-teal-800">รวม T2</th>
                
                <th className="px-4 py-3 font-bold text-center bg-gray-100">รวมทั้งสิ้น</th>
                <th className="px-4 py-3 font-bold text-center bg-gray-100">เกรด</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={15} className="px-6 py-16 text-center text-gray-400">
                    <p className="mb-2">ยังไม่มีรายชื่อนักเรียนในวิชานี้ หรือห้องที่เลือก</p>
                    <p className="text-xs">กรุณากดปุ่ม <span className="font-semibold">"📋 วางรายชื่อ (Copy/Paste)"</span> หรือ <span className="font-semibold">"📥 นำเข้าจาก Excel"</span> ด้านบน</p>
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student: any, idx: number) => {
                  let t1Total = 0;
                  let t2Total = 0;

                  return (
                    <tr key={student.id} className="hover:bg-emerald-50/30 transition-colors divide-x divide-gray-100 text-sm">
                      <td className="px-4 py-2 text-center text-gray-500">{idx + 1}</td>
                      <td className="px-4 py-2 text-gray-500">{student.studentId}</td>
                      <td className="px-4 py-2 font-medium text-gray-900">{student.name}</td>
                      
                      {term1Categories.map((cat: any, cIdx: number) => {
                        const isApplicable = cat.applicableRooms === "all" || (cat.applicableRooms && JSON.parse(cat.applicableRooms).includes(student.room));
                        const val = localOverrides[`${student.id}_${cat.id}`] ?? student.scoreMap[cat.id] ?? 0;
                        if(isApplicable) t1Total += val;
                        return (
                          <td key={cat.id} className="p-0">
                            {isApplicable ? (
                            <input 
                              type="number" 
                              data-row={idx}
                              data-col={cIdx}
                              defaultValue={val === 0 ? '' : val} 
                              max={cat.maxScore}
                              onBlur={(e) => handleScoreChange(student.id, cat.id, e.target.value, cat.maxScore, e.target)}
                              onKeyDown={(e) => handleKeyDown(e, idx, cIdx)}
                              className="w-full h-full min-h-[44px] text-center bg-transparent border-0 focus:ring-2 focus:ring-inset focus:ring-emerald-500 outline-none text-gray-800" 
                            />
                            ) : (
                              <div className="w-full h-full min-h-[44px] flex items-center justify-center bg-gray-50 text-gray-300 text-xs">-</div>
                            )}
                          </td>
                        );
                      })}
                      <td className="bg-gray-50/30 border-r border-dashed border-gray-200"></td>
                      <td className="px-4 py-2 text-center font-bold text-emerald-700 bg-emerald-50/30">{t1Total}</td>
                      
                      {term2Categories.map((cat: any, cIdx: number) => {
                        const actualColIdx = term1Categories.length + cIdx;
                        const isApplicable = cat.applicableRooms === "all" || (cat.applicableRooms && JSON.parse(cat.applicableRooms).includes(student.room));
                        const val = localOverrides[`${student.id}_${cat.id}`] ?? student.scoreMap[cat.id] ?? 0;
                        if(isApplicable) t2Total += val;
                        return (
                          <td key={cat.id} className="p-0">
                            {isApplicable ? (
                            <input 
                              type="number" 
                              data-row={idx}
                              data-col={actualColIdx}
                              defaultValue={val === 0 ? '' : val} 
                              max={cat.maxScore}
                              onBlur={(e) => handleScoreChange(student.id, cat.id, e.target.value, cat.maxScore, e.target)}
                              onKeyDown={(e) => handleKeyDown(e, idx, actualColIdx)}
                              className="w-full h-full min-h-[44px] text-center bg-transparent border-0 focus:ring-2 focus:ring-inset focus:ring-emerald-500 outline-none text-gray-800" 
                            />
                            ) : (
                              <div className="w-full h-full min-h-[44px] flex items-center justify-center bg-gray-50 text-gray-300 text-xs">-</div>
                            )}
                          </td>
                        );
                      })}
                      <td className="bg-gray-50/30 border-r border-dashed border-gray-200"></td>
                      <td className="px-4 py-2 text-center font-bold text-teal-700 bg-teal-50/30">{t2Total}</td>
                      
                      <td className="px-4 py-2 text-center font-bold text-gray-800 bg-gray-50/50">
                        {t1Total + t2Total}
                      </td>
                      <td className="px-4 py-2 text-center font-bold text-emerald-600 bg-gray-50/50 text-base">
                        {calculateGrade(t1Total + t2Total)}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        
        <div className="p-4 border-t border-gray-200 bg-gray-50 flex justify-between items-center text-sm text-gray-500">
          <span>แสดงนักเรียนทั้งหมด {filteredStudents.length} คน</span>
          <span className="text-green-600 flex items-center space-x-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
            <span>ระบบบันทึกคะแนนอัตโนมัติเมื่อพิมพ์เสร็จ</span>
          </span>
        </div>
      </div>
    </div>
  );
}
