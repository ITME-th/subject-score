const fs = require('fs');

let file = 'src/components/courses/ScoreTable.tsx';
let c = fs.readFileSync(file, 'utf8');

// 1. Ensure removeAllStudentsFromCourse is imported
if (!c.includes('removeAllStudentsFromCourse')) {
  c = c.replace(
    'import { importStudentsToCourse } from "@/app/actions/student";',
    'import { importStudentsToCourse, removeAllStudentsFromCourse } from "@/app/actions/student";'
  );
}

// 2. Add handleClearAllStudents function
if (!c.includes('handleClearAllStudents')) {
  const handlerCode = `
  const handleClearAllStudents = () => {
    if (!window.confirm("⚠️ ยืนยันการลบรายชื่อนักเรียนทั้งหมดในวิชานี้?\\n\\n(คะแนนที่เคยกรอกไว้จะถูกลบทั้งหมดและไม่สามารถกู้คืนได้)")) return;
    
    startTransition(async () => {
      try {
        const res = await removeAllStudentsFromCourse(course.id);
        if (res.success) alert("ลบรายชื่อนักเรียนทั้งหมดสำเร็จ");
        else alert("เกิดข้อผิดพลาด: " + res.error);
      } catch(e) {
        alert("เกิดข้อผิดพลาด");
      }
    });
  };

  `;
  
  c = c.replace(
    '// การบันทึกคะแนน (Auto-save) เมื่อครูพิมพ์และเปลี่ยนช่อง',
    handlerCode + '// การบันทึกคะแนน (Auto-save) เมื่อครูพิมพ์และเปลี่ยนช่อง'
  );
}

// 3. Add the clear button to the UI
if (!c.includes('ล้างรายชื่อทั้งหมด')) {
  const buttonCode = `
          <button 
            onClick={handleClearAllStudents}
            disabled={isPending || students.length === 0}
            className="flex items-center space-x-2 px-4 py-2 bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-medium shadow-sm transition-all"
            title="ลบนักเรียนและคะแนนทั้งหมดในวิชานี้เพื่อเริ่มใหม่"
          >
            <span>🗑️ ล้างรายชื่อทั้งหมด</span>
          </button>
`;
  
  const searchStr = '<span>📤 ส่งออก ปพ.5</span>\n          </button>';
  c = c.replace(searchStr, searchStr + buttonCode);
}

fs.writeFileSync(file, c);
console.log('Added Clear All Students button correctly');
