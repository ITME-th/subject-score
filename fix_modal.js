const fs = require('fs');
let file = 'src/components/courses/ScoreTable.tsx';
let content = fs.readFileSync(file, 'utf8');

const anchor = `placeholder="เช่น 10, 20"
                  className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>`;

const addition = `
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

if(content.includes(anchor) && !content.includes("เลือกห้องที่จะเพิ่มช่องคะแนน")) {
  content = content.replace(anchor, anchor + addition);
  fs.writeFileSync(file, content);
  console.log("Success");
} else {
  console.log("Anchor not found or already added");
}
