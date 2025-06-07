const { createServer } = require("http")
const { parse } = require("url")
const next = require("next")

const dev = process.env.NODE_ENV !== "production"
const hostname = process.env.HOSTNAME || "localhost"
const port = process.env.PORT || 3000

console.log(`Starting server in ${dev ? "development" : "production"} mode`)
console.log(`Hostname: ${hostname}, Port: ${port}`)

// Create Next.js app
const app = next({ dev, hostname, port })
const handle = app.getRequestHandler()

app
  .prepare()
  .then(() => {
    console.log("Next.js app prepared successfully")

    createServer(async (req, res) => {
      try {
        // Parse the URL
        const parsedUrl = parse(req.url, true)

        // Handle the request with Next.js
        await handle(req, res, parsedUrl)
      } catch (err) {
        console.error("Error occurred handling", req.url, err)
        res.statusCode = 500
        res.end("internal server error")
      }
    })
      .once("error", (err) => {
        console.error("Server error:", err)
        process.exit(1)
      })
      .listen(port, hostname, () => {
        console.log(`> Ready on http://${hostname}:${port}`)
        console.log(`> Environment: ${process.env.NODE_ENV || "development"}`)

        // Signal to PM2 that the app is ready (if wait_ready is true)
        if (process.send) {
          process.send("ready")
        }
      })
  })
  .catch((err) => {
    console.error("Failed to prepare Next.js app:", err)
    process.exit(1)
  })

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM received, shutting down gracefully")
  process.exit(0)
})

process.on("SIGINT", () => {
  console.log("SIGINT received, shutting down gracefully")
  process.exit(0)
})

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err)
  process.exit(1)
})

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason)
  process.exit(1)
})
