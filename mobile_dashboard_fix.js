const fs = require('fs');

let dashboardFile = 'src/app/(dashboard)/page.tsx';
let dCode = fs.readFileSync(dashboardFile, 'utf8');

// Find the table and make it hidden on mobile
let tableStart = dCode.indexOf('<table className="w-full text-left">');
if (tableStart !== -1) {
  dCode = dCode.replace(
    '<table className="w-full text-left">',
    '<table className="hidden md:table w-full text-left">'
  );

  // We also need to add mobile view.
  // We'll append it right after the closing </table>
  let tableEnd = dCode.indexOf('</table>', tableStart) + 8;
  
  let mobileView = `
            {/* Mobile View */}
            <div className="md:hidden grid grid-cols-1 divide-y divide-gray-100">
              {recentCourses.map(course => (
                <div key={course.id} className="p-5 flex flex-col space-y-3 hover:bg-gray-50/50 transition-colors">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-gray-900 text-base">{course.code}</h3>
                      <p className="text-gray-600 font-medium text-sm mt-0.5">{course.name}</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-1.5">
                    {course.rooms.length === 0 ? (
                      <span className="text-gray-400 text-xs">-</span>
                    ) : (
                      course.rooms.map(r => (
                        <span key={r.id} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
                          {r.roomName}
                        </span>
                      ))
                    )}
                  </div>
                  
                  <div className="pt-2 flex justify-end">
                    <Link href={\`/courses/\${course.id}/scores\`} className="inline-flex items-center px-4 py-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg text-sm font-semibold transition-colors">
                      กรอกคะแนน
                    </Link>
                  </div>
                </div>
              ))}
            </div>
`;
  
  dCode = dCode.substring(0, tableEnd) + '\n' + mobileView + dCode.substring(tableEnd);
  fs.writeFileSync(dashboardFile, dCode);
  console.log('Mobile layout for dashboard completed');
} else {
  console.log('Table not found or already modified');
}
