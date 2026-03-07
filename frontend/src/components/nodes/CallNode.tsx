import { Handle, Position } from "@xyflow/react";
import { Phone } from "lucide-react";
import NodeToolbarActions from "./NodeToolbarActions";

export default function CallNode({
  id,
  data,
  selected,
}: {
  id: string;
  data: { label?: string; config?: { assistantId?: string; phoneNumberId?: string } };
  selected: boolean;
}) {
  const hasAssistant = !!data.config?.assistantId;

  return (
    <div
      className={`rounded-xl border-2 bg-white px-4 py-3 shadow-md w-52 ${
        selected ? "border-sky-500 shadow-sky-100" : "border-sky-200"
      }`}
    >
      <NodeToolbarActions id={id} selected={selected} accentColor="bg-sky-500" />
      <Handle type="target" position={Position.Top} className="!bg-sky-400" />

      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-sky-500">
          <Phone className="h-4 w-4 text-white" />
        </div>
        <div className="min-w-0">
          <span className="block text-sm font-semibold text-gray-800">
            {data.label || "VAPI Call"}
          </span>
          <span className="text-[11px] font-medium text-sky-600">Voice AI</span>
        </div>
      </div>

      {hasAssistant ? (
        <p className="mt-2 truncate rounded-md bg-sky-50 px-2 py-1 text-[11px] text-sky-800">
          Assistant configured ✓
        </p>
      ) : (
        <p className="mt-1 text-xs text-gray-400">No assistant set</p>
      )}

      <Handle type="source" position={Position.Bottom} className="!bg-sky-400" />
    </div>
  );
}
