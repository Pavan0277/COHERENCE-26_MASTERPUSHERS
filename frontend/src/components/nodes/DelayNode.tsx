import { Handle, Position } from "@xyflow/react";
import { Clock, Play } from "lucide-react";
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
}: Readonly<{
  id: string;
  data: { label?: string; config?: { min?: number; max?: number } };
  selected: boolean;
}>) {
  const min = data.config?.min ?? 0;
  const max = data.config?.max ?? 0;
  const hasConfig = min > 0 || max > 0;

  return (
    <div className="relative select-none" style={{ width: 300 }}>
      <NodeToolbarActions id={id} selected={selected} accentColor="bg-slate-500" />

      {/* Card box — header only */}
      <div
        className={`relative rounded-2xl bg-white transition-all duration-150 ${
          selected
            ? "border-2 border-slate-400 shadow-xl shadow-slate-100/60"
            : "border-2 border-gray-200 shadow-md hover:shadow-lg"
        }`}
      >
        {/* Play button on left edge of card */}
        <div className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-gray-900 shadow-lg">
          <Play className="h-3.5 w-3.5 ml-0.5 text-white" />
        </div>

        <Handle type="target" position={Position.Top} className="!bg-slate-400 !w-3 !h-3 !border-2 !border-white" />
        <Handle type="source" position={Position.Bottom} className="!bg-slate-400 !w-3 !h-3 !border-2 !border-white" />

        <div className="flex items-center gap-3 px-5 py-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-500 shadow-sm shadow-slate-200">
            <Clock className="h-6 w-6 text-white" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-base font-bold leading-tight text-gray-900">
              {data.label || "Delay"}
            </p>
            <p className="mt-0.5 text-xs text-gray-400">Timer Node</p>
          </div>
        </div>
      </div>

      {/* Body + badge — outside the box */}
      <div className="px-1 pt-3">
        {hasConfig ? (
          <p className="text-sm leading-relaxed text-gray-500">
            Wait between{" "}
            <span className="font-semibold text-gray-700">{humanize(min)}</span>
            {" and "}
            <span className="font-semibold text-gray-700">{humanize(max)}</span>
            {" before the next step."}
          </p>
        ) : (
          <p className="text-sm leading-relaxed text-gray-500">
            Add a randomised wait time between steps for natural pacing.
          </p>
        )}
        <div className="mt-2">
          <span className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${
            hasConfig ? "bg-slate-100 text-slate-600" : "bg-gray-100 text-gray-500"
          }`}>
            {hasConfig ? `${humanize(min)} – ${humanize(max)}` : "Unassigned"}
          </span>
        </div>
      </div>
    </div>
  );
}
