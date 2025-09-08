import {
  FormLabel,
  MultiSelect, MultiSelectProps,
  OptionType,
  SelectVariant
} from "@simply-patternfly/core";
import { useState } from "react";
import {
  FieldPath,
  FieldValues,
  PathValue,
  useController,
  UseControllerProps,
} from "react-hook-form";
import { FieldProps } from "../types";
import { getRuleValue } from "../util/getRuleValue";

const isString = (option: string | { value: string }): option is string =>
  typeof option === "string";
const getValue = (option: string | { value: string }) =>
  isString(option) ? option : option.value;

export type MultiSelectFieldProps<
  T extends FieldValues,
  P extends FieldPath<T> = FieldPath<T>
> = UseControllerProps<T, P> &
  Omit<MultiSelectProps, "name"> & {
    name: P;
  } & FieldProps;

export const MultiSelectField = <
  T extends FieldValues,
  P extends FieldPath<T> = FieldPath<T>
>(
  props: MultiSelectFieldProps<T, P>
) => {
  const { rules, control, defaultValue, labelIcon, helperText, ...rest } =
    props;
  const [filteredOptions, setFilteredOptions] = useState<OptionType>(
    props.options
  );
  const defaultVal = defaultValue ?? ("" as PathValue<T, P>);
  const required = !!getRuleValue(rules?.required);

  const { field, fieldState } = useController({
    ...rest,
    control,
    defaultValue: defaultVal,
    rules,
  });

  return (
    <FormLabel
      name={props.name}
      label={props.label}
      labelIcon={labelIcon}
      isRequired={required}
      error={fieldState.error?.message}
      helperText={helperText}
    >
      <MultiSelect
        {...rest}
        options={filteredOptions}
        onFilter={(value) => {
          setFilteredOptions(
            props.options.filter((option) =>
              getValue(option).toLowerCase().includes(value?.toLowerCase() || "")
            ) as OptionType
          );
        }}
        selections={field.value}
        onSelect={(value) => {
          if (props.variant === SelectVariant.typeaheadMulti) {
            if (field.value.includes(value)) {
              field.onChange(
                field.value.filter((option: string) => option !== value)
              );
            } else {
              field.onChange([...field.value, value]);
            }
          } else {
            field.onChange([value]);
          }
        }}
        onClear={() => {
          field.onChange([]);
        }}
        status={fieldState.error ? "danger" : undefined}
      />
    </FormLabel>
  );
};
