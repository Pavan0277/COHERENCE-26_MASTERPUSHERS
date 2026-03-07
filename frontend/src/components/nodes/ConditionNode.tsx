import { Handle, Position } from "@xyflow/react";
import { GitBranch, CheckCircle2, AlertCircle } from "lucide-react";
import NodeToolbarActions from "./NodeToolbarActions";

const OP_LABELS: Record<string, string> = {
  equals:       "=",
  not_equals:   "≠",
  contains:     "contains",
  greater_than: ">",
  less_than:    "<",
  is_empty:     "is empty",
  not_empty:    "not empty",
};

export default function ConditionNode({
  id,
  data,
  selected,
}: Readonly<{
  id: string;
  data: { label?: string; config?: { column?: string; operator?: string; value?: string } };
  selected: boolean;
}>) {
  const { column, operator, value } = data.config || {};
  const hasCondition = !!(column && operator);

  return (
    <div className="relative select-none animate-node-enter" style={{ width: 260 }}>
      <NodeToolbarActions id={id} selected={selected} accentColor="bg-amber-500" />

      <Handle type="target" position={Position.Left} style={{ top: 28 }} className="!bg-amber-400 !w-3 !h-3 !border-2 !border-white !shadow-md" />

      <div
        className={`flex items-center gap-3 rounded-2xl bg-white px-4 py-3 transition-all duration-200 ${
          selected
            ? "shadow-xl shadow-amber-100/60 ring-2 ring-amber-400"
            : "shadow-md ring-1 ring-slate-200 hover:-translate-y-0.5 hover:shadow-xl"
        }`}
      >
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500 shadow-sm shadow-amber-200">
          <GitBranch className="h-5 w-5 text-white" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[14px] font-bold leading-tight text-slate-900">
            {data.label || "Condition"}
          </p>
          <p className="text-[11px] text-slate-400">Branch Node</p>
        </div>
      </div>

      <div className="px-1 pt-3 space-y-2">
        {hasCondition ? (
          <p className="rounded-lg bg-amber-50 px-3 py-1.5 font-mono text-[12px] text-amber-800">
            if <span className="font-semibold">{column}</span>{" "}
            <span className="text-amber-500">{OP_LABELS[operator ?? ""] || operator}</span>
            {value ? <> <span className="font-semibold">"{value}"</span></> : ""}
          </p>
        ) : (
          <p className="text-[12px] leading-relaxed text-slate-500">
            Continue only if lead matches condition. Otherwise skip.
          </p>
        )}
        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
          hasCondition ? "bg-amber-50 text-amber-600" : "bg-slate-100 text-slate-500"
        }`}>
          {hasCondition
            ? <><CheckCircle2 className="h-3 w-3" />Condition set</>
            : <><AlertCircle className="h-3 w-3" />No condition</>
          }
        </span>
      </div>

      <Handle type="source" position={Position.Right} style={{ top: 28 }} className="!bg-amber-400 !w-3 !h-3 !border-2 !border-white !shadow-md" />
    </div>
  );
}
