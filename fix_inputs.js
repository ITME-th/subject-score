const fs = require('fs');

const replaceInFile = (f) => {
  if (!fs.existsSync(f)) return;
  let c = fs.readFileSync(f, 'utf8');
  
  const oldClass = 'className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 outline-none transition-all"';
  const newClass = 'className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all shadow-sm font-medium"';
  
  const oldClass2 = 'className="flex-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 outline-none transition-all"';
  const newClass2 = 'className="flex-1 px-4 py-2.5 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all shadow-sm font-medium"';

  // Also replace in auth if any
  const oldAuthClass = 'className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl"';
  const newAuthClass = 'className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all shadow-sm font-medium"';

  c = c.replaceAll(oldClass, newClass);
  c = c.replaceAll(oldClass2, newClass2);
  c = c.replaceAll(oldAuthClass, newAuthClass);

  fs.writeFileSync(f, c);
  console.log('Updated ' + f);
};

replaceInFile('src/app/(dashboard)/courses/create/page.tsx');
replaceInFile('src/app/(dashboard)/courses/[id]/edit/EditCourseForm.tsx');
replaceInFile('src/app/(auth)/login/page.tsx');
replaceInFile('src/app/(auth)/register/page.tsx');
