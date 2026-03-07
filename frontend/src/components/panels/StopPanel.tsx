import { useState } from "react";
import { StopCircle } from "lucide-react";

interface StopConfig {
  reason: string;
  status: "completed" | "failed" | "skipped";
}

interface Props {
  config: Partial<StopConfig>;
  onChange: (config: StopConfig) => void;
  onClose: () => void;
}

const STATUS_OPTIONS: { value: StopConfig["status"]; label: string; color: string }[] = [
  { value: "completed", label: "Completed",  color: "border-slate-400 text-slate-700" },
  { value: "skipped",   label: "Skipped",    color: "border-yellow-400 text-yellow-700" },
  { value: "failed",    label: "Failed",     color: "border-red-400 text-red-700" },
];

export default function StopPanel({ config, onChange, onClose }: Props) {
  const [reason, setReason] = useState(config.reason || "");
  const [status, setStatus] = useState<StopConfig["status"]>(config.status || "completed");

  const save = () => {
    onChange({ reason: reason.trim(), status });
    onClose();
  };

  return (
    <div className="space-y-4">
      <div className="rounded-lg bg-red-50 border border-red-100 px-3 py-2.5">
        <p className="text-xs text-red-700 font-medium">Stop / End Branch</p>
        <p className="text-[11px] text-red-600 mt-0.5">
          Explicitly terminates the branch. No nodes after this will run. The lead execution
          status is set to the value below.
        </p>
      </div>

      <div>
        <label className="mb-2 block text-xs font-medium text-gray-600">
          Lead Status After Stop <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-3 gap-2">
          {STATUS_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setStatus(opt.value)}
              className={`rounded-xl border-2 py-2.5 text-xs font-semibold transition-all ${
                status === opt.value
                  ? `${opt.color} bg-white shadow-sm`
                  : "border-gray-200 text-gray-400 hover:border-gray-300"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-gray-600">
          Reason / Note <span className="text-gray-400 font-normal">(optional)</span>
        </label>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="e.g. Lead unsubscribed from outreach"
          rows={3}
          className="w-full resize-none rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-red-400 focus:outline-none"
        />
      </div>

      <button
        onClick={save}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-red-500 py-2.5 text-sm font-semibold text-white hover:bg-red-600 transition"
      >
        <StopCircle className="h-4 w-4" />
        Save Stop Node
      </button>
    </div>
  );
}
