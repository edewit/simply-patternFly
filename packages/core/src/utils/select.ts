import { OptionType, SimpleSelectOption } from "../types";

export const LOADER_OPTION_VALUE = "loader";

export const isSelectBasedOptions = (
  options: OptionType
): options is SimpleSelectOption[] =>
  options.length > 0 && typeof options[0] !== "string";

export const isString = (
  option: SimpleSelectOption | string
): option is string => typeof option === "string";

export const key = (option: SimpleSelectOption | string) =>
  isString(option) ? option : option.key;

export const value = (option: SimpleSelectOption | string) =>
  isString(option) ? option : option.value;
