import { useState } from "react";
import { Phone } from "lucide-react";

interface CallConfig {
  assistantId: string;
  phoneNumberId: string;
}

interface Props {
  config: Partial<CallConfig>;
  onChange: (config: CallConfig) => void;
  onClose: () => void;
}

export default function CallPanel({ config, onChange, onClose }: Props) {
  const [assistantId,  setAssistantId]  = useState(config.assistantId  || "");
  const [phoneNumberId, setPhoneNumberId] = useState(config.phoneNumberId || "");

  const save = () => {
    onChange({ assistantId, phoneNumberId });
    onClose();
  };

  return (
    <div className="space-y-5 p-1">
      <div className="rounded-xl border border-sky-100 bg-sky-50 px-4 py-3 text-xs text-sky-700">
        <strong>VAPI Voice AI</strong> — place an AI-powered outbound call to each lead's phone
        number.{" "}
        <span className="font-semibold">
          Global defaults are set in{" "}
          <a href="/settings" className="underline">
            Settings → VAPI
          </a>
          .
        </span>{" "}
        Fill below only to override for this specific node.
      </div>

      {/* Assistant ID */}
      <div>
        <label className="mb-1.5 block text-xs font-medium text-gray-600">
          Assistant ID <span className="text-gray-400 font-normal">(optional override)</span>
        </label>
        <input
          type="text"
          value={assistantId}
          onChange={(e) => setAssistantId(e.target.value)}
          placeholder="Leave blank to use Settings default"
          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-800 placeholder-gray-400 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100"
        />
      </div>

      {/* Phone Number ID */}
      <div>
        <label className="mb-1.5 block text-xs font-medium text-gray-600">
          Phone Number ID <span className="text-gray-400 font-normal">(optional override)</span>
        </label>
        <input
          type="text"
          value={phoneNumberId}
          onChange={(e) => setPhoneNumberId(e.target.value)}
          placeholder="Leave blank to use Settings default"
          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-800 placeholder-gray-400 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100"
        />
      </div>

      <div className="rounded-lg border border-amber-100 bg-amber-50 px-3 py-2 text-[11px] text-amber-700">
        The <strong>phone</strong> column in your CSV must contain a valid phone number. Leads
        without one are skipped.
      </div>

      <button
        onClick={save}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-sky-500 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-600"
      >
        <Phone className="h-4 w-4" />
        Save Call Config
      </button>
    </div>
  );
}
