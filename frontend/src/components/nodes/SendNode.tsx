import { Handle, Position } from "@xyflow/react";
import { Send, Mail, MessageSquare, Play } from "lucide-react";
import NodeToolbarActions from "./NodeToolbarActions";

const PLATFORM_ICONS: Record<string, React.ReactNode> = {
  email:    <Mail          className="h-6 w-6 text-white" />,
  slack:    <MessageSquare className="h-6 w-6 text-white" />,
  telegram: <Send          className="h-6 w-6 text-white" />,
};

const PLATFORM_LABELS: Record<string, string> = {
  email: "Email", slack: "Slack", telegram: "Telegram",
};

const PLATFORM_BG: Record<string, string> = {
  email:    "bg-blue-500 shadow-blue-200",
  slack:    "bg-pink-500 shadow-pink-200",
  telegram: "bg-sky-500 shadow-sky-200",
};

const PLATFORM_BADGE: Record<string, string> = {
  email:    "bg-blue-50 text-blue-600",
  slack:    "bg-pink-50 text-pink-600",
  telegram: "bg-sky-50 text-sky-600",
};

export default function SendNode({
  id,
  data,
  selected,
}: Readonly<{
  id: string;
  data: { label?: string; config?: { platform?: string; message?: string } };
  selected: boolean;
}>) {
  const platform = data.config?.platform || "email";
  const message  = data.config?.message  || "";

  return (
    <div className="relative select-none" style={{ width: 300 }}>
      <NodeToolbarActions id={id} selected={selected} accentColor="bg-orange-500" />

      {/* Card box — header only */}
      <div
        className={`relative rounded-2xl bg-white transition-all duration-150 ${
          selected
            ? "border-2 border-orange-400 shadow-xl shadow-orange-100/60"
            : "border-2 border-gray-200 shadow-md hover:shadow-lg"
        }`}
      >
        {/* Play button on left edge of card */}
        <div className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-gray-900 shadow-lg">
          <Play className="h-3.5 w-3.5 ml-0.5 text-white" />
        </div>

        <Handle type="target" position={Position.Top} className="!bg-orange-400 !w-3 !h-3 !border-2 !border-white" />
        <Handle type="source" position={Position.Bottom} className="!bg-orange-400 !w-3 !h-3 !border-2 !border-white" />

        <div className="flex items-center gap-3 px-5 py-4">
          <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl shadow-sm ${
            PLATFORM_BG[platform] ?? PLATFORM_BG.email
          }`}>
            {PLATFORM_ICONS[platform] ?? <Send className="h-6 w-6 text-white" />}
          </div>
          <div className="min-w-0">
            <p className="truncate text-base font-bold leading-tight text-gray-900">
              {data.label || "Send Message"}
            </p>
            <p className="mt-0.5 text-xs text-gray-400">Action Node</p>
          </div>
        </div>
      </div>

      {/* Body + badge — outside the box */}
      <div className="px-1 pt-3">
        {message ? (
          <p className="line-clamp-3 text-sm leading-relaxed text-gray-500">{message}</p>
        ) : (
          <p className="text-sm leading-relaxed text-gray-500">
            Send a message via {PLATFORM_LABELS[platform] ?? platform} to each matched lead.
          </p>
        )}
        <div className="mt-2">
          <span className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${
            PLATFORM_BADGE[platform] ?? PLATFORM_BADGE.email
          }`}>
            {PLATFORM_LABELS[platform] ?? platform}
          </span>
        </div>
      </div>
    </div>
  );
}
