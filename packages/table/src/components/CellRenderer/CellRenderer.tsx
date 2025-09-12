import {
  ActionsColumn,
  IActions,
  IActionsResolver,
  IRow,
  IRowCell,
  Td,
} from "@patternfly/react-table";
import { ReactNode } from "react";

type CellRendererProps = {
  row: IRow;
  index?: number;
  actions?: IActions;
  actionResolver?: IActionsResolver;
};

export const isRow = (c: ReactNode | IRowCell): c is IRowCell =>
  !!c && (c as IRowCell).title !== undefined;

export const CellRenderer = ({
  row,
  index,
  actions,
  actionResolver,
}: CellRendererProps) => {
  const items = actions || actionResolver?.(row, {});
  return (
    <>
      {row.cells!.map((c, i) => (
        <Td key={`cell-${i}`}>{(isRow(c) ? c.title : c) as ReactNode}</Td>
      ))}
      {items && items.length > 0 && !row.disableActions && (
        <Td isActionCell>
          <ActionsColumn items={items} extraData={{ rowIndex: index }} />
        </Td>
      )}
    </>
  );
};
