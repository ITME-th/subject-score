const fs = require('fs');
let file = 'src/components/courses/ScoreTable.tsx';
let c = fs.readFileSync(file, 'utf8');

c = c.replace('const [selectedRoom, setSelectedRoom] = useState<string>("all");', 
`const [selectedRoom, setSelectedRoom] = useState<string>("all");
  const [localOverrides, setLocalOverrides] = useState<Record<string, number>>({});`);

c = c.replace(/const val = student\.scoreMap\[cat\.id\] \|\| 0;/g, 
  "const val = localOverrides[`${student.id}_${cat.id}`] ?? student.scoreMap[cat.id] ?? 0;");

c = c.replace(
  /const handleScoreChange = async \(studentId: string, categoryId: string, value: string, maxScore: number\) => {/g,
  `const handleScoreChange = async (studentId: string, categoryId: string, value: string, maxScore: number) => {
    let numVal = parseFloat(value) || 0;
    if (numVal > maxScore) numVal = maxScore;
    if (numVal < 0) numVal = 0;
    
    // อัปเดต UI ทันที (Optimistic Update)
    setLocalOverrides(prev => ({
      ...prev,
      [\`\${studentId}_\${categoryId}\`]: numVal
    }));
`
);

fs.writeFileSync(file, c);
console.log('Fixed real-time scores');
