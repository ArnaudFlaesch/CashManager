import { LabelService } from './services/label.service/label.service';
import { MatDialogModule } from '@angular/material/dialog';
import { LoginComponent } from './login/login.component';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { HomeComponent } from './home/home.component';
import { AuthGuard } from './guards/auth.guard';
import { AuthService } from './services/auth.service/auth.service';
import { ExpenseService } from './services/expense.service/expense.service';
import { HttpClientModule } from '@angular/common/http';
import { ErrorHandlerService } from './services/error.handler.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { NgChartsModule } from 'ng2-charts';

@NgModule({
  declarations: [AppComponent, LoginComponent, HomeComponent],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    MatButtonModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    HttpClientModule,
    NgChartsModule
  ],
  providers: [
    AuthService,
    LabelService,
    ExpenseService,
    ErrorHandlerService,
    AuthGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
