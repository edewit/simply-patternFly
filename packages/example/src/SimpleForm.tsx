import {
  ActionGroup,
  AsyncMultiSelect,
  AsyncSingleSelect,
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
  const [asyncSelectedOptions, setAsyncSelectedOptions] = useState<string[]>([]);


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
        <AsyncSingleSelect
          pageSize={5}
          fetchOptions={(first, max) =>
            new Promise((resolve) => {
              setTimeout(() => {
                resolve({
                  options: states.slice(first, first + max),
                  hasMore: first + max < states.length,
                });
              }, 2000);
            })
          }
        />
        <AsyncMultiSelect
          variant="typeaheadMulti"
          selections={asyncSelectedOptions}
          onSelect={(value) => {
            if (asyncSelectedOptions.includes(value)) {
              setAsyncSelectedOptions(asyncSelectedOptions.filter((option) => option !== value)
              );
            } else {
              setAsyncSelectedOptions([...asyncSelectedOptions, value]);
            }
          }}
          pageSize={7}
          fetchOptions={(first, max, filter) =>
            new Promise((resolve) => {
              setTimeout(() => {
                const filteredStates = states.filter((state) =>
                  state.toLowerCase().startsWith(filter.toLowerCase())
                );
                resolve({
                  options: filteredStates.slice(first, first + max),
                  hasMore: first + max < states.length,
                });
              }, 2000);
            })
          }
        />
        <ActionGroup>
          <Button variant="primary" type="submit">
            Submit
          </Button>
          <Button variant="link" onClick={() => {
            setSelectedOptions([]);
            setAsyncSelectedOptions([]);
          }}>
            Reset
          </Button>
        </ActionGroup>
      </Form>
    </>
  );
};
