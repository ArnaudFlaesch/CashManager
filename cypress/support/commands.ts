Cypress.Commands.add("loginAsAdmin", (): Cypress.Chainable => {
  return loginAs("admintest", "adminpassword");
});

Cypress.Commands.add("loginAsUser", (): Cypress.Chainable => {
  return loginAs("usertest", "userpassword");
});

Cypress.Commands.add("shouldDisplayErrorMessage", (errorMessage: string): Cypress.Chainable => {
  return shouldDisplayErrorMessage(errorMessage);
});

function loginAs(username: string, password: string): Cypress.Chainable {
  return cy
    .request("POST", `${Cypress.expose("backend_url")}/auth/login`, {
      username: username,
      password: password
    })
    .its("body")
    .then((response) => {
      window.localStorage.setItem("user", JSON.stringify(response));
    });
}

function shouldDisplayErrorMessage(errorMessage: string): Cypress.Chainable {
  return cy
    .get(".mat-mdc-simple-snack-bar")
    .invoke("text")
    .then((text) => {
      expect(text.trim()).equal(errorMessage);
    });
}
