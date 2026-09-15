const fs = require('fs');

let f = 'src/components/dashboard/SearchBox.tsx';
let c = fs.readFileSync(f, 'utf8');

const oldBtn = `<button className="text-sm px-4 py-2 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-lg shadow-sm flex items-center space-x-2">
               <span>🖨️ พิมพ์ใบรายงานผล (ปพ.6) [ตัวอย่าง]</span>
             </button>`;
const newBtn = `<Link href={\`/student/\${studentData.studentId}/report\`} target="_blank" className="text-sm px-4 py-2 bg-emerald-600 border border-emerald-700 text-white hover:bg-emerald-700 rounded-lg shadow-sm flex items-center space-x-2 font-medium">
               <span>🖨️ พิมพ์ใบรายงานผล (ปพ.6)</span>
             </Link>`;

c = c.replace(oldBtn, newBtn);
if(!c.includes('import Link from "next/link"')) {
  c = 'import Link from "next/link";\n' + c;
}

fs.writeFileSync(f, c);
console.log('Updated SearchBox link');
