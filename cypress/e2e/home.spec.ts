/// <reference types="cypress" />

describe('Home page tests', () => {
  beforeEach(() => {
    cy.loginAsAdmin().visit('/');
  });

  it('Should display the labels', () => {
    cy.get('#mat-tab-label-0-2')
      .click()
      .get('.label-name')
      .should('have.length', 2)
      .eq(0)
      .should('have.text', 'Courses')
      .get('.label-name')
      .eq(1)
      .should('have.text', 'Restaurant');
  });

  it('Should add a new expense related to an existing label', () => {
    cy.clock(new Date(2022, 3, 20, 0, 0, 0).getTime())
      .get('#expenseAmount')
      .clear()
      .type('120')
      .get('#expenseDate-container .mat-datepicker-toggle')
      .click()
      .get('.mat-calendar-body-today')
      .click()
      .get('#expenseDate')
      .invoke('val')
      .then((val) => {
        expect(val).equal('20/04/2022');
      })
      .get('#expenseLabel')
      .type('Cour')
      .get('.label-autocomplete-option')
      .should('have.length', 1)
      .eq(0)
      .invoke('text')
      .then((text) => {
        expect(text.trim()).equal('Courses');
      })
      .get('.label-autocomplete-option')
      .eq(0)
      .click()
      .get('#expenseLabel')
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
