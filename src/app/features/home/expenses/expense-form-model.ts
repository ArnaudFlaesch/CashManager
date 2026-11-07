import { Label } from "@features/home/labels/label";

export interface ExpenseFormModel {
  amount: number;
  date: Date | null;
  /** Text typed in the autocomplete, or the selected label. */
  label: Label | string;
}
