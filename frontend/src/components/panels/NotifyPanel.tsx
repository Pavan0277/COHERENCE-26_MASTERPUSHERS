import { useState } from "react";
import { Mail, MessageSquare } from "lucide-react";

interface NotifyConfig {
  channel: "email" | "slack";
  message: string;
  subject: string;
}

interface Props {
  config: Partial<NotifyConfig>;
  onChange: (config: NotifyConfig) => void;
  onClose: () => void;
}

const CHANNEL_OPTIONS = [
  { value: "email", label: "Email",  icon: Mail,          description: "Send to your configured SMTP email" },
  { value: "slack", label: "Slack",  icon: MessageSquare, description: "Post to your Slack webhook channel" },
];

const QUICK_MESSAGES = [
  "Lead {name} from {company} has entered this workflow step.",
  "High-priority lead {name} ({email}) reached the notification step.",
  "New lead alert: {name} — {title} at {company}.",
  "Lead {name} completed the workflow stage.",
];

export default function NotifyPanel({ config, onChange, onClose }: Props) {
  const [channel, setChannel] = useState<NotifyConfig["channel"]>(config.channel ?? "email");
  const [message, setMessage] = useState(config.message ?? "");
  const [subject, setSubject] = useState(config.subject ?? "Workflow Notification — {name}");

  const save = () => {
    onChange({ channel, message: message.trim(), subject: subject.trim() });
    onClose();
  };

  return (
    <div className="space-y-4">

      {/* Info */}
      <div className="rounded-lg bg-emerald-50 border border-emerald-100 px-3 py-2.5">
        <p className="text-xs text-emerald-700 font-medium">Internal Notification</p>
        <p className="text-[11px] text-emerald-600 mt-0.5">
          Sends an alert to <strong>you</strong> (not the lead). Useful for monitoring important steps.
        </p>
      </div>

      {/* Channel */}
      <div>
        <label className="mb-1.5 block text-xs font-medium text-gray-600">Notify via</label>
        <div className="grid grid-cols-2 gap-2">
          {CHANNEL_OPTIONS.map((opt) => {
            const Icon = opt.icon;
            return (
              <button
                key={opt.value}
                onClick={() => setChannel(opt.value as NotifyConfig["channel"])}
                className={`flex flex-col items-start gap-1 rounded-lg border p-2.5 text-left transition ${
                  channel === opt.value
                    ? "border-emerald-400 bg-emerald-500 text-white"
                    : "border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="text-xs font-semibold">{opt.label}</span>
                <span className={`text-[10px] leading-tight ${channel === opt.value ? "text-white/80" : "text-gray-400"}`}>
                  {opt.description}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Subject (email only) */}
      {channel === "email" && (
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600">Subject</label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Workflow Notification — {name}"
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-emerald-400 focus:outline-none"
          />
        </div>
      )}

      {/* Message */}
      <div>
        <label className="mb-1 block text-xs font-medium text-gray-600">
          Message <span className="text-red-500">*</span>
        </label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Lead {name} from {company} has reached this step."
          rows={3}
          className="w-full resize-none rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-emerald-400 focus:outline-none"
        />
      </div>

      {/* Quick picks */}
      <div>
        <p className="mb-1.5 text-[11px] font-medium text-gray-500">Quick messages</p>
        <div className="space-y-1">
          {QUICK_MESSAGES.map((qm) => (
            <button
              key={qm}
              onClick={() => setMessage(qm)}
              className="block w-full rounded-lg border border-gray-200 px-2.5 py-1.5 text-left text-[11px] text-gray-600 hover:bg-emerald-50 hover:border-emerald-200 transition"
            >
              {qm}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-lg bg-gray-50 border border-gray-100 px-3 py-2">
        <p className="text-[11px] text-gray-500">
          Use <code className="text-emerald-600">{"{name}"}</code>, <code className="text-emerald-600">{"{email}"}</code>, <code className="text-emerald-600">{"{company}"}</code> as placeholders.
        </p>
      </div>

      <button
        onClick={save}
        className="w-full rounded-lg bg-emerald-500 py-2.5 text-sm font-semibold text-white hover:bg-emerald-600 transition"
      >
        Save Notify Node
      </button>
    </div>
  );
}
