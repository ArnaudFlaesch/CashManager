/* global console */
import { registerLocaleData } from "@angular/common";
import localeFr from "@angular/common/locales/fr";
import { bootstrapApplication } from "@angular/platform-browser";
import { AppComponent } from "@app/app.component";
import { appConfig } from "@app/app.config";

registerLocaleData(localeFr);

bootstrapApplication(AppComponent, appConfig).catch((err) => console.error(err));
