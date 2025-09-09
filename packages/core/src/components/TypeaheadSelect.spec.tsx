import { expect, test } from "@playwright/experimental-ct-react";
import { TypeaheadValueSelect } from "./typeahead-select.story.tsx";
import { TypeaheadSelect } from "./TypeahedSelect.tsx";

test.describe("TypeaheadSelect", () => {
  test("select multiple options", async ({ mount, page }) => {
    let selectedValue: string[] = [];

    const component = await mount(
      <TypeaheadValueSelect onSelect={(value) => (selectedValue = value)} />
    );

    const toggle = component.getByRole("combobox");
    await expect(toggle).toBeVisible();
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

  test("deselect option by clicking again", async ({ mount, page }) => {
    let selectedValue: string[] = [];

    const component = await mount(
      <TypeaheadValueSelect onSelect={(value) => (selectedValue = value)} />
    );

    const toggle = component.getByRole("combobox");
    await toggle.click();

    // Select first option
    const option = page.getByRole("option", { name: "one" });
    await option.click();
    expect(selectedValue).toEqual(["one"]);

    // Click the same option again to deselect
    await option.click();
    expect(selectedValue).toEqual([]);
    
    // Check that the label is removed
    await expect(
      page.getByRole("list", { name: "Label group category" })
    ).not.toBeVisible();
  });

  test("filter options while typing", async ({ mount, page }) => {
    let selectedValue: string[] = [];

    const component = await mount(
      <TypeaheadValueSelect onSelect={(value) => (selectedValue = value)} />
    );

    const toggle = component.getByRole("combobox");
    await toggle.click();

    // Type to filter options
    await toggle.fill("th");

    // Should only show options starting with "th"
    await expect(page.getByRole("option", { name: "three" })).toBeVisible();
    await expect(page.getByRole("option", { name: "one" })).not.toBeVisible();
    await expect(page.getByRole("option", { name: "two" })).not.toBeVisible();

    // Select the filtered option
    await page.getByRole("option", { name: "three" }).click();
    expect(selectedValue).toEqual(["three"]);
  });

  test("clear all selections", async ({ mount, page }) => {
    let selectedValue: string[] = [];

    const component = await mount(
      <TypeaheadValueSelect onSelect={(value) => (selectedValue = value)} />
    );

    const toggle = component.getByRole("combobox");
    await toggle.click();

    // Select multiple options
    await page.getByRole("option", { name: "one" }).click();
    await page.getByRole("option", { name: "two" }).click();
    expect(selectedValue).toEqual(["one", "two"]);

    // Clear all selections using the clear button
    const clearButton = component.getByRole("button", { name: "Clear input value" });
    await expect(clearButton).toBeVisible();
    await clearButton.click();

    expect(selectedValue).toEqual([]);
    await expect(
      page.getByRole("list", { name: "Label group category" })
    ).not.toBeVisible();
  });

  test("remove individual selections using label close", async ({ mount, page }) => {
    let selectedValue: string[] = [];

    const component = await mount(
      <TypeaheadValueSelect onSelect={(value) => (selectedValue = value)} />
    );

    const toggle = component.getByRole("combobox");
    await toggle.click();

    // Select multiple options
    await page.getByRole("option", { name: "one" }).click();
    await page.getByRole("option", { name: "two" }).click();
    await page.getByRole("option", { name: "three" }).click();
    expect(selectedValue).toEqual(["one", "two", "three"]);

    // Remove middle option using the close button on the label
    const labelGroup = page.getByRole("list", { name: "Label group category" });
    await expect(labelGroup).toBeVisible();
    
    // Find and click the close button for "two" - look for the TimesIcon within the button
    const closeButton = labelGroup.getByRole("button").nth(1); // Second close button (for "two")
    await expect(closeButton).toBeVisible();
    await closeButton.click();

    expect(selectedValue).toEqual(["one", "three"]);
    await expect(labelGroup).toHaveText("onethree");
  });

  test("keyboard navigation with Enter key", async ({ mount }) => {
    let selectedValue: string[] = [];

    const component = await mount(
      <TypeaheadValueSelect onSelect={(value) => (selectedValue = value)} />
    );

    const toggle = component.getByRole("combobox");
    await toggle.click();

    // Press Enter to select the first option
    await toggle.press("Enter");
    expect(selectedValue).toEqual(["one"]);
  });

  test("keyboard navigation with Escape key", async ({ mount, page }) => {
    const component = await mount(
      <TypeaheadValueSelect onSelect={() => {}} />
    );

    const toggle = component.getByRole("combobox");
    await toggle.click();

    // Verify dropdown is open
    await expect(page.getByRole("option", { name: "one" })).toBeVisible();

    // Press Escape to close dropdown
    await toggle.press("Escape");

    // Verify dropdown is closed
    await expect(page.getByRole("option", { name: "one" })).not.toBeVisible();
  });

  test("disabled state", async ({ mount, page }) => {
    await mount(
      <TypeaheadSelect
        variant="typeaheadMulti"
        options={["Option 1", "Option 2", "Option 3"]}
        isDisabled={true}
        onSelect={() => {}}
        chipGroupProps={{ name: "group" }}
      />
    );

    // When disabled, no options should be visible initially
    await expect(page.getByRole("option", { name: "Option 1" })).not.toBeVisible();
    await expect(page.getByRole("listbox")).not.toBeVisible();
  });

  test("render with initial selections", async ({ mount, page }) => {
    await mount(
      <TypeaheadSelect
        variant="typeaheadMulti"
        options={["Option 1", "Option 2", "Option 3"]}
        selections={["Option 1", "Option 3"]}
        onSelect={() => {}}
        chipGroupProps={{ name: "group" }}
      />
    );

    // Check that initial selections are displayed
    const labelGroup = page.getByRole("list", { name: "Label group category" });
    await expect(labelGroup).toBeVisible();
    await expect(labelGroup).toHaveText("Option 1Option 3");
  });

  test("empty options array", async ({ mount, page }) => {
    const component = await mount(
      <TypeaheadSelect
        options={[]}
        onSelect={() => {}}
      />
    );

    const toggle = component.getByRole("combobox");
    await toggle.click();

    // Should not show any options
    await expect(page.getByRole("option")).not.toBeVisible();
  });

  test("handle object-based options", async ({ mount, page }) => {
    let selectedValue: string[] = [];
    const objectOptions = [
      { key: "key1", value: "Display 1" },
      { key: "key2", value: "Display 2" },
      { key: "key3", value: "Display 3" }
    ];

    const component = await mount(
      <TypeaheadSelect
        variant="typeaheadMulti"
        options={objectOptions}
        onSelect={(value) => selectedValue = [...selectedValue, value]}
        chipGroupProps={{ name: "group" }}
      />
    );

    const toggle = component.getByRole("combobox");
    await toggle.click();

    const option = page.getByRole("option", { name: "Display 1" });
    await expect(option).toBeVisible();
    await option.click();

    expect(selectedValue).toContain("key1");
  });

  test("focus management after selection", async ({ mount, page }) => {
    const component = await mount(
      <TypeaheadValueSelect onSelect={() => {}} />
    );

    const toggle = component.getByRole("combobox");
    await toggle.click();
    await toggle.focus();

    const option = page.getByRole("option", { name: "one" });
    await option.click();

    // Verify the dropdown remains open for multi-select (indicating focus is maintained)
    await expect(page.getByRole("option", { name: "two" })).toBeVisible();
  });
});
