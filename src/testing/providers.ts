import { EnvironmentProviders, Provider } from "@angular/core";
import { MATERIAL_ANIMATIONS } from "@angular/material/core";

/** Providers of every unit test, see the `providersFile` option of the test builder. */
const testProviders: (Provider | EnvironmentProviders)[] = [
  // jsdom runs no CSS transition, so the components waiting for one (tabs, menus) never settle
  { provide: MATERIAL_ANIMATIONS, useValue: { animationsDisabled: true } }
];

export default testProviders;
