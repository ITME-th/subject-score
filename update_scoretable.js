const fs = require('fs');
let file = 'src/components/courses/ScoreTable.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Add state
content = content.replace(
  'const [newColMax, setNewColMax] = useState("");',
  'const [newColMax, setNewColMax] = useState("");\n  const [newColRooms, setNewColRooms] = useState<string[]>([]);'
);

// 2. Modify handleAddColumn
content = content.replace(
  'const res = await addScoreColumn(course.id, newColName, maxScore, newColTerm);',
  'const res = await addScoreColumn(course.id, newColName, maxScore, newColTerm, newColRooms.length === availableRooms.length ? "all" : JSON.stringify(newColRooms));'
);

// 3. Reset state on cancel/success
content = content.replace(
  /setNewColMax\(""\);/g,
  'setNewColMax("");\n        setNewColRooms(availableRooms);'
);

// 4. Initialize state when opening modal
content = content.replace(
  /setShowAddColModal\(true\)/g,
  'setShowAddColModal(true); setNewColRooms(availableRooms)'
);

// 5. Update the Modal JSX
const modalJSX = `<div>
                <label className="block text-sm font-medium text-gray-700 mb-1">คะแนนเต็ม</label>
                <input 
                  type="number" 
                  value={newColMax}
                  onChange={(e) => setNewColMax(e.target.value)}
                  placeholder="เช่น 10, 20"
                  className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 mt-4 border-t pt-4">เลือกห้องที่จะเพิ่มช่องคะแนน</label>
                <div className="grid grid-cols-2 gap-2 mt-2 bg-gray-50 p-3 rounded-lg border border-gray-100">
                  <label className="flex items-center space-x-2 text-sm cursor-pointer">
                    <input type="checkbox" checked={newColRooms.length === availableRooms.length} onChange={(e) => {
                      if (e.target.checked) setNewColRooms(availableRooms);
                      else setNewColRooms([]);
                    }} className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4" />
                    <span className="font-medium text-gray-800">ทุกห้อง</span>
                  </label>
                  {availableRooms.map(r => (
                    <label key={r} className="flex items-center space-x-2 text-sm cursor-pointer">
                      <input type="checkbox" checked={newColRooms.includes(r)} onChange={(e) => {
                        if (e.target.checked) setNewColRooms([...newColRooms, r]);
                        else setNewColRooms(newColRooms.filter(room => room !== r));
                      }} className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4" />
                      <span className="text-gray-700">{r}</span>
                    </label>
                  ))}
                </div>
              </div>`;
              
const regex = /<div>\s*<label className="block text-sm font-medium text-gray-700 mb-1">คะแนนเต็ม<\/label>\s*<input[^>]*>\s*<\/div>/;
content = content.replace(regex, modalJSX);

// 6. Update filtering of categories
content = content.replace(
  'const term1Categories = course.scoreCategories.filter((c: any) => c.term === 1);',
  'const term1Categories = course.scoreCategories.filter((c: any) => c.term === 1 && (c.applicableRooms === "all" || (selectedRoom !== "all" ? JSON.parse(c.applicableRooms).includes(selectedRoom) : true)));'
);
content = content.replace(
  'const term2Categories = course.scoreCategories.filter((c: any) => c.term === 2);',
  'const term2Categories = course.scoreCategories.filter((c: any) => c.term === 2 && (c.applicableRooms === "all" || (selectedRoom !== "all" ? JSON.parse(c.applicableRooms).includes(selectedRoom) : true)));'
);

fs.writeFileSync(file, content);
console.log("Updated ScoreTable.tsx successfully");
