const fs = require('fs');
let file = 'src/app/(dashboard)/courses/page.tsx';
let c = fs.readFileSync(file, 'utf8');

if (!c.includes('CourseRowActions')) {
  c = c.replace('import { redirect } from "next/navigation";', 'import { redirect } from "next/navigation";\nimport CourseRowActions from "@/components/courses/CourseRowActions";');
  
  const oldActions = `<td className="px-6 py-5 text-right space-x-2">
                      <Link href={\`/courses/\${course.id}/scores\`} className="inline-flex items-center px-3 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 hover:text-emerald-800 rounded-lg text-sm font-semibold transition-colors">
                        <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                        กรอกคะแนน
                      </Link>
                      <Link href={\`/courses/\${course.id}/summary\`} className="inline-flex items-center px-3 py-1.5 bg-purple-50 text-purple-700 hover:bg-purple-100 hover:text-purple-800 rounded-lg text-sm font-semibold transition-colors">
                        <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                        สรุปผล
                      </Link>
                      <Link href={\`/courses/\${course.id}/edit\`} className="inline-flex items-center p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700 rounded-lg transition-colors" title="แก้ไข">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                      </Link>
                    </td>`;
  c = c.replace(oldActions, '<CourseRowActions courseId={course.id} />');
  fs.writeFileSync(file, c);
  console.log('Injected CourseRowActions');
}
