import { SelectOption, Spinner } from "@patternfly/react-core";
import { MultiSelectProps } from "../types";
import { key, LOADER_OPTION_VALUE, value } from "../utils/select";
import { MultiSelect } from "./MultiSelect";
import { useAsyncSelect, UseAsyncSelectOptions } from "../hooks/useAsyncSelect";

export type AsyncMultiSelectProps = Omit<MultiSelectProps, "options" | "onFilter"> & UseAsyncSelectOptions;

export const AsyncMultiSelect = ({
  fetchOptions,
  pageSize = 10,
  ...rest
}: AsyncMultiSelectProps) => {
  const { isLoading, options, hasMore, fetchMoreOptions, updateFilter } = useAsyncSelect({
    fetchOptions,
    pageSize,
  });

  return (
    <MultiSelect
      options={options}
      onFilter={updateFilter}
      {...rest}
    >
      {options.map((option) => (
        <SelectOption key={key(option)} value={key(option)} isSelected={rest.selections?.includes(key(option))}>
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
    </MultiSelect>
  );
};
