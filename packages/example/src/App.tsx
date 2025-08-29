import {
  ActionGroup,
  Button,
  FemaleIcon,
  Form,
  Masthead,
  MastheadBrand,
  MastheadLogo,
  MastheadMain,
  MultiSelect,
  Page,
  PageSection,
  Title,
} from "@simply-patternfly/core";
import {
  SingleSelectField,
  TextField,
} from "@simply-patternfly/react-hook-form";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";

interface FormData {
  name: string;
  email: string;
  message: string;
  gender: string;
}

function App() {
  const [selectedOptions, setSelectedOptions] = useState<string>("");
  const options = useMemo<string[]>(() => [
    "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "Florida", "Georgia",
    "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland",
    "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey",
    "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina",
    "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"
  ], []);
  const [filteredOptions, setFilteredOptions] = useState<string[]>(options);

  const { control, handleSubmit, reset } = useForm<FormData>({
    mode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      message: "",
      gender: "",
    },
  });

  const onSubmit = (data: FormData) => {
    console.log("Form submitted:", data);
    alert(`Hello ${data.name}! Your message has been received.`);
    reset();
  };

  return (
    <Page
      masthead={
        <Masthead>
          <MastheadMain>
            <MastheadBrand>
              <MastheadLogo href="https://patternfly.org" target="_blank">
                Logo
              </MastheadLogo>
            </MastheadBrand>
          </MastheadMain>
        </Masthead>
      }
    >
      <PageSection>
        <Title headingLevel="h1">Simply PatternFly</Title>
      </PageSection>
      <PageSection>
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

          <MultiSelect
            options={filteredOptions}
            onFilter={(value) => {
              setFilteredOptions(options.filter((option) => option.toLowerCase().includes(value.toLowerCase())));
            }}
            selections={selectedOptions ? [selectedOptions] : []}
            onSelect={setSelectedOptions}
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
      </PageSection>
      <PageSection variant="secondary">
        <div>
          This example demonstrates the multi-module structure with core and
          react-hook-form packages
        </div>
      </PageSection>
    </Page>
  );
}

export default App;
