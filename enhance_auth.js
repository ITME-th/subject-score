const fs = require('fs');

const apply = (f) => { 
  let c = fs.readFileSync(f, 'utf8'); 
  c = c.replace('className="p-8"', 'className="p-10"'); 
  c = c.replace('className="text-2xl font-bold text-center text-gray-800 mb-6"', 'className="text-3xl font-extrabold text-center text-gray-900 mb-8 tracking-tight"'); 
  
  // Custom headers for login/register
  if (f.includes('login')) {
     c = c.replace('<h2 className="text-3xl font-extrabold text-center text-gray-900 mb-8 tracking-tight">เข้าสู่ระบบ</h2>', 
     '<div className="text-center mb-8"><div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-2xl mx-auto flex items-center justify-center shadow-lg shadow-emerald-500/30 mb-4"><span className="text-3xl font-bold text-white">S</span></div><h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">ยินดีต้อนรับกลับมา</h2><p className="text-gray-500 text-sm mt-1">เข้าสู่ระบบเพื่อจัดการคะแนนนักเรียน</p></div>');
  } else {
     c = c.replace('<h2 className="text-3xl font-extrabold text-center text-gray-900 mb-8 tracking-tight">ลงทะเบียนครูใหม่</h2>', 
     '<div className="text-center mb-8"><div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-2xl mx-auto flex items-center justify-center shadow-lg shadow-emerald-500/30 mb-4"><span className="text-3xl font-bold text-white">S</span></div><h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">สร้างบัญชีผู้ใช้ใหม่</h2><p className="text-gray-500 text-sm mt-1">ลงทะเบียนเพื่อเริ่มต้นใช้งานระบบ</p></div>');
  }
  
  c = c.replace('className="w-full bg-emerald-600 text-white font-semibold py-3 rounded-lg hover:bg-emerald-700 transition duration-200 mt-6"', 'className="w-full bg-emerald-600 text-white font-bold py-3.5 rounded-xl hover:bg-emerald-700 hover:shadow-lg hover:shadow-emerald-500/30 active:scale-[0.98] transition-all duration-200 mt-6"'); 
  c = c.replace(/className="w-full px-4 py-2\.5 bg-gray-50 border border-gray-200 rounded-lg/g, 'className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl'); 
  fs.writeFileSync(f, c); 
}; 

apply('src/app/(auth)/login/page.tsx'); 
apply('src/app/(auth)/register/page.tsx'); 
console.log('Auth forms enhanced');
