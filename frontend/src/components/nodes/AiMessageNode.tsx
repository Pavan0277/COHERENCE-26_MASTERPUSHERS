import { Handle, Position } from "@xyflow/react";
import { Sparkles, CheckCircle2, AlertCircle } from "lucide-react";
import NodeToolbarActions from "./NodeToolbarActions";

interface Config {
  instructions?: string;
  template?: string;
}

export default function AiMessageNode({
  id,
  data,
  selected,
}: Readonly<{
  id: string;
  data: { label?: string; config?: Config };
  selected: boolean;
}>) {
  const { instructions, template } = data.config || {};
  const bodyText = template || instructions;
  const isConfigured = Boolean(bodyText?.trim());

  return (
    <div className="relative select-none animate-node-enter" style={{ width: 260 }}>
      <NodeToolbarActions id={id} selected={selected} accentColor="bg-emerald-500" />

      <Handle type="target" position={Position.Left} style={{ top: 28 }} className="!bg-emerald-400 !w-3 !h-3 !border-2 !border-white !shadow-md" />

      {/* Header card box — only icon + title + subtitle inside */}
      <div
        className={`flex items-center gap-3 rounded-2xl bg-white px-4 py-3 transition-all duration-200 ${
          selected
            ? "shadow-xl shadow-emerald-100/60 ring-2 ring-emerald-400"
            : "shadow-md ring-1 ring-slate-200 hover:-translate-y-0.5 hover:shadow-xl"
        }`}
      >
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500 shadow-sm shadow-emerald-200">
          <Sparkles className="h-5 w-5 text-white" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[14px] font-bold leading-tight text-slate-900">
            {data.label || "AI Message"}
          </p>
          <p className="text-[11px] text-slate-400">AI Node</p>
        </div>
      </div>

      {/* Content outside the box */}
      <div className="px-1 pt-3 space-y-2">
        {bodyText ? (
          <p className="line-clamp-2 text-[12px] leading-relaxed text-slate-500">{bodyText}</p>
        ) : (
          <p className="text-[12px] leading-relaxed text-slate-500">
            Generate personalised messages for each lead using Gemini AI.
          </p>
        )}
        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
          isConfigured ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-500"
        }`}>
          {isConfigured
            ? <><CheckCircle2 className="h-3 w-3" />Prompt configured</>
            : <><AlertCircle className="h-3 w-3" />Unassigned</>
          }
        </span>
      </div>

      <Handle type="source" position={Position.Right} style={{ top: 28 }} className="!bg-emerald-400 !w-3 !h-3 !border-2 !border-white !shadow-md" />
    </div>
  );
}
