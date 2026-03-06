import { useState } from "react";
import { Clock, Check } from "lucide-react";

interface DelayConfig { min: number; max: number; }

interface Props {
  config: Partial<DelayConfig>;
  onChange: (config: DelayConfig) => void;
  onClose: () => void;
}

// Presets in minutes
const PRESETS = [
  { label: "30 min",  min: 30,   max: 60   },
  { label: "2 hours", min: 120,  max: 240  },
  { label: "1 day",   min: 1440, max: 2880 },
  { label: "2 days",  min: 2880, max: 4320 },
];

function humanize(minutes: number): string {
  if (!minutes) return "0 min";
  const d = Math.floor(minutes / 1440);
  const h = Math.floor((minutes % 1440) / 60);
  const m = minutes % 60;
  const parts: string[] = [];
  if (d) parts.push(`${d}d`);
  if (h) parts.push(`${h}h`);
  if (m) parts.push(`${m}m`);
  return parts.join(" ");
}

export default function DelayPanel({ config, onChange, onClose }: Props) {
  const [min, setMin] = useState<number>(config.min ?? 120);
  const [max, setMax] = useState<number>(config.max ?? 240);

  const invalid = min < 0 || max < 0 || min > max;

  const save = () => {
    if (invalid) return;
    onChange({ min, max });
    onClose();
  };

  return (
    <div className="space-y-4">

      {/* Summary badge */}
      <div className="flex items-center gap-2 rounded-lg bg-orange-50 border border-orange-200 px-3 py-2">
        <Clock className="h-4 w-4 shrink-0 text-orange-500" />
        <p className="text-sm text-orange-800">
          Wait <span className="font-semibold">{humanize(min)}</span>
          {" – "}
          <span className="font-semibold">{humanize(max)}</span>
          <span className="ml-1 text-orange-500">(random)</span>
        </p>
      </div>

      {/* Quick presets */}
      <div>
        <p className="mb-1.5 text-xs font-medium text-gray-600">Quick presets</p>
        <div className="grid grid-cols-2 gap-2">
          {PRESETS.map((p) => (
            <button
              key={p.label}
              onClick={() => { setMin(p.min); setMax(p.max); }}
              className={`rounded-lg border py-2 text-xs font-medium transition ${
                min === p.min && max === p.max
                  ? "border-orange-400 bg-orange-50 text-orange-700"
                  : "border-gray-200 text-gray-600 hover:border-orange-300 hover:text-orange-600"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Min / Max inputs */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600">
            Min delay (minutes)
          </label>
          <input
            type="number"
            min={0}
            value={min}
            onChange={(e) => setMin(Number(e.target.value))}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-orange-400 focus:outline-none"
          />
          <p className="mt-1 text-[11px] text-gray-400">{humanize(min)}</p>
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600">
            Max delay (minutes)
          </label>
          <input
            type="number"
            min={0}
            value={max}
            onChange={(e) => setMax(Number(e.target.value))}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-orange-400 focus:outline-none"
          />
          <p className="mt-1 text-[11px] text-gray-400">{humanize(max)}</p>
        </div>
      </div>

      {min > max && (
        <p className="rounded-md bg-red-50 px-3 py-1.5 text-xs text-red-600">
          Min must be ≤ Max
        </p>
      )}

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={save}
          disabled={invalid}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-600 disabled:opacity-50 transition"
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
