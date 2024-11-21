const { defineConfig } = require("cypress");

module.exports = defineConfig({
  component: {
    devServer: {
      framework: "create-react-app",
      bundler: "webpack",
    },
  },

  e2e: {
    supportFile: "cypress/support/e2e.js", 
    specPattern: "cypress/integration/**/*.spec.js",
    baseUrl: "http://localhost:3000",
    setupNodeEvents(on, config) {
      require('@cypress/code-coverage/task')(on, config);
      return config;
    },
  },
});
