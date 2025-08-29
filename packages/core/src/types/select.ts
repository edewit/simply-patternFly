import { SelectProps } from "@patternfly/react-core";


export type OptionType = string[] | SimpleSelectOption[];

export type SimpleSelectOption = {
  key: string;
  value: string;
};

export type SingleSelectProps = Omit<
  SelectProps,
  | "toggle"
  | "selections"
  | "onSelect"
  | "onClear"
  | "isOpen"
  | "onFilter"
  | "variant"
> & {
  name: string;
  value?: string;
  error?: string;
  options: OptionType;
  selectedOptions?: OptionType;
  isDisabled?: boolean;
  onSelect?: (value: string) => void;
};