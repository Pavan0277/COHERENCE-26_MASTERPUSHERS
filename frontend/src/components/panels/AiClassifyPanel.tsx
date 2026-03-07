import { useState } from "react";
import { Brain } from "lucide-react";

interface AiClassifyConfig {
  instructions: string;
  categories: string[];
  outputField: string;
}

interface Props {
  config: Partial<AiClassifyConfig>;
  onChange: (config: AiClassifyConfig) => void;
  onClose: () => void;
}

export default function AiClassifyPanel({ config, onChange, onClose }: Props) {
  const [instructions, setInstructions] = useState(config.instructions || "");
  const [categoriesRaw, setCategoriesRaw] = useState(
    Array.isArray(config.categories) && config.categories.length
      ? config.categories.join(", ")
      : "hot, warm, cold"
  );
  const [outputField, setOutputField] = useState(config.outputField || "classification");

  const save = () => {
    const categories = categoriesRaw
      .split(",")
      .map((c) => c.trim())
      .filter(Boolean);
    onChange({ instructions: instructions.trim(), categories, outputField: outputField.trim() || "classification" });
    onClose();
  };

  return (
    <div className="space-y-4">
      <div className="rounded-lg bg-pink-50 border border-pink-100 px-3 py-2.5">
        <p className="text-xs text-pink-700 font-medium">AI Lead Classification</p>
        <p className="text-[11px] text-pink-600 mt-0.5">
          Uses AI to bucket each lead into one of your categories. The result is stored as a tag and in the output field.
        </p>
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-gray-600">
          Categories <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={categoriesRaw}
          onChange={(e) => setCategoriesRaw(e.target.value)}
          placeholder="hot, warm, cold"
          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-pink-400 focus:outline-none"
        />
        <p className="mt-1 text-[11px] text-gray-400">Comma-separated list of labels.</p>
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-gray-600">
          Classification Instructions
        </label>
        <textarea
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
          placeholder="e.g. Classify based on company size and role seniority. Hot = VP+ at 200+ employees."
          rows={4}
          className="w-full resize-none rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-pink-400 focus:outline-none"
        />
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-gray-600">
          Output Field <span className="text-gray-400 font-normal">(where to store result)</span>
        </label>
        <input
          type="text"
          value={outputField}
          onChange={(e) => setOutputField(e.target.value)}
          placeholder="classification"
          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm font-mono focus:border-pink-400 focus:outline-none"
        />
      </div>

      <button
        onClick={save}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-pink-500 py-2.5 text-sm font-semibold text-white hover:bg-pink-600 transition"
      >
        <Brain className="h-4 w-4" />
        Save Classify Node
      </button>
    </div>
  );
}
