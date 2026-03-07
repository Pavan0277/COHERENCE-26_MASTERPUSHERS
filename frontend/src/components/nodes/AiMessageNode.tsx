import { Handle, Position } from "@xyflow/react";
import { Sparkles, Play } from "lucide-react";
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
  const hasTemplate = template && template.trim() !== "";
  const bodyText = hasTemplate ? template : instructions;
  const isConfigured = Boolean(bodyText && bodyText.trim() !== "");

  const renderBody = () => {
    if (hasTemplate) {
      return <p className="line-clamp-3 text-sm leading-relaxed text-gray-500">{template}</p>;
    }
    if (instructions) {
      return <p className="line-clamp-3 text-sm leading-relaxed text-gray-500">{instructions}</p>;
    }
    return (
      <p className="text-sm leading-relaxed text-gray-500">
        Generate a personalised message for each lead using Gemini AI.
      </p>
    );
  };

  return (
    <div className="relative select-none" style={{ width: 300 }}>
      {/* Left floating run button */}
      <div className="absolute -left-4 top-5 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-gray-900 shadow-lg">
        <Play className="h-3.5 w-3.5 ml-0.5 text-white" />
      </div>

      <NodeToolbarActions id={id} selected={selected} accentColor="bg-green-500" />

      {/* Card */}
      <div
        className={`rounded-2xl bg-white transition-all duration-150 ${
          selected
            ? "border-2 border-green-400 shadow-xl shadow-green-100/60"
            : "border-2 border-gray-200 shadow-md hover:shadow-lg"
        }`}
      >
        <Handle type="target" position={Position.Top} className="!bg-green-400 !w-3 !h-3 !border-2 !border-white" />

        {/* Header */}
        <div className="flex items-center gap-3 px-5 pt-4 pb-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-green-500 shadow-sm shadow-green-200">
            <Sparkles className="h-6 w-6 text-white" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-base font-bold leading-tight text-gray-900">
              {data.label || "AI Message"}
            </p>
            <p className="mt-0.5 text-xs text-gray-400">AI Node</p>
          </div>
        </div>

        <div className="h-px bg-gray-100" />

        {/* Body */}
        <div className="px-5 py-3">
          {renderBody()}
        </div>

        {/* Footer badge */}
        <div className="px-5 pb-4">
          <span className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${
            isConfigured ? "bg-green-50 text-green-600" : "bg-gray-100 text-gray-500"
          }`}>
            {isConfigured ? "Prompt configured" : "Unassigned"}
          </span>
        </div>

        <Handle type="source" position={Position.Bottom} className="!bg-green-400 !w-3 !h-3 !border-2 !border-white" />
      </div>
    </div>
  );
}
