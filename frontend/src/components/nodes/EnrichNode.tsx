import { Handle, Position } from "@xyflow/react";
import { Database, CheckCircle2, AlertCircle } from "lucide-react";
import NodeToolbarActions from "./NodeToolbarActions";

const PROVIDER_LABELS: Record<string, string> = {
  hunter:   "Hunter.io",
  clearbit: "Clearbit",
  apollo:   "Apollo.io",
};

export default function EnrichNode({
  id,
  data,
  selected,
}: Readonly<{
  id: string;
  data: { label?: string; config?: { provider?: string; apiKey?: string } };
  selected: boolean;
}>) {
  const { provider = "hunter", apiKey } = data.config || {};
  const isConfigured = !!apiKey;

  return (
    <div className="relative select-none animate-node-enter" style={{ width: 260 }}>
      <NodeToolbarActions id={id} selected={selected} accentColor="bg-yellow-600" />

      <Handle type="target" position={Position.Left} style={{ top: 28 }} className="!bg-yellow-500 !w-3 !h-3 !border-2 !border-white !shadow-md" />

      <div
        className={`flex items-center gap-3 rounded-2xl bg-white px-4 py-3 transition-all duration-200 ${
          selected
            ? "shadow-xl shadow-yellow-100/60 ring-2 ring-yellow-400"
            : "shadow-md ring-1 ring-slate-200 hover:-translate-y-0.5 hover:shadow-xl"
        }`}
      >
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-yellow-600 shadow-sm shadow-yellow-200">
          <Database className="h-5 w-5 text-white" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[14px] font-bold leading-tight text-slate-900">
            {data.label || "Enrich Lead"}
          </p>
          <p className="text-[11px] text-slate-400">Data Enrichment Node</p>
        </div>
      </div>

      <div className="px-1 pt-3 space-y-2">
        <p className="text-[12px] leading-relaxed text-slate-500">
          Fetch extra data via{" "}
          <span className="font-medium text-slate-700">{PROVIDER_LABELS[provider] || provider}</span>
          {" "}and merge into lead.
        </p>
        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
          isConfigured ? "bg-yellow-50 text-yellow-700" : "bg-slate-100 text-slate-500"
        }`}>
          {isConfigured
            ? <><CheckCircle2 className="h-3 w-3" />API key set</>
            : <><AlertCircle className="h-3 w-3" />No API key</>
          }
        </span>
      </div>

      <Handle type="source" position={Position.Right} style={{ top: 28 }} className="!bg-yellow-500 !w-3 !h-3 !border-2 !border-white !shadow-md" />
    </div>
  );
}
