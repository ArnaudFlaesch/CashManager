import { Label } from './../model/Label';
import { LabelService } from './../services/label.service/label.service';
import { Component } from '@angular/core';
import { ChartConfiguration, ChartEvent } from 'chart.js';
import { format, isBefore } from 'date-fns';
import { ITotalExpenseByMonth } from '../model/ITotalExpenseByMonth';
import { ExpenseService } from '../services/expense.service/expense.service';
import { ErrorHandlerService } from '../services/error.handler.service';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgChartsModule } from 'ng2-charts';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';
import { MatOption } from '@angular/material/core';
import { NgFor, NgIf } from '@angular/common';
import { MatSelect } from '@angular/material/select';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { fr } from 'date-fns/locale/fr';

@Component({
  selector: 'app-total-expense-by-month',
  templateUrl: './total-expense-by-month.component.html',
  styleUrls: ['./total-expense-by-month.component.scss'],
  standalone: true,
  imports: [
    MatFormField,
    MatLabel,
    MatSelect,
    FormsModule,
    ReactiveFormsModule,
    NgFor,
    MatOption,
    NgIf,
    MatIconButton,
    MatIcon,
    NgChartsModule
  ]
})
export class TotalExpenseByMonthComponent {
  readonly noLabelIdSelected = 0;

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
  public labelControl = new FormControl<number>(this.noLabelIdSelected);

  private ERROR_GETTING_LABELS = 'Erreur lors de la récupération des labels.';
  private selectedLabelId = this.noLabelIdSelected;

  constructor(
    private expenseService: ExpenseService,
    private labelService: LabelService,
    private errorHandlerService: ErrorHandlerService
  ) {
    this.getLabels();
    this.labelControl.valueChanges.subscribe((newValue) => {
      this.selectLabel(newValue ?? this.noLabelIdSelected);
    });
  }

  public resetSelectedLabel(): void {
    this.labelControl.setValue(this.noLabelIdSelected);
  }

  public selectLabel(labelId: number): void {
    if (this.selectedLabelId !== labelId) {
      this.selectedLabelId = labelId;
      if (this.selectedLabelId === this.noLabelIdSelected) {
        this.getTotalExpensesByMonth();
      } else {
        this.expenseService
          .getTotalExpensesByMonthByLabelId(this.selectedLabelId)
          .subscribe({
            next: (data) => this.refreshChart(data)
          });
      }
    }
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

  public isOneLabelSelected(): boolean {
    return this.selectedLabelId !== this.noLabelIdSelected;
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
        format(new Date(totalByMonth.date), 'MMMM yyyy', { locale: fr })
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
