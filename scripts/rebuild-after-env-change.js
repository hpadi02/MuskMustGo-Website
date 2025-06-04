const { execSync } = require("child_process")
const fs = require("fs")
const path = require("path")

console.log("🔄 Checking for environment variable changes...")

// Path to the .env.local file
const envPath = path.join(process.cwd(), ".env.local")

// Check if .env.local exists
if (!fs.existsSync(envPath)) {
  console.log("❌ .env.local file not found. Please create it first.")
  process.exit(1)
}

// Read the current .env.local file
const envContent = fs.readFileSync(envPath, "utf8")

// Create a hash of the env file content
const crypto = require("crypto")
const currentHash = crypto.createHash("md5").update(envContent).digest("hex")

// Path to store the previous hash
const hashPath = path.join(process.cwd(), ".env.hash")

// Check if the hash file exists
let previousHash = ""
if (fs.existsSync(hashPath)) {
  previousHash = fs.readFileSync(hashPath, "utf8")
}

// Compare hashes
if (currentHash !== previousHash) {
  console.log("🔄 Environment variables have changed. Rebuilding...")

  try {
    // Run the build command
    console.log("🏗️ Running npm run build...")
    execSync("npm run build", { stdio: "inherit" })

    // Restart PM2
    console.log("🔄 Restarting PM2...")
    execSync("pm2 restart ecosystem.config.js", { stdio: "inherit" })

    // Save the new hash
    fs.writeFileSync(hashPath, currentHash)

    console.log("✅ Rebuild and restart completed successfully!")
  } catch (error) {
    console.error("❌ Error during rebuild:", error.message)
    process.exit(1)
  }
} else {
  console.log("✅ No changes detected in environment variables.")
}
