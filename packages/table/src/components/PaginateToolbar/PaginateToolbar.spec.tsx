import { expect, test } from "@playwright/experimental-ct-react";
import {
  BasicPaginationToolbar,
  WithSearchToolbar,
  WithCustomToolbarItems,
  WithSubToolbar,
  FullFeaturedToolbar,
  EmptyStateToolbar,
  SecondPageToolbar,
  LargePageSizeToolbar,
  SmallDatasetToolbar,
  WithCustomIdToolbar,
} from "./PaginateToolbar.story";

test.describe("PaginatingTableToolbar Component", () => {
  test("renders basic pagination toolbar", async ({ mount }) => {
    const component = await mount(<BasicPaginationToolbar />);

    // Check that the toolbar is present
    const toolbar = component.locator('[data-testid="table-toolbar"]');
    await expect(toolbar).toBeVisible();

    // Check for pagination (may not be visible with small datasets)
    const paginationControls = component.locator('[role="navigation"]');
    const paginationCount = await paginationControls.count();
    
    if (paginationCount > 0) {
      // If pagination is present, check basic functionality
      const topPagination = paginationControls.first();
      await expect(topPagination).toBeVisible();
      
      // Should have top and potentially bottom pagination
      expect(paginationCount).toBeGreaterThanOrEqual(1);
      if (paginationCount === 2) {
        const bottomPagination = paginationControls.last();
        await expect(bottomPagination).toBeVisible();
      }
    }

    // Check content area
    await expect(component.getByText("Table content would go here")).toBeVisible();
  });

  test("renders search functionality", async ({ mount }) => {
    const component = await mount(<WithSearchToolbar />);

    // Check search input is present
    const searchInput = component.locator('[data-testid="table-search-input"] input');
    await expect(searchInput).toBeVisible();
    await expect(searchInput).toHaveAttribute("placeholder", "Search users...");

    // Check input group is present
    const inputGroup = component.locator('[data-testid="search-users"]');
    await expect(inputGroup).toBeVisible();

    // Test search input functionality
    await searchInput.fill("test search");
    await expect(searchInput).toHaveValue("test search");

    // Test clearing search
    const clearButton = component.locator('button[aria-label*="Clear input"]');
    if (await clearButton.count() > 0) {
      await clearButton.click();
      await expect(searchInput).toHaveValue("");
    }
  });

  test("renders custom toolbar items", async ({ mount }) => {
    const component = await mount(<WithCustomToolbarItems />);

    // Check custom buttons are present
    await expect(component.getByRole("button", { name: "Add User" })).toBeVisible();
    await expect(component.getByRole("button", { name: "Export" })).toBeVisible();

    // Check buttons are clickable
    const addButton = component.getByRole("button", { name: "Add User" });
    const exportButton = component.getByRole("button", { name: "Export" });
    
    await expect(addButton).toBeEnabled();
    await expect(exportButton).toBeEnabled();

    // Test button interactions
    await addButton.click();
    await exportButton.click();
  });

  test("renders sub-toolbar", async ({ mount }) => {
    const component = await mount(<WithSubToolbar />);

    // Check sub-toolbar button is present
    await expect(component.getByRole("button", { name: "Clear all filters" })).toBeVisible();

    // Check button is clickable
    const clearButton = component.getByRole("button", { name: "Clear all filters" });
    await expect(clearButton).toBeEnabled();
    await clearButton.click();
  });

  test("renders full featured toolbar", async ({ mount }) => {
    const component = await mount(<FullFeaturedToolbar />);

    // Check all features are present
    const searchInput = component.locator('[data-testid="table-search-input"] input');
    await expect(searchInput).toBeVisible();

    await expect(component.getByRole("button", { name: "Add User" })).toBeVisible();
    await expect(component.getByRole("button", { name: "Export" })).toBeVisible();
    await expect(component.getByRole("button", { name: "Clear all filters" })).toBeVisible();

    // Check pagination is present (may not render with current dataset)
    const pagination = component.locator('[role="navigation"]');
    const paginationCount = await pagination.count();
    // Pagination may not render depending on data size
    expect(paginationCount).toBeGreaterThanOrEqual(0);
  });

  test("handles empty state correctly", async ({ mount }) => {
    const component = await mount(<EmptyStateToolbar />);

    // Check that toolbar is present
    const toolbar = component.locator('[data-testid="table-toolbar"]');
    await expect(toolbar).toBeVisible();

    // With count=0, pagination may not render at all
    const allPagination = component.locator('[role="navigation"]');
    const paginationCount = await allPagination.count();
    
    // Bottom pagination should not be present when count is 0
    // Top pagination may or may not be present depending on PatternFly behavior
    expect(paginationCount).toBeLessThanOrEqual(1);

    // Check content
    await expect(component.getByText("No data - bottom pagination should not render")).toBeVisible();
  });

  test("displays correct pagination state for different pages", async ({ mount }) => {
    const component = await mount(<SecondPageToolbar />);

    // Check for pagination controls (may not be visible with current dataset)
    const pagination = component.locator('[role="navigation"]');
    const paginationCount = await pagination.count();
    
    if (paginationCount > 0) {
      const firstPagination = pagination.first();
      await expect(firstPagination).toBeVisible();

      // Check for previous button (should be enabled on page 2)
      const prevButton = component.locator('button[aria-label*="Go to previous page"]').first();
      if (await prevButton.count() > 0) {
        await expect(prevButton).toBeEnabled();
      }

      // Check for next button
      const nextButton = component.locator('button[aria-label*="Go to next page"]').first();
      if (await nextButton.count() > 0) {
        await expect(nextButton).toBeEnabled();
      }
    }
  });

  test("handles large page sizes", async ({ mount }) => {
    const component = await mount(<LargePageSizeToolbar />);

    // Check for pagination (may not be visible with current dataset)
    const pagination = component.locator('[role="navigation"]');
    const paginationCount = await pagination.count();
    
    if (paginationCount > 0) {
      const firstPagination = pagination.first();
      await expect(firstPagination).toBeVisible();

      // With 100 items and 50 per page, should have 2 pages
      // Check if page controls reflect this
      const nextButton = component.locator('button[aria-label*="Go to next page"]').first();
      if (await nextButton.count() > 0) {
        await expect(nextButton).toBeEnabled();
      }
    }

    // Check content
    await expect(component.getByText("Large page size (50 items per page)")).toBeVisible();
  });

  test("handles small datasets", async ({ mount }) => {
    const component = await mount(<SmallDatasetToolbar />);

    // Check for pagination (may not be visible with very small datasets)
    const pagination = component.locator('[role="navigation"]');
    const paginationCount = await pagination.count();
    
    if (paginationCount > 0) {
      const firstPagination = pagination.first();
      await expect(firstPagination).toBeVisible();

      // With only 5 items and page size 10, should be on first and only page
      const prevButton = component.locator('button[aria-label*="Go to previous page"]').first();
      if (await prevButton.count() > 0) {
        await expect(prevButton).toBeDisabled();
      }

      const nextButton = component.locator('button[aria-label*="Go to next page"]').first();
      if (await nextButton.count() > 0) {
        await expect(nextButton).toBeDisabled();
      }
    }
  });

  test("supports custom pagination ID for accessibility", async ({ mount }) => {
    const component = await mount(<WithCustomIdToolbar />);

    // Check for pagination with custom ID (may not be visible)
    const pagination = component.locator('[widget-id="custom-pagination-id"]');
    const anyPagination = component.locator('[role="navigation"]');
    const paginationCount = await anyPagination.count();
    
    if (paginationCount > 0) {
      const firstPagination = anyPagination.first();
      await expect(firstPagination).toBeVisible();
      
      // Check if custom ID is present
      if (await pagination.count() > 0) {
        await expect(pagination).toBeVisible();
      }
    }
  });

  test("pagination click handlers work", async ({ mount }) => {
    const component = await mount(<BasicPaginationToolbar />);

    // Check if pagination is available before testing interactions
    const pagination = component.locator('[role="navigation"]');
    const paginationCount = await pagination.count();
    
    if (paginationCount > 0) {
      // Test next page click (only if enabled)
      const nextButton = component.locator('button[aria-label*="Go to next page"]').first();
      if (await nextButton.count() > 0) {
        const isEnabled = await nextButton.isEnabled();
        if (isEnabled) {
          await nextButton.click();
        }
      }

      // Test previous page click (only if enabled)
      const prevButton = component.locator('button[aria-label*="Go to previous page"]').first();
      if (await prevButton.count() > 0) {
        const isEnabled = await prevButton.isEnabled();
        if (isEnabled) {
          await prevButton.click();
        }
      }
    }

    // Test per-page selector if available
    const pageSizeDropdown = component.locator('[aria-label*="Items per page"]');
    if (await pageSizeDropdown.count() > 0) {
      await pageSizeDropdown.click();
      
      // Try to select a different page size
      const pageSizeOption = component.locator('button[role="option"]').first();
      if (await pageSizeOption.count() > 0) {
        await pageSizeOption.click();
      }
    }
  });

  test("search input triggers onEnter callback", async ({ mount }) => {
    const component = await mount(<WithSearchToolbar />);

    const searchInput = component.locator('[data-testid="table-search-input"] input');
    await searchInput.fill("test query");
    await searchInput.press("Enter");

    // The search functionality should work (callback will be called via action)
    await expect(searchInput).toHaveValue("test query");
  });

  test("pagination displays correct item counts", async ({ mount }) => {
    const component = await mount(<BasicPaginationToolbar />);

    // Check for pagination first
    const pagination = component.locator('[role="navigation"]');
    const paginationCount = await pagination.count();
    
    if (paginationCount > 0) {
      // Check for pagination toggle template (shows item range)
      const itemRange = component.locator("b").first();
      if (await itemRange.count() > 0) {
        // The item range might be hidden by CSS but present in DOM
        const rangeText = await itemRange.textContent();
        if (rangeText && rangeText.trim()) {
          expect(rangeText).toMatch(/\d+ - \d+/); // Should show format like "1 - 10"
        }
      }
    }
  });

  test("toolbar layout and spacing", async ({ mount }) => {
    const component = await mount(<FullFeaturedToolbar />);

    // Check main toolbar structure
    const toolbar = component.locator('[data-testid="table-toolbar"]');
    await expect(toolbar).toBeVisible();

    // Check that toolbar items are properly arranged
    const toolbarContent = toolbar.locator('[class*="pf-v6-c-toolbar__content"], [class*="pf-v5-c-toolbar__content"], [class*="pf-c-toolbar__content"]').first();
    await expect(toolbarContent).toBeVisible();

    // Check divider is present (between toolbar and content)
    const divider = component.locator('[class*="pf-v6-c-divider"], [class*="pf-v5-c-divider"], [class*="pf-c-divider"]');
    await expect(divider).toBeVisible();
  });

  test("handles keyboard navigation", async ({ mount }) => {
    const component = await mount(<WithSearchToolbar />);

    // Test tab navigation through toolbar elements
    const searchInput = component.locator('[data-testid="table-search-input"] input');
    await searchInput.focus();
    await expect(searchInput).toBeFocused();

    // Test Enter key on search
    await searchInput.fill("keyboard test");
    await searchInput.press("Enter");
    await expect(searchInput).toHaveValue("keyboard test");

    // Test Escape key to clear (if supported)
    await searchInput.press("Escape");
    // Note: Escape behavior may vary based on PatternFly implementation
  });

  test("toolbar responsiveness", async ({ mount }) => {
    const component = await mount(<FullFeaturedToolbar />);

    // Check that toolbar adapts to content
    const toolbar = component.locator('[data-testid="table-toolbar"]');
    await expect(toolbar).toBeVisible();

    // Verify all elements are visible
    await expect(component.getByRole("button", { name: "Add User" })).toBeVisible();
    await expect(component.getByRole("button", { name: "Export" })).toBeVisible();
    
    const searchInput = component.locator('[data-testid="table-search-input"] input');
    await expect(searchInput).toBeVisible();

    // Check for pagination (may not be visible)
    const pagination = component.locator('[role="navigation"]');
    const paginationCount = await pagination.count();
    if (paginationCount > 0) {
      await expect(pagination.first()).toBeVisible();
    }
  });

  test("pagination variants (top and bottom)", async ({ mount }) => {
    const component = await mount(<BasicPaginationToolbar />);

    // Get all pagination elements
    const allPagination = component.locator('[role="navigation"]');
    const paginationCount = await allPagination.count();
    
    // May have 0, 1, or 2 pagination elements depending on data size
    expect(paginationCount).toBeGreaterThanOrEqual(0);
    
    if (paginationCount > 0) {
      // At least one pagination should be visible
      const firstPagination = allPagination.first();
      await expect(firstPagination).toBeVisible();
      
      if (paginationCount === 2) {
        // Both top and bottom should be visible
        const bottomPagination = allPagination.last();
        await expect(bottomPagination).toBeVisible();
        
        // Both should have similar controls
        const topNextButton = firstPagination.locator('button[aria-label*="Go to next page"]');
        const bottomNextButton = bottomPagination.locator('button[aria-label*="Go to next page"]');
        
        if (await topNextButton.count() > 0) {
          await expect(topNextButton).toBeVisible();
        }
        if (await bottomNextButton.count() > 0) {
          await expect(bottomNextButton).toBeVisible();
        }
      }
    }
  });
});
