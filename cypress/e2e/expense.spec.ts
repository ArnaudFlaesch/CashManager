/// <reference types="cypress" />

import { Interception } from 'cypress/types/net-stubbing';

describe('Home page tests', () => {
  beforeEach(() => {
    cy.loginAsAdmin().visit('/');
  });

  it('Should create a label, add an expense to it and then delete the label', () => {
    cy.intercept('POST', '/label/addLabel').as('addLabel');
    cy.clock(Date.parse('2023-05-15'));

    cy.get('#mat-tab-label-0-2').click();
    cy.get('#label-form').type('Vacances');
    cy.get('#create-label-button').click();
    cy.wait('@addLabel').then((request: Interception) => {
      expect(request.response.statusCode).to.equal(200);
      cy.get('.label-list').should('have.length', 3);

      cy.get('#mat-tab-label-0-0').click();

      cy.get('#expenseAmount').clear();
      cy.get('#expenseAmount').type('120');
      cy.get('#expenseDate-container .mat-datepicker-toggle').click();
      cy.get('.mat-calendar-body-today').dblclick();
      cy.get('#expenseDate').should('have.value', '15/05/2023');
      cy.get('#expense-label').type('Vac');
      cy.get('.label-autocomplete-option')
        .should('have.length', 1)
        .eq(0)
        .invoke('text')
        .then((text) => {
          expect(text.trim()).equal('Vacances');
        });
      cy.get('.label-autocomplete-option').eq(0).click();
      cy.get('#expense-label').should('have.value', 'Vacances');

      cy.get('#mat-tab-label-0-2').click();
      cy.intercept('DELETE', '/label/deleteLabel?labelId=*').as('deleteLabel');
      cy.get('.deleteLabelButton:nth(2)').click();
      cy.get('#validateAction').click();

      cy.wait('@deleteLabel').then((request: Interception) => {
        expect(request.response.statusCode).to.equal(200);
        cy.get('.label-list').should('have.length', 2);
        cy.clock().then((clock) => {
          clock.restore();
        });
      });
    });
  });
});
