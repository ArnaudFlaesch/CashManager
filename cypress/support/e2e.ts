// ***********************************************************
// This example support/index.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands';
import 'cypress-wait-until';

import addContext = require('mochawesome/addContext');

import { Suite, Test } from 'mocha';
// Alternatively you can use CommonJS syntax:
// require('./commands')

// https://medium.com/egnyte-engineering/3-steps-to-awesome-test-reports-with-cypress-f4fe915bc246
Cypress.on('test:after:run', (test, runnable) => {
  if (test.state === 'failed') {
    let item: Test | Suite = runnable;
    const nameParts = [runnable.title];

    // Iterate through all parents and grab the titles
    while (item.parent) {
      nameParts.unshift(item.parent.title);
      item = item.parent;
    }

    const fullTestName = nameParts.filter(Boolean).join(' -- '); // this is how cypress joins the test title fragments

    const imageUrl = `screenshots/${Cypress.spec.name}/${fullTestName} (failed).png`;

    addContext({ test }, imageUrl);
  }

  Cypress.Commands.add(
    'shouldDisplayErrorMessage',
    (errorMessage: string): Cypress.Chainable => {
      return shouldDisplayErrorMessage(errorMessage);
    }
  );

  function shouldDisplayErrorMessage(errorMessage: string): Cypress.Chainable {
    return cy
      .get('.mat-mdc-simple-snack-bar')
      .invoke('text')
      .then((text) => {
        expect(text.trim()).equal(errorMessage);
      });
  }
});
