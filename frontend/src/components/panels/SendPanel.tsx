import { useState, useRef } from "react";
import { Mail, MessageSquare, Send, Check } from "lucide-react";

interface SendConfig {
  platform: string;
  message: string;
}

interface Props {
  config: Partial<SendConfig>;
  onChange: (config: SendConfig) => void;
  onClose: () => void;
}

const PLATFORMS = [
  { value: "email",    label: "Email",    icon: Mail },
  { value: "slack",    label: "Slack",    icon: MessageSquare },
  { value: "telegram", label: "Telegram", icon: Send },
];

const VARIABLES = ["{{name}}", "{{company}}", "{{title}}"];

const SAMPLE_LEAD = { name: "Alex Johnson", company: "Acme Corp", title: "VP of Sales" };

const DEFAULT_TEMPLATE = `Hi {{name}},\n\nI noticed you're working at {{company}} as {{title}}.\n\nI'd love to connect and share how we can help.\n\nBest,\nThe Team`;

export default function SendPanel({ config, onChange, onClose }: Props) {
  const [platform, setPlatform] = useState(config.platform || "email");
  const [message, setMessage]   = useState(config.message  || DEFAULT_TEMPLATE);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const insertVariable = (v: string) => {
    const el = textareaRef.current;
    if (!el) { setMessage((m) => m + v); return; }
    const start = el.selectionStart ?? message.length;
    const end   = el.selectionEnd   ?? message.length;
    const next  = message.slice(0, start) + v + message.slice(end);
    setMessage(next);
    // Restore cursor after React re-render
    requestAnimationFrame(() => {
      el.selectionStart = el.selectionEnd = start + v.length;
      el.focus();
    });
  };

  const preview = message
    .replace(/\{\{name\}\}/g,    SAMPLE_LEAD.name)
    .replace(/\{\{company\}\}/g, SAMPLE_LEAD.company)
    .replace(/\{\{title\}\}/g,   SAMPLE_LEAD.title);

  const save = () => {
    onChange({ platform, message });
    onClose();
  };

  return (
    <div className="space-y-4">

      {/* Platform selector */}
      <div>
        <label className="mb-1.5 block text-xs font-medium text-gray-600">Platform</label>
        <div className="grid grid-cols-3 gap-2">
          {PLATFORMS.map(({ value, label, icon: Icon }) => (
            <button
              key={value}
              onClick={() => setPlatform(value)}
              className={`flex flex-col items-center gap-1 rounded-xl border-2 py-2.5 text-xs font-medium transition ${
                platform === value
                  ? "border-green-500 bg-green-50 text-green-700"
                  : "border-gray-200 text-gray-500 hover:border-green-300 hover:text-green-600"
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Message template editor */}
      <div>
        <div className="mb-1.5 flex items-center justify-between">
          <label className="text-xs font-medium text-gray-600">Message Template</label>
          <div className="flex gap-1">
            {VARIABLES.map((v) => (
              <button
                key={v}
                onClick={() => insertVariable(v)}
                className="rounded bg-green-100 px-1.5 py-0.5 font-mono text-[10px] text-green-700 hover:bg-green-200 transition"
              >
                {v}
              </button>
            ))}
          </div>
        </div>
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={7}
          className="w-full resize-none rounded-lg border border-gray-200 p-3 font-mono text-xs focus:border-green-400 focus:outline-none"
        />
      </div>

      {/* Live preview */}
      <div className="rounded-lg border border-green-100 bg-green-50 p-3">
        <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-green-600">
          Preview — {SAMPLE_LEAD.name} @ {SAMPLE_LEAD.company}
        </p>
        <p className="whitespace-pre-wrap text-xs text-green-900">{preview}</p>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={save}
          disabled={!message.trim()}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50 transition"
        >
          <Check className="h-4 w-4" /> Save
        </button>
        <button
          onClick={onClose}
          className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 transition"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
