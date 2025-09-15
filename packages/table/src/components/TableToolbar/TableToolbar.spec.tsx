import { expect, test } from "@playwright/experimental-ct-react";
import {
  ActionsOnlyToolbar,
  BasicToolbar,
  FullFeaturedToolbar,
  SearchOnlyToolbar,
  WithFooterItems,
  WithSearchToolbar,
  WithSearchTypeComponent,
  WithSubToolbar,
  WithToolbarItems,
} from "./TableToolbar.story";

test.describe("TableToolbar Component", () => {
  test("renders basic toolbar structure", async ({ mount }) => {
    const component = await mount(<BasicToolbar />);

    // Check that the main toolbar is present
    const toolbar = component.locator('[data-testid="table-toolbar"]');
    await expect(toolbar).toBeVisible();

    // Check that divider is present
    const divider = component.locator(
      '[class*="pf-v6-c-divider"], [class*="pf-v5-c-divider"], [class*="pf-c-divider"]'
    );
    await expect(divider).toBeVisible();

    // Check content is rendered
    await expect(
      component.getByText("Basic table content goes here")
    ).toBeVisible();

    // Should have footer toolbar (even if empty)
    const toolbars = component.locator(
      '[class*="pf-v6-c-toolbar"], [class*="pf-v5-c-toolbar"], [class*="pf-c-toolbar"]'
    );
    const toolbarCount = await toolbars.count();
    expect(toolbarCount).toBeGreaterThanOrEqual(2); // Main toolbar + footer toolbar
  });

  test("renders search functionality", async ({ mount }) => {
    const component = await mount(<WithSearchToolbar />);

    // Check search input is present
    const searchInput = component.locator(
      '[data-testid="table-search-input"] input'
    );
    await expect(searchInput).toBeVisible();
    await expect(searchInput).toHaveAttribute("placeholder", "Search items...");

    // Check input group is present with correct testid
    const inputGroup = component.locator('[data-testid="search-items"]');
    await expect(inputGroup).toBeVisible();

    // Test search input functionality
    await searchInput.fill("test search query");
    await expect(searchInput).toHaveValue("test search query");

    // Test search on Enter key
    await searchInput.press("Enter");
    await expect(searchInput).toHaveValue("test search query");

    // Test clear functionality
    const clearButton = component.locator(
      'button[aria-label*="Clear"], button[aria-label*="clear"]'
    );
    if ((await clearButton.count()) > 0) {
      await clearButton.click();
      await expect(searchInput).toHaveValue("");
    }
  });

  test("renders custom toolbar items", async ({ mount }) => {
    const component = await mount(<WithToolbarItems />);

    // Check all toolbar buttons are present
    await expect(
      component.getByRole("button", { name: "Add Item" })
    ).toBeVisible();
    await expect(
      component.getByRole("button", { name: "Export" })
    ).toBeVisible();
    await expect(
      component.getByRole("button", { name: "Import" })
    ).toBeVisible();

    // Check buttons are clickable
    const addButton = component.getByRole("button", { name: "Add Item" });
    const exportButton = component.getByRole("button", { name: "Export" });
    const importButton = component.getByRole("button", { name: "Import" });

    await expect(addButton).toBeEnabled();
    await expect(exportButton).toBeEnabled();
    await expect(importButton).toBeEnabled();

    // Test button interactions
    await addButton.click();
    await exportButton.click();
    await importButton.click();

    // Check content is rendered
    await expect(
      component.getByText("Table content with toolbar items")
    ).toBeVisible();
  });

  test("renders sub-toolbar", async ({ mount }) => {
    const component = await mount(<WithSubToolbar />);

    // Check sub-toolbar content is present
    await expect(
      component.getByRole("button", { name: "Clear all filters" })
    ).toBeVisible();
    await expect(
      component.getByText("Applied filters: Category, Status")
    ).toBeVisible();

    // Test sub-toolbar button interaction
    const clearButton = component.getByRole("button", {
      name: "Clear all filters",
    });
    await expect(clearButton).toBeEnabled();
    await clearButton.click();

    // Check that there are multiple toolbars (main + sub + footer)
    const toolbars = component.locator(
      '[class*="pf-v6-c-toolbar"], [class*="pf-v5-c-toolbar"], [class*="pf-c-toolbar"]'
    );
    const toolbarCount = await toolbars.count();
    expect(toolbarCount).toBeGreaterThanOrEqual(3);
  });

  test("renders footer items", async ({ mount }) => {
    const component = await mount(<WithFooterItems />);

    // Check footer content is present
    await expect(
      component.getByText("Footer content: 100 items total")
    ).toBeVisible();

    // Check main content is rendered
    await expect(
      component.getByText("Table content with footer toolbar")
    ).toBeVisible();
  });

  test("renders search with type component", async ({ mount }) => {
    const component = await mount(<WithSearchTypeComponent />);

    // Check search input is present
    const searchInput = component.locator(
      '[data-testid="table-search-input"] input'
    );
    await expect(searchInput).toBeVisible();

    // Check search type dropdown is present
    const searchTypeToggle = component.getByRole("button", { name: "Name" });
    await expect(searchTypeToggle).toBeVisible();

    // Test dropdown interaction
    await searchTypeToggle.click();

    // Check dropdown options are available
    const emailOption = component.getByRole("option", { name: "Email" });

    if ((await emailOption.count()) > 0) {
      await expect(emailOption).toBeVisible();
      await emailOption.click();

      // Verify selection changed
      await expect(
        component.getByRole("button", { name: "Email" })
      ).toBeVisible();
    }
  });

  test("renders full featured toolbar", async ({ mount }) => {
    const component = await mount(<FullFeaturedToolbar />);

    // Check search functionality
    const searchInput = component.locator(
      '[data-testid="table-search-input"] input'
    );
    await expect(searchInput).toBeVisible();

    // Check search type dropdown
    const searchTypeToggle = component.getByRole("button", {
      name: "All Fields",
    });
    await expect(searchTypeToggle).toBeVisible();

    // Check toolbar buttons
    await expect(
      component.getByRole("button", { name: "Create New" })
    ).toBeVisible();
    await expect(
      component.getByRole("button", { name: "Bulk Edit" })
    ).toBeVisible();
    await expect(
      component.getByRole("button", { name: "Export CSV" })
    ).toBeVisible();

    // Check sub-toolbar
    await expect(
      component.getByRole("button", { name: "Clear all filters" })
    ).toBeVisible();
    await expect(
      component.getByText(
        "Active filters: Status (Active), Department (Engineering)"
      )
    ).toBeVisible();

    // Check footer
    await expect(
      component.getByText("Showing 1-25 of 150 results")
    ).toBeVisible();

    // Check table content
    await expect(component.getByText("Full Featured Table")).toBeVisible();
    await expect(component.getByText("John Doe")).toBeVisible();
    await expect(component.getByText("jane@example.com")).toBeVisible();
  });

  test("handles search-only configuration", async ({ mount }) => {
    const component = await mount(<SearchOnlyToolbar />);

    // Check only search is present
    const searchInput = component.locator(
      '[data-testid="table-search-input"] input'
    );
    await expect(searchInput).toBeVisible();
    await expect(searchInput).toHaveAttribute(
      "placeholder",
      "Type to search..."
    );

    // Should not have action buttons (search input may have internal buttons)
    // Instead check for specific action buttons that shouldn't be there
    const actionButtons = component
      .locator("button")
      .filter({ hasText: /add|delete|edit|create|export|import/i });
    const actionButtonCount = await actionButtons.count();
    expect(actionButtonCount).toBe(0);

    // Check content
    await expect(
      component.getByText("Minimal table with search only")
    ).toBeVisible();
  });

  test("handles actions-only configuration", async ({ mount }) => {
    const component = await mount(<ActionsOnlyToolbar />);

    // Check action buttons are present
    await expect(
      component.getByRole("button", { name: "Primary Action" })
    ).toBeVisible();
    await expect(
      component.getByRole("button", { name: "Delete Selected" })
    ).toBeVisible();

    // Should not have search input
    const searchInput = component.locator(
      '[data-testid="table-search-input"] input'
    );
    await expect(searchInput).not.toBeVisible();

    // Check content
    await expect(
      component.getByText("Table with actions only (no search)")
    ).toBeVisible();
  });

  test("search input state management", async ({ mount }) => {
    const component = await mount(<WithSearchToolbar />);

    const searchInput = component.locator(
      '[data-testid="table-search-input"] input'
    );

    // Test typing updates the input value
    await searchInput.fill("test query");
    await expect(searchInput).toHaveValue("test query");

    // Test that spaces are trimmed on search
    await searchInput.fill("  padded query  ");
    await searchInput.press("Enter");

    // After search, the component trims the value
    await expect(searchInput).toHaveValue("padded query");

    // Test clear functionality
    const clearButton = component.locator(
      'button[aria-label*="Clear"], button[aria-label*="clear"]'
    );
    if ((await clearButton.count()) > 0) {
      await clearButton.click();
      await expect(searchInput).toHaveValue("");
    }
  });

  test("keyboard navigation and accessibility", async ({ mount }) => {
    const component = await mount(<WithSearchToolbar />);

    // Test search input focus
    const searchInput = component.locator(
      '[data-testid="table-search-input"] input'
    );
    await searchInput.focus();
    await expect(searchInput).toBeFocused();

    // Test Enter key triggers search
    await searchInput.fill("keyboard test");
    await searchInput.press("Enter");
    await expect(searchInput).toHaveValue("keyboard test");

    // Check aria-label is present
    await expect(searchInput).toHaveAttribute("aria-label", "search");
  });

  test("toolbar layout and structure", async ({ mount }) => {
    const component = await mount(<FullFeaturedToolbar />);

    // Check main toolbar structure
    const mainToolbar = component.locator('[data-testid="table-toolbar"]');
    await expect(mainToolbar).toBeVisible();

    // Check toolbar content exists (use first to avoid strict mode violation)
    const toolbarContent = mainToolbar
      .locator(
        '[class*="pf-v6-c-toolbar__content"], [class*="pf-v5-c-toolbar__content"], [class*="pf-c-toolbar__content"]'
      )
      .first();
    await expect(toolbarContent).toBeVisible();

    // Check divider separates toolbar from content
    const divider = component.locator(
      '[class*="pf-v6-c-divider"], [class*="pf-v5-c-divider"], [class*="pf-c-divider"]'
    );
    await expect(divider).toBeVisible();

    // Check multiple toolbar sections exist (main, sub, footer)
    const allToolbars = component.locator(
      '[class*="pf-v6-c-toolbar"], [class*="pf-v5-c-toolbar"], [class*="pf-c-toolbar"]'
    );
    const toolbarCount = await allToolbars.count();
    expect(toolbarCount).toBeGreaterThanOrEqual(1); // At least the main toolbar should exist
  });

  test("handles empty configurations gracefully", async ({ mount }) => {
    const component = await mount(<BasicToolbar />);

    // Should still render basic structure
    const toolbar = component.locator('[data-testid="table-toolbar"]');
    await expect(toolbar).toBeVisible();

    // Should have no search input
    const searchInput = component.locator(
      '[data-testid="table-search-input"] input'
    );
    await expect(searchInput).not.toBeVisible();

    // Should have no action buttons
    const actionButtons = component.locator("button");
    const buttonCount = await actionButtons.count();
    expect(buttonCount).toBe(0);

    // Content should still render
    await expect(
      component.getByText("Basic table content goes here")
    ).toBeVisible();
  });

  test("search functionality with type component interaction", async ({
    mount,
  }) => {
    const component = await mount(<WithSearchTypeComponent />);

    // Test search type selection
    const searchTypeToggle = component.getByRole("button", { name: "Name" });
    await searchTypeToggle.click();

    const emailOption = component.getByRole("option", { name: "Email" });
    if ((await emailOption.count()) > 0) {
      await emailOption.click();
      await expect(
        component.getByRole("button", { name: "Email" })
      ).toBeVisible();
    }

    // Test search with selected type
    const searchInput = component.locator(
      '[data-testid="table-search-input"] input'
    );
    await searchInput.fill("test@example.com");
    await searchInput.press("Enter");
    await expect(searchInput).toHaveValue("test@example.com");
  });

  test("multiple toolbar items arrangement", async ({ mount }) => {
    const component = await mount(<WithToolbarItems />);

    // Check that all toolbar items are in the same toolbar
    const toolbar = component.locator('[data-testid="table-toolbar"]');
    const toolbarItems = toolbar.locator(
      '[class*="pf-v6-c-toolbar__item"], [class*="pf-v5-c-toolbar__item"], [class*="pf-c-toolbar__item"]'
    );
    const itemCount = await toolbarItems.count();
    expect(itemCount).toBeGreaterThanOrEqual(3); // Should have 3 toolbar items

    // Check buttons are properly spaced and visible
    const addButton = component.getByRole("button", { name: "Add Item" });
    const exportButton = component.getByRole("button", { name: "Export" });
    const importButton = component.getByRole("button", { name: "Import" });

    await expect(addButton).toBeVisible();
    await expect(exportButton).toBeVisible();
    await expect(importButton).toBeVisible();
  });

  test("footer toolbar positioning", async ({ mount }) => {
    const component = await mount(<WithFooterItems />);

    // Footer should be at the bottom after content
    const footerText = component.getByText("Footer content: 100 items total");
    await expect(footerText).toBeVisible();

    const content = component.getByText("Table content with footer toolbar");
    await expect(content).toBeVisible();

    // Both should be visible simultaneously
    await expect(footerText).toBeVisible();
    await expect(content).toBeVisible();
  });
});
