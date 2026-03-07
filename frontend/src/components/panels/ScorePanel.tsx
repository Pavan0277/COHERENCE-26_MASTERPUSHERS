import { useState } from "react";
import { Star } from "lucide-react";

interface ScoreConfig {
  value: number;
  operation: "add" | "subtract" | "set";
}

interface Props {
  config: Partial<ScoreConfig>;
  onChange: (config: ScoreConfig) => void;
  onClose: () => void;
}

const OPERATION_OPTIONS = [
  { value: "add",      label: "Add to score",      symbol: "+" },
  { value: "subtract", label: "Subtract from score", symbol: "−" },
  { value: "set",      label: "Set score to",       symbol: "=" },
];

const QUICK_VALUES = [5, 10, 25, 50, -10, -25];

export default function ScorePanel({ config, onChange, onClose }: Props) {
  const [value, setValueRaw]   = useState<number>(config.value ?? 10);
  const [operation, setOperation] = useState<ScoreConfig["operation"]>(config.operation ?? "add");

  const setValue = (n: number) => setValueRaw(Math.min(1000, Math.max(-1000, n)));

  const save = () => {
    onChange({ value, operation });
    onClose();
  };

  const currentOp = OPERATION_OPTIONS.find((o) => o.value === operation);

  return (
    <div className="space-y-4">

      {/* Preview */}
      <div className="flex items-center gap-2 rounded-lg bg-cyan-50 border border-cyan-100 px-3 py-2.5">
        <Star className="h-4 w-4 text-cyan-500 shrink-0" />
        <p className="text-sm font-semibold text-cyan-700">
          score {currentOp?.symbol} {value}
        </p>
      </div>

      {/* Operation */}
      <div>
        <label className="mb-1.5 block text-xs font-medium text-gray-600">Operation</label>
        <div className="grid grid-cols-3 gap-1.5">
          {OPERATION_OPTIONS.map((op) => (
            <button
              key={op.value}
              onClick={() => setOperation(op.value as ScoreConfig["operation"])}
              className={`rounded-lg border py-2 text-xs font-medium transition ${
                operation === op.value
                  ? "border-cyan-400 bg-cyan-500 text-white"
                  : "border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100"
              }`}
            >
              <span className="block text-base leading-none">{op.symbol}</span>
              <span className="mt-0.5 block text-[10px]">{op.label.split(" ")[0]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Value */}
      <div>
        <label className="mb-1 block text-xs font-medium text-gray-600">
          Points Value <span className="text-red-500">*</span>
        </label>
        <input
          type="number"
          value={value}
          onChange={(e) => setValue(parseInt(e.target.value, 10) || 0)}
          min={-1000}
          max={1000}
          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-cyan-400 focus:outline-none"
        />
      </div>

      {/* Quick picks */}
      <div>
        <p className="mb-1.5 text-[11px] font-medium text-gray-500">Quick picks</p>
        <div className="flex flex-wrap gap-1.5">
          {QUICK_VALUES.map((v) => (
            <button
              key={v}
              onClick={() => setValue(v)}
              className={`rounded-full border px-2.5 py-1 text-[11px] font-medium transition ${
                value === v
                  ? "border-cyan-400 bg-cyan-500 text-white"
                  : v < 0
                    ? "border-red-200 bg-red-50 text-red-600 hover:bg-red-100"
                    : "border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100"
              }`}
            >
              {v > 0 ? `+${v}` : v}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-lg bg-gray-50 border border-gray-100 px-3 py-2">
        <p className="text-[11px] text-gray-500">
          The lead's <code className="text-cyan-600">score</code> field will be updated. Use Filter nodes to branch based on score.
        </p>
      </div>

      <button
        onClick={save}
        className="w-full rounded-lg bg-cyan-500 py-2.5 text-sm font-semibold text-white hover:bg-cyan-600 transition"
      >
        Save Score Node
      </button>
    </div>
  );
}
