import { FormGroup, FormGroupProps, FormHelperText, HelperText, HelperTextItem } from "@patternfly/react-core";
import { PropsWithChildren, ReactNode } from "react";
import { FormErrorText } from "./FormErrorText";
import { HelpItem } from "./HelpItem";

export type FieldProps = {
  id?: string | undefined;
  label?: string;
  name: string;
  labelIcon?: string | ReactNode;
  error?: string;
  helperText?: string;
  isRequired?: boolean;
};

type FormLabelProps = FieldProps & Omit<FormGroupProps, "label" | "labelIcon">;

export const FormLabel = ({
  id,
  name,
  label,
  labelIcon,
  error,
  helperText,
  children,
  ...rest
}: PropsWithChildren<FormLabelProps>) => (
  <FormGroup
    label={label || name}
    fieldId={id || name}
    labelHelp={
      labelIcon ? <HelpItem helpText={labelIcon} id={id || name} /> : undefined
    }
    {...rest}
  >
    {children}
    {error && <FormErrorText data-testid={`${name}-helper`} message={error} />}
    {helperText && (
      <FormHelperText>
        <HelperText>
          <HelperTextItem>{helperText}</HelperTextItem>
        </HelperText>
      </FormHelperText>
    )}
  </FormGroup>
);
