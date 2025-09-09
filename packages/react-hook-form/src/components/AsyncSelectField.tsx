import {
  FormLabel,
  AsyncSingleSelect,
  AsyncTypeaheadSelectProps,
  OptionType,
  AsyncTypeaheadSelect,
  SelectVariant,
} from "@simply-patternfly/core";
import {
  FieldPath,
  FieldValues,
  PathValue,
  useController,
  UseControllerProps,
} from "react-hook-form";
import { FieldProps } from "../types";
import { getRuleValue } from "../util/getRuleValue";

export type AsyncSelectFieldProps<
  O extends OptionType,
  T extends FieldValues,
  P extends FieldPath<T> = FieldPath<T>
> = UseControllerProps<T, P> &
  Omit<AsyncTypeaheadSelectProps<O>, "name" | "variant" | "onSelect" | "selections"> & {
    name: P;
    variant?: "single" | "typeahead" | "typeaheadMulti";
  } & FieldProps;

export const AsyncSelectField = <
  O extends OptionType,
  T extends FieldValues,
  P extends FieldPath<T> = FieldPath<T>
>(
  props: AsyncSelectFieldProps<O, T, P>
) => {
  const {
    rules,
    control,
    defaultValue,
    labelIcon,
    helperText,
    variant,
    ...rest
  } = props;
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
      {variant === "single" ? (
        <AsyncSingleSelect
          {...rest}
          value={field.value}
          onSelect={field.onChange}
          status={fieldState.error ? "danger" : undefined}
        />
      ) : (
        <AsyncTypeaheadSelect
          {...rest}
          variant={variant === "typeahead" ? SelectVariant.typeahead : SelectVariant.typeaheadMulti}
          selections={field.value}
          onSelect={(value) => {
            if (variant === "typeaheadMulti") {
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
      )}
    </FormLabel>
  );
};
