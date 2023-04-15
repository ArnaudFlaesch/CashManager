import { HttpErrorResponse } from '@angular/common/http';
import { Label } from '../../model/Label';
import { ErrorHandlerService } from '../../services/error.handler.service';
import { LabelService } from '../../services/label.service/label.service';
import { ExpenseViewEnum } from '../../enums/ExpenseViewEnum';
import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  public expenseView = ExpenseViewEnum.EXPENSES_BY_MONTH;
  public labels: Label[] = [];

  private ERROR_GETTING_LABELS = 'Erreur lors de la récupération des labels.';

  constructor(
    private labelService: LabelService,
    private errorHandlerService: ErrorHandlerService
  ) {
    this.getLabels();
  }

  private getLabels() {
    this.labelService.getLabels().subscribe({
      next: (labels) => {
        this.labels = labels;
      },
      error: (error: HttpErrorResponse) =>
        this.errorHandlerService.handleError(error, this.ERROR_GETTING_LABELS)
    });
  }
}
