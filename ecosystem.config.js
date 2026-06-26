// PM2 process config for running Healthy Logs on a Hostinger VPS.
//   pm2 start ecosystem.config.js     # start
//   pm2 reload ecosystem.config.js    # zero-downtime reload after a rebuild
//   pm2 logs healthy-logs             # tail logs
//
// Runs `next start` (the production Node server) on port 3000; nginx proxies to it.
module.exports = {
  apps: [
    {
      name: "healthy-logs",
      script: "node_modules/next/dist/bin/next",
      args: "start -p 3000",
      cwd: __dirname,
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      max_memory_restart: "512M",
      env: {
        NODE_ENV: "production",
        PORT: "3000",
      },
    },
  ],
};
