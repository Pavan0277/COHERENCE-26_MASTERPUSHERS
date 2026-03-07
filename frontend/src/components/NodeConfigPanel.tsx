import { X } from "lucide-react";
import UploadPanel from "./panels/UploadPanel";
import FilterPanel from "./panels/FilterPanel";
import AiMessagePanel from "./panels/AiMessagePanel";
import SendPanel from "./panels/SendPanel";
import DelayPanel from "./panels/DelayPanel";
import CallPanel from "./panels/CallPanel";
import WebhookPanel from "./panels/WebhookPanel";
import ConditionPanel from "./panels/ConditionPanel";
import TagPanel from "./panels/TagPanel";
import SmsPanel from "./panels/SmsPanel";
import ScorePanel from "./panels/ScorePanel";
import NotifyPanel from "./panels/NotifyPanel";
import SplitPanel from "./panels/SplitPanel";
import UpdateFieldPanel from "./panels/UpdateFieldPanel";
import AiClassifyPanel from "./panels/AiClassifyPanel";
import WhatsAppPanel from "./panels/WhatsAppPanel";
import LinkedInPanel from "./panels/LinkedInPanel";
import WaitUntilPanel from "./panels/WaitUntilPanel";
import TransformPanel from "./panels/TransformPanel";
import StopPanel from "./panels/StopPanel";
import EnrichPanel from "./panels/EnrichPanel";
import MeetingPanel from "./panels/MeetingPanel";
import HttpRequestPanel from "./panels/HttpRequestPanel";

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
  upload:       "Upload Leads",
  filter:       "Filter",
  ai_message:   "AI Message",
  send:         "Send",
  delay:        "Delay",
  call:         "VAPI Call",
  webhook:      "Webhook",
  condition:    "Condition",
  tag:          "Tag Lead",
  sms:          "Send SMS",
  score:        "Score Lead",
  notify:       "Notify",
  split:        "A/B Split",
  update_field: "Update Lead Field",
  ai_classify:  "AI Classify",
  whatsapp:     "WhatsApp",
  linkedin:     "LinkedIn",
  wait_until:   "Wait Until",
  transform:    "Data Transform",
  stop:         "Stop / End",
  enrich:       "Enrich Lead",
  meeting:      "Meeting Link",
  http_request: "HTTP Request",
};

