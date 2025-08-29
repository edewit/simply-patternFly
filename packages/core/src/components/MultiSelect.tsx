import {
  Button,
  Label,
  LabelGroup,
  LabelGroupProps,
  MenuFooter,
  MenuToggle,
  MenuToggleStatus,
  Select,
  SelectList,
  SelectOption,
  SelectProps,
  TextInputGroup,
  TextInputGroupMain,
  TextInputGroupUtilities,
} from "@patternfly/react-core";
import { TimesIcon } from "@patternfly/react-icons";
import { useRef, useState } from "react";
import { OptionType } from "../types";
import { SelectVariant, Variant } from "../types/select";
import { isString, key, value } from "../utils/select";

export type MultiSelectProps<> = Omit<
  SelectProps,
  "name" | "toggle" | "selected" | "onClick" | "onSelect" | "variant"
> & {
  id?: string;
  onFilter?: (value: string) => void;
  onClear?: () => void;
  variant?: Variant;
  isDisabled?: boolean;
  menuAppendTo?: string;
  placeholderText?: string;
  onSelect?: (value: string) => void;
  selections?: string[];
  validated?: "success" | "warning" | "error" | "default";
  chipGroupProps?: Omit<LabelGroupProps, "children" | "ref">;
  footer?: React.ReactNode;
  options: OptionType;
};

export const MultiSelect = ({
  id,
  onSelect,
  onFilter,
  variant = SelectVariant.typeahead,
  validated,
  placeholderText,
  selections,
  footer,
  isDisabled,
  chipGroupProps,
  options,
  ...rest
}: MultiSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filterValue, setFilterValue] = useState("");
  const textInputRef = useRef<HTMLInputElement>();

  const toggle = () => {
    setIsOpen?.(!isOpen);
  };

  const onInputKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    setIsOpen(true);

    switch (event.key) {
      case "Enter": {
        event.preventDefault();
        onSelect?.(key(options[0]) || "");
        break;
      }
      case "Escape": {
        setIsOpen(false);
        break;
      }
      case "Backspace": {
        if (variant === SelectVariant.typeahead) {
          onSelect?.("");
        }
        break;
      }
    }
  };

  return (
    <Select
      {...rest}
      onOpenChange={(isOpen) => {
        if (!isOpen) setIsOpen(false);
      }}
      onSelect={(_, value) => {
        onSelect?.(value as string || "");
        onFilter?.("");
        setFilterValue("");
        if (variant === SelectVariant.typeahead) {
          setIsOpen(false);
        }
      }}
      isOpen={isOpen}
      toggle={(ref) => (
        <MenuToggle
          ref={ref}
          id={id}
          variant="typeahead"
          onClick={toggle}
          isDisabled={isDisabled}
          isExpanded={isOpen}
          isFullWidth
          status={validated === "error" ? MenuToggleStatus.danger : undefined}
        >
          <TextInputGroup isPlain>
            <TextInputGroupMain
              placeholder={placeholderText}
              value={
                variant === SelectVariant.typeahead && selections && selections.length > 0
                  ? (selections[0])
                  : filterValue
              }
              onClick={toggle}
              onChange={(_, value) => {
                setFilterValue(value);
                onFilter?.(value);
              }}
              onKeyDown={(event) => onInputKeyDown(event)}
              autoComplete="off"
              innerRef={textInputRef}
              role="combobox"
              isExpanded={isOpen}
              aria-controls="select-typeahead-listbox"
              aria-label={placeholderText}
            >
              {variant === SelectVariant.typeaheadMulti &&
                Array.isArray(selections) && (
                  <LabelGroup {...chipGroupProps}>
                    {selections.map((selection, index: number) => (
                      <Label
                        key={index}
                        onClick={(ev) => {
                          ev.stopPropagation();
                          onSelect?.(selection);
                        }}
                      >
                        {value(options.find((option) => key(option) === selection) || "" )}
                      </Label>
                    ))}
                  </LabelGroup>
                )}
            </TextInputGroupMain>
            <TextInputGroupUtilities>
              {!!filterValue && (
                <Button
                  variant="plain"
                  onClick={() => {
                    onSelect?.("");
                    setFilterValue("");
                    onFilter?.("");
                    textInputRef?.current?.focus();
                  }}
                  aria-label="Clear input value"
                >
                  <TimesIcon aria-hidden />
                </Button>
              )}
            </TextInputGroupUtilities>
          </TextInputGroup>
        </MenuToggle>
      )}
    >
      <SelectList>
        {[...options].map((option) => (
          <SelectOption
            key={key(option)}
            value={key(option)}
            isSelected={selections?.includes(key(option))}
          >
            {isString(option) ? option : option.value}
          </SelectOption>
        ))}
      </SelectList>
      {footer && <MenuFooter>{footer}</MenuFooter>}
    </Select>
  );
};
