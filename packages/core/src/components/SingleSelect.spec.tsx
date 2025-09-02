import { expect, test } from "@playwright/experimental-ct-react";
import { SingleSelect } from "./SingleSelect";
import { SingleValueSelect } from "./single-select.story.tsx";

test.describe("SingleSelect", () => {
  test("key value pair options", async ({ mount, page }) => {
    let selectedValue = "";

    const component = await mount(
      <SingleValueSelect onSelect={(value) => (selectedValue = value)} />
    );

    const toggle = component.getByRole("combobox");
    await expect(toggle).toBeVisible();

    await toggle.click();

    // use page.getByRole to find the option because the option is rendered in a portal
    const option = page.getByRole("option", { name: "Option 1" });
    await expect(option).toBeVisible();
    await option.click();

    expect(selectedValue).toBe("key1");
    await expect(toggle).toHaveText("Option 1");
  });

  test("string array options", async ({ mount, page }) => {
    let selectedValue = "";

    const component = await mount(
      <div>
        <SingleSelect
          options={["Option A", "Option B", "Option C"]}
          onSelect={(value) => (selectedValue = value)}
        />
      </div>
    );

    const toggle = component.getByRole("combobox");
    await expect(toggle).toBeVisible();
    await toggle.click();

    const option = page.getByRole("option", { name: "Option B" });
    await expect(option).toBeVisible();
    await option.click();

    expect(selectedValue).toBe("Option B");
  });

  test("render with selected value", async ({ mount }) => {
    const component = await mount(
      <div>
        <SingleSelect
          value="Option B"
          options={["Option A", "Option B", "Option C"]}
        />
      </div>
    );

    const toggle = component.getByRole("combobox");
    await expect(toggle).toBeVisible();
    await expect(toggle).toHaveText("Option B");
  });
});
