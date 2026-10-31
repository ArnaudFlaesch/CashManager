import "./commands";

import addContext from "mochawesome/addContext";

import { Suite, Test } from "mocha";

// Attach the screenshot of each failed test to the mochawesome report
// https://medium.com/egnyte-engineering/3-steps-to-awesome-test-reports-with-cypress-f4fe915bc246
Cypress.on("test:after:run", (test, runnable) => {
  if (test.state === "failed") {
    let item: Test | Suite = runnable;
    const nameParts = [runnable.title];

    // Iterate through all parents and grab the titles
    while (item.parent) {
      nameParts.unshift(item.parent.title);
      item = item.parent;
    }

    const fullTestName = nameParts.filter(Boolean).join(" -- "); // this is how cypress joins the test title fragments

    const imageUrl = `screenshots/${Cypress.spec.relative.replace("cypress/e2e/", "")}/${fullTestName} (failed).png`;

    addContext({ test }, imageUrl);
  }
});
