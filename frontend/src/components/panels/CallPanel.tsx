import { useState } from "react";
import { Phone } from "lucide-react";

const ALEX2_ID = "38d3f51c-f007-421b-9e2d-9e899f53ad83";

interface CallConfig {
  assistantId: string;
  phoneNumberId: string;
  followUp: boolean;
}

interface Props {
  config: Partial<CallConfig>;
  onChange: (config: CallConfig) => void;
  onClose: () => void;
}

export default function CallPanel({ config, onChange, onClose }: Props) {
  const [followUp,      setFollowUp]      = useState(config.followUp ?? false);
  const [assistantId,   setAssistantId]   = useState(config.assistantId  || "");
  const [phoneNumberId, setPhoneNumberId] = useState(config.phoneNumberId || "");

  const handleFollowUpToggle = (checked: boolean) => {
    setFollowUp(checked);
    // Auto-fill Alex2 ID when switching to follow-up, clear it when switching back
    if (checked && !assistantId) {
      setAssistantId(ALEX2_ID);
    } else if (!checked && assistantId === ALEX2_ID) {
      setAssistantId("");
    }
  };

  const save = () => {
    onChange({ assistantId, phoneNumberId, followUp });
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

      {/* Follow-up toggle */}
      <div className="flex items-start gap-3 rounded-xl border border-violet-100 bg-violet-50 px-4 py-3">
        <input
          id="followup-toggle"
          type="checkbox"
          checked={followUp}
          onChange={(e) => handleFollowUpToggle(e.target.checked)}
          className="mt-0.5 h-4 w-4 rounded border-gray-300 text-violet-600 focus:ring-violet-400"
        />
        <label htmlFor="followup-toggle" className="cursor-pointer text-xs text-violet-800">
          <span className="font-semibold">Follow-up call (uses Alex2)</span>
          <br />
          <span className="text-violet-600">
            Automatically routes to the follow-up assistant configured in Settings → VAPI. Enabling
            this pre-fills the Assistant ID with Alex2.
          </span>
        </label>
      </div>

      {/* Assistant ID */}
      <div>
        <label className="mb-1.5 block text-xs font-medium text-gray-600">
          Assistant ID{" "}
          <span className="text-gray-400 font-normal">
            {followUp ? "(Alex2 pre-filled)" : "(optional override)"}
          </span>
        </label>
        <input
          type="text"
          value={assistantId}
          onChange={(e) => setAssistantId(e.target.value)}
          placeholder={followUp ? ALEX2_ID : "Leave blank to use Settings default"}
          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm font-mono text-gray-800 placeholder-gray-400 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100"
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
