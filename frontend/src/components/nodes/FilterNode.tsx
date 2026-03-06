import { Handle, Position } from "@xyflow/react";
import { Filter } from "lucide-react";
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
}: {
  id: string;
  data: { label?: string; config?: { column?: string; operator?: string; value?: string } };
  selected: boolean;
}) {
  const { column, operator, value } = data.config || {};
  const hasFilter = column && operator && value;

  return (
    <div
      className={`rounded-xl border-2 bg-white px-4 py-3 shadow-md w-52 ${
        selected ? "border-purple-500 shadow-purple-100" : "border-purple-200"
      }`}
    >
      <NodeToolbarActions id={id} selected={selected} accentColor="bg-purple-500" />
      <Handle type="target" position={Position.Top} className="!bg-purple-400" />

      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-purple-500">
          <Filter className="h-4 w-4 text-white" />
        </div>
        <span className="text-sm font-semibold text-gray-800">
          {data.label || "Filter"}
        </span>
      </div>

      {hasFilter ? (
        <p className="mt-1.5 rounded-md bg-purple-50 px-2 py-1 font-mono text-xs text-purple-800">
          <span className="font-semibold">{column}</span>
          {" "}
          <span className="text-purple-500">{OP_LABELS[operator!] || operator}</span>
          {" "}
          <span className="font-semibold">{value}</span>
        </p>
      ) : (
        <p className="mt-1 text-xs text-gray-400">No filter set</p>
      )}

      <Handle type="source" position={Position.Bottom} className="!bg-purple-400" />
    </div>
  );
}
