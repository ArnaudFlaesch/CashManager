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
import { ITotalExpenseByMonth } from "@model/ITotalExpenseByMonth";
import { ErrorHandlerService } from "@services/error-handler.service";
import { ThemeService } from "@services/theme.service";
import { ExpenseService } from "@services/expense.service";
import { Label } from "@model/Label";
import { getChartOptions } from "@utils/Constants";

@Component({
  selector: "cash-manager-total-expense-by-month",
  templateUrl: "./total-expense-by-month.component.html",
  styleUrl: "./total-expense-by-month.component.scss",
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
export class TotalExpenseByMonthComponent {
  public readonly labels = {
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
  public readonly chartOptions = computed(() => getChartOptions(this.themeService.isDarkMode()));

  public readonly labelModel = signal({ labelId: this.NO_LABEL_ID_SELECTED });
  public readonly labelForm = form(this.labelModel);
  public readonly isOneLabelSelected = computed(
    () => this.labelModel().labelId !== this.NO_LABEL_ID_SELECTED
  );

  public readonly totalExpensesByMonthChart = computed<ChartData<"line">>(() => {
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
        ? this.expenseService.getTotalExpensesByMonth()
        : this.expenseService.getTotalExpensesByMonthByLabelId(labelId)
      ).pipe(
        this.errorHandlerService.catchError<ITotalExpenseByMonth[]>(
          this.ERROR_GETTING_TOTAL_EXPENSES,
          []
        )
      ),
    defaultValue: []
  });

  private readonly expenseService = inject(ExpenseService);
  private readonly errorHandlerService = inject(ErrorHandlerService);
  private readonly themeService = inject(ThemeService);

  public selectLabel(labelId: number): void {
    this.labelForm.labelId().value.set(labelId);
  }

  public resetSelectedLabel(): void {
    this.selectLabel(this.NO_LABEL_ID_SELECTED);
  }
}
