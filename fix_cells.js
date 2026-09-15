const fs = require('fs');
let file = 'src/components/courses/ScoreTable.tsx';
let c = fs.readFileSync(file, 'utf8');

const t1Old = `{term1Categories.map((cat: any, cIdx: number) => {
                        const val = student.scoreMap[cat.id] || 0;
                        t1Total += val;
                        return (
                          <td key={cat.id} className="p-0">
                            <input 
                              type="number" 
                              data-row={idx}
                              data-col={cIdx}
                              defaultValue={val === 0 ? '' : val} 
                              max={cat.maxScore}
                              onBlur={(e) => handleScoreChange(student.id, cat.id, e.target.value, cat.maxScore)}
                              onKeyDown={(e) => handleKeyDown(e, idx, cIdx)}
                              className="w-full h-full min-h-[44px] text-center bg-transparent border-0 focus:ring-2 focus:ring-inset focus:ring-emerald-500 outline-none text-gray-800" 
                            />
                          </td>
                        );
                      })}`;

const t1New = `{term1Categories.map((cat: any, cIdx: number) => {
                        const isApplicable = cat.applicableRooms === "all" || (cat.applicableRooms && JSON.parse(cat.applicableRooms).includes(student.room));
                        const val = student.scoreMap[cat.id] || 0;
                        if(isApplicable) t1Total += val;
                        return (
                          <td key={cat.id} className="p-0">
                            {isApplicable ? (
                            <input 
                              type="number" 
                              data-row={idx}
                              data-col={cIdx}
                              defaultValue={val === 0 ? '' : val} 
                              max={cat.maxScore}
                              onBlur={(e) => handleScoreChange(student.id, cat.id, e.target.value, cat.maxScore)}
                              onKeyDown={(e) => handleKeyDown(e, idx, cIdx)}
                              className="w-full h-full min-h-[44px] text-center bg-transparent border-0 focus:ring-2 focus:ring-inset focus:ring-emerald-500 outline-none text-gray-800" 
                            />
                            ) : (
                              <div className="w-full h-full min-h-[44px] flex items-center justify-center bg-gray-50 text-gray-300 text-xs">-</div>
                            )}
                          </td>
                        );
                      })}`;

const t2Old = `{term2Categories.map((cat: any, cIdx: number) => {
                        const actualColIdx = term1Categories.length + cIdx;
                        const val = student.scoreMap[cat.id] || 0;
                        t2Total += val;
                        return (
                          <td key={cat.id} className="p-0">
                            <input 
                              type="number" 
                              data-row={idx}
                              data-col={actualColIdx}
                              defaultValue={val === 0 ? '' : val} 
                              max={cat.maxScore}
                              onBlur={(e) => handleScoreChange(student.id, cat.id, e.target.value, cat.maxScore)}
                              onKeyDown={(e) => handleKeyDown(e, idx, actualColIdx)}
                              className="w-full h-full min-h-[44px] text-center bg-transparent border-0 focus:ring-2 focus:ring-inset focus:ring-emerald-500 outline-none text-gray-800" 
                            />
                          </td>
                        );
                      })}`;

const t2New = `{term2Categories.map((cat: any, cIdx: number) => {
                        const actualColIdx = term1Categories.length + cIdx;
                        const isApplicable = cat.applicableRooms === "all" || (cat.applicableRooms && JSON.parse(cat.applicableRooms).includes(student.room));
                        const val = student.scoreMap[cat.id] || 0;
                        if(isApplicable) t2Total += val;
                        return (
                          <td key={cat.id} className="p-0">
                            {isApplicable ? (
                            <input 
                              type="number" 
                              data-row={idx}
                              data-col={actualColIdx}
                              defaultValue={val === 0 ? '' : val} 
                              max={cat.maxScore}
                              onBlur={(e) => handleScoreChange(student.id, cat.id, e.target.value, cat.maxScore)}
                              onKeyDown={(e) => handleKeyDown(e, idx, actualColIdx)}
                              className="w-full h-full min-h-[44px] text-center bg-transparent border-0 focus:ring-2 focus:ring-inset focus:ring-emerald-500 outline-none text-gray-800" 
                            />
                            ) : (
                              <div className="w-full h-full min-h-[44px] flex items-center justify-center bg-gray-50 text-gray-300 text-xs">-</div>
                            )}
                          </td>
                        );
                      })}`;

c = c.replace(t1Old, t1New);
c = c.replace(t2Old, t2New);

fs.writeFileSync(file, c);
console.log('Replaced');
