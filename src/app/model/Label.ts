export class Label {
  _id = 0;
  _label = '';

  constructor(id: number, label: string) {
    this._id = id;
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
   * Getter label
   * @return {string }
   */
  public get label(): string {
    return this._label;
  }
}
