import { Component, inject, input, OnInit } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconButton } from '@angular/material/button';
import { MatOption } from '@angular/material/core';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatSelect } from '@angular/material/select';
import { ChartConfiguration } from 'chart.js';
import { format, isBefore } from 'date-fns';
import { fr } from 'date-fns/locale/fr';
import { BaseChartDirective } from 'ng2-charts';
import { ITotalExpenseByMonth } from '@model/ITotalExpenseByMonth';
import { ExpenseService } from '@services/expense.service/expense.service';
import { Label } from '@model/Label';

@Component({
  selector: 'app-total-expense-by-month',
  templateUrl: './total-expense-by-month.component.html',
  imports: [
    BaseChartDirective,
    MatFormField,
    MatLabel,
    MatSelect,
    FormsModule,
    ReactiveFormsModule,
    MatOption,
    MatIconButton,
    MatIcon
  ]
})
export class TotalExpenseByMonthComponent implements OnInit {
  public readonly labels = input<Label[]>([]);
  public readonly noLabelIdSelected = 0;
  public totalExpensesByMonthChart: ChartConfiguration['data'] | undefined = undefined;
  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: {
        display: true
      }
    }
  };
  public labelControl = new FormControl<number>(this.noLabelIdSelected);
  private selectedLabelId = this.noLabelIdSelected;
  private expenseService = inject(ExpenseService);

  public constructor() {
    this.labelControl.valueChanges.subscribe((newValue) => {
      this.selectLabel(newValue ?? this.noLabelIdSelected);
    });
  }

  public ngOnInit(): void {
    this.getTotalExpensesByMonth();
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
        this.expenseService.getTotalExpensesByMonthByLabelId(this.selectedLabelId).subscribe({
          next: (data) => this.refreshChart(data)
        });
      }
    }
  }

  public isOneLabelSelected(): boolean {
    return this.selectedLabelId !== this.noLabelIdSelected;
  }

  private getTotalExpensesByMonth(): void {
    this.expenseService.getTotalExpensesByMonth().subscribe({
      next: (data: ITotalExpenseByMonth[]) => {
        this.refreshChart(data);
      }
    });
  }

  private refreshChart(data: ITotalExpenseByMonth[]): void {
    const chartData = data.toSorted((dataA, dataB) => {
      const dateA = new Date(dataA.date);
      const dateB = new Date(dataB.date);
      if (dateA.getTime() === dateB.getTime()) return 0;
      return isBefore(dateA, dateB) ? -1 : 1;
    });
    const average =
      chartData.reduce((total, totalByMonth) => totalByMonth.total + total, 0) / chartData.length;
    this.totalExpensesByMonthChart = {
      labels: chartData.map((totalByMonth) =>
        format(new Date(totalByMonth.date), 'MMMM yyyy', { locale: fr })
      ),
      datasets: [
        {
          label: 'Total des dépenses',
          data: data.map((totalByMonth) => totalByMonth.total)
        },
        {
          label: 'Moyenne',
          data: Array(chartData.length).fill(average)
        }
      ]
    };
  }
}
