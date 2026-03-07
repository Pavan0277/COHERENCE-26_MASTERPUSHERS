import { Handle, Position } from "@xyflow/react";
import { Upload, Play } from "lucide-react";
import { useWorkflow } from "../../store/workflowStore";
import NodeToolbarActions from "./NodeToolbarActions";

export default function UploadNode({ id, data, selected }: Readonly<{ id: string; data: { label?: string }; selected: boolean }>) {
  const { detectedColumns } = useWorkflow();
  const cols = Object.entries(detectedColumns);
  const isConfigured = cols.length > 0;

  return (
    <div className="relative select-none" style={{ width: 300 }}>
      {/* Left floating run button */}
      <div className="absolute -left-4 top-5 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-gray-900 shadow-lg">
        <Play className="h-3.5 w-3.5 ml-0.5 text-white" />
      </div>

      <NodeToolbarActions id={id} selected={selected} accentColor="bg-blue-500" />

      {/* Card */}
      <div
        className={`rounded-2xl bg-white transition-all duration-150 ${
          selected
            ? "border-2 border-blue-400 shadow-xl shadow-blue-100/60"
            : "border-2 border-gray-200 shadow-md hover:shadow-lg"
        }`}
      >
        {/* Header */}
        <div className="flex items-center gap-3 px-5 pt-4 pb-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-500 shadow-sm shadow-blue-200">
            <Upload className="h-6 w-6 text-white" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-base font-bold leading-tight text-gray-900">
              {data.label || "Upload Leads"}
            </p>
            <p className="mt-0.5 text-xs text-gray-400">Import Node</p>
          </div>
        </div>

        <div className="h-px bg-gray-100" />

        {/* Body */}
        <div className="px-5 py-3">
          {isConfigured ? (
            <div className="space-y-1.5">
              {cols.slice(0, 3).map(([field, col]) => (
                <p key={field} className="text-sm text-gray-500">
                  <span className="font-medium text-gray-700">{field}</span>
                  <span className="text-gray-400"> ← "{col as string}"</span>
                </p>
              ))}
            </div>
          ) : (
            <p className="text-sm leading-relaxed text-gray-500">
              Import leads from a CSV or Excel file to start your automation.
            </p>
          )}
        </div>

        {/* Footer badge */}
        <div className="px-5 pb-4">
          <span className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${
            isConfigured ? "bg-blue-50 text-blue-600" : "bg-gray-100 text-gray-500"
          }`}>
            {isConfigured ? `${cols.length} columns mapped` : "Unassigned"}
          </span>
        </div>

        <Handle type="source" position={Position.Bottom} className="!bg-blue-400 !w-3 !h-3 !border-2 !border-white" />
      </div>
    </div>
  );
}