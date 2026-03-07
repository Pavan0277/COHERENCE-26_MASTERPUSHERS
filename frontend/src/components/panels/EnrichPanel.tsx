import { useState } from "react";
import { Database } from "lucide-react";

const PROVIDERS = [
  { value: "hunter",   label: "Hunter.io",  description: "Find email by name + company" },
  { value: "clearbit", label: "Clearbit",   description: "Enrich by email address" },
  { value: "apollo",   label: "Apollo.io",  description: "Enrich by email / domain" },
];

interface EnrichConfig {
  provider: string;
  apiKey: string;
  lookupField: string;
}

interface Props {
  config: Partial<EnrichConfig>;
  onChange: (config: EnrichConfig) => void;
  onClose: () => void;
}

export default function EnrichPanel({ config, onChange, onClose }: Props) {
  const [provider,    setProvider]    = useState(config.provider    || "hunter");
  const [apiKey,      setApiKey]      = useState(config.apiKey      || "");
  const [lookupField, setLookupField] = useState(config.lookupField || "email");

  const save = () => {
    onChange({ provider, apiKey: apiKey.trim(), lookupField });
    onClose();
  };

  const selected = PROVIDERS.find((p) => p.value === provider);

  return (
    <div className="space-y-4">
      <div className="rounded-lg bg-yellow-50 border border-yellow-100 px-3 py-2.5">
        <p className="text-xs text-yellow-800 font-medium">Lead Enrichment</p>
        <p className="text-[11px] text-yellow-700 mt-0.5">
          Fetches additional data for the lead from a third-party API and merges it in.
          Enrichment failures are non-fatal — the workflow continues.
        </p>
      </div>

      <div>
        <label className="mb-2 block text-xs font-medium text-gray-600">
          Provider <span className="text-red-500">*</span>
        </label>
        <div className="space-y-2">
          {PROVIDERS.map((p) => (
            <button
              key={p.value}
              type="button"
              onClick={() => setProvider(p.value)}
              className={`flex w-full items-start gap-3 rounded-xl border-2 px-3 py-2.5 text-left transition-all ${
                provider === p.value
                  ? "border-yellow-400 bg-yellow-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="flex-1">
                <p className={`text-xs font-semibold ${provider === p.value ? "text-yellow-800" : "text-gray-700"}`}>
                  {p.label}
                </p>
                <p className="text-[11px] text-gray-400">{p.description}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-gray-600">
          {selected?.label} API Key <span className="text-red-500">*</span>
        </label>
        <input
          type="password"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder="Your API key"
          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm font-mono focus:border-yellow-400 focus:outline-none"
        />
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-gray-600">Lookup Field</label>
        <select
          value={lookupField}
          onChange={(e) => setLookupField(e.target.value)}
          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-yellow-400 focus:outline-none"
        >
          <option value="email">email</option>
          <option value="company">company (domain)</option>
        </select>
      </div>

      <button
        onClick={save}
        disabled={!apiKey.trim()}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-yellow-600 py-2.5 text-sm font-semibold text-white hover:bg-yellow-700 disabled:opacity-40 transition"
      >
        <Database className="h-4 w-4" />
        Save Enrich Node
      </button>
    </div>
  );
}
