import { Handle, Position } from "@xyflow/react";
import { Send, Mail, MessageSquare, CheckCircle2 } from "lucide-react";
import NodeToolbarActions from "./NodeToolbarActions";

const PLATFORM_META: Record<string, {
  label: string;
  icon: React.ReactNode;
  bg: string;
  ring: string;
  badge: string;
  bar: string;
}> = {
  email:    { label: "Email",    icon: <Mail className="h-5 w-5 text-white" />,          bg: "bg-blue-500 shadow-blue-200",  ring: "ring-blue-400",  badge: "bg-blue-50 text-blue-600",   bar: "bg-blue-500"   },
  slack:    { label: "Slack",    icon: <MessageSquare className="h-5 w-5 text-white" />, bg: "bg-pink-500 shadow-pink-200",  ring: "ring-pink-400",  badge: "bg-pink-50 text-pink-600",   bar: "bg-pink-500"   },
  telegram: { label: "Telegram", icon: <Send className="h-5 w-5 text-white" />,          bg: "bg-sky-500 shadow-sky-200",    ring: "ring-sky-400",   badge: "bg-sky-50 text-sky-600",     bar: "bg-sky-500"    },
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
  const meta     = PLATFORM_META[platform] ?? PLATFORM_META.email;

  return (
    <div className="relative select-none animate-node-enter" style={{ width: 260 }}>
      <NodeToolbarActions id={id} selected={selected} accentColor="bg-orange-500" />

      <Handle type="target" position={Position.Left} style={{ top: 28 }} className="!bg-orange-400 !w-3 !h-3 !border-2 !border-white !shadow-md" />

      {/* Header card box — only icon + title + subtitle inside */}
      <div
        className={`flex items-center gap-3 rounded-2xl bg-white px-4 py-3 transition-all duration-200 ${
          selected
            ? `shadow-xl ring-2 ${meta.ring}`
            : "shadow-md ring-1 ring-slate-200 hover:-translate-y-0.5 hover:shadow-xl"
        }`}
      >
        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl shadow-sm ${meta.bg}`}>
          {meta.icon}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[14px] font-bold leading-tight text-slate-900">
            {data.label || "Send Message"}
          </p>
          <p className="text-[11px] text-slate-400">Action Node</p>
        </div>
      </div>

      {/* Content outside the box */}
      <div className="px-1 pt-3 space-y-2">
        {message ? (
          <p className="line-clamp-2 text-[12px] leading-relaxed text-slate-500">{message}</p>
        ) : (
          <p className="text-[12px] leading-relaxed text-slate-500">
            Send a message via {meta.label} to each matched lead.
          </p>
        )}
        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${meta.badge}`}>
          <CheckCircle2 className="h-3 w-3" />{meta.label}
        </span>
      </div>

      <Handle type="source" position={Position.Right} style={{ top: 28 }} className="!bg-orange-400 !w-3 !h-3 !border-2 !border-white !shadow-md" />
    </div>
  );
}
