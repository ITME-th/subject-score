const fs = require('fs');
let file = 'src/app/(dashboard)/courses/[id]/summary/page.tsx';
let c = fs.readFileSync(file, 'utf8');

c = c.replace(
  'export default async function CourseSummaryPage({ params }: { params: { id: string } }) {',
  'export default async function CourseSummaryPage({ params }: { params: Promise<{ id: string }> }) {\n  const resolvedParams = await params;'
);

c = c.replace(
  'where: { id: params.id },',
  'where: { id: resolvedParams.id },'
);

c = c.replace(
  'where: { id: params.id }',
  'where: { id: resolvedParams.id }'
);

fs.writeFileSync(file, c);
console.log('Fixed params in summary page');
