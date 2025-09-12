import { Skeleton } from "@patternfly/react-core";
import { Table, Tbody, Td, Th, Thead, Tr } from "@patternfly/react-table";
import { Field } from "../../types";

type LoaderProps<T> = {
  columns: Field<T>[];
};

export const Loader = <T,>({ columns }: LoaderProps<T>) => {
  return (
    <Table>
      <Thead>
        <Tr>
          {columns.map((column) => (
            <Th
              key={column.displayKey || column.name}
              className={column.transforms?.[0]().className}
            >
              {column.displayKey || column.name}
            </Th>
          ))}
        </Tr>
      </Thead>
      <Tbody>
        {Array.from({ length: Math.floor(Math.random() * 4) + 1 }).map(
          (_row, index) => (
            <Tr key={index}>
              {columns.map((_, index) => (
                <Td key={index}>
                  <Skeleton />
                </Td>
              ))}
            </Tr>
          )
        )}
      </Tbody>
    </Table>
  );
};
