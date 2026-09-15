const fs = require('fs');
let file = 'src/components/courses/ScoreTable.tsx';
let c = fs.readFileSync(file, 'utf8');

const start = c.indexOf('const exportToExcel = () => {');
const end = c.indexOf('return (', start);

const newExportFunc = `const exportToExcel = () => {
    // 1. หัวตาราง (Headers)
    const dataHeaders = [
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

    // 2. ข้อมูลนักเรียน (Data Rows)
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

    // 3. จัดฟอร์มเอกสารมาตรฐาน (Top Titles)
    const roomText = selectedRoom === 'all' ? 'รวมทุกห้อง' : \`ห้อง \${selectedRoom}\`;
    const finalData = [
      ["แบบรายงานผลการพัฒนาคุณภาพผู้เรียนรายวิชา (ปพ.5)"],
      [\`รหัสวิชา: \${course.code}      ชื่อวิชา: \${course.name}      ปีการศึกษา: \${course.year}\`],
      [\`ชั้นเรียน: \${roomText}      หน่วยกิต: \${course.credits}\`],
      [], // Blank row
      dataHeaders,
      ...rows
    ];

    const ws = XLSX.utils.aoa_to_sheet(finalData);

    // 4. ตั้งค่าความกว้างคอลัมน์ (Column Widths)
    const colWidths = [
      { wch: 8 },  // ลำดับ
      { wch: 15 }, // รหัสนักเรียน
      { wch: 30 }, // ชื่อ-นามสกุล
    ];
    // เพิ่มความกว้างให้คอลัมน์คะแนน
    for (let i = 3; i < dataHeaders.length; i++) {
      colWidths.push({ wch: 12 });
    }
    ws['!cols'] = colWidths;

    // 5. ผสานเซลล์หัวตาราง (Merge Title Cells)
    const totalCols = dataHeaders.length;
    ws['!merges'] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: totalCols - 1 } }, // Title 1
      { s: { r: 1, c: 0 }, e: { r: 1, c: totalCols - 1 } }, // Title 2
      { s: { r: 2, c: 0 }, e: { r: 2, c: totalCols - 1 } }, // Title 3
    ];

    // 6. สร้างไฟล์และดาวน์โหลด
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "แบบบันทึกผลการเรียน");
    
    // ตั้งชื่อไฟล์ให้ดูเป็นทางการ
    const fileName = \`แบบบันทึกผลการเรียน_\${course.code}_\${roomText.replace('/', '-')}.xlsx\`;
    XLSX.writeFile(wb, fileName);
  };

  `;

c = c.substring(0, start) + newExportFunc + c.substring(end);
fs.writeFileSync(file, c);
console.log('Upgraded Excel Export');
