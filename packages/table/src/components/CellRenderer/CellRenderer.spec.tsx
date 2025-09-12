import { IRowCell } from "@patternfly/react-table";
import { expect, test } from "@playwright/experimental-ct-react";
import { isRow } from "./CellRenderer";
import {
  DisabledActionsStory,
  EmptyActionResolverStory,
  EmptyActionsStory,
  JSXElementsStory,
  NoActionsStory,
  RowCellsStory,
  StringCellsStory,
  WithActionResolverStory,
  WithActionsStory,
} from "./CellRenderer.story";

test.describe("CellRenderer Component", () => {
  test("renders simple string cells", async ({ mount }) => {
    const component = await mount(<StringCellsStory />);

    await expect(component.getByText("Cell 1")).toBeVisible();
    await expect(component.getByText("Cell 2")).toBeVisible();
    await expect(component.getByText("Cell 3")).toBeVisible();
  });

  test("renders IRowCell objects", async ({ mount }) => {
    const component = await mount(<RowCellsStory />);

    await expect(component.getByText("Row Cell 1")).toBeVisible();
    await expect(component.getByText("Simple Cell")).toBeVisible();
    await expect(component.getByText("Row Cell 2")).toBeVisible();
  });

  test("renders with actions column when actions provided", async ({
    mount,
  }) => {
    const component = await mount(<WithActionsStory />);

    await expect(component.getByText("Cell 1")).toBeVisible();
    await expect(component.getByText("Cell 2")).toBeVisible();

    // Check for actions column - count number of td elements (should be 3: Cell 1, Cell 2, Actions)
    const tableCells = component.locator("td");
    await expect(tableCells).toHaveCount(3);
  });

  test("renders with action resolver", async ({ mount }) => {
    const component = await mount(<WithActionResolverStory />);

    await expect(component.getByText("Cell 1")).toBeVisible();
    await expect(component.getByText("Cell 2")).toBeVisible();

    // Check for actions column - count number of td elements (should be 3: Cell 1, Cell 2, Actions)
    const tableCells = component.locator("td");
    await expect(tableCells).toHaveCount(3);
  });

  test("does not render actions when row has disableActions", async ({
    mount,
  }) => {
    const component = await mount(<DisabledActionsStory />);

    await expect(component.getByText("Cell 1")).toBeVisible();
    await expect(component.getByText("Cell 2")).toBeVisible();

    // Actions column should not be present - count number of td elements (should be 2: Cell 1, Cell 2)
    const tableCells = component.locator("td");
    await expect(tableCells).toHaveCount(2);
  });

  test("does not render actions when no actions or resolver provided", async ({
    mount,
  }) => {
    const component = await mount(<NoActionsStory />);

    await expect(component.getByText("Cell 1")).toBeVisible();
    await expect(component.getByText("Cell 2")).toBeVisible();

    // Actions column should not be present - count number of td elements (should be 2: Cell 1, Cell 2)
    const tableCells = component.locator("td");
    await expect(tableCells).toHaveCount(2);
  });

  test("renders JSX elements as cells", async ({ mount }) => {
    const component = await mount(<JSXElementsStory />);

    await expect(component.getByText("JSX Cell 1")).toBeVisible();
    await expect(component.getByText("String Cell")).toBeVisible();
    await expect(component.getByText("Bold JSX Cell")).toBeVisible();

    // Check that the bold element is rendered
    const boldElement = component.locator("strong");
    await expect(boldElement).toBeVisible();
    await expect(boldElement).toContainText("Bold JSX Cell");
  });

  test("handles empty actions array", async ({ mount }) => {
    const component = await mount(<EmptyActionsStory />);

    await expect(component.getByText("Cell 1")).toBeVisible();
    await expect(component.getByText("Cell 2")).toBeVisible();

    // Actions column should not be present when actions array is empty - count number of td elements (should be 2: Cell 1, Cell 2)
    const tableCells = component.locator("td");
    await expect(tableCells).toHaveCount(2);
  });

  test("action resolver returning empty array", async ({ mount }) => {
    const component = await mount(<EmptyActionResolverStory />);

    await expect(component.getByText("Cell 1")).toBeVisible();
    await expect(component.getByText("Cell 2")).toBeVisible();

    // Actions column should not be present when resolver returns empty array - count number of td elements (should be 2: Cell 1, Cell 2)
    const tableCells = component.locator("td");
    await expect(tableCells).toHaveCount(2);
  });
});

test.describe("isRow utility function", () => {
  test("returns true for IRowCell objects", () => {
    const rowCell: IRowCell = { title: "Test Title" };
    expect(isRow(rowCell)).toBe(true);
  });

  test("returns false for string values", () => {
    expect(isRow("test string")).toBe(false);
  });

  test("returns false for JSX elements", () => {
    const jsxElement = <div>Test</div>;
    expect(isRow(jsxElement)).toBe(false);
  });

  test("returns false for null/undefined", () => {
    expect(isRow(null)).toBe(false);
    expect(isRow(undefined)).toBe(false);
  });

  test("returns false for objects without title property", () => {
    const obj = { name: "test" };
    expect(isRow(obj as IRowCell)).toBe(false);
  });
});
