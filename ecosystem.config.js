module.exports = {
  apps: [
    {
      name: "musk-must-go-app",
      script: "server.js",
      instances: "max", // Use all available CPU cores
      exec_mode: "cluster",
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

      // Force the app to use the specified port
      node_args: "--port=3000",

      // Load environment variables from .env.local
      env_file: ".env.local",
    },
  ],
}
