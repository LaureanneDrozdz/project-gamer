const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://frontend:5173',
    specPattern: 'cypress/e2e/**/*.cy.{js,ts}',
    setupNodeEvents(on, config) {
      on('uncaught:exception', (err, runnable) => {
        return false;
      });

      return config;
    },
  },
});
