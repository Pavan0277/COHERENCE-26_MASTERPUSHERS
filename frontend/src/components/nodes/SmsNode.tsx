import { Handle, Position } from "@xyflow/react";
import { MessageSquare, CheckCircle2, AlertCircle } from "lucide-react";
import NodeToolbarActions from "./NodeToolbarActions";

export default function SmsNode({
  id,
  data,
  selected,
}: Readonly<{
  id: string;
  data: { label?: string; config?: { message?: string; from?: string } };
  selected: boolean;
}>) {
  const message = data.config?.message || "";

  return (
    <div className="relative select-none animate-node-enter" style={{ width: 260 }}>
      <NodeToolbarActions id={id} selected={selected} accentColor="bg-fuchsia-500" />

      <Handle type="target" position={Position.Left} style={{ top: 28 }} className="!bg-fuchsia-400 !w-3 !h-3 !border-2 !border-white !shadow-md" />

      <div
        className={`flex items-center gap-3 rounded-2xl bg-white px-4 py-3 transition-all duration-200 ${
          selected
            ? "shadow-xl shadow-fuchsia-100/60 ring-2 ring-fuchsia-400"
            : "shadow-md ring-1 ring-slate-200 hover:-translate-y-0.5 hover:shadow-xl"
        }`}
      >
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-fuchsia-500 shadow-sm shadow-fuchsia-200">
          <MessageSquare className="h-5 w-5 text-white" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[14px] font-bold leading-tight text-slate-900">
            {data.label || "Send SMS"}
          </p>
          <p className="text-[11px] text-slate-400">Twilio SMS</p>
        </div>
      </div>

      <div className="px-1 pt-3 space-y-2">
        {message ? (
          <p className="truncate text-[12px] leading-relaxed text-slate-600 bg-fuchsia-50 rounded-lg px-2.5 py-1.5 border border-fuchsia-100">
            {message.length > 60 ? message.slice(0, 60) + "…" : message}
          </p>
        ) : (
          <p className="text-[12px] leading-relaxed text-slate-500">
            Send an SMS to the lead's phone number via Twilio.
          </p>
        )}
        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
          message ? "bg-fuchsia-50 text-fuchsia-600" : "bg-slate-100 text-slate-500"
        }`}>
          {message
            ? <><CheckCircle2 className="h-3 w-3" />Message set</>
            : <><AlertCircle className="h-3 w-3" />No message</>
          }
        </span>
      </div>

      <Handle type="source" position={Position.Right} style={{ top: 28 }} className="!bg-fuchsia-400 !w-3 !h-3 !border-2 !border-white !shadow-md" />
    </div>
  );
}
