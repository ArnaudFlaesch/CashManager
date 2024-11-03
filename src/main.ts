import { registerLocaleData } from '@angular/common';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import localeFr from '@angular/common/locales/fr';
import { enableProdMode, importProvidersFrom, inject, isDevMode } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDateFnsModule, provideDateFnsAdapter } from '@angular/material-date-fns-adapter';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { Routes, provideRouter } from '@angular/router';
import { ServiceWorkerModule } from '@angular/service-worker';
import { fr } from 'date-fns/locale/fr';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { AppComponent } from './app/app.component';
import { AuthGuard } from './app/guards/auth.guard';

import { AuthService } from './app/services/auth.service/auth.service';
import { ConfigService } from './app/services/config.service/config.service';
import { ErrorHandlerService } from './app/services/error.handler.service';
import { ExpenseService } from './app/services/expense.service/expense.service';
import { LabelService } from './app/services/label.service/label.service';
import { NotificationService } from './app/services/notification.service/NotificationService';
import { ThemeService } from './app/services/theme.service/theme.service';
import { DateUtilsService } from './app/utils/date.utils.service';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./app/pages/login/login.component').then((m) => m.LoginComponent)
  },
  {
    path: 'home',
    loadComponent: () => import('./app/pages/home/home.component').then((m) => m.HomeComponent),
    canActivate: [() => inject(AuthGuard)]
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
    importProvidersFrom(
      BrowserModule,
      FormsModule,
      MatAutocompleteModule,
      MatButtonModule,
      MatDatepickerModule,
      MatDividerModule,
      MatMenuModule,
      MatDialogModule,
      MatIconModule,
      MatInputModule,
      MatFormFieldModule,
      MatNativeDateModule,
      MatProgressSpinnerModule,
      MatBadgeModule,
      MatDateFnsModule,
      MatTooltipModule,
      MatSlideToggleModule,
      MatSelectModule,
      MatTabsModule,
      MatSnackBarModule,
      ReactiveFormsModule,
      ServiceWorkerModule.register('ngsw-worker.js', {
        enabled: !isDevMode(),
        // Register the ServiceWorker as soon as the application is stable
        // or after 30 seconds (whichever comes first).
        registrationStrategy: 'registerWhenStable:30000'
      })
    ),
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
    provideAnimations(),
    provideHttpClient(withInterceptorsFromDi())
  ]
}).catch((err) => console.error(err));
