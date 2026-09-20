const fs = require('fs');
let file = 'src/components/courses/ScoreTable.tsx';
let c = fs.readFileSync(file, 'utf8');

function escapeRegex(string) {
    return string.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
}

function replaceIgnoreSpaces(text, search, replaceStr) {
    // Convert newlines and multiple spaces to a regex that matches any whitespace/newlines
    const searchRegexStr = search
        .split('\n')
        .map(s => escapeRegex(s.trim()))
        .join('\\s+');
    
    const regex = new RegExp(searchRegexStr, 'g');
    return text.replace(regex, replaceStr);
}

// Fix 1: Table headers
const old1 = `<th className="px-4 py-3 font-medium text-center w-12">ลำดับ</th>
<th className="px-4 py-3 font-medium w-24">รหัส</th>
<th className="px-4 py-3 font-medium min-w-[200px]">ชื่อ-นามสกุล</th>`;

const new1 = `<th className="px-4 py-3 font-medium text-center w-12 hidden sm:table-cell">ลำดับ</th>
                <th className="px-4 py-3 font-medium w-24 hidden sm:table-cell">รหัส</th>
                <th className="px-4 py-3 font-medium min-w-[140px] sm:min-w-[200px] sticky left-0 z-20 bg-gray-50 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">ชื่อ-นามสกุล</th>`;

c = replaceIgnoreSpaces(c, old1, new1);

// Fix 2: Table body
const old2 = `<tr key={student.id} className="hover:bg-emerald-50/30 transition-colors divide-x divide-gray-100 text-sm">
<td className="px-4 py-2 text-center text-gray-500">{idx + 1}</td>
<td className="px-4 py-2 text-gray-500">{student.studentId}</td>
<td className="px-4 py-2 font-medium text-gray-900">{student.name}</td>`;

const new2 = `<tr key={student.id} className="hover:bg-emerald-50/30 transition-colors divide-x divide-gray-100 text-sm group/row">
                      <td className="px-4 py-2 text-center text-gray-500 hidden sm:table-cell">{idx + 1}</td>
                      <td className="px-4 py-2 text-gray-500 hidden sm:table-cell">{student.studentId}</td>
                      <td className="px-4 py-2 font-medium text-gray-900 sticky left-0 z-10 bg-white group-hover/row:bg-emerald-50/50 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)] transition-colors">
                        <div className="flex flex-col">
                          <span>{student.name}</span>
                          <span className="text-[10px] text-gray-400 sm:hidden">รหัส: {student.studentId}</span>
                        </div>
                      </td>`;

c = replaceIgnoreSpaces(c, old2, new2);

// Fix 3: Table footer
const old3 = `<div className="p-4 border-t border-gray-200 bg-gray-50 flex justify-between items-center text-sm text-gray-500">
<span>แสดงนักเรียนทั้งหมด {filteredStudents.length} คน</span>
<span className="text-green-600 flex items-center space-x-1">
<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
<span>ระบบบันทึกคะแนนอัตโนมัติเมื่อพิมพ์เสร็จ</span>
</span>
</div>`;

const new3 = `<div className="p-4 border-t border-gray-200 bg-gray-50 flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-0 text-sm text-gray-500">
          <span>แสดงนักเรียนทั้งหมด {filteredStudents.length} คน</span>
          <span className="text-green-600 flex items-center space-x-1 bg-green-50/50 sm:bg-transparent px-3 py-1 sm:p-0 rounded-full sm:rounded-none">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
            <span>ระบบบันทึกคะแนนอัตโนมัติเมื่อพิมพ์เสร็จ</span>
          </span>
        </div>`;

c = replaceIgnoreSpaces(c, old3, new3);

fs.writeFileSync(file, c);
console.log('Mobile layout changes applied successfully');
