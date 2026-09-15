const fs = require('fs');
let file = 'src/app/(print)/student/[id]/report/page.tsx';
let c = fs.readFileSync(file, 'utf8');

c = c.replace(
  'export default async function ReportCardPage({ params }: { params: { id: string } }) {',
  'export default async function ReportCardPage({ params }: { params: Promise<{ id: string }> }) {\n  const resolvedParams = await params;'
);

c = c.replace(
  'searchStudentAction(params.id);',
  'searchStudentAction(resolvedParams.id);'
);

fs.writeFileSync(file, c);
console.log('Fixed params in report page');
