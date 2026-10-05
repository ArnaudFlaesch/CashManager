import { registerLocaleData } from "@angular/common";
import { provideHttpClient, withInterceptorsFromDi, withXhr } from "@angular/common/http";
import localeFr from "@angular/common/locales/fr";
import { enableProdMode, isDevMode, provideBrowserGlobalErrorListeners } from "@angular/core";
import { provideDateFnsAdapter } from "@angular/material-date-fns-adapter";
import { MAT_DATE_LOCALE } from "@angular/material/core";
import { bootstrapApplication } from "@angular/platform-browser";
import { provideRouter } from "@angular/router";
import { provideServiceWorker } from "@angular/service-worker";
import { AuthService } from "@services/auth.service/auth.service";
import { ConfigService } from "@services/config.service/config.service";
import { ErrorHandlerService } from "@services/error.handler.service";
import { ExpenseService } from "@services/expense.service/expense.service";
import { LabelService } from "@services/label.service/label.service";
import { NotificationService } from "@services/notification.service/NotificationService";
import { ThemeService } from "@services/theme.service/theme.service";
import { fr } from "date-fns/locale/fr";
import { provideCharts, withDefaultRegisterables } from "ng2-charts";
import { AppComponent } from "./app/app.component";
import { routes } from "./app/app.routes";
import { AuthGuard } from "./app/guards/auth.guard";
import { DateUtilsService } from "./app/utils/date.utils.service";
import { environment } from "./environments/environment";

if (environment.production) {
  enableProdMode();
}

registerLocaleData(localeFr);

bootstrapApplication(AppComponent, {
  providers: [
    provideServiceWorker("ngsw-worker.js", {
      enabled: !isDevMode(),
      registrationStrategy: "registerWhenStable:30000"
    }),
    AuthGuard,
    AuthService,
    LabelService,
    ExpenseService,
    ConfigService,
    ErrorHandlerService,
    NotificationService,
    ThemeService,
    DateUtilsService,
    { provide: MAT_DATE_LOCALE, useValue: fr },
    provideRouter(routes),
    provideCharts(withDefaultRegisterables()),
    provideDateFnsAdapter(),
    provideHttpClient(withXhr(), withInterceptorsFromDi()),
    provideBrowserGlobalErrorListeners()
  ]
}).catch((err) => console.error(err));
