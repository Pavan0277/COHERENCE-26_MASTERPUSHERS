import { Handle, Position } from "@xyflow/react";
import { Zap, CheckCircle2, AlertCircle } from "lucide-react";
import NodeToolbarActions from "./NodeToolbarActions";

const OPERATION_LABELS: Record<string, string> = {
  uppercase: "UPPERCASE",
  lowercase: "lowercase",
  trim:      "Trim",
  replace:   "Find & Replace",
  template:  "Template",
};

export default function TransformNode({
  id,
  data,
  selected,
}: Readonly<{
  id: string;
  data: { label?: string; config?: { field?: string; operation?: string } };
  selected: boolean;
}>) {
  const { field, operation } = data.config || {};
  const isConfigured = !!field && !!operation;

  return (
    <div className="relative select-none animate-node-enter" style={{ width: 260 }}>
      <NodeToolbarActions id={id} selected={selected} accentColor="bg-stone-500" />

      <Handle type="target" position={Position.Left} style={{ top: 28 }} className="!bg-stone-400 !w-3 !h-3 !border-2 !border-white !shadow-md" />

      <div
        className={`flex items-center gap-3 rounded-2xl bg-white px-4 py-3 transition-all duration-200 ${
          selected
            ? "shadow-xl shadow-stone-100/60 ring-2 ring-stone-400"
            : "shadow-md ring-1 ring-slate-200 hover:-translate-y-0.5 hover:shadow-xl"
        }`}
      >
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-stone-500 shadow-sm shadow-stone-200">
          <Zap className="h-5 w-5 text-white" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[14px] font-bold leading-tight text-slate-900">
            {data.label || "Data Transform"}
          </p>
          <p className="text-[11px] text-slate-400">Field Transform Node</p>
        </div>
      </div>

      <div className="px-1 pt-3 space-y-2">
        {isConfigured ? (
          <p className="text-[12px] leading-relaxed text-slate-500">
            <span className="font-medium text-slate-700">{OPERATION_LABELS[operation!] || operation}</span>
            {" "}{field}
          </p>
        ) : (
          <p className="text-[12px] leading-relaxed text-slate-500">
            Transform a lead field: uppercase, lowercase, trim, replace, or template.
          </p>
        )}
        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
          isConfigured ? "bg-stone-100 text-stone-600" : "bg-slate-100 text-slate-500"
        }`}>
          {isConfigured
            ? <><CheckCircle2 className="h-3 w-3" />Transform set</>
            : <><AlertCircle className="h-3 w-3" />Not configured</>
          }
        </span>
      </div>

      <Handle type="source" position={Position.Right} style={{ top: 28 }} className="!bg-stone-400 !w-3 !h-3 !border-2 !border-white !shadow-md" />
    </div>
  );
}
