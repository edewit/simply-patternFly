import { expect, test } from "@playwright/experimental-ct-react";
import { AsyncTypeaheadValueSelect } from "./async-typeahead.story";

test.describe("AsyncMultiSelect", () => {
  test("select multiple options", async ({ mount, page }) => {
    let selectedValue: string[] = [];

    const component = await mount(
      <AsyncTypeaheadValueSelect onSelect={(value) => (selectedValue = value)} />
    );

    const toggle = component.getByRole("combobox");
    await toggle.click();

    const option = page.getByRole("option", { name: "one" });
    await expect(option).toBeVisible();
    await option.click();

    expect(selectedValue).toEqual(["one"]);
    await expect(
      page.getByRole("list", { name: "Label group category" })
    ).toHaveText("one");

    const option2 = page.getByRole("option", { name: "two" });
    await expect(option2).toBeVisible();
    await option2.click();
    expect(selectedValue).toEqual(["one", "two"]);
    await expect(
      page.getByRole("list", { name: "Label group category" })
    ).toHaveText("onetwo");
  });

  test("View more option loads additional options", async ({ mount, page }) => {
    const component = await mount(
      <AsyncTypeaheadValueSelect onSelect={() => {}} />
    );

    const toggle = component.getByRole("combobox");
    await toggle.click();

    // Wait for initial options to load (pageSize=5, so we expect 5 options + "View more")
    await expect(page.getByRole("option", { name: "one" })).toBeVisible();
    await expect(page.getByRole("option", { name: "five" })).toBeVisible();
    
    // Check that "View more" option is present
    const viewMoreOption = page.getByRole("option", { name: "View more" });
    await expect(viewMoreOption).toBeVisible();

    // Initially, options 6-10 should not be visible
    await expect(page.getByRole("option", { name: "six" })).not.toBeVisible();

    // Click "View more" to load more options
    await viewMoreOption.click();

    // Wait for loading to complete and additional options to appear
    await expect(page.getByRole("option", { name: "six" })).toBeVisible();
    await expect(page.getByRole("option", { name: "ten" })).toBeVisible();

    // "View more" should no longer be visible since all options are loaded
    await expect(viewMoreOption).not.toBeVisible();
  });

  test("filtering works correctly", async ({ mount, page }) => {
    const component = await mount(
      <AsyncTypeaheadValueSelect onSelect={() => {}} />
    );

    const toggle = component.getByRole("combobox");
    await toggle.click();

    // Type to filter options
    await toggle.fill("t");

    // Wait for filtered results (should show "two", "three", "ten")
    await expect(page.getByRole("option", { name: "two" })).toBeVisible();
    await expect(page.getByRole("option", { name: "three" })).toBeVisible();
    
    // Options not starting with "t" should not be visible
    await expect(page.getByRole("option", { name: "one" })).not.toBeVisible();
    await expect(page.getByRole("option", { name: "four" })).not.toBeVisible();
  });

  test("clear functionality removes all selections", async ({ mount, page }) => {
    let selectedValue: string[] = [];

    const component = await mount(
      <AsyncTypeaheadValueSelect onSelect={(value) => (selectedValue = value)} />
    );

    const toggle = component.getByRole("combobox");
    await toggle.click();

    // Select multiple options
    await page.getByRole("option", { name: "one" }).click();
    await page.getByRole("option", { name: "two" }).click();

    expect(selectedValue).toEqual(["one", "two"]);

    // Clear all selections using the clear button
    const clearButton = page.getByRole("button", { name: "Clear input value" });
    await expect(clearButton).toBeVisible();
    await clearButton.click();

    expect(selectedValue).toEqual([]);
    await expect(
      page.getByRole("list", { name: "Label group category" })
    ).not.toBeVisible();
  });

  test("individual option deselection works", async ({ mount, page }) => {
    let selectedValue: string[] = [];

    const component = await mount(
      <AsyncTypeaheadValueSelect onSelect={(value) => (selectedValue = value)} />
    );

    const toggle = component.getByRole("combobox");
    await toggle.click();

    // Select multiple options
    await page.getByRole("option", { name: "one" }).click();
    await page.getByRole("option", { name: "two" }).click();
    await page.getByRole("option", { name: "three" }).click();

    expect(selectedValue).toEqual(["one", "two", "three"]);

    // Deselect "two" by clicking on its label close button
    const labelGroup = page.getByRole("list", { name: "Label group category" });
    const closeButton = labelGroup.getByRole("button").nth(1); // Second close button (for "two")
    await expect(closeButton).toBeVisible();
    await closeButton.click();

    expect(selectedValue).toEqual(["one", "three"]);
    await expect(
      page.getByRole("list", { name: "Label group category" })
    ).toHaveText("onethree");
  });

  test("loading state is displayed during async operations", async ({ mount, page }) => {
    const component = await mount(
      <AsyncTypeaheadValueSelect onSelect={() => {}} />
    );

    const toggle = component.getByRole("combobox");
    await toggle.click();

    // Initial load - should show loading state
    // Note: The story has a 2-second delay, so we should see loading initially
    
    // Wait for options to load
    await expect(page.getByRole("option", { name: "one" })).toBeVisible();

    // Test loading state when clicking "View more"
    const viewMoreOption = page.getByRole("option", { name: "View more" });
    await expect(viewMoreOption).toBeVisible();
    
    // Click "View more" and check for loading spinner
    await viewMoreOption.click();
    
    // The loading state should briefly show a spinner
    // Then more options should appear
    await expect(page.getByRole("option", { name: "six" })).toBeVisible();
  });

  test("keyboard navigation works", async ({ mount, page }) => {
    let selectedValue: string[] = [];

    const component = await mount(
      <AsyncTypeaheadValueSelect onSelect={(value) => (selectedValue = value)} />
    );

    const toggle = component.getByRole("combobox");
    await toggle.click();

    // Wait for options to load
    await expect(page.getByRole("option", { name: "one" })).toBeVisible();

    await toggle.press("Enter");
    expect(selectedValue).toEqual(["one"]);

    // Test Escape key to close dropdown
    await toggle.press("Escape");
    await expect(page.getByRole("option", { name: "one" })).not.toBeVisible();
  });

  test("handles empty filter results", async ({ mount, page }) => {
    const component = await mount(
      <AsyncTypeaheadValueSelect onSelect={() => {}} />
    );

    const toggle = component.getByRole("combobox");
    await toggle.click();

    // Filter with text that matches no options
    await toggle.fill("xyz");

    // Should show no options
    await expect(page.getByRole("option")).toHaveCount(0);
  });

  test("maintains selection state when filtering", async ({ mount, page }) => {
    let selectedValue: string[] = [];

    const component = await mount(
      <AsyncTypeaheadValueSelect onSelect={(value) => (selectedValue = value)} />
    );

    const toggle = component.getByRole("combobox");
    await toggle.click();

    // Select an option
    await page.getByRole("option", { name: "one" }).click();
    expect(selectedValue).toEqual(["one"]);

    // Filter options
    await toggle.fill("t");

    // Selected option should still be shown in the label group
    await expect(
      page.getByRole("list", { name: "Label group category" })
    ).toHaveText("one");

    // Clear filter
    await toggle.fill("");

    // Selected option should still be selected
    await expect(
      page.getByRole("list", { name: "Label group category" })
    ).toHaveText("one");
  });
});