import { useCallback, useState } from "react";
import { AsyncSelectResponse } from "../../hooks/useAsyncSelect";
import { AsyncTypeaheadSelect } from "./AsyncTypeaheadSelect";

export const AsyncTypeaheadValueSelect = ({
  onSelect,
}: {
  onSelect: (value: string[]) => void;
}) => {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const fetchOptions = useCallback(
    (
      first: number,
      max: number,
      filter?: string
    ): Promise<AsyncSelectResponse<string[]>> => {
      const allOptions = [
        "one",
        "two",
        "three",
        "four",
        "five",
        "six",
        "seven",
        "eight",
        "nine",
        "ten",
      ];

      const filteredOptions = filter
        ? allOptions.filter((option) =>
            option.toLowerCase().includes(filter.toLowerCase())
          )
        : allOptions;

      return new Promise((resolve) => {
        resolve({
          options: filteredOptions.slice(first, first + max),
          hasMore: first + max < filteredOptions.length,
        });
      });
    },
    []
  );
  return (
    <AsyncTypeaheadSelect
      chipGroupProps={{
        name: "group",
      }}
      variant="typeaheadMulti"
      selections={selectedOptions}
      onSelect={(value) => {
        if (selectedOptions.includes(value as string)) {
          setSelectedOptions(
            selectedOptions.filter((option) => option !== value)
          );
          onSelect(selectedOptions.filter((option) => option !== value));
        } else {
          setSelectedOptions([...selectedOptions, value as string]);
          onSelect([...selectedOptions, value as string]);
        }
      }}
      onClear={() => {
        setSelectedOptions([]);
        onSelect([]);
      }}
      pageSize={5}
      fetchOptions={fetchOptions}
    />
  );
};
