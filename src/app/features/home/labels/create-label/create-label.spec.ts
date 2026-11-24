import { HarnessLoader } from "@angular/cdk/testing";
import { TestbedHarnessEnvironment } from "@angular/cdk/testing/testbed";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MatInputHarness } from "@angular/material/input/testing";

import { getElement } from "@testing/dom";
import { CreateLabel } from "./create-label";

describe("CreateLabel", () => {
  let fixture: ComponentFixture<CreateLabel>;
  let loader: HarnessLoader;

  beforeEach(async () => {
    fixture = TestBed.createComponent(CreateLabel);
    loader = TestbedHarnessEnvironment.loader(fixture);
    await fixture.whenStable();
  });

  function getInput(): Promise<MatInputHarness> {
    return loader.getHarness(MatInputHarness.with({ selector: "#label-form" }));
  }

  function getSubmitButton(): HTMLButtonElement {
    return getElement(fixture, "#create-label-button", HTMLButtonElement);
  }

  it("Should submit the typed label", async () => {
    const labelSubmittedSpy = vi.spyOn(fixture.componentInstance.labelSubmitted, "emit");

    await (await getInput()).setValue("New label");
    getSubmitButton().click();
    await fixture.whenStable();

    expect(labelSubmittedSpy).toHaveBeenCalledWith("New label");
  });

  it("Should not submit an empty label", async () => {
    const labelSubmittedSpy = vi.spyOn(fixture.componentInstance.labelSubmitted, "emit");

    getSubmitButton().click();
    await fixture.whenStable();

    expect(labelSubmittedSpy).not.toHaveBeenCalled();
  });

  it("Should disable the button while the label is submitted", async () => {
    fixture.componentRef.setInput("isSubmitting", true);
    await fixture.whenStable();

    expect(getSubmitButton().disabled).toBe(true);
  });

  it("Should empty the form once reset", async () => {
    const input = await getInput();
    await input.setValue("New label");

    fixture.componentInstance.reset();
    await fixture.whenStable();

    expect(await input.getValue()).toBe("");
  });
});
