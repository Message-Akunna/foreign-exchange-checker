import type { Table } from "@tanstack/react-table";
import {
  Frame,
  FrameFooter,
  FrameHeader,
  FramePanel,
} from "@/components/ui/frame";
import {
  InertiaPagination,
  type PaginatorMeta,
} from "@/components/custom/pagination";
import { cn } from "@/lib/utils";
import { DataTableBody } from "./table-body";

interface DataTableProps<TData> {
  table: Table<TData>;
  meta: PaginatorMeta;
  toolbar?: React.ReactNode;
  emptyState?: React.ReactNode;
  className?: string;
}

export function DataTable<TData>({
  table,
  meta,
  toolbar,
  emptyState,
  className,
}: DataTableProps<TData>) {
  return (
    <Frame className={cn("w-full", className)}>
      <FrameHeader className="p-0">{toolbar}</FrameHeader>
      <FramePanel className="overflow-scroll p-0">
        <DataTableBody table={table} emptyState={emptyState} />
      </FramePanel>
      {meta.last_page > 1 && (
        <FrameFooter className="pt-3">
          <InertiaPagination meta={meta} showSummary />
        </FrameFooter>
      )}
    </Frame>
  );
}
