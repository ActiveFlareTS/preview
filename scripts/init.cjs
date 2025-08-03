try {
  const { execSync } = require('child_process');
  const fs = require('fs');
  const readline = require('readline');
  const path = require('path');
  execSync('pnpm install', { stdio: 'inherit' });
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  // Read wrangler.jsonc from parent directory
  const wranglerPath = path.resolve(__dirname, '..', 'wrangler.jsonc');
  let wranglerContent = fs.readFileSync(wranglerPath, 'utf8');

  if (wranglerContent.includes('REPLACE_DB_NAME') || wranglerContent.includes('REPLACE_DB_ID')) {
    rl.question('What would you like to call your D1 database? (only letters and dashes, like v3-mysite-com): ', (dbName) => {
  // Create a new D1 database with the provided name

      const output = execSync(`pnpx wrangler d1 create ${dbName}`, { encoding: 'utf8' });
      // Find the JSON object by removing lines until we hit a line that is just "{"
      const lines = output.split('\n');
      let jsonStartIndex = -1;

      for (let i = 0; i < lines.length; i++) {
        if (lines[i].trim() === '{') {
          jsonStartIndex = i;
          break;
        }
      }

      if (jsonStartIndex === -1) {
        console.error('Could not find JSON object in wrangler output.');
        console.log("You need to update your wrangler.jsonc with this info:");
        console.log(output);
        process.exit(1);
      }

      const jsonLines = lines.slice(jsonStartIndex);
      const jsonString = jsonLines.join('\n');
      console.log("Found JSON: ", jsonString);
      const dbInfo = JSON.parse(jsonString);
      const databaseId = dbInfo.database_id;


      // Replace placeholders
      wranglerContent = wranglerContent
        .replace(/REPLACE_DB_ID/g, databaseId)
        .replace(/REPLACE_DB_NAME/g, dbName);

      // Write back to file
      fs.writeFileSync(wranglerPath, wranglerContent, 'utf8');

      // Output the database name to the console
      console.log(`Database ${dbName} created successfully and updated wrangler.jsonc.`);


      // Update wrangler types
      execSync('pnpx wrangler types', { stdio: 'inherit' });

      // Checking if wrangler is authenticated
      execSync('pnpx wrangler whoami', { stdio: 'inherit' });

      // Exit the process
      process.exit(0);
    });
  } else {
    // Update wrangler types
    execSync('pnpx wrangler types', { stdio: 'inherit' });

    // Checking if wrangler is authenticated
    execSync('pnpx wrangler whoami', { stdio: 'inherit' });
    process.exit(0);
  }
} catch (error) {
  console.error('An error occurred:', error.message);
  process.exit(1);
}

