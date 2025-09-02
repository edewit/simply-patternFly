import { SelectOption, Spinner } from "@patternfly/react-core";
import { useCallback, useEffect, useState } from "react";
import { OptionType, SingleSelectProps } from "../types";
import { key, LOADER_OPTION_VALUE, value } from "../utils/select";
import { SingleSelect } from "./SingleSelect";

export type AsyncSingleSelectProps = Omit<SingleSelectProps, "options"> & {
  pageSize?: number;
  fetchOptions: (first: number, max: number) => Promise<ResponseType>;
};

export type ResponseType = {
  options: OptionType;
  hasMore: boolean;
};

export const AsyncSingleSelect = ({
  onSelect,
  fetchOptions,
  pageSize = 10,
}: AsyncSingleSelectProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [options, setOptions] = useState<OptionType>([]);
  const [first, setFirst] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const loadOptions = useCallback(
    async (
      startIndex: number,
      isAppending: boolean = false,
      event?: React.MouseEvent
    ) => {
      event?.stopPropagation();
      event?.preventDefault();
      setIsLoading(true);
      const response = await fetchOptions(startIndex, pageSize);
      setIsLoading(false);

      if (isAppending) {
        setOptions(
          (prevOptions) => [...prevOptions, ...response.options] as OptionType
        );
      } else {
        setOptions(response.options as OptionType);
      }

      setFirst(startIndex + pageSize);
      setHasMore(response.hasMore);
    },
    [fetchOptions, pageSize]
  );

  const fetchMoreOptions = useCallback(
    async (event?: React.MouseEvent) => {
      await loadOptions(first, true, event);
    },
    [loadOptions, first]
  );

  useEffect(() => {
    loadOptions(0, false);
  }, [loadOptions]);

  return (
    <SingleSelect options={[]} onSelect={onSelect}>
      {options.map((option) => (
        <SelectOption key={key(option)} value={key(option)}>
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
