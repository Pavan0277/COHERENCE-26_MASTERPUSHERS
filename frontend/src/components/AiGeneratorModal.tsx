import { useState, useRef, useEffect } from "react";
import { Wand2, Loader2, Sparkles, X, ChevronDown, Bot, CornerDownLeft } from "lucide-react";
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

type Msg =
  | { role: "bot"; text: string; variant?: "success" | "error" | "default" }
  | { role: "user"; text: string };

const WELCOME: Msg = {
  role: "bot",
  text: "Hey! Describe the outreach workflow you need and I'll build it on the canvas instantly.",
};

const CHIPS = [
  "Cold email with 2-day follow-up",
  "Slack outreach for CTOs only",
  "Filter managers → AI email → send",
];

function getBubbleCls(variant?: "success" | "error" | "default") {
  if (variant === "success") return "bg-emerald-50 text-emerald-800 border border-emerald-200";
  if (variant === "error") return "bg-red-50 text-red-700 border border-red-200";
  return "bg-white text-gray-800 border border-gray-100 shadow-sm";
}

export default function AiGeneratorModal({ onGenerate, onClose }: Readonly<Props>) {
  const [msgs, setMsgs]         = useState<Msg[]>([WELCOME]);
  const [input, setInput]       = useState("");
  const [busy, setBusy]         = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const endRef    = useRef<HTMLDivElement>(null);
  const inputRef  = useRef<HTMLTextAreaElement>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs]);
  useEffect(() => { if (!collapsed) setTimeout(() => inputRef.current?.focus(), 80); }, [collapsed]);

  const submit = async (text?: string) => {
    const prompt = (text ?? input).trim();
    if (!prompt || busy) return;
    setInput("");
    setMsgs((m) => [...m, { role: "user", text: prompt }]);
    setBusy(true);
    try {
      const res = await generateWorkflowFromPrompt(prompt);
      const wf: GeneratedWorkflow = res.data.workflow ?? res.data;
      setMsgs((m) => [...m, { role: "bot", text: `Done — ${wf.nodes?.length ?? 0} nodes added to your canvas.`, variant: "success" }]);
      setTimeout(() => onGenerate(wf), 600);
    } catch (e: unknown) {
      const err = e instanceof Error ? e.message : "Something went wrong. Try again.";
      setMsgs((m) => [...m, { role: "bot", text: err, variant: "error" }]);
    } finally {
      setBusy(false);
    }
  };

  /* ── collapsed pill ── */
  if (collapsed) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setCollapsed(false)}
          className="flex items-center gap-2 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-purple-200 hover:scale-105 active:scale-95 transition-all"
        >
          <Sparkles className="h-4 w-4" />
          AI Assistant
        </button>
      </div>
    );
  }

  /* ── expanded panel ── */
  return (
    <div className="fixed bottom-6 right-6 z-50 flex w-[360px] flex-col rounded-2xl border border-white/10 bg-white shadow-2xl shadow-purple-100 overflow-hidden"
      style={{ height: 500 }}>

      {/* ── top bar ── */}
      <div className="flex shrink-0 items-center gap-3 px-4 py-3 bg-gradient-to-r from-purple-600 to-indigo-600">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white/15">
          <Sparkles className="h-4 w-4 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-white leading-tight">AI Workflow Assistant</p>
          <p className="text-[10px] text-purple-200">Powered by Gemini</p>
        </div>
        <button onClick={() => setCollapsed(true)}
          className="rounded-lg p-1 text-white/60 hover:bg-white/15 hover:text-white transition"
          title="Minimise">
          <ChevronDown className="h-4 w-4" />
        </button>
        <button onClick={onClose}
          className="rounded-lg p-1 text-white/60 hover:bg-white/15 hover:text-white transition"
          title="Close">
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* ── messages ── */}
      <div className="flex-1 overflow-y-auto space-y-3 px-4 py-3 bg-[#f8f7ff]">
        {msgs.map((m, idx) => {
          const key = `${m.role}-${idx}`;
          if (m.role === "user") {
            return (
              <div key={key} className="flex justify-end">
                <p className="max-w-[78%] rounded-2xl rounded-tr-sm bg-purple-600 px-3.5 py-2 text-sm text-white leading-relaxed">
                  {m.text}
                </p>
              </div>
            );
          }
          const bubbleCls = getBubbleCls(m.variant);
          return (
            <div key={key} className="flex items-end gap-2">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-purple-100 mb-0.5">
                <Bot className="h-3.5 w-3.5 text-purple-600" />
              </div>
              <p className={`max-w-[78%] rounded-2xl rounded-bl-sm px-3.5 py-2 text-sm leading-relaxed ${bubbleCls}`}>
                {m.text}
              </p>
            </div>
          );
        })}

        {/* typing indicator */}
        {busy && (
          <div className="flex items-end gap-2">
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-purple-100">
              <Bot className="h-3.5 w-3.5 text-purple-600" />
            </div>
            <div className="flex gap-1 rounded-2xl rounded-bl-sm bg-white border border-gray-100 shadow-sm px-4 py-3">
              {[0, 150, 300].map((d) => (
                <span key={d} className="h-1.5 w-1.5 rounded-full bg-purple-400 animate-bounce"
                  style={{ animationDelay: `${d}ms` }} />
              ))}
            </div>
          </div>
        )}

        {/* quick-start chips */}
        {msgs.length === 1 && !busy && (
          <div className="flex flex-col gap-1.5 pl-8 pt-1">
            {CHIPS.map((chip) => (
              <button key={chip} onClick={() => submit(chip)}
                className="w-fit rounded-xl border border-purple-200 bg-white px-3 py-1.5 text-left text-xs text-purple-700 hover:bg-purple-50 transition shadow-sm">
                {chip}
              </button>
            ))}
          </div>
        )}

        <div ref={endRef} />
      </div>

      {/* ── input ── */}
      <div className="shrink-0 border-t border-gray-100 bg-white px-3 py-2.5">
        <div className="flex items-end gap-2 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 focus-within:border-purple-400 focus-within:bg-white transition">
          <textarea
            ref={inputRef}
            rows={2}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); submit(); } }}
            placeholder="Describe your workflow…"
            className="flex-1 resize-none bg-transparent text-sm text-gray-800 placeholder-gray-400 focus:outline-none leading-relaxed"
          />
          <button onClick={() => submit()} disabled={busy || !input.trim()}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-40 transition">
            {busy
              ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
              : <Wand2 className="h-3.5 w-3.5" />}
          </button>
        </div>
        <p className="mt-1.5 flex items-center justify-center gap-1 text-[10px] text-gray-400">
          <CornerDownLeft className="h-3 w-3" /> Enter to send · Shift+Enter new line
        </p>
      </div>
    </div>
  );
}


