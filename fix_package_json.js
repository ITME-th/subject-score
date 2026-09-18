const fs = require('fs');
const pkgPath = 'package.json';
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));

pkg.scripts.postinstall = "prisma generate";

fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
console.log('Added postinstall script to package.json');
