/*eslint-disable*/
// setup.js (CommonJS version)
const fs = require("fs");
const { execSync } = require("child_process");
const path = require("path");

const packageJsonPath = path.join(process.cwd(), "package.json");
const packageData = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));

// ask for a new name (optional — or you can pass as CLI arg)
const newName = process.argv[2] || "my-new-project";
packageData.name = newName;

// clear repository info
delete packageData.repository;
delete packageData.bugs;
delete packageData.homepage;

// write updated package.json
fs.writeFileSync(packageJsonPath, JSON.stringify(packageData, null, 2), "utf-8");

console.log("✅ package.json updated.");

// remove old lock file and reinstall dependencies
console.log("🧹 Regenerating package-lock.json...");
execSync("rm -f package-lock.json && npm install", { stdio: "inherit" });

console.log("✨ Setup complete!");
