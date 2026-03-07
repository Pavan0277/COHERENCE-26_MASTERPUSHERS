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
      {/* Left floating run button */}
      <div className="absolute -left-4 top-5 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-gray-900 shadow-lg">
        <Play className="h-3.5 w-3.5 ml-0.5 text-white" />
      </div>

      <NodeToolbarActions id={id} selected={selected} accentColor="bg-orange-500" />

      {/* Card */}
      <div
        className={`rounded-2xl bg-white transition-all duration-150 ${
          selected
            ? "border-2 border-orange-400 shadow-xl shadow-orange-100/60"
            : "border-2 border-gray-200 shadow-md hover:shadow-lg"
        }`}
      >
        <Handle type="target" position={Position.Top} className="!bg-orange-400 !w-3 !h-3 !border-2 !border-white" />

        {/* Header */}
        <div className="flex items-center gap-3 px-5 pt-4 pb-3">
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

        <div className="h-px bg-gray-100" />

        {/* Body */}
        <div className="px-5 py-3">
          {message ? (
            <p className="line-clamp-3 text-sm leading-relaxed text-gray-500">{message}</p>
          ) : (
            <p className="text-sm leading-relaxed text-gray-500">
              Send a message via {PLATFORM_LABELS[platform] ?? platform} to each matched lead.
            </p>
          )}
        </div>

        {/* Footer badge */}
        <div className="px-5 pb-4">
          <span className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${
            PLATFORM_BADGE[platform] ?? PLATFORM_BADGE.email
          }`}>
            {PLATFORM_LABELS[platform] ?? platform}
          </span>
        </div>

        <Handle type="source" position={Position.Bottom} className="!bg-orange-400 !w-3 !h-3 !border-2 !border-white" />
      </div>
    </div>
  );
}

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
  const styles   = PLATFORM_STYLES[platform] ?? PLATFORM_STYLES.email;

  return (
    <div
      className={`w-72 rounded-2xl bg-white overflow-hidden select-none transition-all duration-150 ${
        selected
          ? "border-2 border-orange-400 shadow-xl shadow-orange-100/60"
          : "border-2 border-orange-100 shadow-md hover:shadow-lg"
      }`}
    >
      <NodeToolbarActions id={id} selected={selected} accentColor="bg-orange-500" />
      <Handle type="target" position={Position.Top} className="!bg-orange-400 !w-3 !h-3 !border-2 !border-white" />

      {/* Header */}
      <div className="flex items-center gap-3 px-5 pt-4 pb-3">
        <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl shadow-sm ${styles.icon}`}>
          {PLATFORM_ICONS[platform] ?? <Send className="h-6 w-6 text-white" />}
        </div>
        <div className="min-w-0">
          <p className="truncate text-[15px] font-semibold leading-tight text-gray-900">
            {data.label || "Send Message"}
          </p>
          <p className="mt-0.5 text-xs text-gray-400">Action Node</p>
        </div>
      </div>

      <div className="h-px bg-gray-100" />

      {/* Body */}
      <div className="px-5 py-3">
        {message ? (
          <p className="line-clamp-2 rounded-lg bg-orange-50 px-3 py-2 text-xs leading-snug text-orange-800">
            {message}
          </p>
        ) : (
          <p className="text-sm leading-snug text-gray-400">
            Send a message via {PLATFORM_LABELS[platform] ?? platform} to each matched lead.
          </p>
        )}
      </div>

      {/* Footer badge */}
      <div className="flex items-center px-5 pb-4 pt-1">
        <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${styles.badge}`}>
          <CheckCircle2 className="h-3 w-3" />
          {PLATFORM_LABELS[platform] ?? platform}
        </span>
      </div>

      <Handle type="source" position={Position.Bottom} className="!bg-orange-400 !w-3 !h-3 !border-2 !border-white" />
    </div>
  );
}
