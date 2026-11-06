import { Component, computed, inject, input, signal } from "@angular/core";
import { rxResource } from "@angular/core/rxjs-interop";
import { form, FormField } from "@angular/forms/signals";
import { MatIconButton } from "@angular/material/button";
import { MatOption } from "@angular/material/core";
import { MatFormField, MatLabel } from "@angular/material/form-field";
import { MatIcon } from "@angular/material/icon";
import { MatTooltip } from "@angular/material/tooltip";
import { MatSelect } from "@angular/material/select";
import { ChartData } from "chart.js";
import { format, parseISO } from "date-fns";
import { fr } from "date-fns/locale/fr";
import { BaseChartDirective } from "ng2-charts";
import { MonthlyExpenseTotal } from "@features/home/expenses/monthly-expense-total";
import { HttpErrorHandler } from "@core/http-error-handler";
import { Theme } from "@core/theme";
import { ExpenseApi } from "@features/home/expenses/expense-api";
import { Label } from "@features/home/labels/label";
import { getChartOptions } from "@shared/chart-options";

@Component({
  selector: "cash-manager-total-expense-by-month",
  templateUrl: "./total-expense-by-month.html",
  styleUrl: "./total-expense-by-month.scss",
  imports: [
    BaseChartDirective,
    MatFormField,
    MatLabel,
    MatSelect,
    FormField,
    MatOption,
    MatIconButton,
    MatIcon,
    MatTooltip
  ]
})
export class TotalExpenseByMonth {
  protected readonly labels = {
    title: "Total des dépenses par mois",
    expenseLabels: "Étiquettes",
    allLabels: "Toutes les étiquettes"
  };

  private readonly NO_LABEL_ID_SELECTED = 0;
  private readonly ERROR_GETTING_TOTAL_EXPENSES =
    "Erreur lors de la récupération du total des dépenses.";
  private readonly CHART_LABELS = { total: "Total des dépenses", average: "Moyenne" };
  private readonly CHART_DATE_FORMAT = "MMMM yyyy";

  public readonly expenseLabels = input<Label[]>([]);
  protected readonly chartOptions = computed(() => getChartOptions(this.theme.isDarkMode()));

  private readonly labelModel = signal({ labelId: this.NO_LABEL_ID_SELECTED });
  protected readonly labelForm = form(this.labelModel);
  protected readonly isOneLabelSelected = computed(
    () => this.labelModel().labelId !== this.NO_LABEL_ID_SELECTED
  );

  protected readonly totalExpensesByMonthChart = computed<ChartData<"line">>(() => {
    const chartData = this.totalExpensesByMonth
      .value()
      .toSorted((dataA, dataB) => parseISO(dataA.date).getTime() - parseISO(dataB.date).getTime());
    const average =
      chartData.reduce((total, totalByMonth) => total + totalByMonth.total, 0) / chartData.length;
    return {
      labels: chartData.map((totalByMonth) =>
        format(parseISO(totalByMonth.date), this.CHART_DATE_FORMAT, { locale: fr })
      ),
      datasets: [
        {
          label: this.CHART_LABELS.total,
          data: chartData.map((totalByMonth) => totalByMonth.total)
        },
        { label: this.CHART_LABELS.average, data: chartData.map(() => average) }
      ]
    };
  });

  private readonly totalExpensesByMonth = rxResource({
    params: () => this.labelModel().labelId,
    stream: ({ params: labelId }) =>
      (labelId === this.NO_LABEL_ID_SELECTED
        ? this.expenseApi.getTotalExpensesByMonth()
        : this.expenseApi.getTotalExpensesByMonthByLabelId(labelId)
      ).pipe(
        this.httpErrorHandler.catchError<MonthlyExpenseTotal[]>(
          this.ERROR_GETTING_TOTAL_EXPENSES,
          []
        )
      ),
    defaultValue: []
  });

  private readonly expenseApi = inject(ExpenseApi);
  private readonly httpErrorHandler = inject(HttpErrorHandler);
  private readonly theme = inject(Theme);

  private selectLabel(labelId: number): void {
    this.labelForm.labelId().value.set(labelId);
  }

  protected resetSelectedLabel(): void {
    this.selectLabel(this.NO_LABEL_ID_SELECTED);
  }
}
