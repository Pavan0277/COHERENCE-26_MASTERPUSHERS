import { Handle, Position } from "@xyflow/react";
import { Tag, CheckCircle2, AlertCircle } from "lucide-react";
import NodeToolbarActions from "./NodeToolbarActions";

export default function TagNode({
  id,
  data,
  selected,
}: Readonly<{
  id: string;
  data: { label?: string; config?: { tag?: string; color?: string } };
  selected: boolean;
}>) {
  const tag   = data.config?.tag   || "";
  const color = data.config?.color || "#6366f1";

  return (
    <div className="relative select-none animate-node-enter" style={{ width: 260 }}>
      <NodeToolbarActions id={id} selected={selected} accentColor="bg-indigo-500" />

      <Handle type="target" position={Position.Left} style={{ top: 28 }} className="!bg-indigo-400 !w-3 !h-3 !border-2 !border-white !shadow-md" />

      <div
        className={`flex items-center gap-3 rounded-2xl bg-white px-4 py-3 transition-all duration-200 ${
          selected
            ? "shadow-xl shadow-indigo-100/60 ring-2 ring-indigo-400"
            : "shadow-md ring-1 ring-slate-200 hover:-translate-y-0.5 hover:shadow-xl"
        }`}
      >
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-500 shadow-sm shadow-indigo-200">
          <Tag className="h-5 w-5 text-white" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[14px] font-bold leading-tight text-slate-900">
            {data.label || "Tag Lead"}
          </p>
          <p className="text-[11px] text-slate-400">Label Node</p>
        </div>
      </div>

      <div className="px-1 pt-3 space-y-2">
        {tag ? (
          <span
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[12px] font-semibold text-white"
            style={{ backgroundColor: color }}
          >
            <Tag className="h-3 w-3" />
            {tag}
          </span>
        ) : (
          <p className="text-[12px] leading-relaxed text-slate-500">
            Attach a label/tag to the lead for CRM categorisation.
          </p>
        )}
        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
          tag ? "bg-indigo-50 text-indigo-600" : "bg-slate-100 text-slate-500"
        }`}>
          {tag
            ? <><CheckCircle2 className="h-3 w-3" />Tag configured</>
            : <><AlertCircle className="h-3 w-3" />No tag set</>
          }
        </span>
      </div>

      <Handle type="source" position={Position.Right} style={{ top: 28 }} className="!bg-indigo-400 !w-3 !h-3 !border-2 !border-white !shadow-md" />
    </div>
  );
}
