const fs = require('fs');
let file = 'src/components/dashboard/SearchBox.tsx';
let c = fs.readFileSync(file, 'utf8');
if (c.startsWith('import Link from "next/link";\n"use client";')) {
  c = c.replace('import Link from "next/link";\n"use client";', '"use client";\nimport Link from "next/link";');
  fs.writeFileSync(file, c);
  console.log('Fixed SearchBox top');
} else {
  console.log('Not starting with import Link... Maybe something else');
  console.log(c.substring(0, 50));
}
