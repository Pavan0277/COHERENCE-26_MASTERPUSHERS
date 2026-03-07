import { useState } from "react";
import { Globe } from "lucide-react";

const METHODS = ["POST", "GET", "PUT", "PATCH", "DELETE"];

interface HttpRequestConfig {
  url: string;
  method: string;
  headers: string;
  body: string;
  outputField: string;
}

interface Props {
  config: Partial<HttpRequestConfig>;
  onChange: (config: HttpRequestConfig) => void;
  onClose: () => void;
}

export default function HttpRequestPanel({ config, onChange, onClose }: Readonly<Props>) {
  const [url,          setUrl]          = useState(config.url         || "");
  const [method,       setMethod]       = useState(config.method      || "POST");
  const [headers,      setHeaders]      = useState(config.headers     || "{}");
  const [body,         setBody]         = useState(config.body        || "");
  const [outputField,  setOutputField]  = useState(config.outputField || "");
  const [headersValid, setHeadersValid] = useState(true);

  const validateHeaders = (val: string) => {
    try { JSON.parse(val); setHeadersValid(true); } catch { setHeadersValid(false); }
    setHeaders(val);
  };

  const save = () => {
    if (!headersValid) return;
    onChange({ url: url.trim(), method, headers, body: body.trim(), outputField: outputField.trim() });
    onClose();
  };

  return (
    <div className="space-y-4">
      <div className="rounded-lg bg-gray-100 border border-gray-200 px-3 py-2.5">
        <p className="text-xs text-gray-700 font-medium">HTTP Request</p>
        <p className="text-[11px] text-gray-600 mt-0.5">
          Send a request to any API. Lead fields can be used in the body with{" "}
          <code className="bg-gray-200 px-1 rounded">&#123;name&#125;</code>,{" "}
          <code className="bg-gray-200 px-1 rounded">&#123;email&#125;</code>, etc.
        </p>
      </div>

      <div className="flex gap-2">
        <div className="w-28">
          <label htmlFor="hr-method" className="mb-1 block text-xs font-medium text-gray-600">Method</label>
          <select
            id="hr-method"
            value={method}
            onChange={(e) => setMethod(e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-2 py-2 text-sm font-mono focus:border-gray-400 focus:outline-none"
          >
            {METHODS.map((m) => <option key={m}>{m}</option>)}
          </select>
        </div>
        <div className="flex-1">
          <label htmlFor="hr-url" className="mb-1 block text-xs font-medium text-gray-600">
            URL <span className="text-red-500">*</span>
          </label>
          <input
            id="hr-url"
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://api.example.com/endpoint"
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-gray-400 focus:outline-none"
          />
        </div>
      </div>

      <div>
        <label htmlFor="hr-headers" className="mb-1 block text-xs font-medium text-gray-600">
          Headers <span className="text-gray-400 font-normal">(JSON)</span>
        </label>
        <textarea
          id="hr-headers"
          value={headers}
          onChange={(e) => validateHeaders(e.target.value)}
          rows={2}
          className={`w-full resize-none rounded-lg border px-3 py-2 text-sm font-mono focus:outline-none ${headersValid ? "border-gray-200 focus:border-gray-400" : "border-red-300 focus:border-red-400"}`}
          placeholder='{"Authorization": "Bearer TOKEN"}'
        />
        {!headersValid && <p className="mt-1 text-[11px] text-red-500">Invalid JSON</p>}
      </div>

      {method !== "GET" && (
        <div>
          <label htmlFor="hr-body" className="mb-1 block text-xs font-medium text-gray-600">
            Body <span className="text-gray-400 font-normal">(JSON or plain text, optional)</span>
          </label>
          <textarea
            id="hr-body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={3}
            placeholder='{"id": "{email}", "note": "From workflow"}'
            className="w-full resize-none rounded-lg border border-gray-200 px-3 py-2 text-sm font-mono focus:border-gray-400 focus:outline-none"
          />
          <p className="mt-1 text-[11px] text-gray-400">Leave empty to send lead fields by default.</p>
        </div>
      )}

      <div>
        <label htmlFor="hr-output" className="mb-1 block text-xs font-medium text-gray-600">
          Store Response In <span className="text-gray-400 font-normal">(optional lead field)</span>
        </label>
        <input
          id="hr-output"
          type="text"
          value={outputField}
          onChange={(e) => setOutputField(e.target.value)}
          placeholder="e.g. apiResponse"
          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm font-mono focus:border-gray-400 focus:outline-none"
        />
      </div>

      <button
        onClick={save}
        disabled={!url.trim() || !headersValid}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-gray-700 py-2.5 text-sm font-semibold text-white hover:bg-gray-800 disabled:opacity-40 transition"
      >
        <Globe className="h-4 w-4" />
        Save HTTP Request Node
      </button>
    </div>
  );
}
