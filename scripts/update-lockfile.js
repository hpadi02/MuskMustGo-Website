const { execSync } = require("child_process")
const fs = require("fs")

console.log("🔄 Updating pnpm lockfile...")

try {
  // Remove existing lockfile
  if (fs.existsSync("pnpm-lock.yaml")) {
    fs.unlinkSync("pnpm-lock.yaml")
    console.log("✅ Removed old pnpm-lock.yaml")
  }

  // Reinstall dependencies to generate new lockfile
  execSync("pnpm install", { stdio: "inherit" })
  console.log("✅ Generated new pnpm-lock.yaml")

  console.log("🎉 Lockfile updated successfully!")
} catch (error) {
  console.error("❌ Error updating lockfile:", error.message)
  process.exit(1)
}
