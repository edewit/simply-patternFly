import { SelectOption, Spinner } from "@patternfly/react-core";
import { SingleSelectProps } from "../types";
import { key, LOADER_OPTION_VALUE, value } from "../utils/select";
import { SingleSelect } from "./SingleSelect";
import { useAsyncSelect, UseAsyncSelectOptions } from "../hooks/useAsyncSelect";

export type AsyncSingleSelectProps = Omit<SingleSelectProps, "options"> & UseAsyncSelectOptions;

export const AsyncSingleSelect = ({
  fetchOptions,
  pageSize = 10,
  ...rest
}: AsyncSingleSelectProps) => {
  const { isLoading, options, hasMore, fetchMoreOptions } = useAsyncSelect({
    fetchOptions,
    pageSize,
  });

  return (
    <SingleSelect options={options} {...rest}>
      {options.map((option) => (
        <SelectOption key={key(option)} value={key(option)} isSelected={rest.value === key(option)}>
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
    </SingleSelect>
  );
};
