import { useState } from "react";

interface SmsConfig {
  message: string;
  from: string;
}

interface Props {
  config: Partial<SmsConfig>;
  onChange: (config: SmsConfig) => void;
  onClose: () => void;
}

export default function SmsPanel({ config, onChange, onClose }: Props) {
  const [message, setMessage] = useState(config.message || "");
  const [from, setFrom]       = useState(config.from    || "");

  const save = () => {
    onChange({ message: message.trim(), from: from.trim() });
    onClose();
  };

  return (
    <div className="space-y-4">

      {/* Info */}
      <div className="rounded-lg bg-fuchsia-50 border border-fuchsia-100 px-3 py-2.5">
        <p className="text-xs text-fuchsia-700 font-medium">Twilio SMS</p>
        <p className="text-[11px] text-fuchsia-600 mt-0.5">
          Sends an SMS to the lead's <strong>phone</strong> field. Ensure Twilio credentials are set in Settings.
        </p>
      </div>

      {/* Message */}
      <div>
        <label className="mb-1 block text-xs font-medium text-gray-600">
          Message <span className="text-red-500">*</span>
        </label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Hi {name}, we wanted to reach out about {company}…"
          rows={4}
          maxLength={1600}
          className="w-full resize-none rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-fuchsia-400 focus:outline-none"
        />
        <p className="mt-1 text-[11px] text-gray-400">{message.length}/1600 characters</p>
      </div>

      {/* Note about AI message */}
      <div className="rounded-lg bg-gray-50 border border-gray-100 px-3 py-2">
        <p className="text-[11px] text-gray-500">
          <strong>Tip:</strong> Leave message empty and place an <em>AI Message</em> node before this — the AI-generated text will be used automatically.
        </p>
      </div>

      {/* From number (optional) */}
      <div>
        <label className="mb-1 block text-xs font-medium text-gray-600">
          From Number <span className="text-gray-400">(optional override)</span>
        </label>
        <input
          type="text"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
          placeholder="+1415XXXXXXX (leave blank to use Settings default)"
          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-fuchsia-400 focus:outline-none"
        />
      </div>

      <button
        onClick={save}
        className="w-full rounded-lg bg-fuchsia-500 py-2.5 text-sm font-semibold text-white hover:bg-fuchsia-600 transition"
      >
        Save SMS Node
      </button>
    </div>
  );
}
