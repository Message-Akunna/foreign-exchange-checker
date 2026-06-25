import { useNavigate } from "react-router";
import { useAppDispatch, useAppSelector } from "@/services/redux";
import {
  clearLogs,
  setAmount,
  setSendCurrency,
  setReceiveCurrency,
} from "@/services/redux/fx-slice";
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
  EmptyMedia,
} from "@/components/ui/empty";
import { Button } from "@/components/ui/button";
import {
  ClipboardList,
  Trash2,
  ArrowRightLeft,
  RefreshCcw,
} from "lucide-react";
import { toast } from "sonner";

export default function LogsPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const logs = useAppSelector((state) => state.fx.logs);

  const handleClearLogs = () => {
    dispatch(clearLogs());
    toast.success("Conversion logs cleared");
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
      <Empty className="py-12 border-dashed border border-border/80 bg-card/10 rounded-2xl min-h-[300px]">
        <EmptyHeader>
          <EmptyMedia
            variant="icon"
            className="h-10 w-10 rounded-full bg-primary/10 border border-primary/20 text-primary"
          >
            <ClipboardList className="size-5" />
          </EmptyMedia>
          <EmptyTitle className="text-base font-mono font-bold mt-2">
            No Conversions Logged
          </EmptyTitle>
          <EmptyDescription className="font-mono text-xs max-w-xs mt-1">
            Perform conversions and click the "Log Conversion" button to save
            calculations here.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  return (
    <div className="space-y-4">
      {/* Table Header and Clear Button */}
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-mono font-bold tracking-widest text-muted-foreground uppercase">
          Saved Conversions
        </h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleClearLogs}
          className="text-xs font-mono font-bold text-destructive hover:text-destructive hover:bg-destructive/10 gap-1.5 h-8 rounded-lg"
        >
          <Trash2 className="size-3.5" />
          Clear Logs
        </Button>
      </div>

      {/* Logs Table / List */}
      <div className="border border-border/80 bg-card/10 rounded-2xl overflow-hidden shadow-sm">
        <div className="divide-y divide-border/60">
          {logs.map((log) => (
            <div
              key={log.id}
              className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono hover:bg-card/20 transition-all"
            >
              {/* Log Details */}
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2 text-sm text-foreground">
                  <span className="font-bold">
                    {log.amount.toLocaleString("en-US")} {log.sendCurrency}
                  </span>
                  <ArrowRightLeft className="size-3 text-muted-foreground" />
                  <span className="text-primary font-bold">
                    {log.result.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}{" "}
                    {log.receiveCurrency}
                  </span>
                </div>

                <div className="text-[10px] text-muted-foreground flex items-center gap-2">
                  <span>Rate: {log.rate.toFixed(4)}</span>
                  <span>•</span>
                  <span>{log.timestamp}</span>
                </div>
              </div>

              {/* Restore Button */}
              <div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleRestoreLog(log)}
                  className="w-full sm:w-auto h-8 text-[10px] font-mono font-bold tracking-wider uppercase border border-border/80 hover:bg-muted gap-1.5 rounded-lg"
                >
                  <RefreshCcw className="size-3" />
                  Restore
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
