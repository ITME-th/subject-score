const fs = require('fs');
let f = 'src/components/dashboard/AtRiskAlerts.tsx';
let c = fs.readFileSync(f, 'utf8');

c = c.replace("href={\\`/courses/\\${alert.course.id}/scores\\`}", "href={`/courses/${alert.course.id}/scores`}");

fs.writeFileSync(f, c);
console.log('Fixed AtRiskAlerts');
