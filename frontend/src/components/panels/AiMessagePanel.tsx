import { useState } from "react";
import { Sparkles, Loader2, RefreshCw, Check } from "lucide-react";
import { generateMessage } from "../../services/api";

interface AiMessageConfig {
  instructions: string;
  template: string;
}

interface Props {
  config: Partial<AiMessageConfig>;
  onChange: (config: AiMessageConfig) => void;
  onClose: () => void;
}

const VARIABLES = ["{{name}}", "{{company}}", "{{title}}"];

const SAMPLE_LEAD = { name: "Alex Johnson", company: "Acme Corp", title: "VP of Sales" };

export default function AiMessagePanel({ config, onChange, onClose }: Props) {
  const [instructions, setInstructions] = useState(config.instructions || "");
  const [template, setTemplate]         = useState(config.template || "");
  const [status, setStatus]             = useState<"idle" | "loading" | "done" | "error">("idle");
  const [errorMsg, setErrorMsg]         = useState("");

  const generate = async () => {
    if (!instructions.trim()) return;
    setStatus("loading");
    setErrorMsg("");
    try {
      const res  = await generateMessage(SAMPLE_LEAD, instructions);
      const msg: string = res.data?.message ?? res.data ?? "";
      setTemplate(msg);
      setStatus("done");
    } catch (e: unknown) {
      setErrorMsg(e instanceof Error ? e.message : "Generation failed");
      setStatus("error");
    }
  };

  const insertVariable = (v: string) => setTemplate((t) => t + v);

  const save = () => {
    onChange({ instructions, template });
    onClose();
  };

  const isReady = instructions.trim() !== "" && template.trim() !== "";

  // Render a live preview by substituting SAMPLE_LEAD values
  const preview = template
    .replace(/\{\{name\}\}/g, SAMPLE_LEAD.name)
    .replace(/\{\{company\}\}/g, SAMPLE_LEAD.company)
    .replace(/\{\{title\}\}/g, SAMPLE_LEAD.title);

  return (
    <div className="space-y-4">

      {/* Instructions */}
      <div>
        <label className="mb-1 block text-xs font-medium text-gray-600">
          Goal / Instructions
        </label>
        <textarea
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
          rows={3}
          placeholder='e.g. "Introduce our AI outreach product"'
          className="w-full resize-none rounded-lg border border-gray-200 p-3 text-sm focus:border-purple-400 focus:outline-none"
        />
      </div>

      {/* Generate button */}
      <button
        onClick={generate}
        disabled={!instructions.trim() || status === "loading"}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700 disabled:opacity-50 transition"
      >
        {status === "loading" ? (
          <><Loader2 className="h-4 w-4 animate-spin" /> Generating…</>
        ) : status === "done" ? (
          <><RefreshCw className="h-4 w-4" /> Regenerate Message</>
        ) : (
          <><Sparkles className="h-4 w-4" /> Generate Message</>
        )}
      </button>

      {status === "error" && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">{errorMsg}</p>
      )}

      {/* Template editor */}
      {(status === "done" || template) && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium text-gray-600">Message Template</label>
            <div className="flex gap-1">
              {VARIABLES.map((v) => (
                <button
                  key={v}
                  onClick={() => insertVariable(v)}
                  className="rounded bg-purple-100 px-1.5 py-0.5 font-mono text-[10px] text-purple-700 hover:bg-purple-200 transition"
                >
                  {v}
                </button>
              ))}
            </div>
          </div>
          <textarea
            value={template}
            onChange={(e) => setTemplate(e.target.value)}
            rows={6}
            className="w-full resize-none rounded-lg border border-gray-200 p-3 font-mono text-xs focus:border-purple-400 focus:outline-none"
          />
        </div>
      )}

      {/* Live preview */}
      {template && (
        <div className="rounded-lg border border-purple-100 bg-purple-50 p-3">
          <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-purple-500">Preview — {SAMPLE_LEAD.name}, {SAMPLE_LEAD.title} @ {SAMPLE_LEAD.company}</p>
          <p className="whitespace-pre-wrap text-xs text-purple-900">{preview}</p>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={save}
          disabled={!isReady}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700 disabled:opacity-50 transition"
        >
          <Check className="h-4 w-4" /> Save Template
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
