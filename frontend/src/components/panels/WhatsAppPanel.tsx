import { useState } from "react";
import { MessageCircle } from "lucide-react";

interface WhatsAppConfig {
  message: string;
  from: string;
}

interface Props {
  config: Partial<WhatsAppConfig>;
  onChange: (config: WhatsAppConfig) => void;
  onClose: () => void;
}

export default function WhatsAppPanel({ config, onChange, onClose }: Props) {
  const [message, setMessage] = useState(config.message || "");
  const [from, setFrom] = useState(config.from || "");

  const save = () => {
    onChange({ message: message.trim(), from: from.trim() });
    onClose();
  };

  return (
    <div className="space-y-4">
      <div className="rounded-lg bg-green-50 border border-green-100 px-3 py-2.5">
        <p className="text-xs text-green-700 font-medium">WhatsApp via Twilio</p>
        <p className="text-[11px] text-green-600 mt-0.5">
          Sends a WhatsApp message to the lead's <strong>phone</strong> field using your Twilio account.
          Ensure your Twilio number is WhatsApp-enabled.
        </p>
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-gray-600">
          Message <span className="text-red-500">*</span>
        </label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Hi {name}, saw you work at {company}…"
          rows={4}
          maxLength={1600}
          className="w-full resize-none rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-green-500 focus:outline-none"
        />
        <p className="mt-1 text-[11px] text-gray-400">{message.length}/1600 · supports {"{name}"}, {"{company}"} etc.</p>
      </div>

      <div className="rounded-lg bg-gray-50 border border-gray-100 px-3 py-2">
        <p className="text-[11px] text-gray-500">
          <strong>Tip:</strong> Leave empty and place an <em>AI Message</em> node before this to use AI-generated text.
        </p>
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-gray-600">
          From Number <span className="text-gray-400 font-normal">(optional override)</span>
        </label>
        <input
          type="text"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
          placeholder="+1415XXXXXXX (leave blank to use Settings default)"
          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-green-500 focus:outline-none"
        />
      </div>

      <button
        onClick={save}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-green-600 py-2.5 text-sm font-semibold text-white hover:bg-green-700 transition"
      >
        <MessageCircle className="h-4 w-4" />
        Save WhatsApp Node
      </button>
    </div>
  );
}
