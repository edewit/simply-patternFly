import { EmptyState, EmptyStateBody } from "@patternfly/react-core";
import { cellWidth } from "@patternfly/react-table";
import { LoaderResponse } from "../../types";
import { PaginatingTable } from "./PaginateTable";

// Test data types
type TestUser = {
  id: number;
  name: string;
  age: number;
  email: string;
  status?: string;
};

// Test data
const testUsers: TestUser[] = [
  {
    id: 1,
    name: "John Doe",
    age: 30,
    email: "john.doe@example.com",
    status: "Active",
  },
  {
    id: 2,
    name: "Jane Smith",
    age: 25,
    email: "jane.smith@example.com",
    status: "Inactive",
  },
  {
    id: 3,
    name: "Bob Johnson",
    age: 35,
    email: "bob.johnson@example.com",
    status: "Active",
  },
  {
    id: 4,
    name: "Alice Brown",
    age: 28,
    email: "alice.brown@example.com",
    status: "Active",
  },
  {
    id: 5,
    name: "Charlie Wilson",
    age: 32,
    email: "charlie.wilson@example.com",
    status: "Inactive",
  },
  {
    id: 6,
    name: "Diana Davis",
    age: 27,
    email: "diana.davis@example.com",
    status: "Active",
  },
  {
    id: 7,
    name: "Edward Miller",
    age: 29,
    email: "edward.miller@example.com",
    status: "Active",
  },
  {
    id: 8,
    name: "Fiona Garcia",
    age: 31,
    email: "fiona.garcia@example.com",
    status: "Inactive",
  },
  {
    id: 9,
    name: "George Martinez",
    age: 26,
    email: "george.martinez@example.com",
    status: "Active",
  },
  {
    id: 10,
    name: "Helen Rodriguez",
    age: 33,
    email: "helen.rodriguez@example.com",
    status: "Active",
  },
  {
    id: 11,
    name: "Ian Lopez",
    age: 24,
    email: "ian.lopez@example.com",
    status: "Inactive",
  },
  {
    id: 12,
    name: "Julia Taylor",
    age: 34,
    email: "julia.taylor@example.com",
    status: "Active",
  },
];

// Mock async loader that simulates API calls
const createMockLoader =
  (data: TestUser[], delay: number = 500) =>
  async (
    first: number,
    max: number,
    search?: string
  ): Promise<LoaderResponse<TestUser>> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        let filteredData = data;

        if (search) {
          filteredData = data.filter(
            (user) =>
              user.name.toLowerCase().includes(search.toLowerCase()) ||
              user.email.toLowerCase().includes(search.toLowerCase())
          );
        }

        const result = filteredData.slice(first, first + max);
        const hasMore = first + max < filteredData.length;
        resolve({ data: result, hasMore });
      }, delay);
    });
  };

// Synchronous loader for faster tests
const createSyncLoader =
  (data: TestUser[]) =>
  async (
    first: number,
    max: number,
    search?: string
  ): Promise<LoaderResponse<TestUser>> => {
    let filteredData = data;

    if (search) {
      filteredData = data.filter(
        (user) =>
          user.name.toLowerCase().includes(search.toLowerCase()) ||
          user.email.toLowerCase().includes(search.toLowerCase())
      );
    }

    const result = filteredData.slice(first, first + max);
    const hasMore = first + max < filteredData.length;
    return { data: result, hasMore };
  };

// Basic columns configuration
const basicColumns = [
  { name: "name", displayKey: "Name" },
  { name: "age", displayKey: "Age", transforms: [cellWidth(10)] },
  { name: "email", displayKey: "Email" },
];

const columnsWithStatus = [
  { name: "name", displayKey: "Name" },
  { name: "status", displayKey: "Status", transforms: [cellWidth(15)] },
  { name: "email", displayKey: "Email" },
];

// Basic PaginatingTable story
export const BasicPaginatingTableStory = () => (
  <PaginatingTable<TestUser>
    ariaLabelKey="basic-table"
    loader={createSyncLoader(testUsers.slice(0, 5))}
    columns={basicColumns}
  />
);

