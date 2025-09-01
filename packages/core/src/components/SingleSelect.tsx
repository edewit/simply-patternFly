import {
  MenuToggle,
  Select,
  SelectList,
  SelectOption
} from "@patternfly/react-core";
import { useState } from "react";
import { SingleSelectProps } from "../types";
import { isSelectBasedOptions, isString, key } from "../utils/select";

export const SingleSelect = ({
  id,
  value = "",
  options,
  selectedOptions = [],
  isDisabled,
  onSelect,
  status,
  ...rest
}: SingleSelectProps) => {
  const [open, setOpen] = useState(false);

  return (
      <Select
        {...rest}
        variant="default"
        onClick={() => setOpen(!open)}
        onOpenChange={() => setOpen(false)}
        selected={
          isSelectBasedOptions(options)
            ? options.filter((o) => value === o.key).map((o) => o.value)
            : value
        }
        toggle={(ref: React.Ref<HTMLButtonElement>) => (
          <MenuToggle
            id={id ?? ""}
            ref={ref}
            onClick={() => setOpen(!open)}
            isExpanded={open}
            isFullWidth
            status={status}
            aria-label={id}
            isDisabled={isDisabled}
          >
            {isSelectBasedOptions(options)
              ? options.find((o) => o.key === value)?.value
              : value}
          </MenuToggle>
        )}
        onSelect={(
          _event: React.MouseEvent<Element, MouseEvent> | undefined,
          v: string | number | undefined
        ) => {
          const option = v?.toString() ?? "";
          onSelect?.(option);
          setOpen(false);
        }}
        isOpen={open}
      >
        <SelectList data-testid={`select-${id ?? ""}`}>
          {[...options, ...selectedOptions].map((option) => (
            <SelectOption key={key(option)} value={key(option)}>
              {isString(option) ? option : option.value}
            </SelectOption>
          ))}
        </SelectList>
      </Select>
  );
};
