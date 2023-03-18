export class Expense {
  private _id = 0;
  private _amount = 0;
  private _expenseDate: Date = new Date();
  private _labelId = 0;

  constructor(id: number, amount: number, expenseDate: Date, labelId: number) {
    this._id = id;
    this._amount = amount;
    this._expenseDate = expenseDate;
    this._labelId = labelId;
  }

  /**
   * Getter id
   * @return {number }
   */
  public get id(): number {
    return this._id;
  }

  /**
   * Getter amount
   * @return {number }
   */
  public get amount(): number {
    return this._amount;
  }

  /**
   * Getter expenseDate
   * @return {Date }
   */
  public get expenseDate(): Date {
    return this._expenseDate;
  }

  /**
   * Getter labelId
   * @return {number }
   */
  public get labelId(): number {
    return this._labelId;
  }
}
