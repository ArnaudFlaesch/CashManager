import { Component, input, output, signal } from "@angular/core";
import { form, FormField, FormRoot, required } from "@angular/forms/signals";
import { MatButton } from "@angular/material/button";
import { MatFormField, MatLabel } from "@angular/material/form-field";
import { MatIcon } from "@angular/material/icon";
import { MatInput } from "@angular/material/input";

@Component({
  selector: "cash-manager-create-label",
  templateUrl: "./create-label.html",
  styleUrl: "./create-label.scss",
  imports: [FormRoot, FormField, MatFormField, MatLabel, MatInput, MatButton, MatIcon]
})
export class CreateLabel {
  public readonly isSubmitting = input(false);
  /** Emitted with the name of the label to create, once the form is submitted and valid. */
  public readonly labelSubmitted = output<string>();

  protected readonly labels = {
    newLabel: "Nouvelle étiquette",
    labelPlaceholder: "Renseignez un label",
    labelAriaLabel: "Label",
    add: "Ajouter"
  };

  private readonly labelModel = signal({ label: "" });
  public readonly labelForm = form(
    this.labelModel,
    (schema) => {
      required(schema.label);
    },
    {
      submission: {
        action: (labelForm) => {
          this.labelSubmitted.emit(labelForm.label().value());
          return Promise.resolve(undefined);
        }
      }
    }
  );

  /** Public: called by the parent once the label is created, to empty the form. */
  public reset(): void {
    this.labelForm().reset({ label: "" });
  }
}
