import { useState } from "react";
import { Filter } from "lucide-react";
import { useWorkflow } from "../../store/workflowStore";

interface FilterConfig {
  column: string;
  operator: string;
  value: string;
}

interface Props {
  config: Partial<FilterConfig>;
  onChange: (config: FilterConfig) => void;
  onClose: () => void;
}

const FALLBACK_COLUMNS = ["name", "email", "company", "title", "phone"];

const OPERATORS = [
  { value: "contains",     label: "contains" },
  { value: "equals",       label: "equals" },
  { value: "not_equals",   label: "not equals" },
  { value: "greater_than", label: "greater than" },
  { value: "less_than",    label: "less than" },
];

const OP_SYMBOLS: Record<string, string> = {
  contains:     "contains",
  equals:       "=",
  not_equals:   "≠",
  greater_than: ">",
  less_than:    "<",
};

export default function FilterPanel({ config, onChange, onClose }: Props) {
  const { detectedColumns } = useWorkflow();

  // Available columns: prefer detected from uploaded file, fall back to defaults
  const availableColumns = Object.keys(detectedColumns).length
    ? Object.keys(detectedColumns)
    : FALLBACK_COLUMNS;

  const [column, setColumn]     = useState(config.column   || availableColumns[0]);
  const [operator, setOperator] = useState(config.operator || "contains");
  const [value, setValue]       = useState(config.value    || "");

  const save = () => {
    onChange({ column, operator, value });
    onClose();
  };

  const isValid = column && operator && value.trim() !== "";

  return (
    <div className="space-y-4">

      {/* Live preview */}
      <div className="rounded-lg bg-yellow-50 border border-yellow-200 px-3 py-2 text-sm">
        <p className="mb-0.5 text-[10px] font-semibold uppercase tracking-wide text-yellow-600">
          Preview
        </p>
        <p className="font-mono text-yellow-900">
          <span className="font-semibold">{column || "…"}</span>
          {" "}
          <span className="text-yellow-600">{OP_SYMBOLS[operator] || operator}</span>
          {" "}
          <span className="font-semibold">{value || "…"}</span>
        </p>
      </div>

      {/* Column */}
      <div>
        <label className="mb-1 block text-xs font-medium text-gray-600">Column</label>
        <div className="relative">
          <select
            value={column}
            onChange={(e) => setColumn(e.target.value)}
            className="w-full appearance-none rounded-lg border border-gray-200 bg-white px-3 py-2 pr-8 text-sm focus:border-yellow-400 focus:outline-none"
          >
            {availableColumns.map((c) => (
              <option key={c} value={c}>
                {c}
                {detectedColumns[c] ? ` (← "${detectedColumns[c]}")` : ""}
              </option>
            ))}
          </select>
          <Filter className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        </div>
        {Object.keys(detectedColumns).length === 0 && (
          <p className="mt-1 text-[11px] text-amber-500">
            ⚠ Upload leads first to see actual column names.
          </p>
        )}
      </div>

      {/* Operator */}
      <div>
        <label className="mb-1 block text-xs font-medium text-gray-600">Operator</label>
        <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3">
          {OPERATORS.map((op) => (
            <button
              key={op.value}
              onClick={() => setOperator(op.value)}
              className={`rounded-lg border py-1.5 text-xs font-medium transition ${
                operator === op.value
                  ? "border-yellow-400 bg-yellow-50 text-yellow-700"
                  : "border-gray-200 text-gray-600 hover:border-yellow-300 hover:text-yellow-700"
              }`}
            >
              {op.label}
            </button>
          ))}
        </div>
      </div>

      {/* Value */}
      <div>
        <label className="mb-1 block text-xs font-medium text-gray-600">Value</label>
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && isValid && save()}
          placeholder={`e.g. Tesla`}
          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-yellow-400 focus:outline-none"
          autoFocus
        />
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={save}
          disabled={!isValid}
          className="flex-1 rounded-lg bg-yellow-500 px-4 py-2 text-sm font-medium text-white hover:bg-yellow-600 disabled:opacity-50 transition"
        >
          Apply Filter
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

