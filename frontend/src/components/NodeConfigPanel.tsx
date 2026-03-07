import { X } from "lucide-react";
import UploadPanel from "./panels/UploadPanel";
import FilterPanel from "./panels/FilterPanel";
import AiMessagePanel from "./panels/AiMessagePanel";
import SendPanel from "./panels/SendPanel";
import DelayPanel from "./panels/DelayPanel";
import CallPanel from "./panels/CallPanel";

interface Props {
  node: {
    id: string;
    type: string;
    data: { label: string; config?: Record<string, unknown> };
  };
  workflowId: string | null;
  onUpdateConfig: (nodeId: string, config: Record<string, unknown>) => void;
  onClose: () => void;
}

const TYPE_LABELS: Record<string, string> = {
  upload: "Upload Leads",
  filter: "Filter",
  ai_message: "AI Message",
  send: "Send",
  delay: "Delay",
  call: "VAPI Call",
};

const TYPE_COLORS: Record<string, string> = {
  upload: "from-blue-500 to-blue-600",
  filter: "from-yellow-400 to-yellow-500",
  ai_message: "from-purple-500 to-purple-600",
  send: "from-green-500 to-green-600",
  delay: "from-orange-400 to-orange-500",
  call: "from-sky-500 to-sky-600",
};

export default function NodeConfigPanel({ node, workflowId, onUpdateConfig, onClose }: Props) {
  const config = node.data.config || {};

  const renderPanel = () => {
    switch (node.type) {
      case "upload":
        return (
          <UploadPanel workflowId={workflowId} onClose={onClose} />
        );
      case "filter":
        return (
          <FilterPanel
            config={config as { column?: string; operator?: string; value?: string }}
            onChange={(c) => onUpdateConfig(node.id, c as unknown as Record<string, unknown>)}
            onClose={onClose}
          />
        );
      case "ai_message":
        return (
          <AiMessagePanel
            config={config as { instructions?: string; template?: string }}
            onChange={(c) => onUpdateConfig(node.id, c as unknown as Record<string, unknown>)}
            onClose={onClose}
          />
        );
      case "send":
        return (
          <SendPanel
            config={config as { platform?: string; message?: string }}
            onChange={(c) => onUpdateConfig(node.id, c as unknown as Record<string, unknown>)}
            onClose={onClose}
          />
        );
      case "delay":
        return (
          <DelayPanel
            config={config as { min?: number; max?: number }}
            onChange={(c) => onUpdateConfig(node.id, c as unknown as Record<string, unknown>)}
            onClose={onClose}
          />
        );
      case "call":
        return (
          <CallPanel
            config={config as { assistantId?: string; phoneNumberId?: string }}
            onChange={(c) => onUpdateConfig(node.id, c as unknown as Record<string, unknown>)}
            onClose={onClose}
          />
        );
      default:
        return <p className="text-sm text-gray-500">No config for this node type.</p>;
    }
  };

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className={`flex items-center justify-between bg-gradient-to-r ${TYPE_COLORS[node.type] || "from-gray-500 to-gray-600"} px-4 py-3.5`}>
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-white/70">
            Configure Node
          </p>
          <p className="text-[15px] font-bold text-white">
            {TYPE_LABELS[node.type] || node.type}
          </p>
        </div>
        <button
          onClick={onClose}
          className="rounded-xl p-1.5 text-white/60 hover:bg-white/20 hover:text-white transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto p-4">{renderPanel()}</div>
    </div>
  );
}
