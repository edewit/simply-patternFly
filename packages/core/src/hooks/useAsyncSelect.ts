import { useCallback, useEffect, useState } from "react";
import { OptionType } from "../types";

export type AsyncSelectResponse<T extends OptionType> = {
  options: T;
  hasMore: boolean;
};

export type UseAsyncSelectOptions<T extends OptionType = OptionType> = {
  fetchOptions: (
    first: number,
    max: number,
    filter?: string
  ) => Promise<AsyncSelectResponse<T>>;
  pageSize?: number;
};

export const useAsyncSelect = <T extends OptionType>({
  fetchOptions,
  pageSize = 10,
}: {
  fetchOptions: (
    first: number,
    max: number,
    filter?: string
  ) => Promise<AsyncSelectResponse<T>>;
  pageSize?: number;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [options, setOptions] = useState<T>([] as unknown as T);
  const [first, setFirst] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [filter, setFilter] = useState<string | undefined>("");

  const loadOptions = useCallback(
    async (startIndex: number = 0, filterValue?: string) => {
      setIsLoading(true);
      const response = await fetchOptions(startIndex, pageSize, filterValue);
      setIsLoading(false);

      if (startIndex === 0) {
        setOptions(response.options as T);
      } else {
        setOptions(
          (prevOptions) => [...prevOptions, ...response.options] as unknown as T
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

  const updateFilter = useCallback(
    (value?: string): void => {
      setFilter(value);

      // Only reload if the filter actually changed
      if (value !== "") {
        loadOptions(0, value);
      }
    },
    [loadOptions]
  );

  useEffect(() => {
    loadOptions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    isLoading,
    options,
    hasMore,
    filter,
    fetchMoreOptions,
    updateFilter,
  };
};
