const fs = require("fs")
const path = require("path")

// Read current package.json
const packageJsonPath = path.join(process.cwd(), "package.json")
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"))

// Add nodemailer to dependencies
if (!packageJson.dependencies) {
  packageJson.dependencies = {}
}

packageJson.dependencies["nodemailer"] = "^6.9.8"

// Add types for nodemailer to devDependencies
if (!packageJson.devDependencies) {
  packageJson.devDependencies = {}
}

packageJson.devDependencies["@types/nodemailer"] = "^6.4.14"

// Write updated package.json
fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2))

console.log("✅ Added nodemailer and @types/nodemailer to package.json")
console.log('📦 Run "npm install" to install the new dependencies')