const TYPE_COLORS: Record<string, string> = {
  upload:       "from-blue-500 to-blue-600",
  filter:       "from-yellow-400 to-yellow-500",
  ai_message:   "from-purple-500 to-purple-600",
  send:         "from-green-500 to-green-600",
  delay:        "from-orange-400 to-orange-500",
  call:         "from-sky-500 to-sky-600",
  webhook:      "from-rose-500 to-rose-600",
  condition:    "from-amber-400 to-amber-500",
  tag:          "from-indigo-500 to-indigo-600",
  sms:          "from-fuchsia-500 to-fuchsia-600",
  score:        "from-cyan-500 to-cyan-600",
  notify:       "from-emerald-500 to-emerald-600",
  split:        "from-violet-500 to-violet-600",
  update_field: "from-teal-500 to-teal-600",
  ai_classify:  "from-pink-500 to-pink-600",
  whatsapp:     "from-green-600 to-green-700",
  linkedin:     "from-blue-700 to-blue-800",
  wait_until:   "from-orange-500 to-orange-600",
  transform:    "from-stone-500 to-stone-600",
  stop:         "from-red-500 to-red-600",
  enrich:       "from-yellow-600 to-yellow-700",
  meeting:      "from-teal-600 to-teal-700",
  http_request: "from-gray-700 to-gray-800",
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
      case "webhook":
        return (
          <WebhookPanel
            config={config as { url?: string; method?: string }}
            onChange={(c) => onUpdateConfig(node.id, c as unknown as Record<string, unknown>)}
            onClose={onClose}
          />
        );
      case "condition":
        return (
          <ConditionPanel
            config={config as { column?: string; operator?: string; value?: string }}
            onChange={(c) => onUpdateConfig(node.id, c as unknown as Record<string, unknown>)}
            onClose={onClose}
          />
        );
      case "tag":
        return (
          <TagPanel
            config={config as { tag?: string; color?: string }}
            onChange={(c) => onUpdateConfig(node.id, c as unknown as Record<string, unknown>)}
            onClose={onClose}
          />
        );
      case "sms":
        return (
          <SmsPanel
            config={config as { message?: string; from?: string }}
            onChange={(c) => onUpdateConfig(node.id, c as unknown as Record<string, unknown>)}
            onClose={onClose}
          />
        );
      case "score":
        return (
          <ScorePanel
            config={config as { value?: number; operation?: "add" | "subtract" | "set" }}
            onChange={(c) => onUpdateConfig(node.id, c as unknown as Record<string, unknown>)}
            onClose={onClose}
          />
        );
      case "notify":
        return (
          <NotifyPanel
            config={config as { channel?: "email" | "slack"; message?: string; subject?: string }}
            onChange={(c) => onUpdateConfig(node.id, c as unknown as Record<string, unknown>)}
            onClose={onClose}
          />
        );
      case "split":
        return (
          <SplitPanel
            config={config as { percentage?: number }}
            onChange={(c) => onUpdateConfig(node.id, c as unknown as Record<string, unknown>)}
            onClose={onClose}
          />
        );
      case "update_field":
        return (
          <UpdateFieldPanel
            config={config as { field?: string; value?: string }}
            onChange={(c) => onUpdateConfig(node.id, c as unknown as Record<string, unknown>)}
            onClose={onClose}
          />
        );
      case "ai_classify":
        return (
          <AiClassifyPanel
            config={config as { instructions?: string; categories?: string[]; outputField?: string }}
            onChange={(c) => onUpdateConfig(node.id, c as unknown as Record<string, unknown>)}
            onClose={onClose}
          />
        );
      case "whatsapp":
        return (
          <WhatsAppPanel
            config={config as { message?: string; from?: string }}
            onChange={(c) => onUpdateConfig(node.id, c as unknown as Record<string, unknown>)}
            onClose={onClose}
          />
        );
      case "linkedin":
        return (
          <LinkedInPanel
            config={config as { automationUrl?: string; subject?: string; message?: string }}
            onChange={(c) => onUpdateConfig(node.id, c as unknown as Record<string, unknown>)}
            onClose={onClose}
          />
        );
      case "wait_until":
        return (
          <WaitUntilPanel
            config={config as { datetime?: string; timezone?: string }}
            onChange={(c) => onUpdateConfig(node.id, c as unknown as Record<string, unknown>)}
            onClose={onClose}
          />
        );
      case "transform":
        return (
          <TransformPanel
            config={config as { field?: string; operation?: string; find?: string; replace?: string; template?: string; outputField?: string }}
            onChange={(c) => onUpdateConfig(node.id, c as unknown as Record<string, unknown>)}
            onClose={onClose}
          />
        );
      case "stop":
        return (
          <StopPanel
            config={config as { reason?: string; status?: string }}
            onChange={(c) => onUpdateConfig(node.id, c as unknown as Record<string, unknown>)}
            onClose={onClose}
          />
        );
      case "enrich":
        return (
          <EnrichPanel
            config={config as { provider?: string; apiKey?: string; lookupField?: string }}
            onChange={(c) => onUpdateConfig(node.id, c as unknown as Record<string, unknown>)}
            onClose={onClose}
          />
        );
      case "meeting":
        return (
          <MeetingPanel
            config={config as { platform?: string; url?: string; message?: string; channel?: string }}
            onChange={(c) => onUpdateConfig(node.id, c as unknown as Record<string, unknown>)}
            onClose={onClose}
          />
        );
      case "http_request":
        return (
          <HttpRequestPanel
            config={config as { url?: string; method?: string; headers?: string; body?: string; outputField?: string }}
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
