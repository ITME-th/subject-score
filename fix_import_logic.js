const fs = require('fs');

// 1. Add `rooms: true` to page.tsx
let pfile = 'src/app/(dashboard)/courses/[id]/scores/page.tsx';
let pcode = fs.readFileSync(pfile, 'utf8');
if (!pcode.includes('rooms: true')) {
  pcode = pcode.replace('scoreCategories:', 'rooms: true,\n      scoreCategories:');
  fs.writeFileSync(pfile, pcode);
}

// 2. Modify ScoreTable.tsx
let file = 'src/components/courses/ScoreTable.tsx';
let c = fs.readFileSync(file, 'utf8');

// 2.1 Add importStatus state
if (!c.includes('importStatus')) {
  c = c.replace(
    'const [isPending, startTransition] = useTransition();',
    'const [isPending, startTransition] = useTransition();\n  const [importStatus, setImportStatus] = useState({ isImporting: false, total: 0 });'
  );
}

// 2.2 Re-write the handleFileUpload logic
const oldFileUploadStart = c.indexOf('// นำเข้าผ่านไฟล์ Excel');
const oldFileUploadEnd = c.indexOf('// นำเข้าผ่านการ ก๊อปปี้/วาง', oldFileUploadStart);

const newFileUploadFunc = `// นำเข้าผ่านไฟล์ Excel
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: "binary" });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws);
        
        let formattedData = data.map((row: any) => {
          const keys = Object.keys(row);
          const findKey = (keywords: string[]) => keys.find(k => keywords.some(kw => k.toLowerCase().includes(kw.toLowerCase())));
          
          const idKey = findKey(["รหัส", "id", "เลข", "ประจำตัว"]);
          const nameKey = findKey(["ชื่อ", "name", "สกุล"]); 
          const roomKey = findKey(["ห้อง", "ชั้น", "room", "class"]);

          return {
            id: idKey ? String(row[idKey]) : undefined,
            name: nameKey ? String(row[nameKey]) : undefined,
            room: roomKey ? String(row[roomKey]) : "-"
          };
        }).filter((r: any) => r.id && r.name); 

        // Filter out rooms that are not assigned to this course
        const allowedRooms = (course.rooms || []).map((r: any) => r.roomName);
        const originalCount = formattedData.length;
        
        if (allowedRooms.length > 0) {
          formattedData = formattedData.filter((r: any) => allowedRooms.includes(r.room));
        }

        if (formattedData.length === 0) {
          if (originalCount > 0) {
            alert(\`คัดลอกรายชื่อมา \${originalCount} คน แต่ไม่มีใครอยู่ในห้องที่วิชานี้สอนเลยครับ (อนุญาตเฉพาะห้อง: \${allowedRooms.join(', ')})\`);
          } else {
            alert("ไม่พบข้อมูลนักเรียน! โปรดตรวจสอบหัวคอลัมน์ Excel");
          }
          if (fileInputRef.current) fileInputRef.current.value = "";
          return;
        }

        setImportStatus({ isImporting: true, total: formattedData.length });
        startTransition(async () => {
          try {
            const res = await importStudentsToCourse(course.id, formattedData as any);
            if (res.success) {
              if (originalCount > formattedData.length) {
                alert(\`นำเข้านักเรียนสำเร็จ \${formattedData.length} คน\\n(ข้ามเด็กห้องอื่น \${originalCount - formattedData.length} คนที่ไม่ได้เรียนวิชานี้)\`);
              } else {
                alert(\`นำเข้านักเรียนสำเร็จ \${formattedData.length} คน\`);
              }
            } else {
              alert(\`นำเข้าไม่สำเร็จ: \${res.error}\`);
            }
          } catch (err) {
            alert("เกิดข้อผิดพลาดในการนำเข้า");
          } finally {
            setImportStatus({ isImporting: false, total: 0 });
            if (fileInputRef.current) fileInputRef.current.value = "";
          }
        });
      } catch (err) {
        alert("ไฟล์ Excel ไม่ถูกต้อง");
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    };
    reader.readAsBinaryString(file);
  };

  `;

