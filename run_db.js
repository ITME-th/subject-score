const { execSync } = require('child_process');
try {
  execSync('node "node_modules/prisma/build/index.js" db push', { stdio: 'inherit' });
  execSync('node "node_modules/prisma/build/index.js" generate', { stdio: 'inherit' });
} catch (e) {
  console.error("Failed to run Prisma:", e.message);
  process.exit(1);
}
