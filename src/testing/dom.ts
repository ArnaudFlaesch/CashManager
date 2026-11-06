import { ComponentFixture } from "@angular/core/testing";

/** Element rendered by the fixture that matches the selector, or null when there is none. */
export function queryElement(fixture: ComponentFixture<unknown>, selector: string): Element | null {
  return (fixture.nativeElement as HTMLElement).querySelector(selector);
}

/**
 * Element rendered by the fixture that matches the selector.
 * Fails the test when there is none, or when it is not of the expected type.
 */
export function getElement<T extends Element>(
  fixture: ComponentFixture<unknown>,
  selector: string,
  type: abstract new () => T
): T {
  const element = queryElement(fixture, selector);
  if (!(element instanceof type)) {
    throw new Error(`No ${type.name} matches "${selector}"`);
  }
  return element;
}
