/// <reference types="cypress" />

import { Interception } from 'cypress/types/net-stubbing';

describe('Login tests', () => {
  beforeEach(() => cy.intercept('POST', '/auth/login').as('login').visit('/'));

  it('Should fail to login', () => {
    cy.get('#loginButton')
      .should('be.disabled')
      .get('#inputUsername')
      .type('test')
      .get('#inputPassword')
      .type('test')
      .get('#loginButton')
      .should('be.enabled')
      .click()
      .wait('@login')
      .then((request: Interception) => {
        expect(request.response.statusCode).to.equal(401);
        cy.get('.mat-simple-snackbar').should(
          'have.text',
          "Erreur lors de la connexion de l'utilisateur."
        );
      });
  });

  it('Should login and logout', () => {
    cy.get('#inputUsername')
      .clear()
      .type('admintest')
      .get('#inputPassword')
      .clear()
      .type('adminpassword')
      .get('#loginButton')
      .should('be.enabled')
      .click()
      .wait('@login')
      .then((request: Interception) => {
        expect(request.response.statusCode).to.equal(200);
        cy.reload()
          .url()
          .should('be.equal', `${Cypress.config('baseUrl')}home`)
          .get('#logoutButton')
          .click()
          .waitUntil(() =>
            cy
              .get('#loginPageTitle')
              .should('have.text', 'Dash')
              .url()
              .should('be.equal', `${Cypress.config('baseUrl')}login`)
          )
          .then(() => expect(localStorage.getItem('user')).to.be.null);
      });
  });
});
