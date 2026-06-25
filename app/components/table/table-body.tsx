import { flexRender, type Table } from "@tanstack/react-table";
import { Inbox } from "lucide-react";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import {
  Table as UITable,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface DataTableBodyProps<TData> {
  table: Table<TData>;
  emptyState?: React.ReactNode;
}

export function DataTableBody<TData>({
  table,
  emptyState,
}: DataTableBodyProps<TData>) {
  const rows = table.getRowModel().rows;

  return (
    <UITable>
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <TableHead key={header.id}>
                {header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
              </TableHead>
            ))}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {rows.length > 0 ? (
          rows.map((row) => (
            <TableRow
              key={row.id}
              data-state={row.getIsSelected() && "selected"}
            >
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell
              colSpan={table.getVisibleLeafColumns().length}
              className="p-6"
            >
              {emptyState ?? (
                <Empty className="border-none bg-muted/10">
                  <EmptyHeader>
                    <EmptyMedia variant="icon">
                      <Inbox className="size-4" />
                    </EmptyMedia>
                    <EmptyTitle>No rows match this view</EmptyTitle>
                    <EmptyDescription>
                      Try a different filter or move to another page.
                    </EmptyDescription>
                  </EmptyHeader>
                  <EmptyContent />
                </Empty>
              )}
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </UITable>
  );
}
