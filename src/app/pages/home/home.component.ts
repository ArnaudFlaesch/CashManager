import { HttpErrorResponse } from "@angular/common/http";
import { Label } from "@model/Label";
import { ErrorHandlerService } from "@services/error.handler.service";
import { LabelService } from "@services/label.service/label.service";
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  OnInit,
  output,
  signal
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { FormField, form } from "@angular/forms/signals";
import { LabelListComponent } from "./label-list/label-list.component";
import { MatButton } from "@angular/material/button";
import { MatInput } from "@angular/material/input";
import { MatFormField, MatLabel } from "@angular/material/form-field";
import { TotalExpenseByMonthComponent } from "./total-expense-by-month/total-expense-by-month.component";
import { ExpenseListByMonthComponent } from "./expense-list-by-month/expense-list-by-month.component";
import { MatTab, MatTabGroup } from "@angular/material/tabs";
import { HeaderComponent } from "../../header/header.component";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    HeaderComponent,
    MatTabGroup,
    MatTab,
    ExpenseListByMonthComponent,
    TotalExpenseByMonthComponent,
    FormField,
    MatFormField,
    MatLabel,
    MatInput,
    MatButton,
    LabelListComponent
  ]
})
export class HomeComponent implements OnInit {
  public readonly labelModel = signal({ label: "" });
  public readonly labelForm = form(this.labelModel);
  public labels = signal<Label[]>([]);
  public readonly insertedLabelEvent = output<Label>();

  private readonly ERROR_CREATING_LABEL_MESSAGE = "Erreur lors de l'ajout du label.";
  private readonly ERROR_GETTING_LABELS = "Erreur lors de la récupération des labels.";
  private readonly labelService = inject(LabelService);
  private readonly errorHandlerService = inject(ErrorHandlerService);
  private readonly destroyRef = inject(DestroyRef);

  public ngOnInit(): void {
    this.getLabels();
  }

  public handleCreateLabel(): void {
    const label = this.labelModel().label;
    if (label) {
      this.labelService
        .addLabel(label)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: (insertedLabel) => {
            this.labels.update((labels) => [...labels, insertedLabel]);
            this.insertedLabelEvent.emit(insertedLabel);
            this.labelModel.update((model) => ({ ...model, label: "" }));
          },
          error: (error: HttpErrorResponse) =>
            this.errorHandlerService.handleError(error, this.ERROR_CREATING_LABEL_MESSAGE)
        });
    }
  }

  public onDeleteLabel(labelId: number): void {
    this.labels.update((labels) => labels.filter((label) => label.id !== labelId));
  }

  private getLabels(): void {
    this.labelService
      .getLabels()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (labels) => {
          this.labels.set(labels);
        },
        error: (error: HttpErrorResponse) =>
          this.errorHandlerService.handleError(error, this.ERROR_GETTING_LABELS)
      });
  }
}
