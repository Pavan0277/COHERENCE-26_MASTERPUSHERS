import { Handle, Position } from "@xyflow/react";
import { Filter, Play } from "lucide-react";
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
    <div className="relative select-none" style={{ width: 300 }}>
      <NodeToolbarActions id={id} selected={selected} accentColor="bg-purple-500" />

      {/* Card box — header only */}
      <div
        className={`relative rounded-2xl bg-white transition-all duration-150 ${
          selected
            ? "border-2 border-purple-400 shadow-xl shadow-purple-100/60"
            : "border-2 border-gray-200 shadow-md hover:shadow-lg"
        }`}
      >
        {/* Play button on left edge of card */}
        <div className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-gray-900 shadow-lg">
          <Play className="h-3.5 w-3.5 ml-0.5 text-white" />
        </div>

        <Handle type="target" position={Position.Top} className="!bg-purple-400 !w-3 !h-3 !border-2 !border-white" />
        <Handle type="source" position={Position.Bottom} className="!bg-purple-400 !w-3 !h-3 !border-2 !border-white" />

        <div className="flex items-center gap-3 px-5 py-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-purple-500 shadow-sm shadow-purple-200">
            <Filter className="h-6 w-6 text-white" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-base font-bold leading-tight text-gray-900">
              {data.label || "Filter"}
            </p>
            <p className="mt-0.5 text-xs text-gray-400">Condition Node</p>
          </div>
        </div>
      </div>

      {/* Body + badge — outside the box */}
      <div className="px-1 pt-3">
        {hasFilter ? (
          <p className="rounded-lg bg-purple-50 px-3 py-2 font-mono text-sm text-purple-800">
            <span className="font-semibold">{column}</span>
            {" "}
            <span className="text-purple-400">{OP_LABELS[operator ?? ""] || operator}</span>
            {" "}
            <span className="font-semibold">"{value}"</span>
          </p>
        ) : (
          <p className="text-sm leading-relaxed text-gray-500">
            Filter leads by matching specific column values before continuing.
          </p>
        )}
        <div className="mt-2">
          <span className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${
            hasFilter ? "bg-purple-50 text-purple-600" : "bg-gray-100 text-gray-500"
          }`}>
            {hasFilter ? "Filter active" : "Unassigned"}
          </span>
        </div>
      </div>
    </div>
  );
}