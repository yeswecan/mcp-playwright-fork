const { execSync } = require('child_process');

try {
  console.log("Running tests with coverage...");
  execSync('npx jest --no-cache --coverage', { stdio: 'inherit' });
  console.log("Tests completed successfully!");
} catch (error) {
  console.error("Error running tests:", error.message);
  console.log(error.stdout?.toString() || "No output");
  process.exit(1);
} 