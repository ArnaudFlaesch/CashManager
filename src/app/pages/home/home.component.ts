import { HttpErrorResponse } from "@angular/common/http";
import { Label } from "@model/Label";
import { ErrorHandlerService } from "@services/error.handler.service";
import { LabelService } from "@services/label.service/label.service";
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
import { MatTab, MatTabGroup } from "@angular/material/tabs";
import { HeaderComponent } from "../../header/header.component";

const ERROR_CREATING_LABEL_MESSAGE = "Erreur lors de l'ajout du label.";
const ERROR_GETTING_LABELS = "Erreur lors de la récupération des labels.";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrl: "./home.component.scss",
  imports: [
    HeaderComponent,
    MatTabGroup,
    MatTab,
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
  public readonly labels = rxResource({
    stream: () =>
      this.labelService
        .getLabels()
        .pipe(this.errorHandlerService.catchError<Label[]>(ERROR_GETTING_LABELS, [])),
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
          this.labels.value.update((labels) => [...labels, insertedLabel]);
          labelForm().reset({ label: "" });
        } catch (error) {
          this.errorHandlerService.handleError(
            error as HttpErrorResponse,
            ERROR_CREATING_LABEL_MESSAGE
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
    this.labels.value.update((labels) => labels.filter((label) => label.id !== labelId));
  }
}
