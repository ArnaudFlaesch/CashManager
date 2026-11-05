import { Label } from "@features/home/labels/label.model";

export interface IExpenseFormModel {
  amount: number;
  date: Date | null;
  /** Text typed in the autocomplete, or the selected label. */
  label: Label | string;
}
