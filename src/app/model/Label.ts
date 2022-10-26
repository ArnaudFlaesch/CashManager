export class Label {
  _id = 0;
  _label = '';
  _userId = 0;

  constructor(id: number, label: string, userId: number) {
    this._id = id;
    this._label = label;
    this._userId = userId;
  }

  /**
   * Getter id
   * @return {number }
   */
  public get id(): number {
    return this._id;
  }

  /**
   * Getter label
   * @return {string }
   */
  public get label(): string {
    return this._label;
  }

  public get userId(): number {
    return this._userId;
  }
}
