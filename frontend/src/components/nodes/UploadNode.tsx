import { Handle, Position } from "@xyflow/react";
import { Upload, CheckCircle2, AlertCircle } from "lucide-react";
import { useWorkflow } from "../../store/workflowStore";
import NodeToolbarActions from "./NodeToolbarActions";

export default function UploadNode({ id, data, selected }: Readonly<{ id: string; data: { label?: string }; selected: boolean }>) {
  const { detectedColumns } = useWorkflow();
  const cols = Object.entries(detectedColumns);
  const isConfigured = cols.length > 0;

  return (
    <div className="relative select-none animate-node-enter" style={{ width: 260 }}>
      <NodeToolbarActions id={id} selected={selected} accentColor="bg-blue-500" />

      {/* Header card box — only icon + title + subtitle inside */}
      <div
        className={`flex items-center gap-3 rounded-2xl bg-white px-4 py-3 transition-all duration-200 ${
          selected
            ? "shadow-xl shadow-blue-100/60 ring-2 ring-blue-400"
            : "shadow-md ring-1 ring-slate-200 hover:-translate-y-0.5 hover:shadow-xl"
        }`}
      >
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500 shadow-sm shadow-blue-200">
          <Upload className="h-5 w-5 text-white" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[14px] font-bold leading-tight text-slate-900">
            {data.label || "Upload Leads"}
          </p>
          <p className="text-[11px] text-slate-400">Import Node</p>
        </div>
      </div>

      {/* Content outside the box */}
      <div className="px-1 pt-3 space-y-2">
        {isConfigured ? (
          <div className="space-y-1">
            {cols.slice(0, 3).map(([field, col]) => (
              <p key={field} className="text-[12px] text-slate-500">
                <span className="font-medium text-slate-700">{field}</span>
                <span className="text-slate-400"> ← "{col}"</span>
              </p>
            ))}
            {cols.length > 3 && (
              <p className="text-[11px] text-slate-400">+{cols.length - 3} more columns</p>
            )}
          </div>
        ) : (
          <p className="text-[12px] leading-relaxed text-slate-500">
            Import leads from a CSV or Excel file to start your automation.
          </p>
        )}
        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
          isConfigured ? "bg-blue-50 text-blue-600" : "bg-slate-100 text-slate-500"
        }`}>
          {isConfigured
            ? <><CheckCircle2 className="h-3 w-3" />{cols.length} columns mapped</>
            : <><AlertCircle className="h-3 w-3" />Unassigned</>
          }
        </span>
      </div>

      <Handle type="source" position={Position.Right} style={{ top: 28 }} className="!bg-blue-400 !w-3 !h-3 !border-2 !border-white !shadow-md" />
    </div>
  );
}