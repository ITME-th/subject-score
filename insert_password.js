const fs = require('fs');
let envFile = fs.readFileSync('.env', 'utf8');
envFile = envFile.replace(/\[YOUR-PASSWORD\]/g, '0630718922Rodee');
fs.writeFileSync('.env', envFile);
console.log('Password inserted into .env');
