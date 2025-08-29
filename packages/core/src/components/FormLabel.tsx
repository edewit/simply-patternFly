import { FormGroup, FormGroupProps } from "@patternfly/react-core";
import { PropsWithChildren, ReactNode } from "react";
import { FormErrorText } from "./FormErrorText";
import { HelpItem } from "./HelpItem";

export type FieldProps = {
  id?: string | undefined;
  label?: string;
  name: string;
  labelIcon?: string | ReactNode;
  error?: string;
  isRequired?: boolean;
};

type FormLabelProps = FieldProps & Omit<FormGroupProps, "label" | "labelIcon">;

export const FormLabel = ({
  id,
  name,
  label,
  labelIcon,
  error,
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
    {error && (
      <FormErrorText data-testid={`${name}-helper`} message={error} />
    )}
  </FormGroup>
);
