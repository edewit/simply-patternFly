import { IActionsResolver, TableProps } from "@patternfly/react-table";
import { cloneDeep, get } from "lodash-es";
import {
  ComponentClass,
  ReactNode,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import {
  Action,
  DetailField,
  Field,
  LoaderFunction,
  Row,
  SubRow,
} from "../../types";
import { DataTable } from "../DataTable";
import { Loader } from "../Loader";
import { PaginatingTableToolbar } from "../PaginateToolbar";

type DataListProps<T> = Omit<TableProps, "rows" | "cells" | "onSelect"> & {
  loader: LoaderFunction<T>;
  onSelect?: (value: T[]) => void;
  canSelectAll?: boolean;
  detailColumns?: DetailField<T>[];
  isRowDisabled?: (value: T) => boolean;
  ariaLabelKey: string;
  searchPlaceholderLabel?: string;
  columns: Field<T>[];
  actions?: Action<T>[];
  actionResolver?: IActionsResolver;
  searchTypeComponent?: ReactNode;
  toolbarItem?: ReactNode;
  subToolbar?: ReactNode;
  emptyState?: (search: boolean) =>ReactNode;
  icon?: ComponentClass;
  isNotCompact?: boolean;
  isRadio?: boolean;
};

export function PaginatingTable<T>({
  ariaLabelKey,
  searchPlaceholderLabel,
  onSelect,
  canSelectAll = false,
  isNotCompact,
  isRadio,
  detailColumns,
  isRowDisabled,
  loader,
  columns,
  actions,
  actionResolver,
  searchTypeComponent,
  toolbarItem,
  subToolbar,
  emptyState,
  ...props
}: DataListProps<T>) {
  const [selected, setSelected] = useState<T[]>([]);
  const [rows, setRows] = useState<(Row<T> | SubRow<T>)[]>();
  const [loading, setLoading] = useState(false);

  const [max, setMax] = useState(10);
  const [first, setFirst] = useState(0);
  const [search, setSearch] = useState<string>("");
  const prevSearch = useRef<string>();

  const [key, setKey] = useState(0);
  const refresh = () => setKey(key + 1);
  const id = useId();

  const renderCell = useCallback(
    (columns: (Field<T> | DetailField<T>)[], value: T) => {
      return columns.map((col) => {
        if ("cellFormatters" in col) {
          const v = get(value, col.name);
          return col.cellFormatters?.reduce((s, f) => f(s), v);
        }
        if (col.cellRenderer) {
          const Component = col.cellRenderer;
          //@ts-expect-error react/no-unknown-property
          return { title: <Component {...value} /> };
        }
        return get(value, col.name);
      });
    },
    []
  );

  const convertToColumns = useCallback(
    (data: T[]): (Row<T> | SubRow<T>)[] => {
      const isDetailColumnsEnabled = (value: T) =>
        detailColumns?.[0]?.enabled?.(value);
      return data
        .map((value, index) => {
          const disabledRow = isRowDisabled ? isRowDisabled(value) : false;
          const row: (Row<T> | SubRow<T>)[] = [
            {
              data: value,
              disableSelection: disabledRow,
              disableActions: disabledRow,
              selected: false, // Will be updated separately to avoid re-fetching data
              isOpen: isDetailColumnsEnabled(value) ? false : undefined,
              cells: renderCell(columns, value),
            },
          ];
          if (detailColumns) {
            row.push({
              parent: index * 2,
              cells: isDetailColumnsEnabled(value)
                ? renderCell(detailColumns!, value)
                : [],
            } as SubRow<T>);
          }
          return row;
        })
        .flat();
    },
    [columns, detailColumns, isRowDisabled, renderCell]
  );

  useEffect(() => {
    let cancelled = false;

    const fetchData = async () => {
      setLoading(true);
      const newSearch =
        (prevSearch.current === "" && search !== "") ||
        prevSearch.current !== search;

      if (newSearch) {
        setFirst(0);
      }
      prevSearch.current = search;
      const data =
        typeof loader === "function"
          ? await loader(newSearch ? 0 : first, max + 1, search)
          : loader;
      if (cancelled) return;

      const result = convertToColumns(data);
      setRows(result);
      setLoading(false);
    };

    fetchData();

    return () => {
      cancelled = true;
    };
  }, [key, first, max, search, loader, convertToColumns]);

  const convertAction = () =>
    actions &&
    cloneDeep(actions).map((action: Action<T>, index: number) => {
      delete action.onRowClick;
      action.onClick = async (_, rowIndex) => {
        const result = await actions[index].onRowClick!(rows![rowIndex].data);
        if (result) {
          setSearch("");
          refresh();
        }
      };
      return action;
    });

  const onCollapse = (isOpen: boolean, rowIndex: number) => {
    (data![rowIndex] as Row<T>).isOpen = isOpen;
    setRows([...data!]);
  };

  // Update selection state in rows without triggering re-fetch
  const updateRowsWithSelection = useCallback(
    (rows: (Row<T> | SubRow<T>)[] | undefined): (Row<T> | SubRow<T>)[] | undefined => {
      if (!rows) return rows;
      return rows.map((row) => {
        if ('data' in row) {
          return {
            ...row,
            selected: !!selected.find(
              (v) => get(v, "id") === get(row.data, "id")
            ),
          };
        }
        return row;
      });
    },
    [selected]
  );

  const data = updateRowsWithSelection(rows);
  const noData = !data || data.length === 0;
  const searching = search !== "";
  // if we use detail columns there are twice the number of rows
  const maxRows = detailColumns ? max * 2 : max;
  const rowLength = detailColumns ? (data?.length || 0) / 2 : data?.length || 0;

  return (
    <>
      {(!noData || searching || loading) && (
        <PaginatingTableToolbar
          id={id}
          count={rowLength}
          first={first}
          max={max}
          onNextClick={setFirst}
          onPreviousClick={setFirst}
          onPerPageSelect={(first, max) => {
            setFirst(first);
            setMax(max);
          }}
          inputGroupName={
            searchPlaceholderLabel ? `${ariaLabelKey}input` : undefined
          }
          inputGroupOnEnter={setSearch}
          inputGroupPlaceholder={searchPlaceholderLabel || ""}
          searchTypeComponent={searchTypeComponent}
          toolbarItem={toolbarItem}
          subToolbar={subToolbar}
        >
          {!loading && !noData && (
            <DataTable
              {...props}
              canSelectAll={canSelectAll}
              canSelect={!!onSelect}
              selected={selected}
              onSelect={(selected) => {
                setSelected(selected);
                onSelect?.(selected);
              }}
              onCollapse={detailColumns ? onCollapse : undefined}
              actions={convertAction()}
              actionResolver={actionResolver}
              rows={data.slice(0, maxRows)}
              columns={columns}
              isNotCompact={isNotCompact}
              isRadio={isRadio}
              ariaLabelKey={ariaLabelKey}
            />
          )}
          {loading && <Loader columns={columns} />}
          {!loading && noData && searching && (
            emptyState?.(searching)
          )}
        </PaginatingTableToolbar>
      )}
      {!loading && noData && !searching && emptyState?.(searching)}
    </>
  );
}
