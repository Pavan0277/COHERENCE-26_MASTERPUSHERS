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
      {/* Left floating run button */}
      <div className="absolute -left-4 top-5 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-gray-900 shadow-lg">
        <Play className="h-3.5 w-3.5 ml-0.5 text-white" />
      </div>

      <NodeToolbarActions id={id} selected={selected} accentColor="bg-slate-500" />

      {/* Card */}
      <div
        className={`rounded-2xl bg-white transition-all duration-150 ${
          selected
            ? "border-2 border-slate-400 shadow-xl shadow-slate-100/60"
            : "border-2 border-gray-200 shadow-md hover:shadow-lg"
        }`}
      >
        <Handle type="target" position={Position.Top} className="!bg-slate-400 !w-3 !h-3 !border-2 !border-white" />

        {/* Header */}
        <div className="flex items-center gap-3 px-5 pt-4 pb-3">
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

        <div className="h-px bg-gray-100" />

        {/* Body */}
        <div className="px-5 py-3">
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
        </div>

        {/* Footer badge */}
        <div className="px-5 pb-4">
          <span className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${
            hasConfig ? "bg-slate-100 text-slate-600" : "bg-gray-100 text-gray-500"
          }`}>
            {hasConfig ? `${humanize(min)} – ${humanize(max)}` : "Unassigned"}
          </span>
        </div>

        <Handle type="source" position={Position.Bottom} className="!bg-slate-400 !w-3 !h-3 !border-2 !border-white" />
      </div>
    </div>
  );
}
