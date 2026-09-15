const fs = require('fs');

let file = 'src/components/courses/ScoreTable.tsx';
let c = fs.readFileSync(file, 'utf8');

// 1. Add exportToExcel function
const funcCode = `
  const exportToExcel = () => {
    const headers = [
      "ลำดับ", 
      "รหัสนักเรียน", 
      "ชื่อ-นามสกุล", 
      ...term1Categories.map((c: any) => \`(T1) \${c.name} (\${c.maxScore})\`), 
      "รวมเทอม 1",
      ...term2Categories.map((c: any) => \`(T2) \${c.name} (\${c.maxScore})\`),
      "รวมเทอม 2",
      "รวมทั้งหมด",
      "เกรด"
    ];

    const rows = filteredStudents.map((student: any, idx: number) => {
      let t1Total = 0;
      let t2Total = 0;
      
      const t1Scores = term1Categories.map((c: any) => {
        const val = student.scoreMap[c.id] || 0;
        const isApplicable = c.applicableRooms === "all" || (c.applicableRooms && JSON.parse(c.applicableRooms).includes(student.room));
        if(isApplicable) t1Total += val;
        return isApplicable ? val : "-";
      });
      
      const t2Scores = term2Categories.map((c: any) => {
        const val = student.scoreMap[c.id] || 0;
        const isApplicable = c.applicableRooms === "all" || (c.applicableRooms && JSON.parse(c.applicableRooms).includes(student.room));
        if(isApplicable) t2Total += val;
        return isApplicable ? val : "-";
      });

      const total = t1Total + t2Total;
      let grade = "0";
      if (total >= 80) grade = "4";
      else if (total >= 75) grade = "3.5";
      else if (total >= 70) grade = "3";
      else if (total >= 65) grade = "2.5";
      else if (total >= 60) grade = "2";
      else if (total >= 55) grade = "1.5";
      else if (total >= 50) grade = "1";

      return [
        idx + 1,
        student.studentId,
        student.name,
        ...t1Scores,
        t1Total,
        ...t2Scores,
        t2Total,
        total,
        grade
      ];
    });

    const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "คะแนนนักเรียน");
    
    const fileName = \`สรุปคะแนน_\${course.code}_\${selectedRoom === 'all' ? 'รวมทุกห้อง' : selectedRoom.replace('/', '-')}.xlsx\`;
    XLSX.writeFile(wb, fileName);
  };

  return (
`;

c = c.replace('return (', funcCode);

// 2. Add Export Button next to the select dropdown
const buttonCode = `</select>
            )}
            <button
              onClick={exportToExcel}
              className="flex items-center space-x-1.5 bg-white border border-gray-300 text-gray-700 py-1.5 px-3 rounded-lg text-sm hover:bg-gray-50 focus:ring-2 focus:ring-emerald-500 outline-none shadow-sm transition-colors"
            >
              <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              <span>ดาวน์โหลด Excel</span>
            </button>
`;

c = c.replace('</select>\n            )}', buttonCode);

fs.writeFileSync(file, c);
console.log('Added exportToExcel feature');
