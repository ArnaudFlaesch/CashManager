/// <reference types="cypress" />

describe('Home page tests', () => {
  beforeEach(() => {
    cy.loginAsAdmin().visit('/');
  });

  it('Should display the labels', () => {
    cy.get('#mat-tab-label-0-2').click();
    cy.get('.label-name')
      .should('have.length', 2)
      .eq(0)
      .should('have.text', 'Courses')
      .get('.label-name')
      .eq(1)
      .should('have.text', 'Restaurant');
  });

  it('Should add a new expense related to an existing label', () => {
    cy.clock(new Date(2022, 3, 20, 0, 0, 0).getTime());
    cy.get('#expenseAmount').clear();
    cy.get('#expenseAmount').type('120');
    cy.get('#expenseDate-container .mat-datepicker-toggle').click();
    cy.get('.mat-calendar-body-today').click();
    cy.get('#expenseDate')
      .invoke('val')
      .then((val) => {
        expect(val).equal('20/04/2022');
      });
    cy.get('#expenseLabel').type('Cou');
    cy.get('.label-autocomplete-option')
      .should('have.length', 1)
      .eq(0)
      .invoke('text')
      .then((text) => {
        expect(text.trim()).equal('Courses');
      });
    cy.get('.label-autocomplete-option').eq(0).click();
    cy.get('#expenseLabel')
      .invoke('val')
      .then((val) => {
        expect(val).equal('Courses');
      })
      .clock()
      .then((clock) => {
        clock.restore();
      });
  });
});
