export interface Label {
  id: number;
  label: string;
  userId: number;
}

/** Id selecting no label, i.e. all of them, in the label filters. */
export const NO_LABEL_ID_SELECTED = 0;
