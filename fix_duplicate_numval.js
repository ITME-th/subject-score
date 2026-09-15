const fs = require('fs');
let file = 'src/components/courses/ScoreTable.tsx';
let c = fs.readFileSync(file, 'utf8');

c = c.replace(
  `let numVal = parseFloat(value) || 0;
    if (numVal > maxScore) numVal = maxScore;
    if (numVal < 0) numVal = 0;
    
    // อัปเดต UI ทันที (Optimistic Update)
    setLocalOverrides(prev => ({
      ...prev,
      [\`\${studentId}_\${categoryId}\`]: numVal
    }));

    let numVal = parseFloat(value) || 0;`,
  `let numVal = parseFloat(value) || 0;
    if (numVal > maxScore) numVal = maxScore;
    if (numVal < 0) numVal = 0;
    
    // อัปเดต UI ทันที (Optimistic Update)
    setLocalOverrides(prev => ({
      ...prev,
      [\`\${studentId}_\${categoryId}\`]: numVal
    }));
`
);

// In case the spacing is different, let's just do a regex replace for the double let numVal block.
const funcStart = 'const handleScoreChange = async (studentId: string, categoryId: string, value: string, maxScore: number) => {';
const funcEnd = 'await updateStudentScore(studentId, course.id, categoryId, numVal);';

const newFunc = `const handleScoreChange = async (studentId: string, categoryId: string, value: string, maxScore: number) => {
    let numVal = parseFloat(value) || 0;
    if (numVal > maxScore) numVal = maxScore;
    if (numVal < 0) numVal = 0;
    
    setLocalOverrides(prev => ({
      ...prev,
      [\`\${studentId}_\${categoryId}\`]: numVal
    }));
    
    `;

c = c.substring(0, c.indexOf(funcStart)) + newFunc + c.substring(c.indexOf(funcEnd));

fs.writeFileSync(file, c);
console.log('Fixed duplicate numVal');
