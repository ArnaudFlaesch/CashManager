import { Component, computed, input, model } from "@angular/core";
import { form, FormField } from "@angular/forms/signals";
import { MatIconButton } from "@angular/material/button";
import { MatOption } from "@angular/material/core";
import { MatFormField, MatLabel } from "@angular/material/form-field";
import { MatIcon } from "@angular/material/icon";
import { MatSelect } from "@angular/material/select";
import { MatTooltip } from "@angular/material/tooltip";
import { ChartData } from "chart.js";
import { format, parseISO } from "date-fns";
import { fr } from "date-fns/locale/fr";
import { BaseChartDirective } from "ng2-charts";

import { Label, NO_LABEL_ID_SELECTED } from "@features/home/labels/label";
import { getChartOptions } from "@shared/chart-options";
import { MonthlyExpenseTotal } from "../monthly-expense-total";

@Component({
  selector: "cash-manager-total-expense-by-month-view",
  templateUrl: "./total-expense-by-month-view.html",
  styleUrl: "./total-expense-by-month-view.scss",
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
export class TotalExpenseByMonthView {
  public readonly totalExpensesByMonth = input.required<MonthlyExpenseTotal[]>();
  public readonly expenseLabels = input<Label[]>([]);
  public readonly isDarkMode = input(false);
  /** Label whose totals are displayed, NO_LABEL_ID_SELECTED for the totals of all the labels. */
  public readonly selectedLabelId = model.required<number>();

  protected readonly labels = {
    title: "Total des dépenses par mois",
    expenseLabels: "Étiquettes",
    allLabels: "Toutes les étiquettes",
    chart: {
      total: "Total des dépenses",
      average: "Moyenne"
    }
  };

  private readonly CHART_DATE_FORMAT = "MMMM yyyy";

  public readonly labelForm = form(this.selectedLabelId);
  public readonly isOneLabelSelected = computed(
    () => this.selectedLabelId() !== NO_LABEL_ID_SELECTED
  );
  public readonly chartOptions = computed(() => getChartOptions(this.isDarkMode()));
  public readonly totalExpensesByMonthChart = computed<ChartData<"line">>(() => {
    const chartData = this.totalExpensesByMonth().toSorted(
      (dataA, dataB) => parseISO(dataA.date).getTime() - parseISO(dataB.date).getTime()
    );
    const average =
      chartData.reduce((total, totalByMonth) => total + totalByMonth.total, 0) / chartData.length;
    return {
      labels: chartData.map((totalByMonth) =>
        format(parseISO(totalByMonth.date), this.CHART_DATE_FORMAT, { locale: fr })
      ),
      datasets: [
        {
          label: this.labels.chart.total,
          data: chartData.map((totalByMonth) => totalByMonth.total)
        },
        { label: this.labels.chart.average, data: chartData.map(() => average) }
      ]
    };
  });

  public resetSelectedLabel(): void {
    this.selectedLabelId.set(NO_LABEL_ID_SELECTED);
  }
}
