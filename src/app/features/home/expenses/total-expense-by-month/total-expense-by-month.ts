import { Component, inject, input, signal } from "@angular/core";
import { rxResource } from "@angular/core/rxjs-interop";

import { HttpErrorHandler } from "@core/http-error-handler";
import { Theme } from "@core/theme";
import { Label, NO_LABEL_ID_SELECTED } from "@features/home/labels/label";
import { ExpenseApi } from "../expense-api";
import { MonthlyExpenseTotal } from "../monthly-expense-total";
import { TotalExpenseByMonthView } from "../total-expense-by-month-view/total-expense-by-month-view";

@Component({
  selector: "cash-manager-total-expense-by-month",
  templateUrl: "./total-expense-by-month.html",
  imports: [TotalExpenseByMonthView]
})
export class TotalExpenseByMonth {
  private readonly expenseApi = inject(ExpenseApi);
  private readonly httpErrorHandler = inject(HttpErrorHandler);
  private readonly theme = inject(Theme);

  public readonly expenseLabels = input<Label[]>([]);

  private readonly ERROR_GETTING_TOTAL_EXPENSES =
    "Erreur lors de la récupération du total des dépenses.";

  public readonly selectedLabelId = signal(NO_LABEL_ID_SELECTED);
  public readonly totalExpensesByMonth = rxResource({
    params: () => this.selectedLabelId(),
    stream: ({ params: labelId }) =>
      (labelId === NO_LABEL_ID_SELECTED
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
  public readonly isDarkMode = this.theme.isDarkMode;
}
