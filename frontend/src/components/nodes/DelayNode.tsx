import { Handle, Position } from "@xyflow/react";
import { Clock } from "lucide-react";
import NodeToolbarActions from "./NodeToolbarActions";

function humanize(minutes: number): string {
  if (!minutes) return "0m";
  const d = Math.floor(minutes / 1440);
  const h = Math.floor((minutes % 1440) / 60);
  const m = minutes % 60;
  const parts: string[] = [];
  if (d) parts.push(`${d}d`);
  if (h) parts.push(`${h}h`);
  if (m) parts.push(`${m}m`);
  return parts.join(" ");
}

export default function DelayNode({
  id,
  data,
  selected,
}: {
  id: string;
  data: { label?: string; config?: { min?: number; max?: number } };
  selected: boolean;
}) {
  const min = data.config?.min ?? 0;
  const max = data.config?.max ?? 0;
  const hasConfig = min > 0 || max > 0;

  return (
    <div
      className={`rounded-xl border-2 bg-white px-4 py-3 shadow-md w-52 ${
        selected ? "border-gray-500 shadow-gray-100" : "border-gray-300"
      }`}
    >
      <NodeToolbarActions id={id} selected={selected} accentColor="bg-gray-500" />
      <Handle type="target" position={Position.Top} className="!bg-gray-400" />

      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gray-500">
          <Clock className="h-4 w-4 text-white" />
        </div>
        <span className="text-sm font-semibold text-gray-800">
          {data.label || "Delay"}
        </span>
      </div>

      {hasConfig ? (
        <p className="mt-1.5 rounded-md bg-gray-100 px-2 py-1 text-xs text-gray-700">
          <span className="font-semibold">{humanize(min)}</span>
          {" – "}
          <span className="font-semibold">{humanize(max)}</span>
          <span className="ml-1 text-gray-400">random</span>
        </p>
      ) : (
        <p className="mt-1 text-xs text-gray-400">No delay set</p>
      )}

      <Handle type="source" position={Position.Bottom} className="!bg-gray-400" />
    </div>
  );
}
