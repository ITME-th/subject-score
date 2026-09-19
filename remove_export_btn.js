const fs = require('fs');

let file = 'src/components/courses/ScoreTable.tsx';
let c = fs.readFileSync(file, 'utf8');

const strToRemove = `<button className="flex items-center space-x-2 px-4 py-2 bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 rounded-lg font-medium shadow-sm transition-all">
            <span>📤 ส่งออก ปพ.5</span></button>`;

if (c.includes(strToRemove)) {
  c = c.replace(strToRemove, '');
  fs.writeFileSync(file, c);
  console.log('Removed ปพ.5 button successfully');
} else {
  // Try regex if formatting differs
  c = c.replace(/<button[^>]*>\s*<span>📤 ส่งออก ปพ\.5<\/span>\s*<\/button>/g, '');
  fs.writeFileSync(file, c);
  console.log('Removed ปพ.5 button using regex');
}
