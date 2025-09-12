import {
  IActions,
  IActionsResolver,
  IRow,
  IRowCell,
  Table,
  Tbody,
  Tr,
} from "@patternfly/react-table";
import { CellRenderer } from "./CellRenderer";

// Mock data for testing
const createMockRow = (
  cells: (string | IRowCell)[],
  options: Partial<IRow> = {}
): IRow => ({
  cells,
  data: { id: "test-row" },
  disableActions: false,
  disableSelection: false,
  ...options,
});

const createRowCell = (title: string): IRowCell => ({
  title,
});

// Simple string cells story
export const StringCellsStory = () => {
  const row = createMockRow(["Cell 1", "Cell 2", "Cell 3"]);

  return (
    <Table>
      <Tbody>
        <Tr>
          <CellRenderer row={row} />
        </Tr>
      </Tbody>
    </Table>
  );
};

// IRowCell objects story
export const RowCellsStory = () => {
  const row = createMockRow([
    createRowCell("Row Cell 1"),
    "Simple Cell",
    createRowCell("Row Cell 2"),
  ]);

  return (
    <Table>
      <Tbody>
        <Tr>
          <CellRenderer row={row} />
        </Tr>
      </Tbody>
    </Table>
  );
};

// With actions story
export const WithActionsStory = () => {
  const row = createMockRow(["Cell 1", "Cell 2"]);
  const actions: IActions = [
    {
      title: "Edit",
      onClick: () => {},
    },
    {
      title: "Delete",
      onClick: () => {},
    },
  ];

  return (
    <Table>
      <Tbody>
        <Tr>
          <CellRenderer row={row} actions={actions} index={0} />
        </Tr>
      </Tbody>
    </Table>
  );
};

// With action resolver story
export const WithActionResolverStory = () => {
  const row = createMockRow(["Cell 1", "Cell 2"]);
  const actionResolver: IActionsResolver = (row) => [
    {
      title: `Action for ${row.data.id}`,
      onClick: () => {},
    },
  ];

  return (
    <Table>
      <Tbody>
        <Tr>
          <CellRenderer row={row} actionResolver={actionResolver} index={0} />
        </Tr>
      </Tbody>
    </Table>
  );
};

// Disabled actions story
export const DisabledActionsStory = () => {
  const row = createMockRow(["Cell 1", "Cell 2"], { disableActions: true });
  const actions: IActions = [
    {
      title: "Edit",
      onClick: () => {},
    },
  ];

  return (
    <Table>
      <Tbody>
        <Tr>
          <CellRenderer row={row} actions={actions} index={0} />
        </Tr>
      </Tbody>
    </Table>
  );
};

// No actions story
export const NoActionsStory = () => {
  const row = createMockRow(["Cell 1", "Cell 2"]);

  return (
    <Table>
      <Tbody>
        <Tr>
          <CellRenderer row={row} index={0} />
        </Tr>
      </Tbody>
    </Table>
  );
};

// JSX elements story
export const JSXElementsStory = () => {
  const row = createMockRow([
    <span key="jsx1">JSX Cell 1</span>,
    "String Cell",
    <div key="jsx2">
      <strong>Bold JSX Cell</strong>
    </div>,
  ]);

  return (
    <Table>
      <Tbody>
        <Tr>
          <CellRenderer row={row} />
        </Tr>
      </Tbody>
    </Table>
  );
};

// Empty actions story
export const EmptyActionsStory = () => {
  const row = createMockRow(["Cell 1", "Cell 2"]);
  const emptyActions: IActions = [];

  return (
    <Table>
      <Tbody>
        <Tr>
          <CellRenderer row={row} actions={emptyActions} index={0} />
        </Tr>
      </Tbody>
    </Table>
  );
};

// Action resolver returning empty array
export const EmptyActionResolverStory = () => {
  const row = createMockRow(["Cell 1", "Cell 2"]);
  const emptyActionResolver: IActionsResolver = () => [];

  return (
    <Table>
      <Tbody>
        <Tr>
          <CellRenderer
            row={row}
            actionResolver={emptyActionResolver}
            index={0}
          />
        </Tr>
      </Tbody>
    </Table>
  );
};
