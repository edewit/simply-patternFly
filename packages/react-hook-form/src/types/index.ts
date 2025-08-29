import { FieldProps as CoreFieldProps } from "@simply-patternfly/core";

export type FieldProps = Omit<CoreFieldProps, "error"> & {
  helperText?: string;
  "data-testid"?: string;
};
