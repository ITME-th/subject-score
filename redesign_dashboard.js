const fs = require('fs');
let file = 'src/app/(dashboard)/page.tsx';
let c = fs.readFileSync(file, 'utf8');

const oldCards = `<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm transition-transform hover:-translate-y-1 duration-200">
          <h3 className="text-sm font-medium text-gray-500">จำนวนวิชาที่สอน</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">{totalCourses}</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm transition-transform hover:-translate-y-1 duration-200">
          <h3 className="text-sm font-medium text-gray-500">จำนวนนักเรียนที่ดูแล</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">{uniqueStudents}</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm transition-transform hover:-translate-y-1 duration-200">
          <h3 className="text-sm font-medium text-gray-500">ต้องกรอกคะแนน</h3>
          <p className="text-3xl font-bold text-red-600 mt-2">0 <span className="text-sm font-normal text-gray-500">รายการ</span></p>
        </div>
      </div>`;

const newCards = `<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="relative bg-white p-6 rounded-3xl border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)] transition-all hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] hover:-translate-y-1 duration-300 overflow-hidden group">
          <div className="absolute -right-6 -top-6 w-32 h-32 bg-gradient-to-br from-emerald-50 to-emerald-100/50 rounded-full group-hover:scale-110 transition-transform duration-500 ease-out"></div>
          <div className="relative z-10">
            <div className="flex items-center space-x-3 mb-2">
              <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
              </div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">จำนวนวิชาที่สอน</h3>
            </div>
            <p className="text-4xl font-extrabold text-gray-900 mt-2 tracking-tight">{totalCourses}</p>
          </div>
        </div>
        <div className="relative bg-white p-6 rounded-3xl border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)] transition-all hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] hover:-translate-y-1 duration-300 overflow-hidden group">
          <div className="absolute -right-6 -top-6 w-32 h-32 bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-full group-hover:scale-110 transition-transform duration-500 ease-out"></div>
          <div className="relative z-10">
            <div className="flex items-center space-x-3 mb-2">
              <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
              </div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">จำนวนนักเรียนที่ดูแล</h3>
            </div>
            <p className="text-4xl font-extrabold text-gray-900 mt-2 tracking-tight">{uniqueStudents}</p>
          </div>
        </div>
        <div className="relative bg-white p-6 rounded-3xl border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)] transition-all hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] hover:-translate-y-1 duration-300 overflow-hidden group">
          <div className="absolute -right-6 -top-6 w-32 h-32 bg-gradient-to-br from-red-50 to-red-100/50 rounded-full group-hover:scale-110 transition-transform duration-500 ease-out"></div>
          <div className="relative z-10">
            <div className="flex items-center space-x-3 mb-2">
              <div className="p-2 bg-red-100 rounded-lg text-red-600">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
              </div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">ต้องกรอกคะแนน</h3>
            </div>
            <p className="text-4xl font-extrabold text-red-600 mt-2 tracking-tight">0 <span className="text-base font-medium text-gray-400">รายการ</span></p>
          </div>
        </div>
      </div>`;

c = c.replace(oldCards, newCards);

// Also redesign the Table wrapper below it
c = c.replace('className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden"', 'className="bg-white border border-gray-100 rounded-3xl shadow-[0_2px_12px_rgba(0,0,0,0.03)] overflow-hidden"');
c = c.replace('className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center"', 'className="px-6 py-5 border-b border-gray-50 flex justify-between items-center bg-white"');
c = c.replace('className="font-semibold text-gray-800"', 'className="text-lg font-bold text-gray-900 tracking-tight"');
c = c.replace('className="text-sm text-emerald-600 hover:underline"', 'className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 px-3 py-1.5 rounded-lg transition-colors"');

fs.writeFileSync(file, c);
console.log('Replaced');
