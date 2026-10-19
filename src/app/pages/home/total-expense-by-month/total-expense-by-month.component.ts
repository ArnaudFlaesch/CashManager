import { Component, computed, inject, input, signal } from "@angular/core";
import { rxResource } from "@angular/core/rxjs-interop";
import { form, FormField } from "@angular/forms/signals";
import { MatIconButton } from "@angular/material/button";
import { MatOption } from "@angular/material/core";
import { MatFormField, MatLabel } from "@angular/material/form-field";
import { MatIcon } from "@angular/material/icon";
import { MatSelect } from "@angular/material/select";
import { ChartData } from "chart.js";
import { format } from "date-fns";
import { fr } from "date-fns/locale/fr";
import { BaseChartDirective } from "ng2-charts";
import { ITotalExpenseByMonth } from "@model/ITotalExpenseByMonth";
import { ErrorHandlerService } from "@services/error.handler.service";
import { ExpenseService } from "@services/expense.service/expense.service";
import { Label } from "@model/Label";
import { CHART_OPTIONS } from "../../../utils/Constants";

const NO_LABEL_ID_SELECTED = 0;
const ERROR_GETTING_TOTAL_EXPENSES = "Erreur lors de la récupération du total des dépenses.";

@Component({
  selector: "cash-manager-total-expense-by-month",
  templateUrl: "./total-expense-by-month.component.html",
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
export class TotalExpenseByMonthComponent {
  public readonly labels = input<Label[]>([]);
  public readonly chartOptions = CHART_OPTIONS;

  public readonly labelModel = signal({ labelId: NO_LABEL_ID_SELECTED });
  public readonly labelForm = form(this.labelModel);
  public readonly isOneLabelSelected = computed(
    () => this.labelModel().labelId !== NO_LABEL_ID_SELECTED
  );

  public readonly totalExpensesByMonthChart = computed<ChartData<"line">>(() => {
    const chartData = this.totalExpensesByMonth
      .value()
      .toSorted((dataA, dataB) => new Date(dataA.date).getTime() - new Date(dataB.date).getTime());
    const average =
      chartData.reduce((total, totalByMonth) => total + totalByMonth.total, 0) / chartData.length;
    return {
      labels: chartData.map((totalByMonth) =>
        format(new Date(totalByMonth.date), "MMMM yyyy", { locale: fr })
      ),
      datasets: [
        { label: "Total des dépenses", data: chartData.map((totalByMonth) => totalByMonth.total) },
        { label: "Moyenne", data: chartData.map(() => average) }
      ]
    };
  });

  private readonly totalExpensesByMonth = rxResource({
    params: () => this.labelModel().labelId,
    stream: ({ params: labelId }) =>
      (labelId === NO_LABEL_ID_SELECTED
        ? this.expenseService.getTotalExpensesByMonth()
        : this.expenseService.getTotalExpensesByMonthByLabelId(labelId)
      ).pipe(
        this.errorHandlerService.catchError<ITotalExpenseByMonth[]>(
          ERROR_GETTING_TOTAL_EXPENSES,
          []
        )
      ),
    defaultValue: []
  });

  private readonly expenseService = inject(ExpenseService);
  private readonly errorHandlerService = inject(ErrorHandlerService);

  public selectLabel(labelId: number): void {
    this.labelForm.labelId().value.set(labelId);
  }

  public resetSelectedLabel(): void {
    this.selectLabel(NO_LABEL_ID_SELECTED);
  }
}
