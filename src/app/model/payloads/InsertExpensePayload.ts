export class InsertExpensePayload {
  public amount: number;
  public expenseDate: Date;
  public labelId: number;

  public constructor() {
    this.amount = 0;
    this.expenseDate = new Date();
    this.labelId = 0;
  }
}
