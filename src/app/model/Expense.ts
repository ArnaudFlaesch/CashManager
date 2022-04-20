import { Label } from './Label';

export class Expense {
  private _id = 0;
  private _amount = 0;
  private _expenseDate: Date = new Date();
  private _label: Label = new Label(0, '');

  constructor(id: number, amount: number, expenseDate: Date, label: Label) {
    this._id = id;
    this._amount = amount;
    this._expenseDate = expenseDate;
    this._label = label;
  }

  /**
   * Getter id
   * @return {number }
   */
  public get id(): number {
    return this._id;
  }

  /**
   * Setter id
   * @param {number } value
   */
  public set id(value: number) {
    this._id = value;
  }

  /**
   * Getter amount
   * @return {number }
   */
  public get amount(): number {
    return this._amount;
  }

  /**
   * Setter expenseDate
   * @param {number } value
   */
  public set amount(value: number) {
    this._amount = value;
  }

  /**
   * Getter expenseDate
   * @return {Date }
   */
  public get expenseDate(): Date {
    return this._expenseDate;
  }

  /**
   * Setter expenseDate
   * @param {Date } value
   */
  public set expenseDate(value: Date) {
    this._expenseDate = value;
  }

  /**
   * Getter label
   * @return {Label }
   */
  public get label(): Label {
    return this._label;
  }

  /**
   * Setter label
   * @param {Label } value
   */
  public set label(value: Label) {
    this._label = value;
  }
}
