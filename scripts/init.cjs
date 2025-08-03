const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// eslint-disable-next-line no-undef
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// pnx wrangler init requires a clean dir!
rl.question('What would you like to call your database? (only letters and dashes, like v3-mysite-com)', (dbName) => {
  // Create a new D1 database with the provided name
  const output = execSync(`wrangler d1 create ${dbName}`, { encoding: 'utf8' });
  // Find the JSON object in the output
  const match = output.match(/\{[\s\S]*?\}/);
  if (!match) {
    console.error('Could not find JSON object in wrangler output.');
    process.exit(1);
  }
  const dbInfo = JSON.parse(match[0]);
  const databaseId = dbInfo.database_id;

  // Read wrangler.jsonc from parent directory
  const wranglerPath = path.resolve(__dirname, '..', 'wrangler.jsonc');
  let wranglerContent = fs.readFileSync(wranglerPath, 'utf8');

  // Replace placeholders
  wranglerContent = wranglerContent
    .replace(/REPLACE_DATABASE_ID/g, databaseId)
    .replace(/REPLACE_DATABASE_NAME/g, dbName);

  // Write back to file
  fs.writeFileSync(wranglerPath, wranglerContent, 'utf8');

  // Output the database name to the console
  console.log(`Database ${dbName} created successfully and updated wrangler.jsonc.`);

  // Installing dependencies
  execSync('pnpm install', { stdio: 'inherit' });

  // Update wrangler types
  execSync('pnpx wrangler types', { stdio: 'inherit' });

  // Checking if wrangler is authenticated
  execSync('pnpx wrangler whoami', { stdio: 'inherit' });





  // Exit the process
  process.exit(0);
});
