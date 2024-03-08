import { enableProdMode, isDevMode, importProvidersFrom } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';


import { environment } from './environments/environment';
import { AppComponent } from './app/app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { NgChartsModule } from 'ng2-charts';
import { withInterceptorsFromDi, provideHttpClient } from '@angular/common/http';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDateFnsModule } from '@angular/material-date-fns-adapter';
import { MatBadgeModule } from '@angular/material/badge';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app/app-routing.module';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { fr } from 'date-fns/locale/fr';
import { MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import { DateUtilsService } from './app/utils/date.utils.service';
import { ThemeService } from './app/services/theme.service/theme.service';
import { NotificationService } from './app/services/notification.service/NotificationService';
import { ErrorHandlerService } from './app/services/error.handler.service';
import { ConfigService } from './app/services/config.service/config.service';
import { ExpenseService } from './app/services/expense.service/expense.service';
import { LabelService } from './app/services/label.service/label.service';
import { AuthService } from './app/services/auth.service/auth.service';
import { AuthGuard } from './app/guards/auth.guard';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
    providers: [
        importProvidersFrom(BrowserModule, AppRoutingModule, FormsModule, MatAutocompleteModule, MatButtonModule, MatDatepickerModule, MatDividerModule, MatMenuModule, MatDialogModule, MatIconModule, MatInputModule, MatFormFieldModule, MatNativeDateModule, MatProgressSpinnerModule, MatBadgeModule, MatDateFnsModule, MatTooltipModule, MatSlideToggleModule, MatSelectModule, MatTabsModule, MatSnackBarModule, NgChartsModule, ReactiveFormsModule, ServiceWorkerModule.register('ngsw-worker.js', {
            enabled: !isDevMode(),
            // Register the ServiceWorker as soon as the application is stable
            // or after 30 seconds (whichever comes first).
            registrationStrategy: 'registerWhenStable:30000'
        })),
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
        provideAnimations(),
        provideHttpClient(withInterceptorsFromDi())
    ]
})
  .catch((err) => console.error(err));
