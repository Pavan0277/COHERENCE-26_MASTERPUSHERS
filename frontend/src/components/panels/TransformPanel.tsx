import { useState } from "react";
import { Zap } from "lucide-react";

const LEAD_FIELDS = ["name", "email", "phone", "company", "title", "score"];
const OPERATIONS = [
  { value: "uppercase", label: "UPPERCASE" },
  { value: "lowercase", label: "lowercase" },
  { value: "trim",      label: "Trim whitespace" },
  { value: "replace",   label: "Find & Replace" },
  { value: "template",  label: "Template string" },
];

interface TransformConfig {
  field: string;
  operation: string;
  find: string;
  replace: string;
  template: string;
  outputField: string;
}

interface Props {
  config: Partial<TransformConfig>;
  onChange: (config: TransformConfig) => void;
  onClose: () => void;
}

export default function TransformPanel({ config, onChange, onClose }: Props) {
  const [field,       setField]       = useState(config.field       || "name");
  const [operation,   setOperation]   = useState(config.operation   || "uppercase");
  const [find,        setFind]        = useState(config.find        || "");
  const [replace,     setReplace]     = useState(config.replace     || "");
  const [template,    setTemplate]    = useState(config.template    || "");
  const [outputField, setOutputField] = useState(config.outputField || "");

  const save = () => {
    onChange({ field, operation, find, replace, template, outputField: outputField.trim() });
    onClose();
  };

  return (
    <div className="space-y-4">
      <div className="rounded-lg bg-stone-50 border border-stone-200 px-3 py-2.5">
        <p className="text-xs text-stone-700 font-medium">Data Transform</p>
        <p className="text-[11px] text-stone-600 mt-0.5">
          Transforms a lead field value. Result is written back to the same field or a custom output field.
        </p>
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-gray-600">
          Field <span className="text-red-500">*</span>
        </label>
        <select
          value={field}
          onChange={(e) => setField(e.target.value)}
          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-stone-400 focus:outline-none"
        >
          {LEAD_FIELDS.map((f) => (
            <option key={f} value={f}>{f}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-gray-600">
          Operation <span className="text-red-500">*</span>
        </label>
        <select
          value={operation}
          onChange={(e) => setOperation(e.target.value)}
          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-stone-400 focus:outline-none"
        >
          {OPERATIONS.map((op) => (
            <option key={op.value} value={op.value}>{op.label}</option>
          ))}
        </select>
      </div>

      {operation === "replace" && (
        <>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">Find</label>
            <input
              type="text"
              value={find}
              onChange={(e) => setFind(e.target.value)}
              placeholder="Text to find"
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-stone-400 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">Replace With</label>
            <input
              type="text"
              value={replace}
              onChange={(e) => setReplace(e.target.value)}
              placeholder="Replacement text"
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-stone-400 focus:outline-none"
            />
          </div>
        </>
      )}

      {operation === "template" && (
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600">Template</label>
          <input
            type="text"
            value={template}
            onChange={(e) => setTemplate(e.target.value)}
            placeholder="e.g. {name} from {company}"
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-stone-400 focus:outline-none"
          />
          <p className="mt-1 text-[11px] text-gray-400">Use {"{name}"}, {"{email}"}, {"{company}"}, {"{title}"}, {"{phone}"}.</p>
        </div>
      )}

      <div>
        <label className="mb-1 block text-xs font-medium text-gray-600">
          Output Field <span className="text-gray-400 font-normal">(optional, defaults to same field)</span>
        </label>
        <input
          type="text"
          value={outputField}
          onChange={(e) => setOutputField(e.target.value)}
          placeholder="Leave blank to overwrite source field"
          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm font-mono focus:border-stone-400 focus:outline-none"
        />
      </div>

      <button
        onClick={save}
        disabled={!field || !operation}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-stone-500 py-2.5 text-sm font-semibold text-white hover:bg-stone-600 disabled:opacity-40 transition"
      >
        <Zap className="h-4 w-4" />
        Save Transform Node
      </button>
    </div>
  );
}
