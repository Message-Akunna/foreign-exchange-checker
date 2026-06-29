import { useNavigate, useLocation } from "react-router";
import { useAuth } from "@/providers/auth-provider";
import { useAppDispatch } from "@/services/redux";
import {
  setAmount,
  setSendCurrency,
  setReceiveCurrency,
} from "@/services/redux/fx-slice";
import {
  useLogs,
  useClearLogsMutation,
  useDeleteLogMutation,
} from "@/services/queries/logs";
import { EmptyState } from "@/components/custom/empty-state";
import { Button } from "@/components/ui/button";
import { IconButton } from "@/components/custom/icon-button";
import { FxCard } from "../_components/fx-card";
import { ClipboardList } from "lucide-react";
import { toast } from "sonner";
import { LogCard } from "./_components/log-card";

export default function LogsPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const { data: logs = [] } = useLogs();
  const clearLogsMutation = useClearLogsMutation();
  const deleteLogMutation = useDeleteLogMutation();

  if (!isAuthenticated) {
    return (
      <EmptyState
        className="py-12 border-dashed border border-border/80 bg-card/10 rounded-2xl min-h-[300px]"
        icon={<ClipboardList className="size-5 text-muted-foreground" />}
        title={
          <span className="text-base font-bold mt-2">Sign In to View Logs</span>
        }
        description={
          <span className="text-xs max-w-xs mt-1 block">
            Please log in to your account to view your past conversion
            calculations.
          </span>
        }
        actions={
          <Button
            variant="primary"
            onClick={() =>
              navigate("/login", { state: { backgroundLocation: location } })
            }
            className="cursor-pointer mt-4"
          >
            Sign In
          </Button>
        }
      />
    );
  }

  const handleClearLogs = () => {
    clearLogsMutation.mutate(undefined, {
      onSuccess: () => {
        toast.success("Conversion logs cleared");
      },
      onError: (error: any) => {
        toast.error(error.message || "Failed to clear conversion logs");
      },
    });
  };

  const handleDeleteLog = (id: string) => {
    deleteLogMutation.mutate(id, {
      onSuccess: () => {
        toast.success("Log entry deleted");
      },
      onError: (error: any) => {
        toast.error(error.message || "Failed to delete log entry");
      },
    });
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
    <FxCard
      title={<div className="text-sm uppercase">CONVERSION LOG</div>}
      headerClassName="items-start"
      headerRight={
        <>
          <div className="text-xs uppercase text-muted-foreground">
            {logs.length} LOGGED
          </div>
          <IconButton
            size="sm"
            variant="outline"
            onClick={handleClearLogs}
            className="uppercase text-muted-foreground"
            loading={clearLogsMutation.isPending}
            disabled={clearLogsMutation.isPending}
          >
            Clear All
          </IconButton>
        </>
      }
    >
      {logs.map((log) => (
        <LogCard
          key={log.id}
          log={log}
          onSelect={() => handleRestoreLog(log)}
          onDelete={() => handleDeleteLog(log.id)}
          loading={deleteLogMutation.isPending && deleteLogMutation.variables === log.id}
          disabled={deleteLogMutation.isPending}
        />
      ))}
    </FxCard>
  );
}
