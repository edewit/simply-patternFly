import { IActions, IActionsResolver } from "@patternfly/react-table";
import { Cell, Field, Row, SubRow } from "../../types";
import { DataTable } from "./DataTable";

// Test data types
type TestRowData = {
  id: string;
  name: string;
  status: string;
  email: string;
};

// Mock data for testing
const testColumns: Field<TestRowData>[] = [
  { name: "Name", displayKey: "Name" },
  { name: "Status", displayKey: "Status" },
  { name: "Email", displayKey: "Email" },
];

const createTestData = (): TestRowData[] => [
  { id: "1", name: "John Doe", status: "Active", email: "john@example.com" },
  {
    id: "2",
    name: "Jane Smith",
    status: "Inactive",
    email: "jane@example.com",
  },
  { id: "3", name: "Bob Johnson", status: "Active", email: "bob@example.com" },
];

const createRows = (data: TestRowData[]) =>
  data.map((item) => ({
    data: item,
    cells: [item.name, item.status, item.email] as Cell<TestRowData>[],
    selected: false,
    disableSelection: false,
    disableActions: false,
  })) as Row<TestRowData>[];

const createExpandableRows = (data: TestRowData[]) => {
  const rows: SubRow<TestRowData>[] = [];
  data.forEach((item, index) => {
    // Main row
    rows.push({
      data: item,
      cells: [item.name, item.status, item.email] as Cell<TestRowData>[],
      parent: index * 2,
    }) as unknown as SubRow<TestRowData>;
    // Expandable content row
    rows.push({
      data: item,
      cells: [
        `Expanded content for ${item.name}: Additional details about this user.`,
      ] as unknown as Cell<TestRowData>[],
      parent: index * 2,
    }) as unknown as SubRow<TestRowData>;
  });
  return rows;
};

// Basic table story
export const BasicTableStory = () => {
  const data = createTestData();
  const rows = createRows(data);

  return (
    <DataTable
      ariaLabelKey="Basic table"
      columns={testColumns}
      rows={rows}
      canSelectAll={false}
      canSelect={false}
    />
  );
};

// Table with checkbox selection
export const CheckboxSelectionStory = () => {
  const data = createTestData();
  const rows = createRows(data);

  return (
    <DataTable
      ariaLabelKey="Table with checkbox selection"
      columns={testColumns}
      rows={rows}
      canSelectAll={true}
      canSelect={true}
      onSelect={(selected) => console.log("Selected:", selected)}
    />
  );
};

// Table with radio selection
export const RadioSelectionStory = () => {
  const data = createTestData();
  const rows = createRows(data);

  return (
    <DataTable
      ariaLabelKey="Table with radio selection"
      columns={testColumns}
      rows={rows}
      canSelectAll={false}
      canSelect={true}
      isRadio={true}
      onSelect={(selected) => console.log("Selected:", selected)}
    />
  );
};

// Table with actions
export const WithActionsStory = () => {
  const data = createTestData();
  const rows = createRows(data);
  const actions: IActions = [
    {
      title: "Edit",
      onClick: () => {},
    },
    {
      title: "Delete",
      onClick: () => {},
    },
  ];

  return (
    <DataTable
      ariaLabelKey="Table with actions"
      columns={testColumns}
      rows={rows}
      canSelectAll={false}
      canSelect={false}
      actions={actions}
    />
  );
};

// Table with action resolver
export const WithActionResolverStory = () => {
  const data = createTestData();
  const rows = createRows(data);
  const actionResolver: IActionsResolver = (row) => [
    {
      title: `Edit ${row.data.name}`,
      onClick: () => {},
    },
    ...(row.data.status === "Active"
      ? [
          {
            title: "Deactivate",
            onClick: () => {},
          },
        ]
      : [
          {
            title: "Activate",
            onClick: () => {},
          },
        ]),
  ];

  return (
    <DataTable
      ariaLabelKey="Table with action resolver"
      columns={testColumns}
      rows={rows}
      canSelectAll={false}
      canSelect={false}
      actionResolver={actionResolver}
    />
  );
};

// Compact table variant
export const CompactTableStory = () => {
  const data = createTestData();
  const rows = createRows(data);

  return (
    <DataTable
      ariaLabelKey="Compact table"
      columns={testColumns}
      rows={rows}
      canSelectAll={false}
      canSelect={false}
    />
  );
};

// Table with disabled selection rows
export const DisabledSelectionStory = () => {
  const data = createTestData();
  const rows = createRows(data).map((row, index) => ({
    ...row,
    disableSelection: index === 1, // Disable selection for second row
  }));

  return (
    <DataTable
      ariaLabelKey="Table with disabled selection"
      columns={testColumns}
      rows={rows}
      canSelectAll={true}
      canSelect={true}
    />
  );
};

// Table with disabled actions rows
export const DisabledActionsStory = () => {
  const data = createTestData();
  const rows = createRows(data).map((row, index) => ({
    ...row,
    disableActions: index === 0, // Disable actions for first row
  }));

  const actions: IActions = [
    {
      title: "Edit",
      onClick: () => {},
    },
    {
      title: "Delete",
      onClick: () => {},
    },
  ];

  return (
    <DataTable
      ariaLabelKey="Table with disabled actions"
      columns={testColumns}
      rows={rows}
      canSelectAll={false}
      canSelect={false}
      actions={actions}
    />
  );
};

// Expandable table
export const ExpandableTableStory = () => {
  const data = createTestData();
  const rows = createExpandableRows(data);

  return (
    <DataTable
      ariaLabelKey="Expandable table"
      columns={testColumns}
      rows={rows}
      canSelectAll={false}
      canSelect={false}
      onCollapse={(isOpen, rowIndex) =>
        console.log(`Row ${rowIndex} ${isOpen ? "expanded" : "collapsed"}`)
      }
    />
  );
};

// Table with pre-selected rows
export const PreSelectedRowsStory = () => {
  const data = createTestData();
  const rows = createRows(data);
  const selectedData = [data[0], data[2]]; // Pre-select first and third rows

  return (
    <DataTable
      ariaLabelKey="Table with pre-selected rows"
      columns={testColumns}
      rows={rows}
      canSelectAll={true}
      canSelect={true}
      selected={selectedData}
    />
  );
};

// Empty table
export const EmptyTableStory = () => {
  return (
    <DataTable
      ariaLabelKey="Empty table"
      columns={testColumns}
      rows={[]}
      canSelectAll={false}
      canSelect={false}
    />
  );
};

// Table with custom column displays
export const CustomColumnDisplayStory = () => {
  const data = createTestData();
  const customColumns: Field<TestRowData>[] = [
    { name: "name", displayKey: "Full Name" },
    { name: "status", displayKey: "User Status" },
    { name: "email", displayKey: "Email Address" },
  ];
  const rows = createRows(data);

  return (
    <DataTable
      ariaLabelKey="Table with custom column displays"
      columns={customColumns}
      rows={rows}
      canSelectAll={false}
      canSelect={false}
    />
  );
};
