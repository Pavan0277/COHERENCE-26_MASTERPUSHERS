import { Handle, Position } from "@xyflow/react";
import { Globe, CheckCircle2, AlertCircle } from "lucide-react";
import NodeToolbarActions from "./NodeToolbarActions";

export default function HttpRequestNode({
  id,
  data,
  selected,
}: Readonly<{
  id: string;
  data: { label?: string; config?: { url?: string; method?: string } };
  selected: boolean;
}>) {
  const { url, method = "POST" } = data.config || {};
  const isConfigured = !!url;

  return (
    <div className="relative select-none animate-node-enter" style={{ width: 260 }}>
      <NodeToolbarActions id={id} selected={selected} accentColor="bg-gray-700" />

      <Handle type="target" position={Position.Left} style={{ top: 28 }} className="!bg-gray-500 !w-3 !h-3 !border-2 !border-white !shadow-md" />

      <div
        className={`flex items-center gap-3 rounded-2xl bg-white px-4 py-3 transition-all duration-200 ${
          selected
            ? "shadow-xl shadow-gray-200/60 ring-2 ring-gray-400"
            : "shadow-md ring-1 ring-slate-200 hover:-translate-y-0.5 hover:shadow-xl"
        }`}
      >
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-700 shadow-sm shadow-gray-300">
          <Globe className="h-5 w-5 text-white" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[14px] font-bold leading-tight text-slate-900">
            {data.label || "HTTP Request"}
          </p>
          <p className="text-[11px] text-slate-400">
            {method} {url ? url.slice(0, 24) + (url.length > 24 ? "…" : "") : "any API endpoint"}
          </p>
        </div>
      </div>

      <div className="px-1 pt-3 space-y-2">
        {url ? (
          <p className="truncate text-[12px] leading-relaxed font-mono text-slate-500">{url}</p>
        ) : (
          <p className="text-[12px] leading-relaxed text-slate-500">
            Make a GET / POST / PUT / DELETE call to any API with custom headers and body.
          </p>
        )}
        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
          isConfigured ? "bg-gray-100 text-gray-700" : "bg-slate-100 text-slate-500"
        }`}>
          {isConfigured
            ? <><CheckCircle2 className="h-3 w-3" />{method} configured</>
            : <><AlertCircle className="h-3 w-3" />No URL set</>
          }
        </span>
      </div>

      <Handle type="source" position={Position.Right} style={{ top: 28 }} className="!bg-gray-500 !w-3 !h-3 !border-2 !border-white !shadow-md" />
    </div>
  );
}
