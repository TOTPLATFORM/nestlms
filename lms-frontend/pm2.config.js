//https://pm2.keymetrics.io/docs/usage/application-declaration/
module.exports = {
  name: "lmsfrontend", // Name of your application
  script: "server.js", // Entry point of your application
  interpreter: "node", // Path to the Bun interpreter
  //interpreter_args: '--bun', // Option to pass to the interpreter
  env: {
    PORT: 3001,
    NODE_ENV: "development",
  },
  env_production: {
    PORT: 3001,
    NODE_ENV: "production",
  },
  env_test: {
    PORT: 3001,
    NODE_ENV: "production",
  },
  env_demo: {
    PORT: 3001,
    NODE_ENV: "production",
  },
};
