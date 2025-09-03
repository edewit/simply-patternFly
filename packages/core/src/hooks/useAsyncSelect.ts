import { useCallback, useEffect, useState } from "react";
import { OptionType } from "../types";

type AsyncSelectResponse = {
  options: OptionType;
  hasMore: boolean;
};

export type UseAsyncSelectOptions = {
  fetchOptions: (first: number, max: number, filter?: string) => Promise<AsyncSelectResponse>;
  pageSize?: number;
};

export const useAsyncSelect = ({
  fetchOptions,
  pageSize = 10,
}: UseAsyncSelectOptions) => {
  const [isLoading, setIsLoading] = useState(false);
  const [options, setOptions] = useState<OptionType>([]);
  const [first, setFirst] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [filter, setFilter] = useState("");

  const loadOptions = useCallback(
    async (startIndex: number = 0, filterValue?: string) => {
      setIsLoading(true);
      const response = await fetchOptions(startIndex, pageSize, filterValue);
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
      await loadOptions(first, filter || undefined);
    },
    [loadOptions, first, filter]
  );

  const updateFilter = useCallback(
    (value: string): void => {
      setFilter(value);
      setOptions([]);
      setFirst(0);
      loadOptions(0, value);
    },
    [loadOptions]
  );

  useEffect(() => {
    loadOptions();
  }, [loadOptions]);

  return {
    isLoading,
    options,
    hasMore,
    filter,
    fetchMoreOptions,
    updateFilter,
  };
};
