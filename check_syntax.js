const fs = require('fs');
const files = [
  'src/app/(dashboard)/courses/[id]/summary/page.tsx',
  'src/app/(print)/student/[id]/report/page.tsx',
  'src/components/courses/CourseRowActions.tsx',
  'src/components/courses/ScoreTable.tsx',
  'src/components/dashboard/SearchBox.tsx'
];

for (const file of files) {
  try {
    let content = fs.readFileSync(file, 'utf8');
    let hasBackslashTick = content.includes('\\`');
    let hasBackslashDollar = content.includes('\\$');
    console.log(file, 'has \\`:', hasBackslashTick, 'has \\$:', hasBackslashDollar);
  } catch (e) {
    console.log('Error reading', file);
  }
}
