import { provideHttpClient, withInterceptors } from "@angular/common/http";
import { ApplicationConfig, isDevMode, provideBrowserGlobalErrorListeners } from "@angular/core";
import { provideDateFnsAdapter } from "@angular/material-date-fns-adapter";
import { MAT_DATE_LOCALE } from "@angular/material/core";
import { MAT_DIALOG_DEFAULT_OPTIONS, MatDialogConfig } from "@angular/material/dialog";
import { provideRouter } from "@angular/router";
import { provideServiceWorker } from "@angular/service-worker";
import { fr } from "date-fns/locale/fr";
import { provideCharts, withDefaultRegisterables } from "ng2-charts";
import { authInterceptor } from "@core/auth/auth-interceptor";
import { routes } from "./app.routes";

export const appConfig: ApplicationConfig = {
  providers: [
    provideServiceWorker("ngsw-worker.js", {
      enabled: !isDevMode(),
      registrationStrategy: "registerWhenStable:30000"
    }),
    { provide: MAT_DATE_LOCALE, useValue: fr },
    // Dialogs never overflow small screens
    {
      provide: MAT_DIALOG_DEFAULT_OPTIONS,
      useValue: Object.assign(new MatDialogConfig(), { maxWidth: "calc(100vw - 2rem)" })
    },
    provideRouter(routes),
    provideCharts(withDefaultRegisterables()),
    provideDateFnsAdapter(),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideBrowserGlobalErrorListeners()
  ]
};
