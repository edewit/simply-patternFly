import { TableToolbar } from "./TableToolbar";
import { Button, ToolbarItem, Select, SelectOption, MenuToggle, MenuToggleElement } from "@patternfly/react-core";
import { useState } from "react";

// Mock action functions for testing
const mockAction = (name: string) => (...args: unknown[]) => {
  console.log(`${name} called with:`, args);
};

// Basic toolbar without any features
export const BasicToolbar = () => (
  <TableToolbar>
    <div style={{ padding: "20px", background: "#f5f5f5" }}>
      Basic table content goes here
    </div>
  </TableToolbar>
);

// Toolbar with search functionality
export const WithSearchToolbar = () => (
  <TableToolbar
    inputGroupName="search-items"
    inputGroupPlaceholder="Search items..."
    inputGroupOnEnter={mockAction("search")}
  >
    <div style={{ padding: "20px", background: "#f5f5f5" }}>
      Table content with search functionality
    </div>
  </TableToolbar>
);

// Toolbar with custom toolbar items
export const WithToolbarItems = () => (
  <TableToolbar
    toolbarItem={
      <>
        <ToolbarItem>
          <Button variant="primary" onClick={mockAction("addItem")}>
            Add Item
          </Button>
        </ToolbarItem>
        <ToolbarItem>
          <Button variant="secondary" onClick={mockAction("export")}>
            Export
          </Button>
        </ToolbarItem>
        <ToolbarItem>
          <Button variant="link" onClick={mockAction("import")}>
            Import
          </Button>
        </ToolbarItem>
      </>
    }
  >
    <div style={{ padding: "20px", background: "#f5f5f5" }}>
      Table content with toolbar items
    </div>
  </TableToolbar>
);

// Toolbar with sub-toolbar
export const WithSubToolbar = () => (
  <TableToolbar
    subToolbar={
      <>
        <ToolbarItem>
          <Button variant="link" onClick={mockAction("clearFilters")}>
            Clear all filters
          </Button>
        </ToolbarItem>
        <ToolbarItem>
          <span>Applied filters: Category, Status</span>
        </ToolbarItem>
      </>
    }
  >
    <div style={{ padding: "20px", background: "#f5f5f5" }}>
      Table content with sub-toolbar
    </div>
  </TableToolbar>
);

// Toolbar with footer items
export const WithFooterItems = () => (
  <TableToolbar
    toolbarItemFooter={
      <ToolbarItem>
        <span>Footer content: 100 items total</span>
      </ToolbarItem>
    }
  >
    <div style={{ padding: "20px", background: "#f5f5f5" }}>
      Table content with footer toolbar
    </div>
  </TableToolbar>
);

// Toolbar with search type component (dropdown)
export const WithSearchTypeComponent = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState("Name");

  const onToggleClick = () => {
    setIsOpen(!isOpen);
  };

  const onSelect = (_event: React.MouseEvent<Element, MouseEvent> | undefined, value: string | number | undefined) => {
    setSelected(value as string);
    setIsOpen(false);
  };

  return (
    <TableToolbar
      inputGroupName="search-with-type"
      inputGroupPlaceholder="Search..."
      inputGroupOnEnter={mockAction("searchWithType")}
      searchTypeComponent={
        <Select
          toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
            <MenuToggle
              ref={toggleRef}
              onClick={onToggleClick}
              isExpanded={isOpen}
              style={{ width: "120px" }}
            >
              {selected}
            </MenuToggle>
          )}
          isOpen={isOpen}
          onSelect={onSelect}
          onOpenChange={(isOpen) => setIsOpen(isOpen)}
        >
          <SelectOption value="Name">Name</SelectOption>
          <SelectOption value="Email">Email</SelectOption>
          <SelectOption value="ID">ID</SelectOption>
        </Select>
      }
    >
      <div style={{ padding: "20px", background: "#f5f5f5" }}>
        Table content with search type selector
      </div>
    </TableToolbar>
  );
};

