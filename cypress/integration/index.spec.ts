/// <reference types="cypress" />

describe('Tests de la page Commandes', () => {
  it('Should display the title', () => {
    cy.visit('/').get('span').should('have.text', 'cash-manager');
  });
});
