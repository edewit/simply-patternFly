import {
  FormHelperText,
  FormLabel,
  HelperText,
  HelperTextItem,
  SingleSelect,
  SingleSelectProps,
} from "@simply-patternfly/core";
import {
  FieldPath,
  FieldValues,
  PathValue,
  useController,
  UseControllerProps
} from "react-hook-form";
import { getRuleValue } from "../util/getRuleValue";
import { FieldProps } from "../types";

export type SingleSelectFieldProps<
  T extends FieldValues,
  P extends FieldPath<T> = FieldPath<T>
> = UseControllerProps<T, P> &
  Omit<SingleSelectProps, "name"> & {
    name: P;
  } & FieldProps;

export const SingleSelectField = <
  T extends FieldValues,
  P extends FieldPath<T> = FieldPath<T>
>(
  props: SingleSelectFieldProps<T, P>
) => {
  const { rules, control, defaultValue, labelIcon, helperText, ...rest } = props;
  const defaultVal = defaultValue ?? ("" as PathValue<T, P>);
  const required = !!getRuleValue(rules?.required);

  const { field, fieldState, } = useController({
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
    >
      <SingleSelect {...rest} value={field.value} onSelect={field.onChange} />
      {helperText && (
        <FormHelperText>
          <HelperText>
            <HelperTextItem>{helperText}</HelperTextItem>
          </HelperText>
        </FormHelperText>
      )}
    </FormLabel>
  );
};
