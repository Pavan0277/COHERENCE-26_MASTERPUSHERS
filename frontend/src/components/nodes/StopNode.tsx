import { Handle, Position } from "@xyflow/react";
import { StopCircle } from "lucide-react";
import NodeToolbarActions from "./NodeToolbarActions";

const STATUS_COLORS: Record<string, string> = {
  completed: "bg-slate-100 text-slate-600",
  failed:    "bg-red-50 text-red-600",
  skipped:   "bg-yellow-50 text-yellow-700",
};

export default function StopNode({
  id,
  data,
  selected,
}: Readonly<{
  id: string;
  data: { label?: string; config?: { reason?: string; status?: string } };
  selected: boolean;
}>) {
  const { reason, status = "completed" } = data.config || {};

  return (
    <div className="relative select-none animate-node-enter" style={{ width: 260 }}>
      <NodeToolbarActions id={id} selected={selected} accentColor="bg-red-500" />

      {/* Terminal node — only has left (target) handle */}
      <Handle type="target" position={Position.Left} style={{ top: 28 }} className="!bg-red-400 !w-3 !h-3 !border-2 !border-white !shadow-md" />

      <div
        className={`flex items-center gap-3 rounded-2xl bg-white px-4 py-3 transition-all duration-200 ${
          selected
            ? "shadow-xl shadow-red-100/60 ring-2 ring-red-400"
            : "shadow-md ring-1 ring-slate-200 hover:-translate-y-0.5 hover:shadow-xl"
        }`}
      >
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-500 shadow-sm shadow-red-200">
          <StopCircle className="h-5 w-5 text-white" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[14px] font-bold leading-tight text-slate-900">
            {data.label || "Stop / End"}
          </p>
          <p className="text-[11px] text-slate-400">Terminal Node</p>
        </div>
      </div>

      <div className="px-1 pt-3 space-y-2">
        <p className="text-[12px] leading-relaxed text-slate-500">
          {reason || "Terminates the branch and marks the lead done."}
        </p>
        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${STATUS_COLORS[status] || STATUS_COLORS.completed}`}>
          <StopCircle className="h-3 w-3" />
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      </div>
      {/* No source handle — this is a terminal node */}
    </div>
  );
}
