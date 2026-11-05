import { HttpErrorResponse } from "@angular/common/http";
import { Label } from "@model/Label";
import { ErrorHandlerService } from "@services/error-handler.service";
import { LabelService } from "@services/label.service";
import { Component, inject, signal } from "@angular/core";
import { rxResource } from "@angular/core/rxjs-interop";
import { form, FormField, FormRoot, required, submit } from "@angular/forms/signals";
import { firstValueFrom } from "rxjs";
import { LabelListComponent } from "./label-list/label-list.component";
import { MatButton } from "@angular/material/button";
import { MatInput } from "@angular/material/input";
import { MatFormField, MatLabel } from "@angular/material/form-field";
import { TotalExpenseByMonthComponent } from "./total-expense-by-month/total-expense-by-month.component";
import { ExpenseListByMonthComponent } from "./expense-list-by-month/expense-list-by-month.component";
import { MatTab, MatTabGroup, MatTabLabel } from "@angular/material/tabs";
import { MatIcon } from "@angular/material/icon";
import { HeaderComponent } from "@app/header/header.component";

@Component({
  selector: "cash-manager-home",
  templateUrl: "./home.component.html",
  styleUrl: "./home.component.scss",
  imports: [
    HeaderComponent,
    MatTabGroup,
    MatTab,
    MatTabLabel,
    MatIcon,
    ExpenseListByMonthComponent,
    TotalExpenseByMonthComponent,
    FormRoot,
    FormField,
    MatFormField,
    MatLabel,
    MatInput,
    MatButton,
    LabelListComponent
  ]
})
export class HomeComponent {
  public readonly labels = {
    monthExpenses: "Dépenses du mois",
    totalByMonth: "Total par mois",
    expenseLabels: "Étiquettes",
    newLabel: "Nouvelle étiquette",
    labelPlaceholder: "Renseignez un label",
    labelAriaLabel: "Label",
    add: "Ajouter"
  };

  private readonly ERROR_CREATING_LABEL = "Erreur lors de l'ajout du label.";
  private readonly ERROR_GETTING_LABELS = "Erreur lors de la récupération des labels.";

  public readonly expenseLabels = rxResource({
    stream: () =>
      this.labelService
        .getLabels()
        .pipe(this.errorHandlerService.catchError<Label[]>(this.ERROR_GETTING_LABELS, [])),
    defaultValue: []
  });

  public readonly labelModel = signal({ label: "" });
  public readonly labelForm = form(this.labelModel, (schema) => required(schema.label), {
    submission: {
      action: async (labelForm) => {
        try {
          const insertedLabel = await firstValueFrom(
            this.labelService.addLabel(labelForm.label().value())
          );
          this.expenseLabels.value.update((labels) => [...labels, insertedLabel]);
          labelForm().reset({ label: "" });
        } catch (error) {
          this.errorHandlerService.handleError(
            error as HttpErrorResponse,
            this.ERROR_CREATING_LABEL
          );
        }
        return undefined;
      }
    }
  });

  private readonly labelService = inject(LabelService);
  private readonly errorHandlerService = inject(ErrorHandlerService);

  public handleCreateLabel(): Promise<boolean> {
    return submit(this.labelForm);
  }

  public onDeleteLabel(labelId: number): void {
    this.expenseLabels.value.update((labels) => labels.filter((label) => label.id !== labelId));
  }
}
