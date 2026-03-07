import { Handle, Position } from "@xyflow/react";
import { Shuffle, CheckCircle2 } from "lucide-react";
import NodeToolbarActions from "./NodeToolbarActions";

export default function SplitNode({
  id,
  data,
  selected,
}: Readonly<{
  id: string;
  data: { label?: string; config?: { percentage?: number } };
  selected: boolean;
}>) {
  const percentage = data.config?.percentage ?? 50;

  return (
    <div className="relative select-none animate-node-enter" style={{ width: 260 }}>
      <NodeToolbarActions id={id} selected={selected} accentColor="bg-violet-500" />

      <Handle type="target" position={Position.Left} style={{ top: 28 }} className="!bg-violet-400 !w-3 !h-3 !border-2 !border-white !shadow-md" />

      <div
        className={`flex items-center gap-3 rounded-2xl bg-white px-4 py-3 transition-all duration-200 ${
          selected
            ? "shadow-xl shadow-violet-100/60 ring-2 ring-violet-400"
            : "shadow-md ring-1 ring-slate-200 hover:-translate-y-0.5 hover:shadow-xl"
        }`}
      >
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-500 shadow-sm shadow-violet-200">
          <Shuffle className="h-5 w-5 text-white" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[14px] font-bold leading-tight text-slate-900">
            {data.label || "A/B Split"}
          </p>
          <p className="text-[11px] text-slate-400">Random Split</p>
        </div>
      </div>

      <div className="px-1 pt-3 space-y-2">
        {/* Visual bar */}
        <div className="rounded-lg bg-violet-50 border border-violet-100 px-2.5 py-2">
          <div className="mb-1.5 flex justify-between text-[10px] font-semibold">
            <span className="text-violet-600">Continue</span>
            <span className="text-gray-400">Skip</span>
          </div>
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-gray-200">
            <div
              className="h-full rounded-full bg-violet-500 transition-all"
              style={{ width: `${percentage}%` }}
            />
          </div>
          <div className="mt-1 flex justify-between text-[10px]">
            <span className="font-bold text-violet-600">{percentage}%</span>
            <span className="text-gray-400">{100 - percentage}%</span>
          </div>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-violet-50 text-violet-600 px-2.5 py-1 text-[11px] font-semibold">
          <CheckCircle2 className="h-3 w-3" />{percentage}% pass through
        </span>
      </div>

      <Handle type="source" position={Position.Right} style={{ top: 28 }} className="!bg-violet-400 !w-3 !h-3 !border-2 !border-white !shadow-md" />
    </div>
  );
}
