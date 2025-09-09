import { useState } from "react";
import { TypeaheadSelect } from "./TypeahedSelect";

export const TypeaheadValueSelect = ({
  onSelect,
}: {
  onSelect: (value: string[]) => void;
}) => {
  const options = [
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
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [filteredOptions, setFilteredOptions] = useState<string[]>(options);
  return (
    <TypeaheadSelect
      chipGroupProps={{
        name: "group",
      }}
      variant="typeaheadMulti"
      options={filteredOptions}
      onFilter={(value) => {
        setFilteredOptions(
          options.filter((option) =>
            option.toLowerCase().startsWith(value?.toLowerCase() || "")
          )
        );
      }}
      selections={selectedOptions}
      onSelect={(value) => {
        if (selectedOptions.includes(value)) {
          setSelectedOptions(
            selectedOptions.filter((option) => option !== value)
          );
          onSelect(selectedOptions.filter((option) => option !== value));
        } else {
          setSelectedOptions([...selectedOptions, value]);
          onSelect([...selectedOptions, value]);
        }
      }}
      onClear={() => {
        setSelectedOptions([]);
        onSelect([]);
      }}
    />
  );
};
