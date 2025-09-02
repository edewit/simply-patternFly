import { LabelGroupProps, SelectProps } from "@patternfly/react-core";

export type OptionType = string[] | SimpleSelectOption[];

export type SimpleSelectOption = {
  key: string;
  value: string;
};

type CommonSelectProps = Omit<
  SelectProps,
  | "toggle"
  | "selections"
  | "onSelect"
  | "onClear"
  | "isOpen"
  | "onFilter"
  | "variant"
> & {
  value?: string;
  options: OptionType;
  selectedOptions?: OptionType;
  isDisabled?: boolean;
  status?: "success" | "warning" | "danger";
  onSelect?: (value: string) => void;
};

export type SingleSelectProps = CommonSelectProps;

export type MultiSelectProps = CommonSelectProps & {
  variant?: Variant;
  onFilter?: (value: string) => void;
  onClear?: () => void;
  menuAppendTo?: string;
  placeholderText?: string;
  selections?: string[];
  chipGroupProps?: Omit<LabelGroupProps, "children" | "ref">;
  footer?: React.ReactNode;
  options: OptionType;
};

export type Variant = `${SelectVariant}`;

export enum SelectVariant {
  typeahead = "typeahead",
  typeaheadMulti = "typeaheadMulti",
}
