import { NodeToolbar, Position } from "@xyflow/react";
import { Trash2, Copy } from "lucide-react";
import { useWorkflow } from "../../store/workflowStore";

interface Props {
  id: string;
  selected: boolean;
  accentColor: string;
  onEdit?: () => void;
}

export default function NodeToolbarActions({ id, selected, onEdit, accentColor: _accentColor }: Readonly<Props>) {
  const { removeNode, duplicateNode } = useWorkflow();

  return (
    <NodeToolbar isVisible={selected} position={Position.Top} offset={8}>
      <div className="flex items-center gap-0.5 rounded-xl border border-slate-200 bg-white px-1 py-1 shadow-xl shadow-slate-200/60">
        {onEdit && (
          <button
            onClick={onEdit}
            className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[12px] font-medium text-slate-600 hover:bg-slate-100 transition-colors"
          >
            Edit
          </button>
        )}
        <button
          onClick={() => duplicateNode(id)}
          title="Duplicate"
          className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[12px] font-medium text-slate-600 hover:bg-slate-100 transition-colors"
        >
          <Copy className="h-3.5 w-3.5" /> Clone
        </button>
        <div className="mx-0.5 h-4 w-px bg-slate-200" />
        <button
          onClick={() => removeNode(id)}
          title="Delete"
          className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[12px] font-medium text-red-500 hover:bg-red-50 transition-colors"
        >
          <Trash2 className="h-3.5 w-3.5" /> Delete
        </button>
      </div>
    </NodeToolbar>
  );
}
