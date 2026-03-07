import { useState } from "react";
import { Linkedin } from "lucide-react";

interface LinkedInConfig {
  message: string;
  subject: string;
  automationUrl: string;
}

interface Props {
  config: Partial<LinkedInConfig>;
  onChange: (config: LinkedInConfig) => void;
  onClose: () => void;
}

export default function LinkedInPanel({ config, onChange, onClose }: Props) {
  const [automationUrl, setAutomationUrl] = useState(config.automationUrl || "");
  const [subject, setSubject]             = useState(config.subject || "");
  const [message, setMessage]             = useState(config.message || "");

  const save = () => {
    onChange({ automationUrl: automationUrl.trim(), subject: subject.trim(), message: message.trim() });
    onClose();
  };

  return (
    <div className="space-y-4">
      <div className="rounded-lg bg-blue-50 border border-blue-100 px-3 py-2.5">
        <p className="text-xs text-blue-800 font-medium">LinkedIn Automation Webhook</p>
        <p className="text-[11px] text-blue-700 mt-0.5">
          POSTs the lead's data + your message to a LinkedIn automation service (Phantombuster, Expandi, 
          Dripify, etc). Configure them to send a connection request or InMail on receipt.
        </p>
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-gray-600">
          Automation Webhook URL <span className="text-red-500">*</span>
        </label>
        <input
          type="url"
          value={automationUrl}
          onChange={(e) => setAutomationUrl(e.target.value)}
          placeholder="https://your-automation-service.com/webhook/…"
          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
        />
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-gray-600">
          Subject / Connection Note
        </label>
        <input
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Hi {name}, I noticed you work at {company}…"
          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
        />
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-gray-600">
          Message Body
        </label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="I'd love to connect and discuss how we can help {company}…"
          rows={4}
          className="w-full resize-none rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
        />
        <p className="mt-1 text-[11px] text-gray-400">Supports {"{name}"}, {"{company}"}, {"{title}"} placeholders.</p>
      </div>

      <button
        onClick={save}
        disabled={!automationUrl.trim()}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-700 py-2.5 text-sm font-semibold text-white hover:bg-blue-800 disabled:opacity-40 transition"
      >
        <Linkedin className="h-4 w-4" />
        Save LinkedIn Node
      </button>
    </div>
  );
}
