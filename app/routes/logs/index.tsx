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
import { ClipboardList, Trash2 } from "lucide-react";
import { toast } from "sonner";

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
          <span className="text-base font-mono font-bold mt-2">
            No Conversions Logged
          </span>
        }
        description={
          <span className="font-mono text-xs max-w-xs mt-1 block">
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
      <CardHeader className="flex items-center justify-between px-5">
        <div className="flex items-center gap-2 uppercase">
          <span className="text-sm">CONVERSION LOG</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-xs uppercase text-muted-foreground font-mono">
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

interface LogCardProps {
  log: {
    id: string;
    timestamp: string;
    amount: number;
    sendCurrency: string;
    receiveCurrency: string;
    rate: number;
    result: number;
  };
  onSelect: () => void;
  onDelete: () => void;
}

function LogCard({ log, onSelect, onDelete }: LogCardProps) {
  // Relative time helper
  const relativeTime = (() => {
    try {
      const logDate = new Date(log.timestamp);
      if (Number.isNaN(logDate.getTime())) return log.timestamp;

      const now = new Date();
      const diffMs = now.getTime() - logDate.getTime();

      if (diffMs <= 0) return "1M";

      const diffMins = Math.floor(diffMs / (1000 * 60));
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

      if (diffMins < 60) {
        return `${Math.max(1, diffMins)}M`;
      }
      if (diffHours < 24) {
        return `${diffHours}H`;
      }

      return logDate.toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
      });
    } catch {
      return log.timestamp;
    }
  })();

  const formattedSource = log.amount.toLocaleString("en-US", {
    minimumFractionDigits: log.amount % 1 === 0 && log.amount >= 10000 ? 0 : 2,
    maximumFractionDigits: 2,
  });

  const isZeroDecimal = ["JPY", "BDT"].includes(log.receiveCurrency);
  const formattedResult = log.result.toLocaleString("en-US", {
    minimumFractionDigits: isZeroDecimal ? 0 : 2,
    maximumFractionDigits: isZeroDecimal ? 0 : 2,
  });

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect();
        }
      }}
      className="flex items-center justify-between px-4 py-3 bg-accent border hover:bg-secondary transition-all rounded-lg gap-5 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/20"
    >
      {/* Left Side: Time elapsed & Currency pair arrow */}
      <div className="flex items-center gap-5">
        <span className="text-xs text-muted-foreground w-12 font-mono leading-tight">
          {relativeTime}
        </span>
        <span className="text-sm font-semibold text-foreground font-mono leading-tight">
          {log.sendCurrency} → {log.receiveCurrency}
        </span>
      </div>

      {/* Right Side: Source amount, Converted value, Trash delete button */}
      <div className="flex items-center gap-5 font-mono">
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground leading-tight">
            {formattedSource}
          </span>
          <span className="text-base font-bold text-primary leading-tight">
            {formattedResult}
          </span>
        </div>

        {/* Delete button */}
        <Button
          type="button"
          variant="outline"
          size="icon-sm"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="hover:text-destructive hover:bg-destructive/10"
        >
          <Trash2 className="size-4" />
        </Button>
      </div>
    </div>
  );
}
