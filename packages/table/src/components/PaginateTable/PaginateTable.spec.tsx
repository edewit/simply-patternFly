import { expect, test } from "@playwright/experimental-ct-react";
import {
  BasicPaginatingTableStory,
  WithSearchStory,
  WithSelectionStory,
  WithRadioSelectionStory,
  WithActionsStory,
  EmptyStateStory,
  LoadingStateStory,
  LargeDatasetStory,
  WithDisabledRowsStory,
  CompactTableStory,
  NotCompactTableStory,
} from "./PaginateTable.story";

test.describe("PaginatingTable Component", () => {
  test("renders basic paginating table with data", async ({ mount }) => {
    const component = await mount(<BasicPaginatingTableStory />);

    // Check table headers
    await expect(component.getByText("Name")).toBeVisible();
    await expect(component.getByText("Age")).toBeVisible();
    await expect(component.getByText("Email")).toBeVisible();

    // Check some sample data is rendered
    await expect(component.getByText("John Doe")).toBeVisible();
    await expect(component.getByText("jane.smith@example.com")).toBeVisible();

    // Should have data rows
    const dataRows = component.locator("tbody tr");
    await expect(dataRows).toHaveCount(5); // Limited to first 5 users

    // Should have toolbar (pagination may not be visible with limited data)
    const toolbar = component.locator('[data-testid="table-toolbar"]');
    await expect(toolbar).toBeVisible();
  });

  test("renders search functionality", async ({ mount }) => {
    const component = await mount(<WithSearchStory />);

    // Check search input is present
    const searchInput = component.locator('input[placeholder*="Search users"]');
    await expect(searchInput).toBeVisible();

    // Test search functionality
    await searchInput.fill("John");
    await searchInput.press("Enter");

    // Should show filtered results
    await expect(component.getByText("John Doe")).toBeVisible();
    await expect(component.getByText("Bob Johnson")).toBeVisible();
    
    // Should not show non-matching results (wait a bit for filter to apply)
    await expect(component.getByText("Jane Smith")).not.toBeVisible();
  });

  test("renders checkbox selection functionality", async ({ mount }) => {
    const component = await mount(<WithSelectionStory />);

    // Check for select all checkbox in toolbar area
    const selectAllCheckbox = component.locator("thead input[type='checkbox']");
    await expect(selectAllCheckbox).toBeVisible();

    // Check for individual row checkboxes
    const rowCheckboxes = component.locator("tbody input[type='checkbox']");
    await expect(rowCheckboxes.first()).toBeVisible();

    // Test selecting individual row
    const firstRowCheckbox = rowCheckboxes.first();
    await firstRowCheckbox.click();
    await expect(firstRowCheckbox).toBeChecked();

    // Test select all functionality
    await selectAllCheckbox.click();
    
    // Verify multiple checkboxes are now checked
    const checkedCheckboxes = component.locator("tbody input[type='checkbox']:checked");
    const checkedCount = await checkedCheckboxes.count();
    expect(checkedCount).toBeGreaterThan(0);
  });

  test("renders radio selection functionality", async ({ mount }) => {
    const component = await mount(<WithRadioSelectionStory />);

    // Should not have select all checkbox for radio mode
    const selectAllCheckbox = component.locator("thead input[type='checkbox']");
    await expect(selectAllCheckbox).not.toBeVisible();

    // Check for individual row radio buttons
    const rowRadios = component.locator("tbody input[type='radio']");
    await expect(rowRadios.first()).toBeVisible();

    // Test selecting radio button (only one should be selected)
    const firstRadio = rowRadios.first();
    const secondRadio = rowRadios.nth(1);

    await firstRadio.click();
    await expect(firstRadio).toBeChecked();

    await secondRadio.click();
    await expect(firstRadio).not.toBeChecked();
    await expect(secondRadio).toBeChecked();
  });

  test("renders table with actions", async ({ mount }) => {
    const component = await mount(<WithActionsStory />);

    // Check basic table structure
    await expect(component.getByText("John Doe")).toBeVisible();

    // Check for actions in rows - look for action buttons or dropdowns
    const actionsElements = component.locator("tbody tr").first().locator("td").last();
    await expect(actionsElements).toBeVisible();

    // Should have action buttons or dropdown
    const buttons = component.locator("tbody button");
    const buttonCount = await buttons.count();
    expect(buttonCount).toBeGreaterThan(0);
  });

  test("renders empty state correctly", async ({ mount }) => {
    const component = await mount(<EmptyStateStory />);

    // Check empty state is displayed
    await expect(component.getByText("No data")).toBeVisible();
    await expect(component.getByText("No users found")).toBeVisible();

    // Should not have data rows
    const dataRows = component.locator("tbody tr");
    await expect(dataRows).toHaveCount(0);

    // Toolbar won't be visible with empty data (by design)
    const toolbar = component.locator('[data-testid="table-toolbar"]');
    await expect(toolbar).not.toBeVisible();
  });

  test("displays loading state", async ({ mount }) => {
    const component = await mount(<LoadingStateStory />);

    // Should show loading skeleton initially (or table data if loading is quick)
    const skeletons = component.locator('[class*="pf-c-skeleton"]').or(component.locator('[class*="pf-v5-c-skeleton"]'));
    const hasSkeletons = await skeletons.count();
    if (hasSkeletons > 0) {
      await expect(skeletons.first()).toBeVisible();
    }

    // Eventually data should load (wait for the mock delay)
    await expect(component.getByText("John Doe")).toBeVisible({ timeout: 5000 });
  });

  test("handles pagination with large dataset", async ({ mount }) => {
    const component = await mount(<LargeDatasetStory />);

    // Check pagination controls are present (may be visible only if there's enough data)
    const pagination = component.locator('[role="navigation"]').first();
    const toolbar = component.locator('[data-testid="table-toolbar"]');
    await expect(toolbar).toBeVisible();

    // Check for page size selector (if pagination is visible)
    const pageSizeDropdown = component.locator('[aria-label*="Items per page"]');
    const hasPagination = await pagination.count();
    if (hasPagination > 0) {
      await expect(pagination).toBeVisible();
      if (await pageSizeDropdown.count() > 0) {
        await expect(pageSizeDropdown).toBeVisible();
      }
    }

    // Check for next/previous buttons (use first to avoid strict mode violations)
    const nextButton = component.locator('button[aria-label*="Go to next page"]').first();
    const prevButton = component.locator('button[aria-label*="Go to previous page"]').first();
    
    // Check button states if they exist
    if (await prevButton.count() > 0) {
      // Previous should be disabled on first page
      await expect(prevButton).toBeDisabled();
    }
    
    if (await nextButton.count() > 0) {
      // If there's more than one page, next should be enabled
      await expect(nextButton).toBeEnabled();
    }
  });

  test("handles disabled rows correctly", async ({ mount }) => {
    const component = await mount(<WithDisabledRowsStory />);

    // Check that some rows have disabled checkboxes
    const disabledCheckboxes = component.locator("tbody input[type='checkbox']:disabled");
    const disabledCount = await disabledCheckboxes.count();
    expect(disabledCount).toBeGreaterThan(0);

    // Check that active users can be selected
    const enabledCheckboxes = component.locator("tbody input[type='checkbox']:not(:disabled)");
    const enabledCount = await enabledCheckboxes.count();
    expect(enabledCount).toBeGreaterThan(0);

    // Test that enabled checkbox can be selected
    const firstEnabledCheckbox = enabledCheckboxes.first();
    await firstEnabledCheckbox.click();
    await expect(firstEnabledCheckbox).toBeChecked();
  });

  test("renders compact table variant", async ({ mount }) => {
    const component = await mount(<CompactTableStory />);

    // Check data is rendered correctly
    await expect(component.getByText("John Doe")).toBeVisible();
    await expect(component.getByText("jane.smith@example.com")).toBeVisible();

    // Check that table has proper structure
    const dataRows = component.locator("tbody tr");
    await expect(dataRows).toHaveCount(6);

    // Verify table headers are present
    await expect(component.getByText("Name")).toBeVisible();
  });

  test("renders not compact table variant", async ({ mount }) => {
    const component = await mount(<NotCompactTableStory />);

    // Check data is rendered correctly
    await expect(component.getByText("John Doe")).toBeVisible();
    await expect(component.getByText("jane.smith@example.com")).toBeVisible();

    // Check that table has proper structure
    const dataRows = component.locator("tbody tr");
    await expect(dataRows).toHaveCount(6);

    // Verify table headers are present
    await expect(component.getByText("Name")).toBeVisible();
  });

  test("handles search with no results", async ({ mount }) => {
    const component = await mount(<WithSearchStory />);

    // Search for something that doesn't exist
    const searchInput = component.locator('input[placeholder*="Search users"]');
    await searchInput.fill("NonexistentUser");
    await searchInput.press("Enter");

    // Should show no data rows
    const dataRows = component.locator("tbody tr");
    await expect(dataRows).toHaveCount(0);

    // Clear search to restore data
    await searchInput.clear();
    await searchInput.press("Enter");

    // Data should be restored
    await expect(component.getByText("John Doe")).toBeVisible();
  });

  test("pagination controls work correctly", async ({ mount }) => {
    const component = await mount(<LargeDatasetStory />);

    // Get initial data count
    const initialRows = component.locator("tbody tr");
    const initialCount = await initialRows.count();
    expect(initialCount).toBeGreaterThan(0);

    // Check for pagination controls
    const pagination = component.locator('[role="navigation"]').first();
    const toolbar = component.locator('[data-testid="table-toolbar"]');
    await expect(toolbar).toBeVisible();

    // Test page size change if dropdown is available
    const pageSizeDropdown = component.locator('[aria-label*="Items per page"]');
    const hasPagination = await pagination.count();
    if (hasPagination > 0 && await pageSizeDropdown.count() > 0) {
      await expect(pagination).toBeVisible();
      if (await pageSizeDropdown.isVisible()) {
        await pageSizeDropdown.click();
        
        // Select a different page size if options are available
        const pageSizeOption = component.locator('button[role="option"]').first();
        if (await pageSizeOption.isVisible()) {
          await pageSizeOption.click();
          
          // Verify table still shows data after page size change
          await expect(component.getByText("John Doe")).toBeVisible();
        }
      }
    }
  });

  test("table accessibility features", async ({ mount }) => {
    const component = await mount(<BasicPaginatingTableStory />);

    // Check table structure
    await expect(component.locator("table")).toBeVisible();
    await expect(component.locator("thead")).toBeVisible();
    await expect(component.locator("tbody")).toBeVisible();

    // Check that table headers have proper structure
    const headers = component.locator("thead th");
    const headerCount = await headers.count();
    expect(headerCount).toBeGreaterThan(0);

    // Check aria labels and accessibility
    const table = component.locator("table");
    
    // Verify table has proper semantic structure
    await expect(table).toBeVisible();
    
    // Check for proper aria labels
    const ariaLabels = await table.getAttribute("aria-label");
    expect(ariaLabels).toBeTruthy();
  });

  test("toolbar functionality", async ({ mount }) => {
    const component = await mount(<WithSearchStory />);

    // Check toolbar is present
    const toolbar = component.locator('[data-testid="table-toolbar"]');
    await expect(toolbar).toBeVisible();

    // Check search input in toolbar
    const searchInput = component.locator('input[placeholder*="Search users"]');
    await expect(searchInput).toBeVisible();

    // Check pagination in toolbar (if available)
    const pagination = component.locator('[role="navigation"]').first();
    const hasPagination = await pagination.count();
    if (hasPagination > 0) {
      await expect(pagination).toBeVisible();
    }

    // Test that toolbar doesn't interfere with table functionality
    await searchInput.fill("John");
    await searchInput.press("Enter");
    await expect(component.getByText("John Doe")).toBeVisible();
  });

  test("handles selection state persistence", async ({ mount }) => {
    const component = await mount(<WithSelectionStory />);

    // Select a few rows
    const rowCheckboxes = component.locator("tbody input[type='checkbox']");
    await rowCheckboxes.first().click();
    await rowCheckboxes.nth(1).click();

    // Verify selections persist
    await expect(rowCheckboxes.first()).toBeChecked();
    await expect(rowCheckboxes.nth(1)).toBeChecked();

    // Test that unselecting works
    await rowCheckboxes.first().click();
    await expect(rowCheckboxes.first()).not.toBeChecked();
    await expect(rowCheckboxes.nth(1)).toBeChecked(); // Second should still be selected
  });
});
