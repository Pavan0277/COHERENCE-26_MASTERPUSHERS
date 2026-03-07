import { useState } from "react";
import { Clock } from "lucide-react";

const TIMEZONES = [
  "UTC",
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "Europe/London",
  "Europe/Paris",
  "Europe/Berlin",
  "Asia/Kolkata",
  "Asia/Singapore",
  "Asia/Tokyo",
  "Australia/Sydney",
];

interface WaitUntilConfig {
  datetime: string;
  timezone: string;
}

interface Props {
  config: Partial<WaitUntilConfig>;
  onChange: (config: WaitUntilConfig) => void;
  onClose: () => void;
}

export default function WaitUntilPanel({ config, onChange, onClose }: Props) {
  const [datetime, setDatetime] = useState(config.datetime || "");
  const [timezone, setTimezone] = useState(config.timezone || "UTC");

  const isPast = datetime ? new Date(datetime).getTime() < Date.now() : false;

  const save = () => {
    onChange({ datetime, timezone });
    onClose();
  };

  return (
    <div className="space-y-4">
      <div className="rounded-lg bg-orange-50 border border-orange-100 px-3 py-2.5">
        <p className="text-xs text-orange-700 font-medium">Wait Until</p>
        <p className="text-[11px] text-orange-600 mt-0.5">
          Pauses execution for each lead until a specific date and time. Uses the same BullMQ
          scheduling as the Delay node — Redis is required.
        </p>
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-gray-600">
          Resume At <span className="text-red-500">*</span>
        </label>
        <input
          type="datetime-local"
          value={datetime}
          onChange={(e) => setDatetime(e.target.value)}
          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-orange-400 focus:outline-none"
        />
        {isPast && (
          <p className="mt-1 text-[11px] text-amber-600">
            ⚠ This date is in the past — leads will pass through immediately.
          </p>
        )}
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-gray-600">Timezone</label>
        <select
          value={timezone}
          onChange={(e) => setTimezone(e.target.value)}
          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-orange-400 focus:outline-none"
        >
          {TIMEZONES.map((tz) => (
            <option key={tz} value={tz}>{tz}</option>
          ))}
        </select>
      </div>

      <button
        onClick={save}
        disabled={!datetime}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-orange-500 py-2.5 text-sm font-semibold text-white hover:bg-orange-600 disabled:opacity-40 transition"
      >
        <Clock className="h-4 w-4" />
        Save Wait Until Node
      </button>
    </div>
  );
}
