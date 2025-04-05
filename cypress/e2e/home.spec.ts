/// <reference types="cypress" />

describe('Home page tests', () => {
  beforeEach(() => {
    cy.loginAsAdmin().visit('/');
  });

  it('Should display the labels', () => {
    cy.get('#mat-tab-group-0-label-2').click();
    cy.get('.label-name')
      .should('have.length', 2)
      .eq(0)
      .should('have.text', 'Courses')
      .get('.label-name')
      .eq(1)
      .should('have.text', 'Restaurant');
  });

  it('Should add a new expense related to an existing label', () => {
    cy.clock(Date.parse('2022-04-20'));
    cy.get('#expenseAmount').clear();
    cy.get('#expenseAmount').type('120');
    cy.get('#expense-label').type('Cou');
    cy.get('.label-autocomplete-option')
      .should('have.length', 1)
      .eq(0)
      .invoke('text')
      .then((text) => {
        expect(text.trim()).equal('Courses');
      });
    cy.get('.label-autocomplete-option').eq(0).click();
    cy.get('#expense-label').should('have.value', 'Courses');
    cy.get('#expenseDate-container .mat-datepicker-toggle').click();
    cy.get('.mat-calendar-body-today').click();
    cy.get('#expenseDate').should('have.value', '20/04/2022');
    cy.clock().then((clock) => {
      clock.restore();
    });
  });
});
