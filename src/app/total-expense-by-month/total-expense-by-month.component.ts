import { Component, OnInit, inject, input } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconButton } from '@angular/material/button';
import { MatOption } from '@angular/material/core';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatSelect } from '@angular/material/select';
import { ChartConfiguration, ChartEvent } from 'chart.js';
import { format, isBefore } from 'date-fns';
import { fr } from 'date-fns/locale/fr';
import { BaseChartDirective } from 'ng2-charts';
import { ITotalExpenseByMonth } from '../model/ITotalExpenseByMonth';
import { ExpenseService } from '../services/expense.service/expense.service';
import { Label } from './../model/Label';

@Component({
    selector: 'app-total-expense-by-month',
    templateUrl: './total-expense-by-month.component.html',
    styleUrls: ['./total-expense-by-month.component.scss'],
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
  private expenseService = inject(ExpenseService);

  public readonly labels = input<Label[]>([]);

  readonly noLabelIdSelected = 0;
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

  constructor() {
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
