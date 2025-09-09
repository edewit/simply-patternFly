import {
  MenuToggle,
  Select,
  SelectList,
  SelectOption,
} from "@patternfly/react-core";
import { useState } from "react";
import { SingleSelectProps } from "../../types";
import {
  value as getValue,
  isSelectBasedOptions,
  key,
  LOADER_OPTION_VALUE
} from "../../utils/select";

export const SingleSelect = ({
  id,
  value = "",
  options,
  isDisabled,
  onSelect,
  status,
  children,
  ...rest
}: SingleSelectProps) => {
  const [open, setOpen] = useState(false);

  const triggerSelect = (v: string | number | undefined) => {
    const option = v?.toString() ?? "";
    if (option === LOADER_OPTION_VALUE) {
      return;
    }
    onSelect?.(option);
    setOpen(false);
  };

  const selectedValue = () =>
    isSelectBasedOptions(options)
      ? options.find((o) => key(o) === value)?.value
      : value;

  return (
    <Select
      {...rest}
      variant="default"
      onClick={() => setOpen(!open)}
      onOpenChange={() => setOpen(false)}
      selected={selectedValue()}
      toggle={(ref: React.Ref<HTMLButtonElement>) => (
        <MenuToggle
          id={id ?? ""}
          role="combobox"
          ref={ref}
          onClick={() => setOpen(!open)}
          isExpanded={open}
          isFullWidth
          status={status}
          aria-label={id}
          isDisabled={isDisabled}
        >
          {selectedValue()}
        </MenuToggle>
      )}
      onSelect={(_, v) => triggerSelect(v)}
      isOpen={open}
    >
      <SelectList data-testid={`select-${id ?? ""}`}>
        {children ||
          options.map((option) => (
            <SelectOption
              key={key(option)}
              value={key(option)}
              isSelected={value === key(option)}
            >
              {getValue(option)}
            </SelectOption>
          ))}
      </SelectList>
    </Select>
  );
};
