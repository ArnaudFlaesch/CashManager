// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add('loginAsAdmin', (): Cypress.Chainable<Response> => {
  return loginAs('admintest', 'adminpassword');
});

Cypress.Commands.add('loginAsUser', (): Cypress.Chainable<Response> => {
  return loginAs('usertest', 'userpassword');
});

function loginAs(username: string, password: string): Cypress.Chainable<Response> {
  return cy
    .request('POST', `${Cypress.env('backend_url')}/auth/login`, {
      username: username,
      password: password
    })
    .its('body')
    .then((response) => {
      window.localStorage.setItem('user', JSON.stringify(response));
    });
}
