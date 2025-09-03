import { SelectOption, Spinner } from "@patternfly/react-core";
import { useCallback, useEffect, useState } from "react";
import { MultiSelectProps, OptionType } from "../types";
import { key, LOADER_OPTION_VALUE, value } from "../utils/select";
import { MultiSelect } from "./MultiSelect";

export type AsyncMultiSelectProps = Omit<MultiSelectProps, "options" | "onFilter"> & {
  pageSize?: number;
  fetchOptions: (
    first: number,
    max: number,
    filter: string
  ) => Promise<ResponseType>;
};

export type ResponseType = {
  options: OptionType;
  hasMore: boolean;
};

export const AsyncMultiSelect = ({
  fetchOptions,
  pageSize = 10,
  ...rest
}: AsyncMultiSelectProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [options, setOptions] = useState<OptionType>([]);
  const [first, setFirst] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [filter, setFilter] = useState("");

  const loadOptions = useCallback(
    async (startIndex: number = 0, filter: string = "") => {
      setIsLoading(true);
      const response = await fetchOptions(startIndex, pageSize, filter);
      setIsLoading(false);

      if (startIndex === 0) {
        setOptions(response.options);
      } else {
        setOptions(
          (prevOptions) => [...prevOptions, ...response.options] as OptionType
        );
      }

      setFirst(startIndex + pageSize);
      setHasMore(response.hasMore);
    },
    [fetchOptions, pageSize]
  );

  const fetchMoreOptions = useCallback(
    async (event?: React.MouseEvent) => {
      event?.stopPropagation();
      event?.preventDefault();
      await loadOptions(first, filter);
    },
    [loadOptions, first, filter]
  );

  useEffect(() => {
    loadOptions();
  }, [loadOptions]);

  const updateFilter = useCallback(
    (value: string): void => {
      setFilter(value);
      setOptions([]);
      loadOptions(0, value);
    },
    [loadOptions]
  );

  return (
    <MultiSelect
      options={[]}
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
