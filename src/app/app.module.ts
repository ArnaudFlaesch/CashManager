import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDateFnsModule } from '@angular/material-date-fns-adapter';
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
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import fr from 'date-fns/locale/fr';
import { NgChartsModule } from 'ng2-charts';

import { ConfigService } from './../app/services/config.service/config.service';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CreateExpenseComponent } from './create-expense/create-expense.component';
import { ExpenseListByMonthComponent } from './expense-list-by-month/expense-list-by-month.component';
import { HeaderComponent } from './header/header.component';
import { LabelListComponent } from './label-list/label-list.component';
import { ConfirmModalComponent } from './modals/confirm-modal/confirm-modal.component';
import { ImportConfigModalComponent } from './modals/import-config-modal/import-config-modal.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { ErrorComponent } from './pages/error/error.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { DateFormatPipe } from './pipes/date-format.pipe';
import { AuthService } from './services/auth.service/auth.service';
import { ErrorHandlerService } from './services/error.handler.service';
import { ExpenseService } from './services/expense.service/expense.service';
import { LabelService } from './services/label.service/label.service';
import { NotificationService } from './services/notification.service/NotificationService';
import { ThemeService } from './services/theme.service/theme.service';
import { TotalExpenseByMonthComponent } from './total-expense-by-month/total-expense-by-month.component';
import { DateUtilsService } from './utils/date.utils.service';
import { AuthGuard } from './guards/auth.guard';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    ErrorComponent,
    ImportConfigModalComponent,
    NotificationsComponent,
    CreateExpenseComponent,
    HeaderComponent,
    ExpenseListByMonthComponent,
    TotalExpenseByMonthComponent,
    LabelListComponent,
    ConfirmModalComponent,
    DateFormatPipe
  ],
  imports: [
    BrowserAnimationsModule,
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
    HttpClientModule,
    NgChartsModule,
    ReactiveFormsModule
  ],
  providers: [
    AuthGuard,
    AuthService,
    LabelService,
    ExpenseService,
    ConfigService,
    ErrorHandlerService,
    NotificationService,
    ThemeService,
    DateUtilsService,
    { provide: MAT_DATE_LOCALE, useValue: fr }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
