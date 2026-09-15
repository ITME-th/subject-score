const fs = require('fs');

let f1 = 'src/app/(print)/student/[id]/report/page.tsx';
let c1 = fs.readFileSync(f1, 'utf8');
c1 = c1.replace('onClick="window.print()"', 'onClick={() => window.print()}');
fs.writeFileSync(f1, c1);

let f2 = 'src/components/courses/ScoreTable.tsx';
let c2 = fs.readFileSync(f2, 'utf8');
c2 = c2.replace('const formattedData = [];', 'const formattedData: any[] = [];');
c2 = c2.replace(
  'const res = await importStudentsToCourse(course.id, formattedData);', 
  'const res = await importStudentsToCourse(course.id, formattedData as any);'
);
fs.writeFileSync(f2, c2);

console.log('Fixed TypeScript errors');
