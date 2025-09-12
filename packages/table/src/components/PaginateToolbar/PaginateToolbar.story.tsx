import { PaginatingTableToolbar } from "./PaginateToolbar";
import { Button, ToolbarItem } from "@patternfly/react-core";

// Mock action functions for testing
const mockAction = (name: string) => (...args: unknown[]) => {
  console.log(`${name} called with:`, args);
};

// Mock data for testing
const sampleData = Array.from({ length: 100 }, (_, i) => ({
  id: i + 1,
  name: `User ${i + 1}`,
  email: `user${i + 1}@example.com`,
  age: 20 + (i % 50),
}));

// Basic pagination toolbar
export const BasicPaginationToolbar = () => (
  <PaginatingTableToolbar
    count={sampleData.length}
    first={0}
    max={10}
    onNextClick={mockAction("onNextClick")}
    onPreviousClick={mockAction("onPreviousClick")}
    onPerPageSelect={mockAction("onPerPageSelect")}
  >
    <div style={{ padding: "20px", background: "#f5f5f5" }}>
      Table content would go here
    </div>
  </PaginatingTableToolbar>
);

// With search functionality
export const WithSearchToolbar = () => (
  <PaginatingTableToolbar
    count={sampleData.length}
    first={0}
    max={10}
    onNextClick={mockAction("onNextClick")}
    onPreviousClick={mockAction("onPreviousClick")}
    onPerPageSelect={mockAction("onPerPageSelect")}
    inputGroupName="search-users"
    inputGroupPlaceholder="Search users..."
    inputGroupOnEnter={mockAction("inputGroupOnEnter")}
  >
    <div style={{ padding: "20px", background: "#f5f5f5" }}>
      Table content with search functionality
    </div>
  </PaginatingTableToolbar>
);

// With custom toolbar items
export const WithCustomToolbarItems = () => (
  <PaginatingTableToolbar
    count={sampleData.length}
    first={0}
    max={10}
    onNextClick={mockAction("onNextClick")}
    onPreviousClick={mockAction("onPreviousClick")}
    onPerPageSelect={mockAction("onPerPageSelect")}
    toolbarItem={
      <>
        <ToolbarItem>
          <Button variant="primary" onClick={mockAction("addUser")}>
            Add User
          </Button>
        </ToolbarItem>
        <ToolbarItem>
          <Button variant="secondary" onClick={mockAction("exportData")}>
            Export
          </Button>
        </ToolbarItem>
      </>
    }
  >
    <div style={{ padding: "20px", background: "#f5f5f5" }}>
      Table content with custom toolbar items
    </div>
  </PaginatingTableToolbar>
);

// With sub-toolbar
export const WithSubToolbar = () => (
  <PaginatingTableToolbar
    count={sampleData.length}
    first={0}
    max={10}
    onNextClick={mockAction("onNextClick")}
    onPreviousClick={mockAction("onPreviousClick")}
    onPerPageSelect={mockAction("onPerPageSelect")}
    subToolbar={
      <ToolbarItem>
        <Button variant="link" onClick={mockAction("clearFilters")}>
          Clear all filters
        </Button>
      </ToolbarItem>
    }
  >
    <div style={{ padding: "20px", background: "#f5f5f5" }}>
      Table content with sub-toolbar
    </div>
  </PaginatingTableToolbar>
);

// Full featured toolbar
export const FullFeaturedToolbar = () => (
  <PaginatingTableToolbar
    count={sampleData.length}
    first={0}
    max={10}
    onNextClick={mockAction("onNextClick")}
    onPreviousClick={mockAction("onPreviousClick")}
    onPerPageSelect={mockAction("onPerPageSelect")}
    inputGroupName="search-users"
    inputGroupPlaceholder="Search users..."
    inputGroupOnEnter={mockAction("inputGroupOnEnter")}
    toolbarItem={
      <>
        <ToolbarItem>
          <Button variant="primary" onClick={mockAction("addUser")}>
            Add User
          </Button>
        </ToolbarItem>
        <ToolbarItem>
          <Button variant="secondary" onClick={mockAction("exportData")}>
            Export
          </Button>
        </ToolbarItem>
      </>
    }
    subToolbar={
      <ToolbarItem>
        <Button variant="link" onClick={mockAction("clearFilters")}>
          Clear all filters
        </Button>
      </ToolbarItem>
    }
  >
    <div style={{ padding: "20px", background: "#f5f5f5" }}>
      Table content with all features enabled
    </div>
  </PaginatingTableToolbar>
);

// Empty state (no data)
export const EmptyStateToolbar = () => (
  <PaginatingTableToolbar
    count={0}
    first={0}
    max={10}
    onNextClick={mockAction("onNextClick")}
    onPreviousClick={mockAction("onPreviousClick")}
    onPerPageSelect={mockAction("onPerPageSelect")}
    inputGroupName="search-users"
    inputGroupPlaceholder="Search users..."
    inputGroupOnEnter={mockAction("inputGroupOnEnter")}
  >
    <div style={{ padding: "20px", background: "#f5f5f5" }}>
      No data - bottom pagination should not render
    </div>
  </PaginatingTableToolbar>
);

// Different page positions
export const SecondPageToolbar = () => (
  <PaginatingTableToolbar
    count={sampleData.length}
    first={10}
    max={10}
    onNextClick={mockAction("onNextClick")}
    onPreviousClick={mockAction("onPreviousClick")}
    onPerPageSelect={mockAction("onPerPageSelect")}
  >
    <div style={{ padding: "20px", background: "#f5f5f5" }}>
      Second page of data (items 11-20 of 100)
    </div>
  </PaginatingTableToolbar>
);

// Large page size
export const LargePageSizeToolbar = () => (
  <PaginatingTableToolbar
    count={sampleData.length}
    first={0}
    max={50}
    onNextClick={mockAction("onNextClick")}
    onPreviousClick={mockAction("onPreviousClick")}
    onPerPageSelect={mockAction("onPerPageSelect")}
  >
    <div style={{ padding: "20px", background: "#f5f5f5" }}>
      Large page size (50 items per page)
    </div>
  </PaginatingTableToolbar>
);

// Small dataset
export const SmallDatasetToolbar = () => (
  <PaginatingTableToolbar
    count={5}
    first={0}
    max={10}
    onNextClick={mockAction("onNextClick")}
    onPreviousClick={mockAction("onPreviousClick")}
    onPerPageSelect={mockAction("onPerPageSelect")}
  >
    <div style={{ padding: "20px", background: "#f5f5f5" }}>
      Small dataset (5 items total, page size 10)
    </div>
  </PaginatingTableToolbar>
);

// Custom ID for accessibility
export const WithCustomIdToolbar = () => (
  <PaginatingTableToolbar
    id="custom-pagination-id"
    count={sampleData.length}
    first={0}
    max={10}
    onNextClick={mockAction("onNextClick")}
    onPreviousClick={mockAction("onPreviousClick")}
    onPerPageSelect={mockAction("onPerPageSelect")}
  >
    <div style={{ padding: "20px", background: "#f5f5f5" }}>
      Table with custom pagination ID for accessibility
    </div>
  </PaginatingTableToolbar>
);
