import { Handle, Position } from "@xyflow/react";
import { Clock, CheckCircle2, AlertCircle } from "lucide-react";
import NodeToolbarActions from "./NodeToolbarActions";

export default function WaitUntilNode({
  id,
  data,
  selected,
}: Readonly<{
  id: string;
  data: { label?: string; config?: { datetime?: string; timezone?: string } };
  selected: boolean;
}>) {
  const { datetime, timezone } = data.config || {};
  const isConfigured = !!datetime;

  const formatDate = (dt: string) => {
    try {
      return new Date(dt).toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dt;
    }
  };

  return (
    <div className="relative select-none animate-node-enter" style={{ width: 260 }}>
      <NodeToolbarActions id={id} selected={selected} accentColor="bg-orange-500" />

      <Handle type="target" position={Position.Left} style={{ top: 28 }} className="!bg-orange-400 !w-3 !h-3 !border-2 !border-white !shadow-md" />

      <div
        className={`flex items-center gap-3 rounded-2xl bg-white px-4 py-3 transition-all duration-200 ${
          selected
            ? "shadow-xl shadow-orange-100/60 ring-2 ring-orange-400"
            : "shadow-md ring-1 ring-slate-200 hover:-translate-y-0.5 hover:shadow-xl"
        }`}
      >
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-500 shadow-sm shadow-orange-200">
          <Clock className="h-5 w-5 text-white" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[14px] font-bold leading-tight text-slate-900">
            {data.label || "Wait Until"}
          </p>
          <p className="text-[11px] text-slate-400">Datetime Pause Node</p>
        </div>
      </div>

      <div className="px-1 pt-3 space-y-2">
        {isConfigured ? (
          <p className="text-[12px] leading-relaxed text-slate-500">
            Pauses until{" "}
            <span className="font-medium text-slate-700">{formatDate(datetime!)}</span>
            {timezone ? ` (${timezone})` : ""}
          </p>
        ) : (
          <p className="text-[12px] leading-relaxed text-slate-500">
            Pause execution until a specific date and time.
          </p>
        )}
        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
          isConfigured ? "bg-orange-50 text-orange-600" : "bg-slate-100 text-slate-500"
        }`}>
          {isConfigured
            ? <><CheckCircle2 className="h-3 w-3" />Date configured</>
            : <><AlertCircle className="h-3 w-3" />No date set</>
          }
        </span>
      </div>

      <Handle type="source" position={Position.Right} style={{ top: 28 }} className="!bg-orange-400 !w-3 !h-3 !border-2 !border-white !shadow-md" />
    </div>
  );
}
