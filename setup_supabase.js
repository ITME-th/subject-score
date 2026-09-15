const fs = require('fs');

// 1. Update schema.prisma
let schema = fs.readFileSync('prisma/schema.prisma', 'utf8');
schema = schema.replace('provider = "sqlite"', 'provider = "postgresql"');
schema = schema.replace('url      = env("DATABASE_URL")', 'url      = env("DATABASE_URL")\n  directUrl = env("DIRECT_URL")');
fs.writeFileSync('prisma/schema.prisma', schema);

// 2. Update .env
let envFile = 'DATABASE_URL="postgresql://postgres.urshdaqjlghwpmfpjhty:[YOUR-PASSWORD]@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true"\n';
envFile += 'DIRECT_URL="postgresql://postgres.urshdaqjlghwpmfpjhty:[YOUR-PASSWORD]@aws-0-ap-northeast-1.pooler.supabase.com:5432/postgres"\n';
fs.writeFileSync('.env', envFile);

// 3. Delete prisma/migrations (since we are switching DB providers)
const path = require('path');
const migrationsPath = path.join(__dirname, 'prisma', 'migrations');
if (fs.existsSync(migrationsPath)) {
  fs.rmSync(migrationsPath, { recursive: true, force: true });
}

console.log('Ready for Supabase!');
