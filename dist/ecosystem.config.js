module.exports = {
  apps: [
    {
      name: "anansesemfie_api",
      script: "./dist/index.js", // or index.js, dist/main.js, etc.
      interpreter: "node",
      instances: 1, // or "max" for cluster mode
      autorestart: true,
      watch: false,
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
