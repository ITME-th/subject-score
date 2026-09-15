const fs = require('fs');

const files = [
  'src/app/(dashboard)/courses/[id]/summary/page.tsx',
  'src/app/(print)/student/[id]/report/page.tsx',
  'src/components/courses/CourseRowActions.tsx',
];

for (const file of files) {
  try {
    let content = fs.readFileSync(file, 'utf8');
    content = content.split('\\`').join('`');
    content = content.split('\\$').join('$');
    fs.writeFileSync(file, content);
    console.log('Fixed', file);
  } catch (e) {
    console.log('Error fixing', file);
  }
}
