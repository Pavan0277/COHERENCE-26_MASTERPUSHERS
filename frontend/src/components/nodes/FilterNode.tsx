import { Handle, Position } from "@xyflow/react";
import { Filter, CheckCircle2, AlertCircle } from "lucide-react";
import NodeToolbarActions from "./NodeToolbarActions";

const OP_LABELS: Record<string, string> = {
  contains:     "contains",
  equals:       "=",
  not_equals:   "≠",
  greater_than: ">",
  less_than:    "<",
};

export default function FilterNode({
  id,
  data,
  selected,
}: Readonly<{
  id: string;
  data: { label?: string; config?: { column?: string; operator?: string; value?: string } };
  selected: boolean;
}>) {
  const { column, operator, value } = data.config || {};
  const hasFilter = column && operator && value;

  return (
    <div className="relative select-none animate-node-enter" style={{ width: 260 }}>
      <NodeToolbarActions id={id} selected={selected} accentColor="bg-violet-500" />

      <Handle type="target" position={Position.Left} style={{ top: 28 }} className="!bg-violet-400 !w-3 !h-3 !border-2 !border-white !shadow-md" />

      {/* Header card box — only icon + title + subtitle inside */}
      <div
        className={`flex items-center gap-3 rounded-2xl bg-white px-4 py-3 transition-all duration-200 ${
          selected
            ? "shadow-xl shadow-violet-100/60 ring-2 ring-violet-400"
            : "shadow-md ring-1 ring-slate-200 hover:-translate-y-0.5 hover:shadow-xl"
        }`}
      >
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-500 shadow-sm shadow-violet-200">
          <Filter className="h-5 w-5 text-white" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[14px] font-bold leading-tight text-slate-900">
            {data.label || "Filter"}
          </p>
          <p className="text-[11px] text-slate-400">Condition Node</p>
        </div>
      </div>

      {/* Content outside the box */}
      <div className="px-1 pt-3 space-y-2">
        {hasFilter ? (
          <p className="rounded-lg bg-violet-50 px-3 py-1.5 font-mono text-[12px] text-violet-800">
            <span className="font-semibold">{column}</span>
            {" "}<span className="text-violet-400">{OP_LABELS[operator ?? ""] || operator}</span>{" "}
            <span className="font-semibold">"{value}"</span>
          </p>
        ) : (
          <p className="text-[12px] leading-relaxed text-slate-500">
            Filter leads by matching specific column values.
          </p>
        )}
        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
          hasFilter ? "bg-violet-50 text-violet-600" : "bg-slate-100 text-slate-500"
        }`}>
          {hasFilter
            ? <><CheckCircle2 className="h-3 w-3" />Filter active</>
            : <><AlertCircle className="h-3 w-3" />Unassigned</>
          }
        </span>
      </div>

      <Handle type="source" position={Position.Right} style={{ top: 28 }} className="!bg-violet-400 !w-3 !h-3 !border-2 !border-white !shadow-md" />
    </div>
  );
}