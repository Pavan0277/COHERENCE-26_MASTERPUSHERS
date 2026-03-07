import { useState } from "react";
import { useWorkflow } from "../../store/workflowStore";

interface ConditionConfig {
  column: string;
  operator: string;
  value: string;
}

interface Props {
  config: Partial<ConditionConfig>;
  onChange: (config: ConditionConfig) => void;
  onClose: () => void;
}

const FALLBACK_COLUMNS = ["name", "email", "company", "title", "phone"];

const OPERATORS = [
  { value: "equals",       label: "equals" },
  { value: "not_equals",   label: "not equals" },
  { value: "contains",     label: "contains" },
  { value: "greater_than", label: "greater than" },
  { value: "less_than",    label: "less than" },
  { value: "is_empty",     label: "is empty" },
  { value: "not_empty",    label: "not empty" },
];

const NO_VALUE_OPS = new Set(["is_empty", "not_empty"]);

const OP_SYMBOLS: Record<string, string> = {
  equals: "=", not_equals: "≠", contains: "contains",
  greater_than: ">", less_than: "<", is_empty: "is empty", not_empty: "not empty",
};

export default function ConditionPanel({ config, onChange, onClose }: Props) {
  const { detectedColumns } = useWorkflow();
  const availableColumns = Object.keys(detectedColumns).length
    ? Object.keys(detectedColumns)
    : FALLBACK_COLUMNS;

  const [column, setColumn]     = useState(config.column   || availableColumns[0]);
  const [operator, setOperator] = useState(config.operator || "equals");
  const [value, setValue]       = useState(config.value    || "");

  const needsValue = !NO_VALUE_OPS.has(operator);
  const isValid    = column && operator && (!needsValue || value.trim());

  const save = () => {
    onChange({ column, operator, value: needsValue ? value : "" });
    onClose();
  };

  return (
    <div className="space-y-4">

      {/* Preview */}
      <div className="rounded-lg bg-amber-50 border border-amber-200 px-3 py-2 text-sm">
        <p className="mb-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-600">
          Preview
        </p>
        <p className="font-mono text-amber-900">
          if <span className="font-semibold">{column || "…"}</span>{" "}
          <span className="text-amber-600">{OP_SYMBOLS[operator] || operator}</span>
          {needsValue && <> <span className="font-semibold">"{value || "…"}"</span></>}
        </p>
        <p className="mt-1 text-[11px] text-amber-600">
          Leads that don't match will be skipped.
        </p>
      </div>

      {/* Column */}
      <div>
        <label className="mb-1 block text-xs font-medium text-gray-600">Column</label>
        <select
          value={column}
          onChange={(e) => setColumn(e.target.value)}
          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-amber-400 focus:outline-none"
        >
          {availableColumns.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {/* Operator */}
      <div>
        <label className="mb-1 block text-xs font-medium text-gray-600">Condition</label>
        <div className="grid grid-cols-2 gap-1.5">
          {OPERATORS.map((op) => (
            <button
              key={op.value}
              onClick={() => setOperator(op.value)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                operator === op.value
                  ? "bg-amber-500 text-white shadow-sm"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {op.label}
            </button>
          ))}
        </div>
      </div>

      {/* Value */}
      {needsValue && (
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600">
            Value <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={`e.g. ${column === "email" ? "@gmail.com" : "Acme"}`}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-amber-400 focus:outline-none"
          />
        </div>
      )}

      <button
        onClick={save}
        disabled={!isValid}
        className="w-full rounded-xl bg-amber-500 py-2.5 text-sm font-semibold text-white hover:bg-amber-600 disabled:opacity-40 transition"
      >
        Save Condition
      </button>
    </div>
  );
}