// Full featured toolbar with everything
export const FullFeaturedToolbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState("All Fields");

  const onToggleClick = () => {
    setIsOpen(!isOpen);
  };

  const onSelect = (_event: React.MouseEvent<Element, MouseEvent> | undefined, value: string | number | undefined) => {
    setSelected(value as string);
    setIsOpen(false);
  };

  return (
    <TableToolbar
      inputGroupName="search-all-features"
      inputGroupPlaceholder="Search all fields..."
      inputGroupOnEnter={mockAction("fullSearch")}
      searchTypeComponent={
        <Select
          toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
            <MenuToggle
              ref={toggleRef}
              onClick={onToggleClick}
              isExpanded={isOpen}
              style={{ width: "120px" }}
            >
              {selected}
            </MenuToggle>
          )}
          isOpen={isOpen}
          onSelect={onSelect}
          onOpenChange={(isOpen) => setIsOpen(isOpen)}
        >
          <SelectOption value="All Fields">All Fields</SelectOption>
          <SelectOption value="Name">Name</SelectOption>
          <SelectOption value="Email">Email</SelectOption>
          <SelectOption value="Status">Status</SelectOption>
        </Select>
      }
      toolbarItem={
        <>
          <ToolbarItem>
            <Button variant="primary" onClick={mockAction("create")}>
              Create New
            </Button>
          </ToolbarItem>
          <ToolbarItem>
            <Button variant="secondary" onClick={mockAction("bulkEdit")}>
              Bulk Edit
            </Button>
          </ToolbarItem>
          <ToolbarItem>
            <Button variant="link" onClick={mockAction("export")}>
              Export CSV
            </Button>
          </ToolbarItem>
        </>
      }
      subToolbar={
        <>
          <ToolbarItem>
            <Button variant="link" onClick={mockAction("clearAllFilters")}>
              Clear all filters
            </Button>
          </ToolbarItem>
          <ToolbarItem>
            <span>Active filters: Status (Active), Department (Engineering)</span>
          </ToolbarItem>
        </>
      }
      toolbarItemFooter={
        <ToolbarItem>
          <span>Showing 1-25 of 150 results</span>
        </ToolbarItem>
      }
    >
      <div style={{ padding: "20px", background: "#f5f5f5" }}>
        <h3>Full Featured Table</h3>
        <p>This table has search, filtering, toolbar actions, sub-toolbar, and footer.</p>
        <table style={{ width: "100%", marginTop: "10px" }}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Status</th>
              <th>Department</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>John Doe</td>
              <td>john@example.com</td>
              <td>Active</td>
              <td>Engineering</td>
            </tr>
            <tr>
              <td>Jane Smith</td>
              <td>jane@example.com</td>
              <td>Active</td>
              <td>Marketing</td>
            </tr>
          </tbody>
        </table>
      </div>
    </TableToolbar>
  );
};

// Toolbar with only search (minimal)
export const SearchOnlyToolbar = () => (
  <TableToolbar
    inputGroupName="minimal-search"
    inputGroupPlaceholder="Type to search..."
    inputGroupOnEnter={mockAction("minimalSearch")}
  >
    <div style={{ padding: "20px", background: "#f5f5f5" }}>
      Minimal table with search only
    </div>
  </TableToolbar>
);

// Toolbar with only actions (no search)
export const ActionsOnlyToolbar = () => (
  <TableToolbar
    toolbarItem={
      <>
        <ToolbarItem>
          <Button variant="primary" onClick={mockAction("primaryAction")}>
            Primary Action
          </Button>
        </ToolbarItem>
        <ToolbarItem>
          <Button variant="danger" onClick={mockAction("deleteSelected")}>
            Delete Selected
          </Button>
        </ToolbarItem>
      </>
    }
  >
    <div style={{ padding: "20px", background: "#f5f5f5" }}>
      Table with actions only (no search)
    </div>
  </TableToolbar>
);
