import { Label } from './../model/Label';
import { LabelService } from './../services/label.service/label.service';
import { Component } from '@angular/core';
import { ChartConfiguration, ChartEvent } from 'chart.js';
import { format, isBefore } from 'date-fns';
import { ITotalExpenseByMonth } from '../model/ITotalExpenseByMonth';
import { ExpenseService } from '../services/expense.service/expense.service';
import { ErrorHandlerService } from '../services/error.handler.service';

@Component({
  selector: 'app-total-expense-by-month',
  templateUrl: './total-expense-by-month.component.html',
  styleUrls: ['./total-expense-by-month.component.scss']
})
export class TotalExpenseByMonthComponent {
  public labels: Label[] = [];

  public totalExpensesByMonthChart: ChartConfiguration['data'] | undefined =
    undefined;

  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: {
        display: true
      }
    }
  };

  private ERROR_GETTING_LABELS = 'Erreur lors de la récupération des labels.';
  private selectedLabelId = 0;

  constructor(
    private expenseService: ExpenseService,
    private labelService: LabelService,
    private errorHandlerService: ErrorHandlerService
  ) {
    this.getLabels();
  }

  public selectLabel(labelId: number): void {
    if (this.selectedLabelId === labelId) {
      this.selectedLabelId = 0;
      this.getTotalExpensesByMonth();
    } else {
      this.selectedLabelId = labelId;
      this.expenseService
        .getTotalExpensesByMonthByLabelId(this.selectedLabelId)
        .subscribe({
          next: (data) => this.refreshChart(data)
        });
    }
  }

  public isLabelSelected(labelId: number): boolean {
    return this.selectedLabelId === labelId;
  }

  public handleChartClickedEvent({
    event,
    active
  }: {
    event?: ChartEvent;
    active?: object[];
  }): void {
    console.log(event, active);
  }

  private getLabels() {
    this.labelService.getLabels().subscribe({
      next: (labels) => {
        this.labels = labels;
        this.getTotalExpensesByMonth();
      },
      error: (error) =>
        this.errorHandlerService.handleError(error, this.ERROR_GETTING_LABELS)
    });
  }

  private getTotalExpensesByMonth(): void {
    this.expenseService.getTotalExpensesByMonth().subscribe({
      next: (data: ITotalExpenseByMonth[]) => {
        this.refreshChart(data);
      }
    });
  }

  private refreshChart(data: ITotalExpenseByMonth[]) {
    data.sort((dataA, dataB) => {
      const dateA = new Date(dataA.date);
      const dateB = new Date(dataB.date);
      if (dateA.getTime() === dateB.getTime()) return 0;
      return isBefore(dateA, dateB) ? -1 : 1;
    });
    this.totalExpensesByMonthChart = {
      labels: data.map((totalByMonth) =>
        format(new Date(totalByMonth.date), 'MMMM yyyy')
      ),
      datasets: [
        {
          label: 'Total des dépenses',
          data: data.map((totalByMonth) => totalByMonth.total)
        }
      ]
    };
  }
}
