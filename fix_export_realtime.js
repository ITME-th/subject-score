const fs = require('fs');
let file = 'src/components/courses/ScoreTable.tsx';
let c = fs.readFileSync(file, 'utf8');

c = c.replace(
  /const val = student\.scoreMap\[c\.id\] \|\| 0;/g,
  "const val = localOverrides[`${student.id}_${c.id}`] ?? student.scoreMap[c.id] ?? 0;"
);

fs.writeFileSync(file, c);
console.log('Fixed export to excel realtime scores');
