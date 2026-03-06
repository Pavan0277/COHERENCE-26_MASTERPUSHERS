import { NodeToolbar, Position } from "@xyflow/react";
import { Trash2, Copy, Settings2 } from "lucide-react";
import { useWorkflow } from "../../store/workflowStore";

interface Props {
  id: string;
  selected: boolean;
  accentColor: string; // tailwind bg class e.g. "bg-blue-500"
  onEdit?: () => void;
}

export default function NodeToolbarActions({ id, selected, accentColor, onEdit }: Props) {
  const { removeNode, duplicateNode } = useWorkflow();

  return (
    <NodeToolbar isVisible={selected} position={Position.Top} offset={6}>
      <div className="flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-1.5 py-1 shadow-md">
        {onEdit && (
          <button
            onClick={onEdit}
            title="Configure"
            className="flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-gray-600 hover:bg-gray-100 transition"
          >
            <Settings2 className="h-3.5 w-3.5" /> Edit
          </button>
        )}
        <button
          onClick={() => duplicateNode(id)}
          title="Duplicate"
          className="flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-gray-600 hover:bg-gray-100 transition"
        >
          <Copy className="h-3.5 w-3.5" /> Clone
        </button>
        <div className="h-4 w-px bg-gray-200" />
        <button
          onClick={() => removeNode(id)}
          title="Delete"
          className="flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-red-500 hover:bg-red-50 transition"
        >
          <Trash2 className="h-3.5 w-3.5" /> Delete
        </button>
      </div>
    </NodeToolbar>
  );
}
