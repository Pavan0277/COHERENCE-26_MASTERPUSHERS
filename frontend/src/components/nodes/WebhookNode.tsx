import { Handle, Position } from "@xyflow/react";
import { Webhook, CheckCircle2, AlertCircle } from "lucide-react";
import NodeToolbarActions from "./NodeToolbarActions";

export default function WebhookNode({
  id,
  data,
  selected,
}: Readonly<{
  id: string;
  data: { label?: string; config?: { url?: string; method?: string } };
  selected: boolean;
}>) {
  const url    = data.config?.url    || "";
  const method = data.config?.method || "POST";

  return (
    <div className="relative select-none animate-node-enter" style={{ width: 260 }}>
      <NodeToolbarActions id={id} selected={selected} accentColor="bg-rose-500" />

      <Handle type="target" position={Position.Left} style={{ top: 28 }} className="!bg-rose-400 !w-3 !h-3 !border-2 !border-white !shadow-md" />

      <div
        className={`flex items-center gap-3 rounded-2xl bg-white px-4 py-3 transition-all duration-200 ${
          selected
            ? "shadow-xl shadow-rose-100/60 ring-2 ring-rose-400"
            : "shadow-md ring-1 ring-slate-200 hover:-translate-y-0.5 hover:shadow-xl"
        }`}
      >
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-500 shadow-sm shadow-rose-200">
          <Webhook className="h-5 w-5 text-white" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[14px] font-bold leading-tight text-slate-900">
            {data.label || "Webhook"}
          </p>
          <p className="text-[11px] text-slate-400">HTTP Request Node</p>
        </div>
      </div>

      <div className="px-1 pt-3 space-y-2">
        {url ? (
          <p className="truncate rounded-lg bg-rose-50 px-3 py-1.5 font-mono text-[11px] text-rose-700">
            <span className="font-bold">{method}</span>{" "}
            {url.replace(/^https?:\/\//, "")}
          </p>
        ) : (
          <p className="text-[12px] leading-relaxed text-slate-500">
            POST lead data to an external URL (CRM, Zapier, etc).
          </p>
        )}
        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
          url ? "bg-rose-50 text-rose-600" : "bg-slate-100 text-slate-500"
        }`}>
          {url
            ? <><CheckCircle2 className="h-3 w-3" />URL configured</>
            : <><AlertCircle className="h-3 w-3" />No URL set</>
          }
        </span>
      </div>

      <Handle type="source" position={Position.Right} style={{ top: 28 }} className="!bg-rose-400 !w-3 !h-3 !border-2 !border-white !shadow-md" />
    </div>
  );
}
