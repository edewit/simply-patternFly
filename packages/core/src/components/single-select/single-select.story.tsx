import { FormLabel } from "../FormLabel";
import { SingleSelect } from "./SingleSelect";
import { useState } from "react";

export const SingleValueSelect = ({
  onSelect,
}: {
  onSelect: (value: string) => void;
}) => {
  const [selectedValue, setSelectedValue] = useState("");
  return (
    <FormLabel name="single-value-select" label="Single Value Select">
      <SingleSelect
        value={selectedValue}
        options={[
          { key: "key1", value: "Option 1" },
          { key: "key2", value: "Option 2" },
        ]}
        onSelect={(value) => {
          setSelectedValue(value);
          onSelect(value);
        }}
      />
    </FormLabel>
  );
};
