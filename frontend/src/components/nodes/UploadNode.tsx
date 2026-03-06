import { Handle, Position } from "@xyflow/react";
import { Upload, CheckCircle2 } from "lucide-react";
import { useWorkflow } from "../../store/workflowStore";
import NodeToolbarActions from "./NodeToolbarActions";

export default function UploadNode({ id, data, selected }: { id: string; data: { label?: string }; selected: boolean }) {
  const { detectedColumns } = useWorkflow();
  const colCount = Object.keys(detectedColumns).length;

  return (
    <div
      className={`rounded-xl border-2 bg-white px-4 py-3 shadow-md w-52 ${
        selected ? "border-blue-500 shadow-blue-100" : "border-blue-200"
      }`}
    >
      <NodeToolbarActions id={id} selected={selected} accentColor="bg-blue-500" />

      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-500">
          <Upload className="h-4 w-4 text-white" />
        </div>
        <span className="text-sm font-semibold text-gray-800">
          {data.label || "Upload Leads"}
        </span>
      </div>

      {colCount > 0 ? (
        <div className="mt-2 space-y-1">
          {Object.entries(detectedColumns).map(([field, col]) => (
            <div key={field} className="flex items-center gap-1.5 text-xs text-gray-500">
              <CheckCircle2 className="h-3 w-3 text-blue-500 shrink-0" />
              <span className="font-medium text-gray-700">{field}</span>
              <span className="text-gray-400 truncate">&larr; &ldquo;{col}&rdquo;</span>
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-1 text-xs text-gray-400">CSV / Excel — click to configure</p>
      )}

      <Handle type="source" position={Position.Bottom} className="!bg-blue-400" />
    </div>
  );
}
