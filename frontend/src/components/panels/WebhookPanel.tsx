import { useState } from "react";

interface WebhookConfig {
  url: string;
  method: string;
}

interface Props {
  config: Partial<WebhookConfig>;
  onChange: (config: WebhookConfig) => void;
  onClose: () => void;
}

const METHODS = ["POST", "PUT", "PATCH", "GET"];

export default function WebhookPanel({ config, onChange, onClose }: Props) {
  const [url, setUrl]       = useState(config.url    || "");
  const [method, setMethod] = useState(config.method || "POST");

  const save = () => {
    onChange({ url: url.trim(), method });
    onClose();
  };

  return (
    <div className="space-y-4">

      {/* Info */}
      <div className="rounded-lg bg-rose-50 border border-rose-200 px-3 py-2 text-xs text-rose-700">
        <p className="font-semibold mb-0.5">What this does</p>
        <p>Sends the lead's data as JSON to the URL you specify. Use with Zapier, Make, or your own CRM endpoint.</p>
      </div>

      {/* Method */}
      <div>
        <label className="mb-1 block text-xs font-medium text-gray-600">HTTP Method</label>
        <div className="flex gap-1.5">
          {METHODS.map((m) => (
            <button
              key={m}
              onClick={() => setMethod(m)}
              className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                method === m
                  ? "bg-rose-500 text-white shadow-sm"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      {/* URL */}
      <div>
        <label className="mb-1 block text-xs font-medium text-gray-600">
          Webhook URL <span className="text-red-500">*</span>
        </label>
        <div className="flex items-center overflow-hidden rounded-lg border border-gray-200 focus-within:border-rose-400">
          <span className="shrink-0 bg-gray-100 px-2.5 py-2 text-xs font-bold text-gray-500 border-r border-gray-200">
            {method}
          </span>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://hooks.zapier.com/hooks/catch/..."
            className="flex-1 px-3 py-2 text-sm outline-none bg-white"
          />
        </div>
        <p className="mt-1 text-[11px] text-gray-400">
          The lead object will be sent as JSON in the request body.
        </p>
      </div>

      {/* Sample payload */}
      <div>
        <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-gray-500">
          Sample payload
        </p>
        <pre className="rounded-lg bg-gray-50 border border-gray-200 px-3 py-2 text-[11px] text-gray-600 overflow-x-auto">
{`{
  "name": "Nikhil Sarak",
  "email": "nikhil@example.com",
  "phone": "+919876543210",
  "company": "Acme Inc",
  "title": "CEO"
}`}
        </pre>
      </div>

      <button
        onClick={save}
        disabled={!url.trim()}
        className="w-full rounded-xl bg-rose-500 py-2.5 text-sm font-semibold text-white hover:bg-rose-600 disabled:opacity-40 transition"
      >
        Save Webhook
      </button>
    </div>
  );
}
