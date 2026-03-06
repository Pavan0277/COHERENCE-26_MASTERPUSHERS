import { useState } from "react";
import { Wand2, Loader2, Sparkles, X, ArrowRight } from "lucide-react";
import { generateWorkflowFromPrompt } from "../services/api";

interface GeneratedNode {
  id?: string;
  type: string;
  config?: Record<string, unknown>;
}

interface GeneratedEdge {
  source: string;
  target: string;
}

interface GeneratedWorkflow {
  nodes: GeneratedNode[];
  edges: GeneratedEdge[];
}

interface Props {
  onGenerate: (workflow: GeneratedWorkflow) => void;
  onClose: () => void;
}

const EXAMPLES = [
  "Create a cold outreach workflow that uploads leads, filters by company size, writes an AI email, sends it, waits 2 days, then sends a follow-up",
  "Build a SaaS outreach: upload leads, filter CTOs only, generate a personalized Slack message, send via Slack, delay 3 days, send a follow-up email",
  "Outreach campaign: upload CSV, filter leads with 'Manager' in title, write a short intro email, send via email, wait 1 day, send second email",
];

const NODE_LABELS: Record<string, string> = {
  upload:     "Upload Leads",
  filter:     "Filter",
  ai_message: "AI Message",
  send:       "Send Message",
  delay:      "Delay",
};

export default function AiGeneratorModal({ onGenerate, onClose }: Props) {
  const [prompt, setPrompt]     = useState("");
  const [status, setStatus]     = useState<"idle" | "loading" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const generate = async () => {
    if (!prompt.trim()) return;
    setStatus("loading");
    setErrorMsg("");
    try {
      const res = await generateWorkflowFromPrompt(prompt);
      const wf: GeneratedWorkflow = res.data.workflow ?? res.data;
      onGenerate(wf);
    } catch (e: unknown) {
      setErrorMsg(e instanceof Error ? e.message : "Generation failed. Please try again.");
      setStatus("error");
    } finally {
      setStatus((s) => (s === "loading" ? "idle" : s));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-600">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-gray-900">Generate Workflow with AI</h2>
              <p className="text-xs text-gray-500">Powered by Gemini</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4 px-6 py-5">

          {/* Prompt input */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Describe your workflow
            </label>
            <textarea
              rows={4}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) generate();
              }}
              placeholder='e.g. "Create a cold outreach workflow with follow-up after 2 days"'
              className="w-full resize-none rounded-xl border border-gray-200 p-3 text-sm focus:border-purple-400 focus:outline-none"
              autoFocus
            />
            <p className="mt-1 text-right text-[11px] text-gray-400">⌘ + Enter to generate</p>
          </div>

          {/* Example prompts */}
          <div>
            <p className="mb-2 text-xs font-medium text-gray-500">Examples — click to use</p>
            <div className="space-y-2">
              {EXAMPLES.map((ex, i) => (
                <button
                  key={i}
                  onClick={() => setPrompt(ex)}
                  className="flex w-full items-start gap-2 rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 text-left text-xs text-gray-600 hover:border-purple-200 hover:bg-purple-50 hover:text-purple-700 transition"
                >
                  <ArrowRight className="mt-0.5 h-3 w-3 shrink-0 text-purple-400" />
                  <span className="line-clamp-2">{ex}</span>
                </button>
              ))}
            </div>
          </div>

          {/* What will be created hint */}
          <div className="rounded-lg bg-purple-50 border border-purple-100 px-3 py-2.5">
            <p className="text-[11px] text-purple-700">
              <span className="font-semibold">Gemini will generate</span> a sequence of{" "}
              {Object.values(NODE_LABELS).join(", ")} nodes connected as a ready-to-run workflow.
              You can edit any node after generation.
            </p>
          </div>

          {/* Error */}
          {status === "error" && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">{errorMsg}</p>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-3 border-t border-gray-100 px-6 py-4">
          <button
            onClick={generate}
            disabled={status === "loading" || !prompt.trim()}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-purple-600 py-2.5 text-sm font-medium text-white hover:bg-purple-700 disabled:opacity-50 transition"
          >
            {status === "loading" ? (
              <><Loader2 className="h-4 w-4 animate-spin" /> Generating workflow…</>
            ) : (
              <><Wand2 className="h-4 w-4" /> Generate Workflow</>
            )}
          </button>
          <button
            onClick={onClose}
            className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm text-gray-600 hover:bg-gray-50 transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
