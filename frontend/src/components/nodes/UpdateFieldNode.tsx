import { Handle, Position } from "@xyflow/react";
import { PenLine, CheckCircle2, AlertCircle } from "lucide-react";
import NodeToolbarActions from "./NodeToolbarActions";

export default function UpdateFieldNode({
  id,
  data,
  selected,
}: Readonly<{
  id: string;
  data: { label?: string; config?: { field?: string; value?: string } };
  selected: boolean;
}>) {
  const { field, value } = data.config || {};
  const isConfigured = !!field;

  return (
    <div className="relative select-none animate-node-enter" style={{ width: 260 }}>
      <NodeToolbarActions id={id} selected={selected} accentColor="bg-teal-500" />

      <Handle type="target" position={Position.Left} style={{ top: 28 }} className="!bg-teal-400 !w-3 !h-3 !border-2 !border-white !shadow-md" />

      <div
        className={`flex items-center gap-3 rounded-2xl bg-white px-4 py-3 transition-all duration-200 ${
          selected
            ? "shadow-xl shadow-teal-100/60 ring-2 ring-teal-400"
            : "shadow-md ring-1 ring-slate-200 hover:-translate-y-0.5 hover:shadow-xl"
        }`}
      >
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-500 shadow-sm shadow-teal-200">
          <PenLine className="h-5 w-5 text-white" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[14px] font-bold leading-tight text-slate-900">
            {data.label || "Update Lead Field"}
          </p>
          <p className="text-[11px] text-slate-400">Field Mutation Node</p>
        </div>
      </div>

      <div className="px-1 pt-3 space-y-2">
        {isConfigured ? (
          <p className="text-[12px] leading-relaxed text-slate-500">
            Set <span className="font-medium text-slate-700">{field}</span>
            {value ? <> → <span className="font-medium text-slate-700 truncate">{value.slice(0, 20)}{value.length > 20 ? "…" : ""}</span></> : ""}
          </p>
        ) : (
          <p className="text-[12px] leading-relaxed text-slate-500">
            Overwrite any lead field with a static value or template.
          </p>
        )}
        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
          isConfigured ? "bg-teal-50 text-teal-600" : "bg-slate-100 text-slate-500"
        }`}>
          {isConfigured
            ? <><CheckCircle2 className="h-3 w-3" />Field set</>
            : <><AlertCircle className="h-3 w-3" />Not configured</>
          }
        </span>
      </div>

      <Handle type="source" position={Position.Right} style={{ top: 28 }} className="!bg-teal-400 !w-3 !h-3 !border-2 !border-white !shadow-md" />
    </div>
  );
}
