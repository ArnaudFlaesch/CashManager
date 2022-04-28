export class InsertExpensePayload {
  amount: number;
  expenseDate: Date;
  labelId: number;

  constructor() {
    this.amount = 0;
    this.expenseDate = new Date();
    this.labelId = 0;
  }
}
