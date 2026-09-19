const fs = require('fs');

// Fix 1: page.tsx ternary sibling issue
let pageFile = 'src/app/(dashboard)/page.tsx';
let pCode = fs.readFileSync(pageFile, 'utf8');

// The ternary is: {recentCourses.length === 0 ? (...) : ( <table... /> <div...>...</div> )}
// We need to wrap the false branch in <></>
if (!pCode.includes('<>\n            <table className="hidden md:table w-full text-left">')) {
  pCode = pCode.replace(
    '<table className="hidden md:table w-full text-left">',
    '<>\n            <table className="hidden md:table w-full text-left">'
  );
  pCode = pCode.replace(
    '            </div>\n          )}\n        </div>',
    '            </div>\n            </>\n          )}\n        </div>'
  );
  fs.writeFileSync(pageFile, pCode);
  console.log('Fixed page.tsx syntax error');
}

// Fix 2: courses/page.tsx extra </div>
let coursesPageFile = 'src/app/(dashboard)/courses/page.tsx';
let cpCode = fs.readFileSync(coursesPageFile, 'utf8');

if (cpCode.includes('      </div>\n      </div>\n    </div>\n  );\n}')) {
  cpCode = cpCode.replace(
    '      </div>\n      </div>\n    </div>\n  );\n}',
    '      </div>\n    </div>\n  );\n}'
  );
  fs.writeFileSync(coursesPageFile, cpCode);
  console.log('Fixed courses/page.tsx syntax error');
}
