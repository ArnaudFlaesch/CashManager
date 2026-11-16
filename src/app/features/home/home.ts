import { HttpErrorResponse } from "@angular/common/http";
import { Component, DestroyRef, inject, signal, viewChild } from "@angular/core";
import { rxResource, takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { MatDialog } from "@angular/material/dialog";
import { MatIcon } from "@angular/material/icon";
import { MatTab, MatTabGroup, MatTabLabel } from "@angular/material/tabs";
import { switchMap } from "rxjs";

import { HttpErrorHandler } from "@core/http-error-handler";
import { Header } from "@core/layout/header/header";
import { confirmWithModal } from "@shared/confirm-modal/confirm-modal";
import { ConfirmModalData } from "@shared/confirm-modal/confirm-modal-data";
import { ExpenseListByMonth } from "./expenses/expense-list-by-month/expense-list-by-month";
import { TotalExpenseByMonth } from "./expenses/total-expense-by-month/total-expense-by-month";
import { CreateLabel } from "./labels/create-label/create-label";
import { Label } from "./labels/label";
import { LabelApi } from "./labels/label-api";
import { LabelList } from "./labels/label-list/label-list";

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
    CreateLabel,
    LabelList
  ]
})
export class Home {
  private readonly labelApi = inject(LabelApi);
  private readonly httpErrorHandler = inject(HttpErrorHandler);
  private readonly dialog = inject(MatDialog);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly labels = {
    monthExpenses: "Dépenses du mois",
    totalByMonth: "Total par mois",
    expenseLabels: "Étiquettes",
    deleteLabelDialog: {
      title: "Suppression d'un label",
      message: "Êtes-vous sûr de vouloir supprimer ce label ?"
    } satisfies ConfirmModalData,
    errors: {
      creatingLabel: "Erreur lors de l'ajout du label.",
      deletingLabel: "Erreur lors de la suppression du label.",
      gettingLabels: "Erreur lors de la récupération des labels."
    }
  };

  private readonly createLabelForm = viewChild(CreateLabel);

  public readonly expenseLabels = rxResource({
    stream: () =>
      this.labelApi
        .getLabels()
        .pipe(this.httpErrorHandler.catchError<Label[]>(this.labels.errors.gettingLabels, [])),
    defaultValue: []
  });
  public readonly isCreatingLabel = signal(false);

  public addLabel(labelName: string): void {
    this.isCreatingLabel.set(true);
    this.labelApi
      .addLabel(labelName)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (insertedLabel) => {
          this.expenseLabels.value.update((labels) => [...labels, insertedLabel]);
          this.createLabelForm()?.reset();
          this.isCreatingLabel.set(false);
        },
        error: (error: HttpErrorResponse) => {
          this.isCreatingLabel.set(false);
          this.httpErrorHandler.handleError(error, this.labels.errors.creatingLabel);
        }
      });
  }

  public openDeleteLabelDialog(labelId: number): void {
    confirmWithModal(this.dialog, this.labels.deleteLabelDialog)
      .pipe(
        switchMap(() => this.labelApi.deleteLabel(labelId)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: () => {
          this.expenseLabels.value.update((labels) =>
            labels.filter((label) => label.id !== labelId)
          );
        },
        error: (error: HttpErrorResponse) => {
          this.httpErrorHandler.handleError(error, this.labels.errors.deletingLabel);
        }
      });
  }
}
