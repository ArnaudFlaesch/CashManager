/// <reference types="cypress" />

import { Interception } from "cypress/types/net-stubbing";

describe("Login tests", () => {
  beforeEach(() => cy.intercept("POST", "/auth/login").as("login").visit("/login"));

  it("Should fail to login", () => {
    cy.get("#login-button").should("be.disabled");
    cy.get("#input-username").type("test");
    cy.get("#input-password").type("test");
    cy.get("#login-button").should("be.enabled").click();
    cy.wait("@login").then((request: Interception) => {
      expect(request.response.statusCode).to.equal(401);
      cy.shouldDisplayErrorMessage("Erreur lors de la connexion de l'utilisateur.");
    });
  });

  it("Should login and logout", () => {
    cy.get("#input-username").type("admintest");
    cy.get("#input-password").type("adminpassword");
    cy.get("#login-button").should("be.enabled").click();
    cy.wait("@login").then((request: Interception) => {
      expect(request.response.statusCode).to.equal(200);
    });
    cy.url().should("be.equal", `${Cypress.config("baseUrl")}home`);
    cy.get("#cashmanager-menu").click();
    cy.get("#logout-button").click();
    cy.get("#login-page-title").should("have.text", "CashManager");
    cy.url().should("be.equal", `${Cypress.config("baseUrl")}login`);
    cy.window().its("localStorage").invoke("getItem", "user").should("be.null");
  });
});
