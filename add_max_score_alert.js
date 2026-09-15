const fs = require('fs');
let file = 'src/components/courses/ScoreTable.tsx';
let c = fs.readFileSync(file, 'utf8');

// Replace handleScoreChange
c = c.replace(
  `const handleScoreChange = async (studentId: string, categoryId: string, value: string, maxScore: number) => {
    let numVal = parseFloat(value) || 0;
    if (numVal > maxScore) numVal = maxScore;
    if (numVal < 0) numVal = 0;
    
    setLocalOverrides(prev => ({
      ...prev,
      [\`\${studentId}_\${categoryId}\`]: numVal
    }));
    
    await updateStudentScore(studentId, course.id, categoryId, numVal);
  };`,
  `const handleScoreChange = async (studentId: string, categoryId: string, value: string, maxScore: number, target: HTMLInputElement) => {
    let isBlank = value.trim() === "";
    let numVal = parseFloat(value) || 0;
    
    if (numVal > maxScore) {
      alert(\`⚠️ แจ้งเตือน: กรอกคะแนน (\${numVal}) เกินคะแนนเต็ม (\${maxScore} คะแนน)\\nระบบได้ปรับเป็นคะแนนสูงสุดให้อัตโนมัติ\`);
      numVal = maxScore;
    }
    if (numVal < 0) numVal = 0;
    
    // อัปเดตตัวเลขในช่องกรอกให้ถูกต้อง
    if (target) {
      target.value = isBlank && numVal === 0 ? "" : numVal.toString();
    }
    
    setLocalOverrides(prev => ({
      ...prev,
      [\`\${studentId}_\${categoryId}\`]: numVal
    }));
    
    await updateStudentScore(studentId, course.id, categoryId, numVal);
  };`
);

// Replace onBlur calls
c = c.replaceAll(
  `onBlur={(e) => handleScoreChange(student.id, cat.id, e.target.value, cat.maxScore)}`,
  `onBlur={(e) => handleScoreChange(student.id, cat.id, e.target.value, cat.maxScore, e.target)}`
);

fs.writeFileSync(file, c);
console.log('Added max score alert and input correction');
