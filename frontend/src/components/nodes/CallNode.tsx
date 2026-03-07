import { Handle, Position } from "@xyflow/react";
import { Phone, CheckCircle2, AlertCircle } from "lucide-react";
import NodeToolbarActions from "./NodeToolbarActions";

export default function CallNode({
  id,
  data,
  selected,
}: Readonly<{
  id: string;
  data: { label?: string; config?: { assistantId?: string; phoneNumberId?: string } };
  selected: boolean;
}>) {
  const hasAssistant = !!data.config?.assistantId;

  return (
    <div className="relative select-none animate-node-enter" style={{ width: 260 }}>
      <NodeToolbarActions id={id} selected={selected} accentColor="bg-sky-500" />

      <Handle type="target" position={Position.Left} style={{ top: 28 }} className="!bg-sky-400 !w-3 !h-3 !border-2 !border-white !shadow-md" />

      {/* Header card box — only icon + title + subtitle inside */}
      <div
        className={`flex items-center gap-3 rounded-2xl bg-white px-4 py-3 transition-all duration-200 ${
          selected
            ? "shadow-xl shadow-sky-100/60 ring-2 ring-sky-400"
            : "shadow-md ring-1 ring-slate-200 hover:-translate-y-0.5 hover:shadow-xl"
        }`}
      >
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-500 shadow-sm shadow-sky-200">
          <Phone className="h-5 w-5 text-white" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[14px] font-bold leading-tight text-slate-900">
            {data.label || "VAPI Call"}
          </p>
          <p className="text-[11px] text-slate-400">Voice AI Node</p>
        </div>
      </div>

      {/* Content outside the box */}
      <div className="px-1 pt-3 space-y-2">
        {hasAssistant ? (
          <p className="text-[12px] leading-relaxed text-slate-500">
            Calling with assistant{" "}
            <span className="font-medium text-slate-700">
              {(data.config?.assistantId ?? "").slice(0, 18)}…
            </span>
          </p>
        ) : (
          <p className="text-[12px] leading-relaxed text-slate-500">
            AI-powered outbound voice call to each lead via VAPI.
          </p>
        )}
        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
          hasAssistant ? "bg-sky-50 text-sky-600" : "bg-slate-100 text-slate-500"
        }`}>
          {hasAssistant
            ? <><CheckCircle2 className="h-3 w-3" />Assistant configured</>
            : <><AlertCircle className="h-3 w-3" />Unassigned</>
          }
        </span>
      </div>

      <Handle type="source" position={Position.Right} style={{ top: 28 }} className="!bg-sky-400 !w-3 !h-3 !border-2 !border-white !shadow-md" />
    </div>
  );
}