// With search functionality
export const WithSearchStory = () => (
  <PaginatingTable<TestUser>
    ariaLabelKey="search-table"
    searchPlaceholderLabel="Search users..."
    loader={createSyncLoader(testUsers)}
    columns={basicColumns}
  />
);

// With selection functionality
export const WithSelectionStory = () => (
  <PaginatingTable<TestUser>
    ariaLabelKey="selection-table"
    searchPlaceholderLabel="Search users..."
    onSelect={(selected) => console.log("Selected:", selected)}
    canSelectAll={true}
    loader={createSyncLoader(testUsers)}
    columns={basicColumns}
  />
);

// With radio selection
export const WithRadioSelectionStory = () => (
  <PaginatingTable<TestUser>
    ariaLabelKey="radio-table"
    searchPlaceholderLabel="Search users..."
    onSelect={(selected) => console.log("Selected:", selected)}
    isRadio={true}
    loader={createSyncLoader(testUsers)}
    columns={basicColumns}
  />
);

// With actions
export const WithActionsStory = () => (
  <PaginatingTable<TestUser>
    ariaLabelKey="actions-table"
    searchPlaceholderLabel="Search users..."
    loader={createSyncLoader(testUsers)}
    columns={basicColumns}
    actions={[
      {
        title: "Edit",
        onRowClick: async (user) => {
          console.log("Edit:", user);
          return false; // Don't refresh
        },
      },
      {
        title: "Delete",
        onRowClick: async (user) => {
          console.log("Delete:", user);
          return true; // Refresh table
        },
      },
    ]}
  />
);

// With empty state
export const EmptyStateStory = () => (
  <PaginatingTable<TestUser>
    ariaLabelKey="empty-table"
    searchPlaceholderLabel="Search users..."
    loader={createSyncLoader([])}
    columns={basicColumns}
    emptyState={(searching) => (
      <EmptyState
        titleText={searching ? "No search results" : "No data"}
        headingLevel="h4"
      >
        <EmptyStateBody>
          {searching ? "Try adjusting your search criteria" : "No users found"}
        </EmptyStateBody>
      </EmptyState>
    )}
  />
);

// With loading state (using async loader with delay)
export const LoadingStateStory = () => (
  <PaginatingTable<TestUser>
    ariaLabelKey="loading-table"
    searchPlaceholderLabel="Search users..."
    loader={createMockLoader(testUsers, 2000)} // 2 second delay
    columns={basicColumns}
  />
);

// Large dataset with pagination
export const LargeDatasetStory = () => (
  <PaginatingTable<TestUser>
    ariaLabelKey="large-table"
    searchPlaceholderLabel="Search users..."
    onSelect={(selected) => console.log("Selected:", selected)}
    canSelectAll={true}
    loader={createSyncLoader(testUsers)}
    columns={columnsWithStatus}
    actions={[
      {
        title: "View",
        onRowClick: async (user) => {
          console.log("View:", user);
          return false;
        },
      },
    ]}
  />
);

// With disabled rows
export const WithDisabledRowsStory = () => (
  <PaginatingTable<TestUser>
    ariaLabelKey="disabled-table"
    searchPlaceholderLabel="Search users..."
    onSelect={(selected) => console.log("Selected:", selected)}
    canSelectAll={true}
    isRowDisabled={(user) => user.status === "Inactive"}
    loader={createSyncLoader(testUsers)}
    columns={columnsWithStatus}
    actions={[
      {
        title: "Edit",
        onRowClick: async (user) => {
          console.log("Edit:", user);
          return false;
        },
      },
    ]}
  />
);

// Compact variant
export const CompactTableStory = () => (
  <PaginatingTable<TestUser>
    ariaLabelKey="compact-table"
    searchPlaceholderLabel="Search users..."
    loader={createSyncLoader(testUsers.slice(0, 6))}
    columns={basicColumns}
    variant="compact"
  />
);

// Not compact variant
export const NotCompactTableStory = () => (
  <PaginatingTable<TestUser>
    ariaLabelKey="not-compact-table"
    searchPlaceholderLabel="Search users..."
    isNotCompact={true}
    loader={createSyncLoader(testUsers.slice(0, 6))}
    columns={basicColumns}
  />
);
