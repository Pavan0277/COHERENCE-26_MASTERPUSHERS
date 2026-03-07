import { useState } from "react";
import { Shuffle } from "lucide-react";

interface SplitConfig {
  percentage: number;
}

interface Props {
  config: Partial<SplitConfig>;
  onChange: (config: SplitConfig) => void;
  onClose: () => void;
}

const QUICK_SPLITS = [20, 33, 50, 67, 80];

export default function SplitPanel({ config, onChange, onClose }: Props) {
  const [percentage, setPercentage] = useState<number>(config.percentage ?? 50);

  const clamp = (v: number) => Math.min(99, Math.max(1, Math.round(v)));

  const save = () => {
    onChange({ percentage });
    onClose();
  };

  return (
    <div className="space-y-4">

      {/* Info */}
      <div className="rounded-lg bg-violet-50 border border-violet-100 px-3 py-2.5">
        <p className="text-xs text-violet-700 font-medium">A/B Random Split</p>
        <p className="text-[11px] text-violet-600 mt-0.5">
          Randomly continues <strong>{percentage}%</strong> of leads and skips the rest. Useful for A/B testing messages or limiting outreach volume.
        </p>
      </div>

      {/* Visual bar */}
      <div className="rounded-xl bg-gray-50 border border-gray-100 p-4">
        <div className="mb-3 flex justify-between text-xs font-semibold text-gray-600">
          <span className="text-violet-600">Continue: {percentage}%</span>
          <span className="text-gray-400">Skip: {100 - percentage}%</span>
        </div>
        <div className="h-4 w-full overflow-hidden rounded-full bg-gray-200">
          <div
            className="h-full rounded-full bg-gradient-to-r from-violet-500 to-violet-400 transition-all"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      {/* Slider */}
      <div>
        <label className="mb-1.5 block text-xs font-medium text-gray-600">Pass-through Percentage</label>
        <input
          type="range"
          min={1}
          max={99}
          value={percentage}
          onChange={(e) => setPercentage(clamp(parseInt(e.target.value, 10)))}
          className="w-full accent-violet-500 cursor-pointer"
        />
        <div className="mt-2 flex items-center gap-2">
          <input
            type="number"
            value={percentage}
            onChange={(e) => setPercentage(clamp(parseInt(e.target.value, 10) || 1))}
            min={1}
            max={99}
            className="w-20 rounded-lg border border-gray-200 px-2 py-1.5 text-center text-sm font-bold text-violet-600 focus:border-violet-400 focus:outline-none"
          />
          <span className="text-sm text-gray-500">% of leads continue</span>
        </div>
      </div>

      {/* Quick presets */}
      <div>
        <p className="mb-1.5 text-[11px] font-medium text-gray-500">Quick presets</p>
        <div className="flex flex-wrap gap-1.5">
          {QUICK_SPLITS.map((v) => (
            <button
              key={v}
              onClick={() => setPercentage(v)}
              className={`rounded-full border px-2.5 py-1 text-[11px] font-medium transition ${
                percentage === v
                  ? "border-violet-400 bg-violet-500 text-white"
                  : "border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100"
              }`}
            >
              {v}/{100 - v}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={save}
        className="w-full rounded-lg bg-violet-500 py-2.5 text-sm font-semibold text-white hover:bg-violet-600 transition"
      >
        <Shuffle className="inline h-4 w-4 mr-1.5" />
        Save Split Node
      </button>
    </div>
  );
}
