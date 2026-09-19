const fs = require('fs');

let file = 'src/components/courses/ScoreTable.tsx';
let c = fs.readFileSync(file, 'utf8');

// 1. Add importStatus state
if (!c.includes('importStatus')) {
  c = c.replace(
    'const [isPending, startTransition] = useTransition();',
    'const [isPending, startTransition] = useTransition();\n  const [importStatus, setImportStatus] = useState({ isImporting: false, total: 0 });'
  );
}

// 2. Modify handleFileUpload
let handleUploadStart = c.indexOf('if (formattedData.length === 0)');
let handleUploadEnd = c.indexOf('if (fileInputRef.current) fileInputRef.current.value = \'\';\n        });', handleUploadStart);
let oldUploadCode = c.substring(handleUploadStart, handleUploadEnd + 70);

let newUploadCode = `if (formattedData.length === 0) {
          alert("ไม่พบข้อมูลนักเรียน! โปรดตรวจสอบว่าไฟล์ Excel มีหัวคอลัมน์คำว่า 'รหัส', 'ชื่อ', และ 'ห้อง' หรือไม่");
          return;
        }

        setImportStatus({ isImporting: true, total: formattedData.length });
        startTransition(async () => {
          try {
            const res = await importStudentsToCourse(course.id, formattedData as any);
            if (res.success) alert(\`นำเข้านักเรียนสำเร็จ \${formattedData.length} คน\`);
          } catch (error) {
            alert("เกิดข้อผิดพลาดในการนำเข้าข้อมูล");
          } finally {
            setImportStatus({ isImporting: false, total: 0 });
            if (fileInputRef.current) fileInputRef.current.value = '';
          }
        });`;

c = c.replace(oldUploadCode, newUploadCode);

// 3. Add Import Loading Overlay
let overlayCode = `
      {/* Import Loading Overlay */}
      {importStatus.isImporting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 backdrop-blur-sm">
          <div className="bg-white p-8 rounded-2xl shadow-2xl flex flex-col items-center max-w-sm w-full mx-4 animate-in fade-in zoom-in duration-200">
            <div className="w-16 h-16 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin mb-4"></div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">กำลังนำเข้าข้อมูล...</h3>
            <p className="text-gray-500 text-center mb-1">
              กำลังประมวลผลรายชื่อนักเรียนจำนวน <span className="font-bold text-emerald-600">{importStatus.total}</span> คน
            </p>
            <p className="text-sm text-amber-600 bg-amber-50 px-3 py-1 rounded-full mt-3 font-medium">
              ⚠️ กรุณารอสักครู่ ห้ามปิดหน้าจอนี้
            </p>
          </div>
        </div>
      )}
`;

// Insert right before the final </div>
c = c.substring(0, c.lastIndexOf('</div>')) + overlayCode + '\n    </div>\n  );\n}';

fs.writeFileSync(file, c);
console.log('Added Import Status Popup');
