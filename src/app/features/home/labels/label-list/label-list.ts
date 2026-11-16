import { Component, input, output } from "@angular/core";
import { MatIconButton } from "@angular/material/button";
import { MatIcon } from "@angular/material/icon";
import { MatTooltip } from "@angular/material/tooltip";

import { Label } from "../label";

@Component({
  selector: "cash-manager-label-list",
  templateUrl: "./label-list.html",
  styleUrl: "./label-list.scss",
  imports: [MatIconButton, MatIcon, MatTooltip]
})
export class LabelList {
  public readonly expenseLabels = input<Label[]>([]);
  /** Emitted with the id of the label to delete, once the user clicks on its delete button. */
  public readonly labelDeletionRequested = output<number>();

  protected readonly labels = {
    deleteLabel: "Supprimer l'étiquette",
    noLabel: "Aucune étiquette pour le moment."
  };
}
