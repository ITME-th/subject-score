import { searchStudentAction } from "@/app/actions/search";
import { notFound } from "next/navigation";

export default async function ReportCardPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  // Use the search action to get the processed data
  const studentData = await searchStudentAction(resolvedParams.id);
  
  if (!studentData) {
    notFound();
  }

  const currentDate = new Date().toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="max-w-[21cm] mx-auto bg-white p-[1cm] md:p-[2cm] print:p-0 print:w-full print:max-w-none text-black">
      {/* ซ่อนปุ่มปรินต์เมื่อทำการสั่งพิมพ์ */}
      <div className="mb-6 flex justify-end print:hidden">
        <button 
          onClick="window.print()" 
          className="px-6 py-2 bg-emerald-600 text-white rounded-lg shadow-sm font-semibold hover:bg-emerald-700"
          // We can't use onClick directly in Server Component, so we'll use a tiny client script or just a plain button with onclick
          // Note: React 18 allows string onclick for some cases, but dangerouslySetInnerHTML is safer for inline scripts
        >
        </button>
        <div dangerouslySetInnerHTML={{__html: `<button onclick="window.print()" class="px-6 py-2 bg-emerald-600 text-white rounded-lg shadow-sm font-semibold hover:bg-emerald-700 flex items-center space-x-2"><span>🖨️ สั่งพิมพ์เอกสาร</span></button>`}} />
      </div>

      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold mb-2">แบบรายงานผลการพัฒนาคุณภาพผู้เรียนรายบุคคล (ปพ.6)</h1>
        <h2 className="text-xl">โรงเรียนต้นแบบการศึกษา</h2>
      </div>

      <div className="flex justify-between items-end mb-6 text-sm border-b-2 border-black pb-4">
        <div>
          <p className="mb-1"><span className="font-bold">ชื่อ-นามสกุล:</span> {studentData.name}</p>
          <p><span className="font-bold">รหัสประจำตัว:</span> {studentData.studentId}</p>
        </div>
        <div className="text-right">
          <p className="mb-1"><span className="font-bold">ชั้นเรียน:</span> ห้อง {studentData.room}</p>
          <p><span className="font-bold">วันที่พิมพ์:</span> {currentDate}</p>
        </div>
      </div>

      <table className="w-full text-left border-collapse border border-black mb-8 text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-black px-4 py-2 font-bold text-center">รหัสวิชา</th>
            <th className="border border-black px-4 py-2 font-bold">ชื่อรายวิชา</th>
            <th className="border border-black px-4 py-2 font-bold text-center">คะแนนรวม (100)</th>
            <th className="border border-black px-4 py-2 font-bold text-center">ระดับผลการเรียน</th>
          </tr>
        </thead>
        <tbody>
          {studentData.courses.length === 0 ? (
            <tr>
              <td colSpan={4} className="border border-black px-4 py-8 text-center">ไม่พบข้อมูลการลงทะเบียน</td>
            </tr>
          ) : (
            studentData.courses.map((course: any) => (
              <tr key={course.id}>
                <td className="border border-black px-4 py-2 text-center">{course.code}</td>
                <td className="border border-black px-4 py-2">{course.name}</td>
                <td className="border border-black px-4 py-2 text-center">{course.total}</td>
                <td className="border border-black px-4 py-2 text-center font-bold">{course.grade}</td>
              </tr>
            ))
          )}
          <tr className="bg-gray-50">
            <td colSpan={3} className="border border-black px-4 py-3 text-right font-bold">เกรดเฉลี่ยสะสม (GPA)</td>
            <td className="border border-black px-4 py-3 text-center font-bold text-lg">{studentData.gpa}</td>
          </tr>
        </tbody>
      </table>

      <div className="flex justify-around mt-16 pt-8 text-center text-sm">
        <div>
          <div className="border-b border-black w-40 mx-auto mb-2"></div>
          <p>( {studentData.name} )</p>
          <p className="mt-1">นักเรียน</p>
        </div>
        <div>
          <div className="border-b border-black w-40 mx-auto mb-2"></div>
          <p>( .................................................... )</p>
          <p className="mt-1">ครูประจำชั้น</p>
        </div>
        <div>
          <div className="border-b border-black w-40 mx-auto mb-2"></div>
          <p>( .................................................... )</p>
          <p className="mt-1">ผู้ปกครอง</p>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          @page { size: A4; margin: 2cm; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; background-color: white !important; }
        }
      `}} />
    </div>
  );
}
