import { ComponentFixture, TestBed } from "@angular/core/testing";

import { getElement, queryElement } from "@testing/dom";
import { Label } from "../label";
import { LabelList } from "./label-list";

describe("LabelList", () => {
  let fixture: ComponentFixture<LabelList>;

  const labels: Label[] = [
    { id: 1, label: "Courses", userId: 1 },
    { id: 2, label: "Restaurant", userId: 1 }
  ];

  beforeEach(() => {
    fixture = TestBed.createComponent(LabelList);
  });

  it("Should display a message when there is no label", async () => {
    await fixture.whenStable();
    expect(queryElement(fixture, "#no-label-message")).not.toBeNull();
  });

  it("Should display the labels", async () => {
    fixture.componentRef.setInput("expenseLabels", labels);
    await fixture.whenStable();
    const names = (fixture.nativeElement as HTMLElement).querySelectorAll<HTMLElement>(
      ".label-name"
    );
    expect(Array.from(names, (name) => name.textContent)).toEqual(["Courses", "Restaurant"]);
    expect(queryElement(fixture, "#no-label-message")).toBeNull();
  });

  it("Should request the deletion of the clicked label", async () => {
    const deletionRequestedSpy = vi.spyOn(fixture.componentInstance.labelDeletionRequested, "emit");
    fixture.componentRef.setInput("expenseLabels", labels);
    await fixture.whenStable();

    getElement(fixture, ".delete-label-button", HTMLButtonElement).click();

    expect(deletionRequestedSpy).toHaveBeenCalledWith(1);
  });
});
