import {
  TextInput,
  TextInputProps,
  ValidatedOptions
} from "@patternfly/react-core";
import { FormLabel } from "@simply-patternfly/core";
import {
  FieldPath,
  FieldValues,
  PathValue,
  UseControllerProps,
  useController,
} from "react-hook-form";
import { FieldProps } from "../types";
import { getRuleValue } from "../util/getRuleValue";

export type TextFieldProps<
  T extends FieldValues,
  P extends FieldPath<T> = FieldPath<T>
> = UseControllerProps<T, P> &
  Omit<TextInputProps, "name" | "isRequired" | "required"> &
  FieldProps;

export const TextField = <
  T extends FieldValues,
  P extends FieldPath<T> = FieldPath<T>
>(
  props: TextFieldProps<T, P>
) => {
  const { labelIcon, helperText, rules, control, ...rest } = props;
  const required = !!getRuleValue(rules?.required);
  const defaultValue = props.defaultValue ?? ("" as PathValue<T, P>);

  const { field, fieldState } = useController({
    ...rest,
    control,
    defaultValue,
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
      <TextInput
        {...rest}
        {...field}
        isRequired={required}
        id={props.name}
        data-testid={props["data-testid"] || props.name}
        validated={
          fieldState.error ? ValidatedOptions.error : ValidatedOptions.default
        }
        isDisabled={props.isDisabled}
      />
    </FormLabel>
  );
};
