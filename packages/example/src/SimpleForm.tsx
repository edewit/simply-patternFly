import {
  ActionGroup,
  Button,
  Form,
  FormLabel,
  MultiSelect,
  Title,
} from "@simply-patternfly/core";
import { useState } from "react";
import { states } from "./constants";

export const SimpleForm = () => {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [filteredOptions, setFilteredOptions] = useState<string[]>(states);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(selectedOptions);
  };

  return (
    <>
      <Title headingLevel="h2">Simple Form</Title>
      <Form isHorizontal onSubmit={onSubmit}>
        <FormLabel name="states" label="States">
          <MultiSelect
            id="states"
            variant="typeaheadMulti"
            options={filteredOptions}
            onFilter={(value) => {
              setFilteredOptions(
                states.filter((option) =>
                  option.toLowerCase().startsWith(value.toLowerCase())
                )
              );
            }}
            selections={selectedOptions}
            onSelect={(value) => {
              if (selectedOptions.includes(value)) {
                setSelectedOptions(
                  selectedOptions.filter((option) => option !== value)
                );
              } else {
                setSelectedOptions([...selectedOptions, value]);
              }
            }}
            onClear={() => {
              setSelectedOptions([]);
            }}
          />
        </FormLabel>
        <ActionGroup>
          <Button variant="primary" type="submit">
            Submit
          </Button>
          <Button variant="link" onClick={() => setSelectedOptions([])}>
            Reset
          </Button>
        </ActionGroup>
      </Form>
    </>
  );
};
