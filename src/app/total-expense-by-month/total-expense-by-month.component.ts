import { Label } from './../model/Label';
import { LabelService } from './../services/label.service/label.service';
import { Component } from '@angular/core';
import { ChartConfiguration, ChartEvent } from 'chart.js';
import { format, isBefore } from 'date-fns';
import { ITotalExpenseByMonth } from '../model/ITotalExpenseByMonth';
import { ExpenseService } from '../services/expense.service/expense.service';

@Component({
  selector: 'app-total-expense-by-month',
  templateUrl: './total-expense-by-month.component.html',
  styleUrls: ['./total-expense-by-month.component.scss']
})
export class TotalExpenseByMonthComponent {
  public labels: Label[] = [];
  private selectedLabelId = 0;

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

  constructor(
    private expenseService: ExpenseService,
    private labelService: LabelService
  ) {
    this.getTotalExpensesByMonth();
    this.labelService.getLabels().subscribe({
      next: (labels) => {
        this.labels = labels;
      }
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
    data.sort((dataA, dataB) => (isBefore(dataA.date, dataB.date) ? -1 : 1));
    this.totalExpensesByMonthChart = {
      labels: data.map((totalByMonth) =>
        format(totalByMonth.date, 'MMMM yyyy')
      ),
      datasets: [
        {
          label: 'Total des dépenses',
          data: data.map((totalByMonth) => totalByMonth.total)
        }
      ]
    };
  }

  public selectLabel(labelId: number) {
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

  public isLabelSelected(labelId: number) {
    return this.selectedLabelId === labelId;
  }

  public handleChartClickedEvent({
    event,
    active
  }: {
    event?: ChartEvent;
    active?: Record<string, unknown>[];
  }): void {
    console.log(event, active);
  }
}
