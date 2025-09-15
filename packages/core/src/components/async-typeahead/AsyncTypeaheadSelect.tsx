import { SelectOption, Spinner } from "@patternfly/react-core";
import {
  AsyncSelectResponse,
  useAsyncSelect,
} from "../../hooks/useAsyncSelect";
import {
  OptionType,
  SimpleSelectOption,
  TypeaheadSelectProps,
} from "../../types";
import { key, LOADER_OPTION_VALUE, value } from "../../utils/select";
import { TypeaheadSelect } from "../typeahead/TypeahedSelect";

export type AsyncTypeaheadSelectProps<T extends OptionType> = Omit<
  TypeaheadSelectProps,
  "options" | "onFilter" | "onSelect" | "selections"
> & {
  fetchOptions: (
    first: number,
    max: number,
    filter?: string
  ) => Promise<AsyncSelectResponse<T>>;
  onSelect: (value: T extends string[] ? string : SimpleSelectOption) => void;
  selections: T extends string[] ? string[] : SimpleSelectOption[];
  pageSize?: number;
};

export const AsyncTypeaheadSelect = <T extends OptionType>({
  fetchOptions,
  pageSize = 10,
  onSelect,
  ...rest
}: AsyncTypeaheadSelectProps<T>) => {
  const { isLoading, options, hasMore, fetchMoreOptions, updateFilter } =
    useAsyncSelect<T>({
      fetchOptions,
      pageSize,
    });

  return (
    <TypeaheadSelect
      {...rest}
      options={[]}
      onFilter={updateFilter}
      onSelect={(value) => {
        if (options.length === 0 || typeof options[0] === "string") {
          onSelect?.(value as T extends string[] ? string : SimpleSelectOption);
        } else {
          const foundOption = options.find((option) => key(option) === value)!;
          onSelect?.(
            foundOption as T extends string[] ? string : SimpleSelectOption
          );
        }
      }}
    >
      {options.map((option) => (
        <SelectOption
          key={key(option)}
          value={key(option)}
          isSelected={rest.selections
            .map((selection) => key(selection))
            .includes(key(option))}
        >
          {value(option)}
        </SelectOption>
      ))}
      {hasMore && (
        <SelectOption
          {...(!isLoading && { isLoadButton: true })}
          {...(isLoading && { isLoading: true })}
          onClick={fetchMoreOptions}
          value={LOADER_OPTION_VALUE}
        >
          {isLoading ? <Spinner size="lg" /> : "View more"}
        </SelectOption>
      )}
    </TypeaheadSelect>
  );
};
