import { Handle, Position } from "@xyflow/react";
import { Brain, CheckCircle2, AlertCircle } from "lucide-react";
import NodeToolbarActions from "./NodeToolbarActions";

export default function AiClassifyNode({
  id,
  data,
  selected,
}: Readonly<{
  id: string;
  data: { label?: string; config?: { instructions?: string; categories?: string[] } };
  selected: boolean;
}>) {
  const { categories, instructions } = data.config || {};
  const catList = Array.isArray(categories) && categories.length ? categories : null;
  const isConfigured = !!instructions || !!catList;

  return (
    <div className="relative select-none animate-node-enter" style={{ width: 260 }}>
      <NodeToolbarActions id={id} selected={selected} accentColor="bg-pink-500" />

      <Handle type="target" position={Position.Left} style={{ top: 28 }} className="!bg-pink-400 !w-3 !h-3 !border-2 !border-white !shadow-md" />

      <div
        className={`flex items-center gap-3 rounded-2xl bg-white px-4 py-3 transition-all duration-200 ${
          selected
            ? "shadow-xl shadow-pink-100/60 ring-2 ring-pink-400"
            : "shadow-md ring-1 ring-slate-200 hover:-translate-y-0.5 hover:shadow-xl"
        }`}
      >
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-pink-500 shadow-sm shadow-pink-200">
          <Brain className="h-5 w-5 text-white" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[14px] font-bold leading-tight text-slate-900">
            {data.label || "AI Classify"}
          </p>
          <p className="text-[11px] text-slate-400">AI Classification Node</p>
        </div>
      </div>

      <div className="px-1 pt-3 space-y-2">
        {catList ? (
          <p className="text-[12px] leading-relaxed text-slate-500">
            Categories: <span className="font-medium text-slate-700">{catList.join(", ")}</span>
          </p>
        ) : (
          <p className="text-[12px] leading-relaxed text-slate-500">
            AI labels each lead as hot / warm / cold (or custom categories).
          </p>
        )}
        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
          isConfigured ? "bg-pink-50 text-pink-600" : "bg-slate-100 text-slate-500"
        }`}>
          {isConfigured
            ? <><CheckCircle2 className="h-3 w-3" />Prompt configured</>
            : <><AlertCircle className="h-3 w-3" />Not configured</>
          }
        </span>
      </div>

      <Handle type="source" position={Position.Right} style={{ top: 28 }} className="!bg-pink-400 !w-3 !h-3 !border-2 !border-white !shadow-md" />
    </div>
  );
}
