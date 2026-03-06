import { Handle, Position } from "@xyflow/react";
import { Send, Mail, MessageSquare } from "lucide-react";
import NodeToolbarActions from "./NodeToolbarActions";

const PLATFORM_ICONS: Record<string, React.ReactNode> = {
  email:    <Mail          className="h-4 w-4 text-white" />,
  slack:    <MessageSquare className="h-4 w-4 text-white" />,
  telegram: <Send          className="h-4 w-4 text-white" />,
};

const PLATFORM_LABELS: Record<string, string> = {
  email: "Email", slack: "Slack", telegram: "Telegram",
};

export default function SendNode({
  id,
  data,
  selected,
}: {
  id: string;
  data: { label?: string; config?: { platform?: string; message?: string } };
  selected: boolean;
}) {
  const platform = data.config?.platform || "email";
  const message  = data.config?.message  || "";

  return (
    <div
      className={`rounded-xl border-2 bg-white px-4 py-3 shadow-md w-52 ${
        selected ? "border-orange-500 shadow-orange-100" : "border-orange-200"
      }`}
    >
      <NodeToolbarActions id={id} selected={selected} accentColor="bg-orange-500" />
      <Handle type="target" position={Position.Top} className="!bg-orange-400" />

      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-orange-500">
          {PLATFORM_ICONS[platform] ?? <Send className="h-4 w-4 text-white" />}
        </div>
        <div className="min-w-0">
          <span className="block text-sm font-semibold text-gray-800">
            {data.label || "Send Message"}
          </span>
          <span className="text-[11px] font-medium capitalize text-orange-600">
            {PLATFORM_LABELS[platform] ?? platform}
          </span>
        </div>
      </div>

      {message ? (
        <p className="mt-2 line-clamp-2 rounded-md bg-orange-50 px-2 py-1 text-[11px] leading-tight text-orange-800">
          {message}
        </p>
      ) : (
        <p className="mt-1 text-xs text-gray-400">No message set</p>
      )}

      <Handle type="source" position={Position.Bottom} className="!bg-orange-400" />
    </div>
  );
}
