import { useState } from "react";
import { PenLine } from "lucide-react";

const LEAD_FIELDS = ["name", "email", "phone", "company", "title", "score", "notes"];

interface UpdateFieldConfig {
  field: string;
  value: string;
}

interface Props {
  config: Partial<UpdateFieldConfig>;
  onChange: (config: UpdateFieldConfig) => void;
  onClose: () => void;
}

export default function UpdateFieldPanel({ config, onChange, onClose }: Props) {
  const [field, setField] = useState(config.field || "");
  const [value, setValue] = useState(config.value || "");

  const save = () => {
    onChange({ field: field.trim(), value });
    onClose();
  };

  return (
    <div className="space-y-4">
      <div className="rounded-lg bg-teal-50 border border-teal-100 px-3 py-2.5">
        <p className="text-xs text-teal-700 font-medium">Update Lead Field</p>
        <p className="text-[11px] text-teal-600 mt-0.5">
          Overwrite a field on the lead record. Supports <code className="bg-teal-100 px-1 rounded">&#123;name&#125;</code>,{" "}
          <code className="bg-teal-100 px-1 rounded">&#123;email&#125;</code>,{" "}
          <code className="bg-teal-100 px-1 rounded">&#123;company&#125;</code> placeholders.
        </p>
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-gray-600">
          Field <span className="text-red-500">*</span>
        </label>
        <div className="flex gap-2">
          <select
            value={LEAD_FIELDS.includes(field) ? field : "__custom__"}
            onChange={(e) => {
              if (e.target.value !== "__custom__") setField(e.target.value);
            }}
            className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-teal-400 focus:outline-none"
          >
            {LEAD_FIELDS.map((f) => (
              <option key={f} value={f}>{f}</option>
            ))}
            <option value="__custom__">custom…</option>
          </select>
        </div>
        {(!LEAD_FIELDS.includes(field) || field === "") && (
          <input
            type="text"
            value={field}
            onChange={(e) => setField(e.target.value)}
            placeholder="e.g. customStatus"
            className="mt-2 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-teal-400 focus:outline-none"
          />
        )}
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-gray-600">
          New Value <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="e.g. contacted or Hi {name}!"
          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-teal-400 focus:outline-none"
        />
        <p className="mt-1 text-[11px] text-gray-400">
          Use {"{name}"}, {"{email}"}, {"{company}"} to insert lead data.
        </p>
      </div>

      <button
        onClick={save}
        disabled={!field.trim()}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-teal-500 py-2.5 text-sm font-semibold text-white hover:bg-teal-600 disabled:opacity-40 transition"
      >
        <PenLine className="h-4 w-4" />
        Save Field Update
      </button>
    </div>
  );
}
