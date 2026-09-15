const fs = require('fs');

function fixAuthFile(file) {
  try {
    let c = fs.readFileSync(file, 'utf8');
    // Replace the problematic classes with the fixed ones
    const badClass = 'className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 outline-none transition-all"';
    const goodClass = 'className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 outline-none transition-all shadow-sm font-medium"';
    
    // Some might have different spacing, so let's do a more robust regex if needed,
    // but a direct replaceAll usually works if they are identical.
    c = c.replaceAll(badClass, goodClass);
    fs.writeFileSync(file, c);
    console.log('Fixed', file);
  } catch(e) {
    console.log('Error on', file, e.message);
  }
}

fixAuthFile('src/app/(auth)/login/page.tsx');
fixAuthFile('src/app/(auth)/register/page.tsx');
