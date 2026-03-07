import { Handle, Position } from "@xyflow/react";
import { MessageCircle, CheckCircle2, AlertCircle } from "lucide-react";
import NodeToolbarActions from "./NodeToolbarActions";

export default function WhatsAppNode({
  id,
  data,
  selected,
}: Readonly<{
  id: string;
  data: { label?: string; config?: { message?: string; from?: string } };
  selected: boolean;
}>) {
  const { message } = data.config || {};
  const isConfigured = !!message?.trim();

  return (
    <div className="relative select-none animate-node-enter" style={{ width: 260 }}>
      <NodeToolbarActions id={id} selected={selected} accentColor="bg-green-600" />

      <Handle type="target" position={Position.Left} style={{ top: 28 }} className="!bg-green-500 !w-3 !h-3 !border-2 !border-white !shadow-md" />

      <div
        className={`flex items-center gap-3 rounded-2xl bg-white px-4 py-3 transition-all duration-200 ${
          selected
            ? "shadow-xl shadow-green-100/60 ring-2 ring-green-500"
            : "shadow-md ring-1 ring-slate-200 hover:-translate-y-0.5 hover:shadow-xl"
        }`}
      >
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-600 shadow-sm shadow-green-200">
          <MessageCircle className="h-5 w-5 text-white" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[14px] font-bold leading-tight text-slate-900">
            {data.label || "WhatsApp"}
          </p>
          <p className="text-[11px] text-slate-400">WhatsApp via Twilio</p>
        </div>
      </div>

      <div className="px-1 pt-3 space-y-2">
        {message ? (
          <p className="line-clamp-2 text-[12px] leading-relaxed text-slate-500">{message}</p>
        ) : (
          <p className="text-[12px] leading-relaxed text-slate-500">
            Send a WhatsApp message to each lead via Twilio.
          </p>
        )}
        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
          isConfigured ? "bg-green-50 text-green-700" : "bg-slate-100 text-slate-500"
        }`}>
          {isConfigured
            ? <><CheckCircle2 className="h-3 w-3" />Message set</>
            : <><AlertCircle className="h-3 w-3" />No message yet</>
          }
        </span>
      </div>

      <Handle type="source" position={Position.Right} style={{ top: 28 }} className="!bg-green-500 !w-3 !h-3 !border-2 !border-white !shadow-md" />
    </div>
  );
}
