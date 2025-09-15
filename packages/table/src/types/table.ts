import { IAction, IFormatter, ITransform } from "@patternfly/react-table";

export type Field<T> = {
  name: string;
  displayKey?: string;
  cellFormatters?: IFormatter[];
  transforms?: ITransform[];
  cellRenderer?: (row: T) => JSX.Element | string;
};

export type DetailField<T> = {
  name: string;
  enabled?: (row: T) => boolean;
  cellRenderer?: (row: T) => JSX.Element | string;
};

export type TitleCell = { title: JSX.Element };
export type Cell<T> = keyof T | JSX.Element | TitleCell;

export type BaseRow<T> = {
  data: T;
  cells: Cell<T>[];
};

export type Row<T> = BaseRow<T> & {
  selected: boolean;
  isOpen?: boolean;
  disableSelection: boolean;
  disableActions: boolean;
};

export type SubRow<T> = BaseRow<T> & {
  parent: number;
};

export type LoaderResponse<T> = {
  data: T[];
  hasMore: boolean;
};

export type LoaderFunction<T> = (
  first: number,
  max: number,
  search?: string
) => Promise<T[] | LoaderResponse<T>>;

export type Action<T> = IAction & {
  onRowClick?: (row: T) => Promise<boolean | void> | void;
};
