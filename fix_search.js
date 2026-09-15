const fs = require('fs');

const fixSearchBox = () => {
  let f = 'src/components/dashboard/SearchBox.tsx';
  if (!fs.existsSync(f)) return;
  let c = fs.readFileSync(f, 'utf8');
  
  c = c.replace('className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 outline-none transition-all"', 'className="flex-1 px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all shadow-sm font-medium"');
  
  fs.writeFileSync(f, c);
  console.log('Updated ' + f);
};

fixSearchBox();
