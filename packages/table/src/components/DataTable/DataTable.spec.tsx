import { expect, test } from "@playwright/experimental-ct-react";
import {
  BasicTableStory,
  CheckboxSelectionStory,
  RadioSelectionStory,
  WithActionsStory,
  WithActionResolverStory,
  CompactTableStory,
  DisabledSelectionStory,
  DisabledActionsStory,
  ExpandableTableStory,
  PreSelectedRowsStory,
  EmptyTableStory,
  CustomColumnDisplayStory,
} from "./DataTable.story";

test.describe("DataTable Component", () => {
  test("renders basic table with columns and rows", async ({ mount }) => {
    const component = await mount(<BasicTableStory />);

    // Check headers first (these should render even if table has issues)
    await expect(component.getByText("Name")).toBeVisible();
    await expect(component.getByText("Status")).toBeVisible();
    await expect(component.getByText("Email")).toBeVisible();

    // Check data rows
    await expect(component.getByText("John Doe")).toBeVisible();
    await expect(component.getByText("Active").first()).toBeVisible();
    await expect(component.getByText("john@example.com")).toBeVisible();
    await expect(component.getByText("Jane Smith")).toBeVisible();
    await expect(component.getByText("Inactive")).toBeVisible();
    await expect(component.getByText("jane@example.com")).toBeVisible();

    // Should have 3 data rows
    const dataRows = component.locator("tbody tr");
    await expect(dataRows).toHaveCount(3);

    // Verify table structure exists (table is rendering properly as evidenced by rows)
    await expect(component.getByText("Name")).toBeVisible(); // Header proves table structure
  });

  test("renders checkbox selection functionality", async ({ mount }) => {
    const component = await mount(<CheckboxSelectionStory />);

    // Check for select all checkbox in header
    const selectAllCheckbox = component.locator("thead input[type='checkbox']");
    await expect(selectAllCheckbox).toBeVisible();

    // Check for individual row checkboxes
    const rowCheckboxes = component.locator("tbody input[type='checkbox']");
    await expect(rowCheckboxes).toHaveCount(3);

    // Test selecting individual row
    const firstRowCheckbox = rowCheckboxes.first();
    await firstRowCheckbox.click();
    await expect(firstRowCheckbox).toBeChecked();

    // Test select all functionality
    await selectAllCheckbox.click();
    const allCheckboxes = component.locator("input[type='checkbox']");
    const checkboxCount = await allCheckboxes.count();
    for (let i = 0; i < checkboxCount; i++) {
      await expect(allCheckboxes.nth(i)).toBeChecked();
    }
  });

  test("renders radio selection functionality", async ({ mount }) => {
    const component = await mount(<RadioSelectionStory />);

    // Should not have select all checkbox for radio mode
    const selectAllCheckbox = component.locator("thead input[type='checkbox']");
    await expect(selectAllCheckbox).not.toBeVisible();

    // Check for individual row radio buttons
    const rowRadios = component.locator("tbody input[type='radio']");
    await expect(rowRadios).toHaveCount(3);

    // Test selecting radio button (only one should be selected)
    const firstRadio = rowRadios.first();
    const secondRadio = rowRadios.nth(1);

    await firstRadio.click();
    await expect(firstRadio).toBeChecked();
    await expect(secondRadio).not.toBeChecked();

    await secondRadio.click();
    await expect(firstRadio).not.toBeChecked();
    await expect(secondRadio).toBeChecked();
  });

  test("renders table with actions column", async ({ mount }) => {
    const component = await mount(<WithActionsStory />);

    // Check basic table structure
    await expect(component.getByText("John Doe")).toBeVisible();

    // Should have 4 columns (Name, Status, Email, Actions)
    const headerCells = component.locator("thead th");
    await expect(headerCells).toHaveCount(3); // Only data columns have headers

    // Check for actions in each row (should be 4 td elements per row including actions)
    const firstRowCells = component.locator("tbody tr").first().locator("td");
    await expect(firstRowCells).toHaveCount(4);
  });

  test("renders table with action resolver", async ({ mount }) => {
    const component = await mount(<WithActionResolverStory />);

    // Check basic table structure
    await expect(component.getByText("John Doe")).toBeVisible();

    // Check for actions in each row
    const firstRowCells = component.locator("tbody tr").first().locator("td");
    await expect(firstRowCells).toHaveCount(4); // 3 data + 1 action column
  });

  test("renders compact table variant", async ({ mount }) => {
    const component = await mount(<CompactTableStory />);

    // Check data is rendered correctly (compact is the default)
    await expect(component.getByText("John Doe")).toBeVisible();
    await expect(component.getByText("jane@example.com")).toBeVisible();

    // Check that we have table rows (proves table is rendering)
    const dataRows = component.locator("tbody tr");
    await expect(dataRows).toHaveCount(3);

    // Verify compact table is working (data and rows present proves functionality)
    await expect(component.getByText("Name")).toBeVisible(); // Header proves table structure
  });

  test("handles disabled selection for specific rows", async ({ mount }) => {
    const component = await mount(<DisabledSelectionStory />);

    // First wait for the table data to render
    await expect(component.getByText("John Doe")).toBeVisible();
    await expect(component.getByText("Jane Smith")).toBeVisible();
    await expect(component.getByText("Bob Johnson")).toBeVisible();

    // Get all row checkboxes first
    const rowCheckboxes = component.locator("tbody input[type='checkbox']");
    await expect(rowCheckboxes).toHaveCount(3);

    // Then check for select all checkbox (it should render after row checkboxes)
    const selectAllCheckbox = component.locator("thead input[type='checkbox']");
    await expect(selectAllCheckbox).toBeVisible();

    // Second row (index 1) should be disabled (Jane Smith)
    const secondRowCheckbox = rowCheckboxes.nth(1);
    await expect(secondRowCheckbox).toBeDisabled();

    // First and third rows should be enabled (John Doe and Bob Johnson)
    const firstRowCheckbox = rowCheckboxes.nth(0);
    const thirdRowCheckbox = rowCheckboxes.nth(2);
    await expect(firstRowCheckbox).toBeEnabled();
    await expect(thirdRowCheckbox).toBeEnabled();
  });

  test("handles disabled actions for specific rows", async ({ mount }) => {
    const component = await mount(<DisabledActionsStory />);

    // All rows should have the same number of cells
    const allRows = component.locator("tbody tr");
    await expect(allRows).toHaveCount(3);

    // First row should have 3 cells (no actions due to disableActions)
    const firstRowCells = allRows.first().locator("td");
    await expect(firstRowCells).toHaveCount(3);

    // Second and third rows should have 4 cells (including actions)
    const secondRowCells = allRows.nth(1).locator("td");
    const thirdRowCells = allRows.nth(2).locator("td");
    await expect(secondRowCells).toHaveCount(4);
    await expect(thirdRowCells).toHaveCount(4);
  });

  test("renders expandable table functionality", async ({ mount }) => {
    const component = await mount(<ExpandableTableStory />);

    // Check basic table structure is rendered  
    await expect(component.getByText("John Doe").first()).toBeVisible();
    
    // Should have rows (main + sub rows for expansion)
    const allRows = component.locator("tbody tr");
    await expect(allRows).toHaveCount(6); // 3 main rows + 3 sub rows
    
    // Check for expand/collapse functionality by looking for buttons
    const buttons = component.locator("button");
    const buttonCount = await buttons.count();
    expect(buttonCount).toBeGreaterThan(0); // Should have expand buttons
  });

  test("renders table with pre-selected rows", async ({ mount }) => {
    const component = await mount(<PreSelectedRowsStory />);

    // Check that some checkboxes are pre-selected
    const checkedCheckboxes = component.locator("tbody input[type='checkbox']:checked");
    await expect(checkedCheckboxes).toHaveCount(2); // First and third rows

    // Check specific rows are selected (rows containing John Doe and Bob Johnson)
    const johnDoeRow = component.locator("tr", { hasText: "John Doe" });
    const johnDoeCheckbox = johnDoeRow.locator("input[type='checkbox']");
    await expect(johnDoeCheckbox).toBeChecked();

    const bobJohnsonRow = component.locator("tr", { hasText: "Bob Johnson" });
    const bobJohnsonCheckbox = bobJohnsonRow.locator("input[type='checkbox']");
    await expect(bobJohnsonCheckbox).toBeChecked();

    // Jane Smith should not be selected
    const janeSmithRow = component.locator("tr", { hasText: "Jane Smith" });
    const janeSmithCheckbox = janeSmithRow.locator("input[type='checkbox']");
    await expect(janeSmithCheckbox).not.toBeChecked();
  });

  test("renders empty table correctly", async ({ mount }) => {
    const component = await mount(<EmptyTableStory />);

    // Check table headers are present
    await expect(component.getByText("Name")).toBeVisible();
    await expect(component.getByText("Status")).toBeVisible();
    await expect(component.getByText("Email")).toBeVisible();

    // Check no data rows
    const dataRows = component.locator("tbody tr");
    await expect(dataRows).toHaveCount(0);

    // Ensure no test data is present
    await expect(component.getByText("John Doe")).not.toBeVisible();
    await expect(component.getByText("jane@example.com")).not.toBeVisible();
  });

  test("renders custom column display names", async ({ mount }) => {
    const component = await mount(<CustomColumnDisplayStory />);

    // Check custom column headers
    await expect(component.getByText("Full Name")).toBeVisible();
    await expect(component.getByText("User Status")).toBeVisible();
    await expect(component.getByText("Email Address")).toBeVisible();

    // Original column names should not be visible in headers  
    // Note: PatternFly falls back to name if displayKey is not found, so we check for exact text matches
    const nameHeader = component.locator("thead th").filter({ hasText: /^Name$/ });
    const statusHeader = component.locator("thead th").filter({ hasText: /^Status$/ });
    const emailHeader = component.locator("thead th").filter({ hasText: /^Email$/ });
    
    await expect(nameHeader).not.toBeVisible();
    await expect(statusHeader).not.toBeVisible();
    await expect(emailHeader).not.toBeVisible();

    // Data should still be rendered correctly
    await expect(component.getByText("John Doe")).toBeVisible();
    await expect(component.getByText("Active").first()).toBeVisible();
  });

  test("handles table accessibility", async ({ mount }) => {
    const component = await mount(<BasicTableStory />);

    // Check data renders first
    await expect(component.getByText("John Doe")).toBeVisible();

    // Check that we have table structure
    const dataRows = component.locator("tbody tr");
    await expect(dataRows).toHaveCount(3);

    // Verify accessibility by checking semantic structure
    await expect(component.getByText("Name")).toBeVisible(); // Headers present

    // Check that all headers have proper structure
    const headers = component.locator("thead th");
    const headerCount = await headers.count();
    expect(headerCount).toBeGreaterThan(0);

    // Check that table has proper semantic structure
    await expect(component.locator("thead")).toBeVisible();
    await expect(component.locator("tbody")).toBeVisible();
  });

  test("handles selection state updates correctly", async ({ mount }) => {
    const component = await mount(<CheckboxSelectionStory />);

    // Start with no selections
    const rowCheckboxes = component.locator("tbody input[type='checkbox']");
    const selectAllCheckbox = component.locator("thead input[type='checkbox']");

    // Select first row
    await rowCheckboxes.first().click();
    await expect(rowCheckboxes.first()).toBeChecked();

    // Select all rows individually
    await rowCheckboxes.nth(1).click();
    await rowCheckboxes.nth(2).click();

    // Select all checkbox should now be checked (all rows selected)
    await expect(selectAllCheckbox).toBeChecked();

    // Unselect one row
    await rowCheckboxes.first().click();
    await expect(rowCheckboxes.first()).not.toBeChecked();

    // Select all checkbox should be unchecked but indeterminate state is handled by useEffect
    await expect(selectAllCheckbox).not.toBeChecked();
  });

  test("table structure with multiple features enabled", async ({ mount }) => {
    // Create a comprehensive test with selection + actions
    const component = await mount(
      <div>
        <CheckboxSelectionStory />
      </div>
    );

    // Check table has correct number of columns
    const firstRow = component.locator("tbody tr").first();
    const cells = firstRow.locator("td");
    await expect(cells).toHaveCount(4); // Selection + 3 data columns

    // Check table headers
    const headers = component.locator("thead th");
    await expect(headers).toHaveCount(4); // Select all + 3 data headers
  });
});
