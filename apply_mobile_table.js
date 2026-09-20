const fs = require('fs');
let file = 'src/components/courses/ScoreTable.tsx';
let c = fs.readFileSync(file, 'utf8');

c = c.replace(
  '<th colSpan={3} className="px-4 py-2 text-center bg-gray-50">ข้อมูลนักเรียน</th>',
  '<th className="px-4 py-2 text-center bg-gray-50 w-12 hidden sm:table-cell">ลำดับ</th>\n                <th className="px-4 py-2 text-center bg-gray-50 w-24 hidden sm:table-cell">รหัส</th>\n                <th className="px-4 py-2 text-center bg-gray-50 sticky left-0 z-20 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">ข้อมูลนักเรียน</th>'
);

c = c.replace(
  '<th className="px-4 py-3 font-medium text-center w-12">ลำดับ</th>\n                <th className="px-4 py-3 font-medium w-24">รหัส</th>\n                <th className="px-4 py-3 font-medium min-w-[200px]">ชื่อ-นามสกุล</th>',
  '<th className="px-4 py-3 font-medium text-center w-12 hidden sm:table-cell">ลำดับ</th>\n                <th className="px-4 py-3 font-medium w-24 hidden sm:table-cell">รหัส</th>\n                <th className="px-4 py-3 font-medium min-w-[140px] sm:min-w-[200px] sticky left-0 z-20 bg-gray-50 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">ชื่อ-นามสกุล</th>'
);

c = c.replace(
  '<td className="px-4 py-2 text-center text-gray-500">{idx + 1}</td>\n                      <td className="px-4 py-2 text-gray-500">{student.studentId}</td>\n                      <td className="px-4 py-2 font-medium text-gray-900">{student.name}</td>',
  '<td className="px-4 py-2 text-center text-gray-500 hidden sm:table-cell">{idx + 1}</td>\n                      <td className="px-4 py-2 text-gray-500 hidden sm:table-cell">{student.studentId}</td>\n                      <td className="px-4 py-2 font-medium text-gray-900 sticky left-0 z-10 bg-white shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)] transition-colors">\n                        <div className="flex flex-col">\n                          <span>{student.name}</span>\n                          <span className="text-[10px] text-gray-400 sm:hidden">รหัส: {student.studentId}</span>\n                        </div>\n                      </td>'
);

c = c.replace(
  '<div className="p-4 border-t border-gray-200 bg-gray-50 flex justify-between items-center text-sm text-gray-500">\n          <span>แสดงนักเรียนทั้งหมด {filteredStudents.length} คน</span>\n          <span className="text-green-600 flex items-center space-x-1">\n            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>\n            <span>ระบบบันทึกคะแนนอัตโนมัติเมื่อพิมพ์เสร็จ</span>\n          </span>\n        </div>',
  '<div className="p-4 border-t border-gray-200 bg-gray-50 flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-0 text-sm text-gray-500">\n          <span>แสดงนักเรียนทั้งหมด {filteredStudents.length} คน</span>\n          <span className="text-green-600 flex items-center space-x-1 bg-green-50/50 sm:bg-transparent px-3 py-1 sm:p-0 rounded-full sm:rounded-none">\n            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>\n            <span>ระบบบันทึกคะแนนอัตโนมัติเมื่อพิมพ์เสร็จ</span>\n          </span>\n        </div>'
);

fs.writeFileSync(file, c);
console.log('Mobile layout changes applied successfully');
