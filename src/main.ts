import { registerLocaleData } from "@angular/common";
import { provideHttpClient, withInterceptors } from "@angular/common/http";
import localeFr from "@angular/common/locales/fr";
import { isDevMode, provideBrowserGlobalErrorListeners } from "@angular/core";
import { provideDateFnsAdapter } from "@angular/material-date-fns-adapter";
import { MAT_DATE_LOCALE } from "@angular/material/core";
import { bootstrapApplication } from "@angular/platform-browser";
import { provideRouter } from "@angular/router";
import { provideServiceWorker } from "@angular/service-worker";
import { fr } from "date-fns/locale/fr";
import { provideCharts, withDefaultRegisterables } from "ng2-charts";
import { AppComponent } from "./app/app.component";
import { routes } from "./app/app.routes";
import { authInterceptor } from "./app/interceptors/auth.interceptor";

registerLocaleData(localeFr);

bootstrapApplication(AppComponent, {
  providers: [
    provideServiceWorker("ngsw-worker.js", {
      enabled: !isDevMode(),
      registrationStrategy: "registerWhenStable:30000"
    }),
    { provide: MAT_DATE_LOCALE, useValue: fr },
    provideRouter(routes),
    provideCharts(withDefaultRegisterables()),
    provideDateFnsAdapter(),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideBrowserGlobalErrorListeners()
  ]
}).catch((err) => console.error(err));
