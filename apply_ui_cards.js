const fs = require('fs');

let file = 'src/components/courses/ScoreTable.tsx';
let c = fs.readFileSync(file, 'utf8');

const targetStart = `<div className="max-w-[1400px] mx-auto space-y-6 pb-12 px-4 sm:px-6">`;
const targetEnd = `      {/* Modal ก๊อปปี้/วาง รายชื่อ */}`;

const oldCodeStart = c.indexOf(targetStart);
const oldCodeEnd = c.indexOf(targetEnd);

const replacement = `<div className="max-w-[1400px] mx-auto space-y-6 pb-12 px-4 sm:px-6">
      <div className="flex flex-col gap-6">
        <div className="space-y-1 w-full">
          <Link href="/courses" className="text-sm text-gray-400 hover:text-gray-600 mb-2 inline-block">
            ← กลับไปหน้ารายวิชา
          </Link>
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 mt-2">
            <h1 className="text-2xl font-bold text-gray-900">กรอกคะแนน: {course.name} ({course.code})</h1>
            {availableRooms.length > 0 && (
              <select 
                value={selectedRoom}
                onChange={(e) => setSelectedRoom(e.target.value)}
                className="bg-white border border-gray-300 text-gray-700 py-1.5 px-3 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none shadow-sm cursor-pointer w-fit"
              >
                <option value="all">แสดงทุกห้องเรียน</option>
                {availableRooms.map((r: string) => (
                  <option key={r} value={r}>ห้อง {r}</option>
                ))}
              </select>
            )}
          </div>
        </div>
        
        {/* Action Buttons Scrollable Row */}
        <div className="flex flex-nowrap overflow-x-auto pb-4 gap-3 w-full snap-x hide-scrollbar" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          <button
            onClick={exportToExcel}
            className="min-w-[120px] flex-shrink-0 flex flex-col items-center justify-center gap-2 p-4 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 focus:ring-2 focus:ring-emerald-500 outline-none shadow-sm transition-colors snap-start"
          >
            <span className="text-2xl">📊</span>
            <span className="text-sm font-medium text-center">ดาวน์โหลด<br/>Excel</span>
          </button>
          
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
            className="min-w-[120px] flex-shrink-0 flex flex-col items-center justify-center gap-2 p-4 bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 rounded-xl font-medium shadow-sm transition-all snap-start disabled:opacity-50"
          >
            <span className="text-2xl">📋</span>
            <span className="text-sm font-medium text-center">วางรายชื่อ<br/>(Copy/Paste)</span>
          </button>
          
          <button 
            onClick={() => fileInputRef.current?.click()}
            disabled={isPending}
            className="min-w-[120px] flex-shrink-0 flex flex-col items-center justify-center gap-2 p-4 bg-green-50 text-green-700 border border-green-200 hover:bg-green-100 rounded-xl font-medium shadow-sm transition-all snap-start disabled:opacity-50"
          >
            <span className="text-2xl">📥</span>
            <span className="text-sm font-medium text-center">นำเข้าจาก<br/>Excel</span>
          </button>
          
          <button 
            onClick={handleClearAllStudents}
            disabled={isPending || students.length === 0}
            className="min-w-[120px] flex-shrink-0 flex flex-col items-center justify-center gap-2 p-4 bg-red-50 text-red-500 border border-red-100 hover:bg-red-100 rounded-xl font-medium shadow-sm transition-all snap-start disabled:opacity-50 disabled:cursor-not-allowed"
            title="ลบนักเรียนและคะแนนทั้งหมดในวิชานี้เพื่อเริ่มใหม่"
          >
            <span className="text-2xl opacity-80">🗑️</span>
            <span className="text-sm font-medium text-center">ล้างรายชื่อ<br/>ทั้งหมด</span>
          </button>
        </div>
      </div>

`;

const newCode = c.substring(0, oldCodeStart) + replacement + c.substring(oldCodeEnd);
fs.writeFileSync(file, newCode);
console.log('Fixed button UI layout successfully');
