import {
  Button,
  Label,
  LabelGroup,
  MenuFooter,
  MenuToggle,
  Select,
  SelectList,
  SelectOption,
  TextInputGroup,
  TextInputGroupMain,
  TextInputGroupUtilities,
} from "@patternfly/react-core";
import { TimesIcon } from "@patternfly/react-icons";
import { Children, ReactElement, useRef, useState } from "react";
import { MultiSelectProps } from "../types";
import { SelectVariant } from "../types/select";
import { LOADER_OPTION_VALUE, key, value } from "../utils/select";

export const MultiSelect = ({
  id,
  onSelect,
  onFilter,
  variant = SelectVariant.typeahead,
  status,
  placeholderText,
  selections,
  footer,
  isDisabled,
  chipGroupProps,
  options,
  onClear,
  children,
  ...rest
}: MultiSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filterValue, setFilterValue] = useState("");
  const textInputRef = useRef<HTMLInputElement>();
  const childrenArray = Children.toArray(children) as ReactElement[];

  const toggle = () => {
    setIsOpen?.(!isOpen);
  };

  const onInputKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    setIsOpen(true);

    switch (event.key) {
      case "Enter": {
        event.preventDefault();
        onSelect?.(key(options?.[0] || "") || childrenArray[0].props.value || "");
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
        if (value === LOADER_OPTION_VALUE) {
          return;
        }
        onSelect?.((value as string) || "");
        onFilter?.("");
        setFilterValue("");
        if (variant !== SelectVariant.typeaheadMulti) {
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
          status={status}
        >
          <TextInputGroup isPlain>
            <TextInputGroupMain
              placeholder={placeholderText}
              value={
                variant === SelectVariant.typeahead && !!selections?.length
                  ? value(selections[0])
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
                    {selections.map((selection) => (
                      <Label
                        key={key(selection)}
                        onClose={(ev) => {
                          ev.stopPropagation();
                          onSelect?.(key(selection));
                        }}
                      >
                        {value(selection)}
                      </Label>
                    ))}
                  </LabelGroup>
                )}
            </TextInputGroupMain>
            <TextInputGroupUtilities>
              {((variant === SelectVariant.typeahead && !!filterValue) ||
                (variant === SelectVariant.typeaheadMulti &&
                  !!selections?.length)) && (
                <Button
                  variant="plain"
                  onClick={() => {
                    if (variant === SelectVariant.typeahead) {
                      onSelect?.("");
                    } else {
                      onClear?.();
                    }
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
        {children
          ? children
          : [...options].map((option) => (
              <SelectOption
                key={key(option)}
                value={key(option)}
                isSelected={selections?.map((selection) => key(selection)).includes(key(option))}
              >
                {value(option)}
              </SelectOption>
            ))}
      </SelectList>
      {footer && <MenuFooter>{footer}</MenuFooter>}
    </Select>
  );
};
