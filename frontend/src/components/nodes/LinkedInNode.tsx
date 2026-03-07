import { Handle, Position } from "@xyflow/react";
import { Linkedin, CheckCircle2, AlertCircle } from "lucide-react";
import NodeToolbarActions from "./NodeToolbarActions";

export default function LinkedInNode({
  id,
  data,
  selected,
}: Readonly<{
  id: string;
  data: { label?: string; config?: { automationUrl?: string; message?: string } };
  selected: boolean;
}>) {
  const { automationUrl, message } = data.config || {};
  const isConfigured = !!automationUrl;

  return (
    <div className="relative select-none animate-node-enter" style={{ width: 260 }}>
      <NodeToolbarActions id={id} selected={selected} accentColor="bg-blue-700" />

      <Handle type="target" position={Position.Left} style={{ top: 28 }} className="!bg-blue-600 !w-3 !h-3 !border-2 !border-white !shadow-md" />

      <div
        className={`flex items-center gap-3 rounded-2xl bg-white px-4 py-3 transition-all duration-200 ${
          selected
            ? "shadow-xl shadow-blue-100/60 ring-2 ring-blue-500"
            : "shadow-md ring-1 ring-slate-200 hover:-translate-y-0.5 hover:shadow-xl"
        }`}
      >
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-700 shadow-sm shadow-blue-200">
          <Linkedin className="h-5 w-5 text-white" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[14px] font-bold leading-tight text-slate-900">
            {data.label || "LinkedIn"}
          </p>
          <p className="text-[11px] text-slate-400">LinkedIn Outreach Node</p>
        </div>
      </div>

      <div className="px-1 pt-3 space-y-2">
        {message ? (
          <p className="line-clamp-2 text-[12px] leading-relaxed text-slate-500">{message}</p>
        ) : (
          <p className="text-[12px] leading-relaxed text-slate-500">
            Send lead + message to a LinkedIn automation service (Phantombuster, Expandi, etc).
          </p>
        )}
        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
          isConfigured ? "bg-blue-50 text-blue-700" : "bg-slate-100 text-slate-500"
        }`}>
          {isConfigured
            ? <><CheckCircle2 className="h-3 w-3" />Webhook configured</>
            : <><AlertCircle className="h-3 w-3" />No webhook URL</>
          }
        </span>
      </div>

      <Handle type="source" position={Position.Right} style={{ top: 28 }} className="!bg-blue-600 !w-3 !h-3 !border-2 !border-white !shadow-md" />
    </div>
  );
}
