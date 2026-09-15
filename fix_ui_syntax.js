const fs = require('fs');
let f = 'src/components/dashboard/AtRiskAlertsUI.tsx';
let c = fs.readFileSync(f, 'utf8');

c = c.split('\\`').join('`');
c = c.split('\\$').join('$');

fs.writeFileSync(f, c);
console.log('Fixed AtRiskAlertsUI properly');
