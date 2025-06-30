import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import {
  enableProdMode,
  inject,
  isDevMode,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection
} from '@angular/core';
import localeFr from '@angular/common/locales/fr';
import { provideDateFnsAdapter } from '@angular/material-date-fns-adapter';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, Routes } from '@angular/router';
import { provideServiceWorker } from '@angular/service-worker';
import { fr } from 'date-fns/locale/fr';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { AppComponent } from './app/app.component';
import { AuthGuard } from './app/guards/auth.guard';

import { AuthService } from '@services/auth.service/auth.service';
import { ConfigService } from '@services/config.service/config.service';
import { ErrorHandlerService } from '@services/error.handler.service';
import { ExpenseService } from '@services/expense.service/expense.service';
import { LabelService } from '@services/label.service/label.service';
import { NotificationService } from '@services/notification.service/NotificationService';
import { ThemeService } from '@services/theme.service/theme.service';
import { DateUtilsService } from './app/utils/date.utils.service';
import { environment } from './environments/environment';
import { registerLocaleData } from '@angular/common';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

if (environment.production) {
  enableProdMode();
}

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./app/pages/login/login.component').then((m) => m.LoginComponent)
  },
  {
    path: 'home',
    loadComponent: () => import('./app/pages/home/home.component').then((m) => m.HomeComponent),
    canActivate: [(): AuthGuard => inject(AuthGuard)]
  },
  {
    path: 'error',
    loadComponent: () => import('./app/pages/error/error.component').then((m) => m.ErrorComponent)
  },
  { path: '**', redirectTo: 'home' }
];

registerLocaleData(localeFr);

bootstrapApplication(AppComponent, {
  providers: [
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000'
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
    provideAnimationsAsync(),
    provideHttpClient(withInterceptorsFromDi()),
    provideZonelessChangeDetection(),
    provideBrowserGlobalErrorListeners()
  ]
}).catch((err) => console.error(err));
