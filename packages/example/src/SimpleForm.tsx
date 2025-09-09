import type { SimpleSelectOption } from "@simply-patternfly/core";
import {
  ActionGroup,
  AsyncTypeaheadSelect,
  AsyncSingleSelect,
  Button,
  Form,
  FormLabel,
  TypeaheadSelect,
  SingleSelect,
  Title,
} from "@simply-patternfly/core";
import { useState } from "react";
import { states, statesWithKey } from "./constants";

export const SimpleForm = () => {
  const [selected, setSelected] = useState<string>("");
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [filteredOptions, setFilteredOptions] = useState<string[]>(states);
  const [asyncSingleSelectedOptions, setAsyncSingleSelectedOptions] =
    useState<string>("");
  const [asyncSelectedOptions, setAsyncSelectedOptions] = useState<string[]>(
    []
  );
  const [asyncSelectedOptionsWithKey, setAsyncSelectedOptionsWithKey] =
    useState<SimpleSelectOption[]>([]);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(
      selected,
      selectedOptions,
      asyncSelectedOptions,
      asyncSelectedOptionsWithKey,
      asyncSingleSelectedOptions
    );
  };

  return (
    <>
      <Title headingLevel="h2">Simple Form</Title>
      <Form isHorizontal onSubmit={onSubmit}>
        <FormLabel name="states" label="Single Select">
          <SingleSelect
            value={selected}
            options={statesWithKey}
            onSelect={(value) => {
              setSelected(value);
            }}
          />
        </FormLabel>
        <FormLabel name="states" label="Multi Select">
          <TypeaheadSelect
            id="states"
            variant="typeaheadMulti"
            options={filteredOptions}
            onFilter={(value) => {
              setFilteredOptions(
                states.filter((option) =>
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
              } else {
                setSelectedOptions([...selectedOptions, value]);
              }
            }}
            onClear={() => {
              setSelectedOptions([]);
            }}
          />
        </FormLabel>
        <TypeaheadSelect
          options={filteredOptions}
          onFilter={(value) => {
            setFilteredOptions(
              states.filter((option) =>
                option.toLowerCase().startsWith(value?.toLowerCase() || "")
              )
            );
          }}
          selections={[selected]}
          onSelect={(value) => {
            setSelected(value);
          }}
        />
        <AsyncSingleSelect
          value={asyncSingleSelectedOptions}
          onSelect={(value) => {
            setAsyncSingleSelectedOptions(value);
          }}
          pageSize={5}
          fetchOptions={(first, max) =>
            new Promise<{ options: string[]; hasMore: boolean }>((resolve) => {
              setTimeout(() => {
                resolve({
                  options: states.slice(first, first + max),
                  hasMore: first + max < states.length,
                });
              }, 2000);
            })
          }
        />
        <AsyncTypeaheadSelect<string[]>
          variant="typeaheadMulti"
          selections={asyncSelectedOptions}
          onSelect={(value) => {
            if (asyncSelectedOptions.includes(value)) {
              setAsyncSelectedOptions(
                asyncSelectedOptions.filter((option) => option !== value)
              );
            } else {
              setAsyncSelectedOptions([...asyncSelectedOptions, value]);
            }
          }}
          pageSize={7}
          fetchOptions={(first, max, filter) =>
            new Promise<{ options: string[]; hasMore: boolean }>((resolve) => {
              setTimeout(() => {
                const filteredStates = states.filter((state) =>
                  state.toLowerCase().startsWith(filter?.toLowerCase() || "")
                );
                resolve({
                  options: filteredStates.slice(first, first + max),
                  hasMore: first + max < states.length,
                });
              }, 2000);
            })
          }
        />
        <FormLabel
          name="statesWithKey"
          label="States with Key (Object Options)"
        >
          <AsyncTypeaheadSelect<SimpleSelectOption[]>
            variant="typeaheadMulti"
            selections={asyncSelectedOptionsWithKey}
            onSelect={(value) => {
              if (
                asyncSelectedOptionsWithKey
                  .map((option) => option.key)
                  .includes(value.key)
              ) {
                setAsyncSelectedOptionsWithKey(
                  asyncSelectedOptionsWithKey.filter(
                    (option) => option.key !== value.key
                  )
                );
              } else {
                setAsyncSelectedOptionsWithKey([
                  ...asyncSelectedOptionsWithKey,
                  value,
                ]);
              }
            }}
            pageSize={5}
            fetchOptions={(first, max, filter) =>
              new Promise<{ options: SimpleSelectOption[]; hasMore: boolean }>(
                (resolve) => {
                  setTimeout(() => {
                    const filteredStates = statesWithKey.filter((state) =>
                      state.value
                        .toLowerCase()
                        .startsWith(filter?.toLowerCase() || "")
                    );
                    resolve({
                      options: filteredStates.slice(first, first + max),
                      hasMore: first + max < statesWithKey.length,
                    });
                  }, 2000);
                }
              )
            }
          />
        </FormLabel>
        <ActionGroup>
          <Button variant="primary" type="submit">
            Submit
          </Button>
          <Button
            variant="link"
            onClick={() => {
              setSelectedOptions([]);
              setAsyncSelectedOptions([]);
              setAsyncSelectedOptionsWithKey([]);
              setAsyncSingleSelectedOptions("");
            }}
          >
            Reset
          </Button>
        </ActionGroup>
      </Form>
    </>
  );
};
