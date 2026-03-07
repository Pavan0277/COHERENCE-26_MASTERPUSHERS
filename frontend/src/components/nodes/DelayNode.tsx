import { Handle, Position } from "@xyflow/react";
import { Clock, CheckCircle2, AlertCircle } from "lucide-react";
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
    <div className="relative select-none animate-node-enter" style={{ width: 260 }}>
      <NodeToolbarActions id={id} selected={selected} accentColor="bg-slate-500" />

      <Handle type="target" position={Position.Left} style={{ top: 28 }} className="!bg-slate-400 !w-3 !h-3 !border-2 !border-white !shadow-md" />

      {/* Header card box — only icon + title + subtitle inside */}
      <div
        className={`flex items-center gap-3 rounded-2xl bg-white px-4 py-3 transition-all duration-200 ${
          selected
            ? "shadow-xl shadow-slate-100/60 ring-2 ring-slate-400"
            : "shadow-md ring-1 ring-slate-200 hover:-translate-y-0.5 hover:shadow-xl"
        }`}
      >
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-500 shadow-sm shadow-slate-200">
          <Clock className="h-5 w-5 text-white" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[14px] font-bold leading-tight text-slate-900">
            {data.label || "Delay"}
          </p>
          <p className="text-[11px] text-slate-400">Timer Node</p>
        </div>
      </div>

      {/* Content outside the box */}
      <div className="px-1 pt-3 space-y-2">
        {hasConfig ? (
          <p className="text-[12px] leading-relaxed text-slate-500">
            Wait between{" "}
            <span className="font-semibold text-slate-700">{humanize(min)}</span>
            {" and "}
            <span className="font-semibold text-slate-700">{humanize(max)}</span>
          </p>
        ) : (
          <p className="text-[12px] leading-relaxed text-slate-500">
            Add a randomised wait time between steps for natural pacing.
          </p>
        )}
        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
          hasConfig ? "bg-slate-100 text-slate-600" : "bg-slate-100 text-slate-500"
        }`}>
          {hasConfig
            ? <><CheckCircle2 className="h-3 w-3" />{humanize(min)} – {humanize(max)}</>
            : <><AlertCircle className="h-3 w-3" />Unassigned</>
          }
        </span>
      </div>

      <Handle type="source" position={Position.Right} style={{ top: 28 }} className="!bg-slate-400 !w-3 !h-3 !border-2 !border-white !shadow-md" />
    </div>
  );
}
