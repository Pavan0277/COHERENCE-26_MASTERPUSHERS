import { Handle, Position } from "@xyflow/react";
import { Star, CheckCircle2, AlertCircle } from "lucide-react";
import NodeToolbarActions from "./NodeToolbarActions";

const OP_LABELS: Record<string, string> = {
  add:      "+",
  subtract: "−",
  set:      "=",
};

export default function ScoreNode({
  id,
  data,
  selected,
}: Readonly<{
  id: string;
  data: { label?: string; config?: { value?: number; operation?: string } };
  selected: boolean;
}>) {
  const value     = data.config?.value     ?? 10;
  const operation = data.config?.operation ?? "add";

  return (
    <div className="relative select-none animate-node-enter" style={{ width: 260 }}>
      <NodeToolbarActions id={id} selected={selected} accentColor="bg-cyan-500" />

      <Handle type="target" position={Position.Left} style={{ top: 28 }} className="!bg-cyan-400 !w-3 !h-3 !border-2 !border-white !shadow-md" />

      <div
        className={`flex items-center gap-3 rounded-2xl bg-white px-4 py-3 transition-all duration-200 ${
          selected
            ? "shadow-xl shadow-cyan-100/60 ring-2 ring-cyan-400"
            : "shadow-md ring-1 ring-slate-200 hover:-translate-y-0.5 hover:shadow-xl"
        }`}
      >
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-500 shadow-sm shadow-cyan-200">
          <Star className="h-5 w-5 text-white" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[14px] font-bold leading-tight text-slate-900">
            {data.label || "Score Lead"}
          </p>
          <p className="text-[11px] text-slate-400">Lead Scoring</p>
        </div>
      </div>

      <div className="px-1 pt-3 space-y-2">
        <div className="flex items-center gap-2 rounded-lg bg-cyan-50 px-2.5 py-1.5 border border-cyan-100">
          <Star className="h-3.5 w-3.5 text-cyan-500 shrink-0" />
          <p className="text-[12px] font-semibold text-cyan-700">
            Score {OP_LABELS[operation] || "+"} {value}
          </p>
        </div>
        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
          value !== 0 ? "bg-cyan-50 text-cyan-600" : "bg-slate-100 text-slate-500"
        }`}>
          {value !== 0
            ? <><CheckCircle2 className="h-3 w-3" />Score configured</>
            : <><AlertCircle className="h-3 w-3" />No score value</>
          }
        </span>
      </div>

      <Handle type="source" position={Position.Right} style={{ top: 28 }} className="!bg-cyan-400 !w-3 !h-3 !border-2 !border-white !shadow-md" />
    </div>
  );
}
