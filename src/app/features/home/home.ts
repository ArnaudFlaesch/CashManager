import { HttpErrorResponse } from "@angular/common/http";
import { Label } from "./labels/label";
import { HttpErrorHandler } from "@core/http-error-handler";
import { LabelApi } from "./labels/label-api";
import { Component, inject, signal } from "@angular/core";
import { rxResource } from "@angular/core/rxjs-interop";
import { form, FormField, FormRoot, required } from "@angular/forms/signals";
import { firstValueFrom } from "rxjs";
import { LabelList } from "./labels/label-list/label-list";
import { MatButton } from "@angular/material/button";
import { MatInput } from "@angular/material/input";
import { MatFormField, MatLabel } from "@angular/material/form-field";
import { TotalExpenseByMonth } from "./expenses/total-expense-by-month/total-expense-by-month";
import { ExpenseListByMonth } from "./expenses/expense-list-by-month/expense-list-by-month";
import { MatTab, MatTabGroup, MatTabLabel } from "@angular/material/tabs";
import { MatIcon } from "@angular/material/icon";
import { Header } from "@core/layout/header/header";

@Component({
  selector: "cash-manager-home",
  templateUrl: "./home.html",
  styleUrl: "./home.scss",
  imports: [
    Header,
    MatTabGroup,
    MatTab,
    MatTabLabel,
    MatIcon,
    ExpenseListByMonth,
    TotalExpenseByMonth,
    FormRoot,
    FormField,
    MatFormField,
    MatLabel,
    MatInput,
    MatButton,
    LabelList
  ]
})
export class Home {
  private readonly labelApi = inject(LabelApi);
  private readonly httpErrorHandler = inject(HttpErrorHandler);

  protected readonly labels = {
    monthExpenses: "Dépenses du mois",
    totalByMonth: "Total par mois",
    expenseLabels: "Étiquettes",
    newLabel: "Nouvelle étiquette",
    labelPlaceholder: "Renseignez un label",
    labelAriaLabel: "Label",
    add: "Ajouter",
    errors: {
      creatingLabel: "Erreur lors de l'ajout du label.",
      gettingLabels: "Erreur lors de la récupération des labels."
    }
  };

  public readonly expenseLabels = rxResource({
    stream: () =>
      this.labelApi
        .getLabels()
        .pipe(this.httpErrorHandler.catchError<Label[]>(this.labels.errors.gettingLabels, [])),
    defaultValue: []
  });
  private readonly labelModel = signal({ label: "" });
  public readonly labelForm = form(
    this.labelModel,
    (schema) => {
      required(schema.label);
    },
    {
      submission: {
        action: async (labelForm) => {
          try {
            const insertedLabel = await firstValueFrom(
              this.labelApi.addLabel(labelForm.label().value())
            );
            this.expenseLabels.value.update((labels) => [...labels, insertedLabel]);
            labelForm().reset({ label: "" });
          } catch (error) {
            this.httpErrorHandler.handleError(
              error as HttpErrorResponse,
              this.labels.errors.creatingLabel
            );
          }
          return undefined;
        }
      }
    }
  );

  public removeLabel(labelId: number): void {
    this.expenseLabels.value.update((labels) => labels.filter((label) => label.id !== labelId));
  }
}
