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
   * Setter id
   * @param {number } value
   */
  public set id(value: number) {
    this._id = value;
  }

  /**
   * Getter label
   * @return {string }
   */
  public get label(): string {
    return this._label;
  }

  /**
   * Setter label
   * @param {string } value
   */
  public set label(value: string) {
    this._label = value;
  }
}
