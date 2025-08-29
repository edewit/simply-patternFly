import { OptionType, SimpleSelectOption } from "../types";

export const isSelectBasedOptions = (
  options: OptionType,
): options is SimpleSelectOption[] => typeof options[0] !== "string";

export const isString = (
  option: SimpleSelectOption | string,
): option is string => typeof option === "string";

export const key = (option: SimpleSelectOption | string) =>
  isString(option) ? option : option.key;