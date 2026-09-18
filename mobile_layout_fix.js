const fs = require('fs');

// 1. Refactor CourseRowActions.tsx to return a div instead of td
let actionsFile = 'src/components/courses/CourseRowActions.tsx';
let actionsCode = fs.readFileSync(actionsFile, 'utf8');
actionsCode = actionsCode.replace(
  '<td className="px-6 py-5 text-right space-x-2">',
  '<div className="flex items-center justify-end space-x-2">'
).replace(
  '</Link>\n    </td>',
  '</Link>\n    </div>'
);
fs.writeFileSync(actionsFile, actionsCode);

// 2. Refactor courses/page.tsx for responsive layout
let coursesPageFile = 'src/app/(dashboard)/courses/page.tsx';
let coursesCode = fs.readFileSync(coursesPageFile, 'utf8');

// Update header responsive layout
coursesCode = coursesCode.replace(
  '<div className="flex justify-between items-end">',
  '<div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">'
);
coursesCode = coursesCode.replace(
  '<Link \n          href="/courses/create" \n          className="flex items-center space-x-2 px-5 py-2.5 bg-emerald-600',
  '<Link \n          href="/courses/create" \n          className="w-full md:w-auto justify-center flex items-center space-x-2 px-5 py-2.5 bg-emerald-600'
);

// Modify the table wrapping
let tableStartIdx = coursesCode.indexOf('<div className="overflow-x-auto">');
let tableEndIdx = coursesCode.indexOf('</div>\n      </div>\n    </div>');

let originalTableDiv = coursesCode.substring(tableStartIdx, tableEndIdx + 6); // include closing </div>
let newTableCode = originalTableDiv.replace(
  '<table className="w-full text-left border-collapse min-w-[900px]">',
  '<table className="hidden md:table w-full text-left border-collapse min-w-[900px]">'
);

// We need to fix the CourseRowActions call in the table
newTableCode = newTableCode.replace(
  /<CourseRowActions courseId={course\.id} \/>/g,
  '<td className="px-6 py-5"><CourseRowActions courseId={course.id} /></td>'
);

// Add the Mobile Grid view
let mobileGridCode = `
        {/* Mobile View */}
        <div className="md:hidden grid grid-cols-1 gap-4 p-4 bg-gray-50/30">
          {courses.length === 0 ? (
            <div className="flex flex-col items-center justify-center space-y-4 py-12">
               <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-400">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
               </div>
               <p className="text-gray-500 font-medium text-sm text-center">ยังไม่มีรายวิชา<br/>คลิกปุ่ม "+ เพิ่มรายวิชาใหม่"</p>
            </div>
          ) : (
            courses.map((course) => (
              <div key={course.id} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex flex-col space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg leading-tight">{course.code}</h3>
                    <p className="text-emerald-700 font-semibold text-sm mt-1">{course.name}</p>
                  </div>
                  <span className="bg-gray-100 text-gray-600 text-xs px-2.5 py-1 rounded-md font-bold tracking-wider">{course.year}</span>
                </div>
                
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <span className="font-medium bg-gray-50 px-2 py-1 rounded border border-gray-100">หน่วยกิต: {course.credits.toFixed(1)}</span>
                </div>

                <div className="space-y-2 pt-1">
                  <p className="text-xs text-gray-400 font-medium">ห้องเรียนที่สอน:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {course.rooms.length === 0 ? (
                      <span className="text-gray-300 text-sm">-</span>
                    ) : (
                      course.rooms.map(r => (
                        <span key={r.id} className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
                          {r.roomName}
                        </span>
                      ))
                    )}
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-50 mt-2">
                  <CourseRowActions courseId={course.id} />
                </div>
              </div>
            ))
          )}
        </div>
`;

coursesCode = coursesCode.replace(originalTableDiv, newTableCode + '\n' + mobileGridCode + '\n      </div>');
fs.writeFileSync(coursesPageFile, coursesCode);

console.log('Mobile layout for courses completed');
