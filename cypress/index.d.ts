/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    loginAsAdmin(): Chainable<Response>;
    loginAsUser(): Chainable<Response>;
  }
}
