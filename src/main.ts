/* global console */
import { registerLocaleData } from "@angular/common";
import localeFr from "@angular/common/locales/fr";
import { bootstrapApplication } from "@angular/platform-browser";
import { App } from "@app/app";
import { appConfig } from "@app/app.config";

registerLocaleData(localeFr);

bootstrapApplication(App, appConfig).catch((err) => console.error(err));
