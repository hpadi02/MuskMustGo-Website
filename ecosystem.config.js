module.exports = {
  apps: [
    {
      name: "musk-must-go-app",
      script: "server.js",
      instances: 1, // Changed from "max" to 1 for debugging
      exec_mode: "fork", // Changed from "cluster" to "fork" for easier debugging
      env: {
        NODE_ENV: "development",
        PORT: 3000,
        HOSTNAME: "localhost",
      },
      env_production: {
        NODE_ENV: "production",
        PORT: 3000,
        HOSTNAME: "0.0.0.0",
      },
      // Restart settings
      max_restarts: 3, // Reduced from 10
      min_uptime: "10s",
      max_memory_restart: "1G",

      // Logging
      log_file: "./logs/combined.log",
      out_file: "./logs/out.log",
      error_file: "./logs/error.log",
      log_date_format: "YYYY-MM-DD HH:mm Z",

      // Monitoring
      monitoring: false,

      // Advanced settings
      kill_timeout: 5000,
      wait_ready: false, // Changed from true to false
      listen_timeout: 10000,

      // Load environment variables from .env.local
      env_file: ".env.local",

      // Add some debugging options
      watch: false,
      ignore_watch: ["node_modules", "logs"],

      // Ensure proper startup
      merge_logs: true,
      time: true,
    },
  ],
}
