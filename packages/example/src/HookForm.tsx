import {
  ActionGroup,
  Button,
  FemaleIcon,
  Form,
  Title,
  type SimpleSelectOption,
  useAlerts,
} from "@simply-patternfly/core";
import {
  AsyncSelectField,
  MultiSelectField,
  SingleSelectField,
  TextField,
} from "@simply-patternfly/react-hook-form";
import { useForm } from "react-hook-form";
import { countries, states } from "./constants";

type FormData = {
  name: string;
  email: string;
  message: string;
  gender: string;
  states: string[];
  hobbies: string[];
  country: string[];
};

export const HookForm = () => {
  const { addAlert } = useAlerts()!;
  const { control, handleSubmit, reset } = useForm<FormData>({
    mode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      message: "",
      gender: "",
      states: [],
      hobbies: [],
      country: [],
    },
  });

  const onSubmit = (data: FormData) => {
    console.log("Form submitted:", data);
    addAlert(`Hello ${data.name}! Your message has been received.`);
    reset();
  };
  return (
    <>
      <Title headingLevel="h2">Example Form</Title>
      <Form isHorizontal onSubmit={handleSubmit(onSubmit)}>
        <TextField
          labelIcon={
            <>
              Some cool text here or even an icon <FemaleIcon />
            </>
          }
          name="email"
          placeholder="Enter your email"
          control={control}
          label="Email Address"
          type="email"
          helperText="We will not share your email with anyone else."
          rules={{
            required: "Email is required",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "Please enter a valid email address",
            },
          }}
        />
        <TextField
          name="name"
          placeholder="Enter your name"
          control={control}
          label="Name"
          rules={{
            required: "Name is required",
            minLength: {
              value: 2,
              message: "Name must be at least 2 characters",
            },
          }}
        />

        <SingleSelectField
          name="gender"
          label="Gender"
          options={["male", "female"]}
          control={control}
        />

        <MultiSelectField
          name="states"
          label="States"
          options={states}
          control={control}
        />

        <MultiSelectField
          name="hobbies"
          label="Hobbies"
          options={[
            "Reading",
            "Gaming",
            "Cooking",
            "Hiking",
            "Photography",
            "Music",
            "Sports",
            "Traveling",
            "Gardening",
            "Drawing",
          ]}
          control={control}
          variant="typeaheadMulti"
          rules={{
            required: "Don't be a boring person, choose at least one hobby",
          }}
        />

        <AsyncSelectField
          variant="typeaheadMulti"
          name="country"
          label="Select countries that you have visited"
          fetchOptions={(first, max, filter) =>
            new Promise<{ options: SimpleSelectOption[]; hasMore: boolean }>((resolve) => {
              setTimeout(() => {
                const filteredCountries = countries.filter((country) =>
                  country.value.toLowerCase().startsWith(filter?.toLowerCase() || "")
                );
                resolve({
                  options: filteredCountries.slice(first, first + max),
                  hasMore: first + max < countries.length,
                });
              }, 2000);
            })
          }
          control={control}
        />

        <ActionGroup>
          <Button variant="primary" type="submit">
            Submit
          </Button>
          <Button variant="link" onClick={() => reset()}>
            Reset
          </Button>
        </ActionGroup>
      </Form>
    </>
  );
};
