import { SelectOption, Spinner } from "@patternfly/react-core";
import { AsyncSelectResponse, useAsyncSelect } from "../hooks/useAsyncSelect";
import { OptionType, SingleSelectProps } from "../types";
import { key, LOADER_OPTION_VALUE, value } from "../utils/select";
import { SingleSelect } from "./single-select/SingleSelect";

export type AsyncSingleSelectProps<T extends OptionType> = Omit<
  SingleSelectProps,
  "options"
> & {
  fetchOptions: (
    first: number,
    max: number,
    filter?: string
  ) => Promise<AsyncSelectResponse<T>>;
  pageSize?: number;
};

export const AsyncSingleSelect = <T extends OptionType>({
  fetchOptions,
  pageSize = 10,
  ...rest
}: AsyncSingleSelectProps<T>) => {
  const { isLoading, options, hasMore, fetchMoreOptions } = useAsyncSelect<T>({
    fetchOptions,
    pageSize,
  });

  return (
    <SingleSelect options={options} {...rest}>
      {options.map((option) => (
        <SelectOption
          key={key(option)}
          value={key(option)}
          isSelected={rest.value === key(option)}
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
    </SingleSelect>
  );
};
