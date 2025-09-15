import {
  Checkbox,
  EmptyState,
  EmptyStateBody,
  SingleSelect,
} from "@simply-patternfly/core";
import { cellWidth, PaginatingTable } from "@simply-patternfly/table";
import { useState } from "react";
import { tableData, type User } from "./constants";

const SearchComponent = () => (
  <SingleSelect
    value="Filter by Name"
    options={["Filter by Name", "Filter by Age", "Filter by Email"]}
    onSelect={(value) => {
      console.log(value);
    }}
  />
);

export const Table = () => {
  const [useSearchComponent, setSearchComponent] = useState(false);
  const [noDataState, setNoDataState] = useState(false);
  const [selectable, setSelectable] = useState(false);
  const [radio, setRadio] = useState(false);
  const [canSelectAll, setCanSelectAll] = useState(false);
  return (
    <>
      <Checkbox
        label="Use search type component"
        id="toggle-search-type-component"
        isChecked={useSearchComponent}
        onChange={(_event, checked) => setSearchComponent(checked)}
      />
      <Checkbox
        label="No data state"
        id="toggle-no-data-state"
        isChecked={noDataState}
        onChange={(_event, checked) => setNoDataState(checked)}
      />
      <Checkbox
        label="Selectable"
        id="toggle-selectable"
        isChecked={selectable}
        onChange={(_event, checked) => setSelectable(checked)}
      />
      <div style={{ marginLeft: "20px" }}>
        <Checkbox
          label="Can select all"
          id="toggle-can-select-all"
          isChecked={canSelectAll}
          onChange={(_event, checked) => setCanSelectAll(checked)}
        />
        <Checkbox
          label="Radio"
          id="toggle-radio"
          isChecked={radio}
          onChange={(_event, checked) => setRadio(checked)}
        />
      </div>

      <br />
      <PaginatingTable<User>
        ariaLabelKey="Table"
        searchPlaceholderLabel="Search"
        onSelect={selectable ? (selected) => console.log(selected) : undefined}
        isRadio={radio}
        canSelectAll={canSelectAll}
        searchTypeComponent={
          useSearchComponent ? <SearchComponent /> : undefined
        }
        loader={(f, m, s) =>
          new Promise((resolve) => {
            if (noDataState) {
              resolve({ data: [], hasMore: false });
              return;
            }
            setTimeout(() => {
              const filteredData = s
                ? tableData.filter((user) =>
                    user.name.toLowerCase().includes(s?.toLowerCase() || "")
                  )
                : tableData;

              const data = filteredData.slice(f, f + m);
              const hasMore = f + m < filteredData.length;

              resolve({ data, hasMore });
            }, 1000);
          })
        }
        columns={[
          {
            name: "name",
            displayKey: "Name",
          },
          {
            name: "age",
            displayKey: "Age",
            transforms: [cellWidth(10)],
          },
          {
            name: "email",
            displayKey: "Email",
            cellRenderer: ({ email }) => (
              <a href={`mailto:${email}`}>{email}</a>
            ),
          },
        ]}
        actions={[
          {
            title: "Edit",
            onRowClick: (row) => {
              console.log(row);
            },
          },
        ]}
        emptyState={(searching) => (
          <EmptyState titleText="Empty state" headingLevel="h4">
            <EmptyStateBody>
              No data found {searching ? "for this search" : ""}
            </EmptyStateBody>
          </EmptyState>
        )}
      />
    </>
  );
};
