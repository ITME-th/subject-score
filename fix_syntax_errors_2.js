const fs = require('fs');

let pageFile = 'src/app/(dashboard)/page.tsx';
let pCode = fs.readFileSync(pageFile, 'utf8');

// Find where the mobile view div closes before the )}
let target = '</div>\n\n          )}\n        </div>\n      </div>';
if (pCode.includes(target)) {
  pCode = pCode.replace(target, '</div>\n            </>\n          )}\n        </div>\n      </div>');
  fs.writeFileSync(pageFile, pCode);
  console.log('Fixed page.tsx closing tag');
} else {
  // Try another approach
  let target2 = '            </div>\n\n          )}\n        </div>';
  if (pCode.includes(target2)) {
    pCode = pCode.replace(target2, '            </div>\n            </>\n          )}\n        </div>');
    fs.writeFileSync(pageFile, pCode);
    console.log('Fixed page.tsx closing tag (2)');
  }
}
