import {
  ExpandableRowContent,
  IActions,
  IActionsResolver,
  IRow,
  Table,
  TableVariant,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@patternfly/react-table";
import { get, intersectionBy } from "lodash-es";
import { ReactNode, useEffect, useMemo, useState } from "react";
import { Field, Row, SubRow } from "../types";
import { CellRenderer, isRow } from "./CellRenderer";

type DataTableProps<T> = {
  ariaLabelKey: string;
  columns: Field<T>[];
  rows: (Row<T> | SubRow<T>)[];
  actions?: IActions;
  actionResolver?: IActionsResolver;
  selected?: T[];
  onSelect?: (value: T[]) => void;
  onCollapse?: (isOpen: boolean, rowIndex: number) => void;
  canSelectAll: boolean;
  canSelect: boolean;
  isNotCompact?: boolean;
  isRadio?: boolean;
};

export function DataTable<T>({
  selected,
  rows,
  canSelectAll,
  canSelect,
  isNotCompact,
  isRadio,
  onCollapse,
  onSelect,
  columns,
  actions,
  actionResolver,
  ariaLabelKey,
  ...props
}: DataTableProps<T>) {
  const [selectedRows, setSelectedRows] = useState<T[]>(selected || []);
  const [expandedRows, setExpandedRows] = useState<boolean[]>([]);

  const rowsSelectedOnPage = useMemo(
    () =>
      intersectionBy(
        selectedRows,
        rows.map((row) => row.data),
        "id"
      ),
    [selectedRows, rows]
  );

  useEffect(() => {
    if (canSelectAll) {
      const selectAllCheckbox = document.getElementsByName("check-all").item(0);
      if (selectAllCheckbox) {
        const checkbox = selectAllCheckbox as HTMLInputElement;
        checkbox.indeterminate =
          rowsSelectedOnPage.length < rows.length &&
          rowsSelectedOnPage.length > 0;
      }
    }
  }, [selectedRows, canSelectAll, rows, rowsSelectedOnPage]);

  const updateSelectedRows = (selected: T[]) => {
    setSelectedRows(selected);
    onSelect?.(selected);
  };

  const updateState = (rowIndex: number, isSelected: boolean) => {
    if (isRadio) {
      const selectedRow = isSelected ? [rows[rowIndex].data] : [];
      updateSelectedRows(selectedRow);
    } else {
      if (rowIndex === -1) {
        const rowsSelectedOnPageIds = rowsSelectedOnPage.map((v: T) =>
          get(v, "id")
        );
        updateSelectedRows(
          isSelected
            ? [...selectedRows, ...rows.map((row) => row.data)]
            : selectedRows.filter(
                (v: T) => !rowsSelectedOnPageIds.includes(get(v, "id"))
              )
        );
      } else {
        if (isSelected) {
          updateSelectedRows([...selectedRows, rows[rowIndex].data]);
        } else {
          updateSelectedRows(
            selectedRows.filter(
              (v: T) => get(v, "id") !== (rows[rowIndex] as IRow).data.id
            )
          );
        }
      }
    }
  };

  return (
    <Table
      {...props}
      variant={isNotCompact ? undefined : TableVariant.compact}
      aria-label={ariaLabelKey}
    >
      <Thead>
        <Tr>
          {onCollapse && <Th screenReaderText={"expandRow"} />}
          {onSelect && (
            <Th
              screenReaderText={"selectAll"}
              select={
                canSelectAll && !isRadio
                  ? {
                      onSelect: (_, isSelected) => {
                        updateState(-1, isSelected);
                      },
                      isSelected: rowsSelectedOnPage.length === rows.length,
                    }
                  : undefined
              }
            />
          )}
          {columns.map((column) => (
            <Th
              screenReaderText={"expandRow"}
              key={column.displayKey || column.name}
              className={column.transforms?.[0]().className}
            >
              {column.displayKey || column.name}
            </Th>
          ))}
        </Tr>
      </Thead>
      {!onCollapse ? (
        <Tbody>
          {(rows as IRow[]).map((row, index) => (
            <Tr key={index} isExpanded={expandedRows[index]}>
              {canSelect && (
                <Td
                  select={{
                    rowIndex: index,
                    onSelect: (_, isSelected, rowIndex: number) => {
                      updateState(rowIndex, isSelected);
                    },
                    isSelected: !!selectedRows.find(
                      (v: T) => get(v, "id") === row.data.id
                    ),
                    variant: isRadio ? "radio" : "checkbox",
                    isDisabled: row.disableSelection,
                  }}
                />
              )}
              <CellRenderer
                row={row}
                index={index}
                actions={actions}
                actionResolver={actionResolver}
              />
            </Tr>
          ))}
        </Tbody>
      ) : (
        (rows as IRow[]).map((row, index) => (
          <Tbody key={index}>
            {index % 2 === 0 ? (
              <Tr>
                <Td
                  expand={
                    rows[index + 1].cells.length === 0
                      ? undefined
                      : {
                          isExpanded: expandedRows[index] ?? false,
                          rowIndex: index,
                          expandId: "expandable-row-",
                          onToggle: (_, rowIndex: number, isOpen: boolean) => {
                            onCollapse(isOpen, rowIndex);
                            const expand = [...expandedRows];
                            expand[index] = isOpen;
                            setExpandedRows(expand);
                          },
                        }
                  }
                />
                <CellRenderer
                  row={row}
                  index={index}
                  actions={actions}
                  actionResolver={actionResolver}
                />
              </Tr>
            ) : (
              <Tr isExpanded={expandedRows[index - 1] ?? false}>
                <Td />
                <Td colSpan={columns.length}>
                  <ExpandableRowContent>
                    {row.cells!.map((c, i) => (
                      <div key={`cell-${i}`}>
                        {(isRow(c) ? c.title : c) as ReactNode}
                      </div>
                    ))}
                  </ExpandableRowContent>
                </Td>
              </Tr>
            )}
          </Tbody>
        ))
      )}
    </Table>
  );
}
