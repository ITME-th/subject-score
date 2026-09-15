const fs = require('fs');
let file = 'src/app/(dashboard)/page.tsx';
let c = fs.readFileSync(file, 'utf8');

if(!c.includes('AtRiskAlerts')) {
  c = c.replace('import SearchBox from "@/components/dashboard/SearchBox";', 'import SearchBox from "@/components/dashboard/SearchBox";\nimport AtRiskAlerts from "@/components/dashboard/AtRiskAlerts";');
  c = c.replace('<SearchBox />', '<SearchBox />\n      <AtRiskAlerts />');
  fs.writeFileSync(file, c);
  console.log('Injected AtRiskAlerts');
}
