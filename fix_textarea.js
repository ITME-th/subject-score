const fs = require('fs');
let file = 'src/components/courses/ScoreTable.tsx';
let c = fs.readFileSync(file, 'utf8');

const oldClass = 'className="w-full h-40 p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500 text-sm"';
const newClass = 'className="w-full h-40 p-3 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 text-sm text-gray-900 placeholder-gray-400 font-medium bg-white shadow-sm"';

c = c.replaceAll(oldClass, newClass);

fs.writeFileSync(file, c);
console.log('Fixed Textarea Modal Inputs in ScoreTable');
