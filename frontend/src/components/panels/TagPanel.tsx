import { useState } from "react";
import { Tag } from "lucide-react";

interface TagConfig {
  tag: string;
  color: string;
}

interface Props {
  config: Partial<TagConfig>;
  onChange: (config: TagConfig) => void;
  onClose: () => void;
}

const PRESET_COLORS = [
  { label: "Indigo",  value: "#6366f1" },
  { label: "Blue",    value: "#3b82f6" },
  { label: "Green",   value: "#22c55e" },
  { label: "Yellow",  value: "#eab308" },
  { label: "Orange",  value: "#f97316" },
  { label: "Red",     value: "#ef4444" },
  { label: "Pink",    value: "#ec4899" },
  { label: "Teal",    value: "#14b8a6" },
];

const PRESET_TAGS = [
  "Hot Lead", "Cold Lead", "Contacted", "Follow-up",
  "Interested", "Not Interested", "VIP", "Demo Scheduled",
];

export default function TagPanel({ config, onChange, onClose }: Props) {
  const [tag, setTag]     = useState(config.tag   || "");
  const [color, setColor] = useState(config.color || "#6366f1");

  const save = () => {
    onChange({ tag: tag.trim(), color });
    onClose();
  };

  return (
    <div className="space-y-4">

      {/* Preview */}
      {tag && (
        <div className="flex items-center gap-2">
          <span
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold text-white"
            style={{ backgroundColor: color }}
          >
            <Tag className="h-3.5 w-3.5" />
            {tag}
          </span>
          <p className="text-xs text-gray-400">Preview</p>
        </div>
      )}

      {/* Tag name */}
      <div>
        <label className="mb-1 block text-xs font-medium text-gray-600">
          Tag Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={tag}
          onChange={(e) => setTag(e.target.value)}
          placeholder="e.g. Hot Lead"
          maxLength={40}
          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-indigo-400 focus:outline-none"
        />
      </div>

      {/* Preset tags */}
      <div>
        <p className="mb-1.5 text-[11px] font-medium text-gray-500">Quick picks</p>
        <div className="flex flex-wrap gap-1.5">
          {PRESET_TAGS.map((pt) => (
            <button
              key={pt}
              onClick={() => setTag(pt)}
              className={`rounded-full border px-2.5 py-1 text-[11px] font-medium transition ${
                tag === pt
                  ? "border-indigo-400 bg-indigo-500 text-white"
                  : "border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100"
              }`}
            >
              {pt}
            </button>
          ))}
        </div>
      </div>

      {/* Color picker */}
      <div>
        <label className="mb-1.5 block text-xs font-medium text-gray-600">Label Color</label>
        <div className="flex flex-wrap gap-2">
          {PRESET_COLORS.map((c) => (
            <button
              key={c.value}
              title={c.label}
              onClick={() => setColor(c.value)}
              className={`h-7 w-7 rounded-full transition-transform ${
                color === c.value ? "scale-125 ring-2 ring-white ring-offset-1 ring-offset-gray-200" : "hover:scale-110"
              }`}
              style={{ backgroundColor: c.value }}
            />
          ))}
        </div>
      </div>

      <button
        onClick={save}
        disabled={!tag.trim()}
        className="w-full rounded-xl bg-indigo-500 py-2.5 text-sm font-semibold text-white hover:bg-indigo-600 disabled:opacity-40 transition"
      >
        Save Tag
      </button>
    </div>
  );
}
