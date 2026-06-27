import { useNavigate } from "react-router";
import { useAppDispatch, useAppSelector } from "@/services/redux";
import {
  clearLogs,
  deleteLog,
  setAmount,
  setSendCurrency,
  setReceiveCurrency,
} from "@/services/redux/fx-slice";
import { EmptyState } from "@/components/custom/empty-state";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ClipboardList } from "lucide-react";
import { toast } from "sonner";
import { LogCard } from "./_components/log-card";

export default function LogsPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const logs = useAppSelector((state) => state.fx.logs);

  const handleClearLogs = () => {
    dispatch(clearLogs());
    toast.success("Conversion logs cleared");
  };

  const handleDeleteLog = (id: string) => {
    dispatch(deleteLog(id));
    toast.success("Log entry deleted");
  };

  const handleRestoreLog = (log: (typeof logs)[0]) => {
    dispatch(setAmount(String(log.amount)));
    dispatch(setSendCurrency(log.sendCurrency));
    dispatch(setReceiveCurrency(log.receiveCurrency));
    toast.success(`Restored conversion: ${log.amount} ${log.sendCurrency}`);
    navigate("/history");
  };

  if (logs.length === 0) {
    return (
      <EmptyState
        className="py-12 border-dashed border border-border/80 bg-card/10 rounded-2xl min-h-[300px]"
        icon={<ClipboardList className="size-5" />}
        title={
          <span className="text-base font-bold mt-2">
            No Conversions Logged
          </span>
        }
        description={
          <span className="text-xs max-w-xs mt-1 block">
            Perform conversions and click the "Log Conversion" button to save
            calculations here.
          </span>
        }
      />
    );
  }

  return (
    <Card className="space-y-5 py-5 gap-0">
      {/* Header Info */}
      <CardHeader className="flex items-start justify-between px-5">
        <div className="text-sm uppercase">CONVERSION LOG</div>
        <div className="flex items-center gap-4">
          <div className="text-xs uppercase text-muted-foreground">
            {logs.length} LOGGED
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={handleClearLogs}
            className="uppercase text-muted-foreground"
          >
            Clear All
          </Button>
        </div>
      </CardHeader>

      {/* Logs List */}
      <CardContent className="space-y-3">
        {logs.map((log) => (
          <LogCard
            key={log.id}
            log={log}
            onSelect={() => handleRestoreLog(log)}
            onDelete={() => handleDeleteLog(log.id)}
          />
        ))}
      </CardContent>
    </Card>
  );
}
