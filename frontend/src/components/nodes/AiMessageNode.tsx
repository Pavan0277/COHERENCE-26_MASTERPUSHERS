import { Handle, Position } from "@xyflow/react";
import { Sparkles, FileText } from "lucide-react";
import NodeToolbarActions from "./NodeToolbarActions";

interface Config {
  instructions?: string;
  template?: string;
}

export default function AiMessageNode({
  id,
  data,
  selected,
}: {
  id: string;
  data: { label?: string; config?: Config };
  selected: boolean;
}) {
  const { instructions, template } = data.config || {};
  const hasTemplate = template && template.trim() !== "";

  return (
    <div
      className={`rounded-xl border-2 bg-white px-4 py-3 shadow-md w-52 ${
        selected ? "border-green-500 shadow-green-100" : "border-green-200"
      }`}
    >
      <NodeToolbarActions id={id} selected={selected} accentColor="bg-green-500" />
      <Handle type="target" position={Position.Top} className="!bg-green-400" />

      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-500">
          <Sparkles className="h-4 w-4 text-white" />
        </div>
        <span className="text-sm font-semibold text-gray-800">
          {data.label || "AI Message"}
        </span>
      </div>

      {hasTemplate ? (
        <div className="mt-2 flex items-start gap-1.5 rounded-md bg-green-50 px-2 py-1.5">
          <FileText className="mt-0.5 h-3 w-3 shrink-0 text-green-400" />
          <p className="line-clamp-2 text-[11px] leading-tight text-green-800">
            {template}
          </p>
        </div>
      ) : (
        <p className="mt-1 truncate text-xs text-gray-400">
          {instructions || "No instructions set"}
        </p>
      )}

      <Handle type="source" position={Position.Bottom} className="!bg-green-400" />
    </div>
  );
}
