import { ILabel } from './../model/ILabel';
import { LabelService } from './../services/label.service/label.service';
import { IExpense } from './../model/IExpense';
import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ErrorHandlerService } from '../services/error.handler.service';
import { AuthService } from './../services/auth.service/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  public labels: ILabel[] = [];

  constructor(
    private router: Router,
    private authService: AuthService,
    private labelService: LabelService,
    private errorHandlerService: ErrorHandlerService
  ) {
    this.initDashboard();
  }

  private initDashboard() {
    this.labelService.getLabels().subscribe({
      next: (labels) => {
        this.labels = labels;
      },
      error: (error: HttpErrorResponse) =>
        this.errorHandlerService.handleError(
          error.message,
          'this.ERROR_MESSAGE_INIT_DASHBOARD'
        )
    });
  }

  public logout() {
    this.authService.logout();
    this.router.navigate(['login']);
  }
}
