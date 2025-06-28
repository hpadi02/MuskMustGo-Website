module.exports = {
  apps: [
    {
      name: "muskmustgo",
      script: "server.js",
      instances: 1,
      exec_mode: "cluster",
      autorestart: true,
      watch: false,
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
      env_production: {
        NODE_ENV: "production",
        PORT: 3000,
        // Removed HOSTNAME - will use 127.0.0.1 from .env.local for security
      },
      // Restart settings
      max_restarts: 10,
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
      wait_ready: true,
      listen_timeout: 10000,

      // Load environment variables from .env.local
      env_file: ".env.local",
    },
  ],
}
