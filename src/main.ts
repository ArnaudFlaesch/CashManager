import { enableProdMode, importProvidersFrom, isDevMode } from '@angular/core';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
import {
  provideHttpClient,
  withInterceptorsFromDi
} from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatDateFnsModule,
  provideDateFnsAdapter
} from '@angular/material-date-fns-adapter';
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
import { ServiceWorkerModule } from '@angular/service-worker';
import { fr } from 'date-fns/locale/fr';
import { AppRoutingModule } from './app/app-routing.module';
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

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(
      BrowserModule,
      AppRoutingModule,
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
    provideCharts(withDefaultRegisterables()),
    provideDateFnsAdapter(),
    provideAnimations(),
    provideHttpClient(withInterceptorsFromDi())
  ]
}).catch((err) => console.error(err));