c = c.substring(0, oldFileUploadStart) + newFileUploadFunc + c.substring(oldFileUploadEnd);

// 2.3 Rewrite handlePasteImport logic
const oldPasteStart = c.indexOf('const handlePasteImport = () => {');
const oldPasteEnd = c.indexOf('// การบันทึกคะแนน', oldPasteStart);

const newPasteFunc = `const handlePasteImport = () => {
    const lines = pasteText.trim().split('\\n');
    let formattedData: any[] = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      let cols = line.split('\\t');
      if (cols.length < 2) cols = line.split(','); 
      if (cols.length < 2) cols = line.split(/\\s{2,}/); 

      if (i === 0 && (cols[0].includes('รหัส') || cols[1]?.includes('ชื่อ'))) {
        continue;
      }

      if (cols.length >= 2) {
        formattedData.push({
          id: cols[0].trim(),
          name: cols[1].trim(),
          room: cols[2] ? cols[2].trim() : "-"
        });
      }
    }

    const allowedRooms = (course.rooms || []).map((r: any) => r.roomName);
    const originalCount = formattedData.length;
    
    if (allowedRooms.length > 0) {
      formattedData = formattedData.filter((r: any) => allowedRooms.includes(r.room));
    }

    if (formattedData.length === 0) {
      if (originalCount > 0) {
        alert(\`คัดลอกรายชื่อมา \${originalCount} คน แต่ไม่มีใครอยู่ในห้องที่วิชานี้สอนเลยครับ (อนุญาตเฉพาะห้อง: \${allowedRooms.join(', ')})\`);
      } else {
        alert("ไม่พบรูปแบบข้อมูลที่ถูกต้อง กรุณาวางข้อมูลที่มีอย่างน้อย 2 คอลัมน์ (รหัส, ชื่อ)");
      }
      return;
    }

    setShowPasteModal(false);
    setImportStatus({ isImporting: true, total: formattedData.length });
    
    startTransition(async () => {
      try {
        const res = await importStudentsToCourse(course.id, formattedData);
        if (res.success) {
          if (originalCount > formattedData.length) {
            alert(\`เพิ่มนักเรียนสำเร็จ \${formattedData.length} คน\\n(ข้ามเด็กห้องอื่น \${originalCount - formattedData.length} คนที่ไม่ได้เรียนวิชานี้)\`);
          } else {
            alert(\`เพิ่มนักเรียนสำเร็จ \${formattedData.length} คน\`);
          }
          setPasteText("");
        } else {
          alert(\`เพิ่มไม่สำเร็จ: \${res.error}\`);
        }
      } catch (err) {
        alert("เกิดข้อผิดพลาดในการนำเข้า");
      } finally {
        setImportStatus({ isImporting: false, total: 0 });
      }
    });
  };

  `;

c = c.substring(0, oldPasteStart) + newPasteFunc + c.substring(oldPasteEnd);

// 2.4 Add Import Loading Overlay before the final </div>
let overlayCode = `
      {/* Import Loading Overlay */}
      {importStatus.isImporting && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/60 backdrop-blur-sm">
          <div className="bg-white p-8 rounded-2xl shadow-2xl flex flex-col items-center max-w-sm w-full mx-4 animate-in fade-in zoom-in duration-200">
            <div className="w-16 h-16 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin mb-4"></div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">กำลังนำเข้าข้อมูล...</h3>
            <p className="text-gray-500 text-center mb-1">
              กำลังบันทึกรายชื่อนักเรียน <span className="font-bold text-emerald-600">{importStatus.total}</span> คน
            </p>
            <p className="text-sm text-amber-600 bg-amber-50 px-4 py-2 rounded-lg mt-4 font-medium flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
              กรุณารอสักครู่ ห้ามปิดหน้าจอนี้
            </p>
          </div>
        </div>
      )}
`;

if (!c.includes('กำลังนำเข้าข้อมูล...')) {
   c = c.substring(0, c.lastIndexOf('</div>')) + overlayCode + '\n    </div>\n  );\n}';
}

fs.writeFileSync(file, c);
console.log('Fixed Import Logic & Rooms Filter!');
