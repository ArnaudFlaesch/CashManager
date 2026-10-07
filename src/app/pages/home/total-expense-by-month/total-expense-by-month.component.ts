import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  input,
  OnInit,
  signal
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { FormField, form } from "@angular/forms/signals";
import { MatIconButton } from "@angular/material/button";
import { MatOption } from "@angular/material/core";
import { MatFormField, MatLabel } from "@angular/material/form-field";
import { MatIcon } from "@angular/material/icon";
import { MatSelect } from "@angular/material/select";
import { ChartConfiguration } from "chart.js";
import { format, isBefore } from "date-fns";
import { fr } from "date-fns/locale/fr";
import { BaseChartDirective } from "ng2-charts";
import { ITotalExpenseByMonth } from "@model/ITotalExpenseByMonth";
import { ExpenseService } from "@services/expense.service/expense.service";
import { Label } from "@model/Label";

@Component({
  selector: "app-total-expense-by-month",
  templateUrl: "./total-expense-by-month.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    BaseChartDirective,
    MatFormField,
    MatLabel,
    MatSelect,
    FormField,
    MatOption,
    MatIconButton,
    MatIcon
  ]
})
export class TotalExpenseByMonthComponent implements OnInit {
  public readonly labels = input<Label[]>([]);
  public readonly noLabelIdSelected = 0;
  public totalExpensesByMonthChart = signal<ChartConfiguration["data"] | undefined>(undefined);
  public barChartOptions: ChartConfiguration["options"] = {
    responsive: true,
    plugins: {
      legend: {
        display: true
      }
    }
  };
  public readonly labelModel = signal({ labelId: this.noLabelIdSelected });
  public readonly labelForm = form(this.labelModel);
  private readonly expenseService = inject(ExpenseService);
  private readonly destroyRef = inject(DestroyRef);

  public ngOnInit(): void {
    this.getTotalExpensesByMonth();
  }

  public resetSelectedLabel(): void {
    this.selectLabel(this.noLabelIdSelected);
  }

  public selectLabel(labelId: number): void {
    this.labelModel.update((model) => ({ ...model, labelId }));
    if (labelId === this.noLabelIdSelected) {
      this.getTotalExpensesByMonth();
    } else {
      this.expenseService
        .getTotalExpensesByMonthByLabelId(labelId)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: (data) => this.refreshChart(data)
        });
    }
  }

  public isOneLabelSelected(): boolean {
    return this.labelModel().labelId !== this.noLabelIdSelected;
  }

  private getTotalExpensesByMonth(): void {
    this.expenseService
      .getTotalExpensesByMonth()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
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
    this.totalExpensesByMonthChart.set({
      labels: chartData.map((totalByMonth) =>
        format(new Date(totalByMonth.date), "MMMM yyyy", { locale: fr })
      ),
      datasets: [
        {
          label: "Total des dépenses",
          data: data.map((totalByMonth) => totalByMonth.total)
        },
        {
          label: "Moyenne",
          data: new Array(chartData.length).fill(average)
        }
      ]
    });
  }
}
