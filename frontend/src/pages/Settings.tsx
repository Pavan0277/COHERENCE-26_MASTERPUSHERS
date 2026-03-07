import { useEffect, useState } from "react";
import { Mail, MessageSquare, Send, Save, CheckCircle, Eye, EyeOff, Phone } from "lucide-react";
import { getSettings, updateSettings } from "../services/api";

type Tab = "email" | "slack" | "telegram" | "vapi";

interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  pass: string;
  from: string;
}

interface SlackConfig {
  webhookUrl: string;
}

interface TelegramConfig {
  botToken: string;
  chatId: string;
  apiId: number;
  apiHash: string;
  sessionString: string;
}

interface VapiConfig {
  apiKey: string;
  assistantId: string;
  followUpFirstMessage: string;
  followUpSystemPrompt: string;
  phoneNumberId: string;
}

const DEFAULT_EMAIL: EmailConfig = { host: "smtp.gmail.com", port: 587, secure: false, user: "", pass: "", from: "" };
const DEFAULT_SLACK: SlackConfig = { webhookUrl: "" };
const DEFAULT_TELEGRAM: TelegramConfig = { botToken: "", chatId: "", apiId: 0, apiHash: "", sessionString: "" };
const DEFAULT_VAPI: VapiConfig = { apiKey: "", assistantId: "", followUpFirstMessage: "", followUpSystemPrompt: "", phoneNumberId: "" };

export default function Settings() {
  const [activeTab, setActiveTab] = useState<Tab>("email");

  const [email, setEmail]       = useState<EmailConfig>(DEFAULT_EMAIL);
  const [slack, setSlack]       = useState<SlackConfig>(DEFAULT_SLACK);
  const [telegram, setTelegram] = useState<TelegramConfig>(DEFAULT_TELEGRAM);
  const [vapi, setVapi]         = useState<VapiConfig>(DEFAULT_VAPI);

  const [saving, setSaving]   = useState(false);
  const [saved, setSaved]     = useState(false);
  const [error, setError]     = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load existing settings on mount
  useEffect(() => {
    (async () => {
      try {
        const res = await getSettings();
        const s = res.data.settings;
        if (s.email)    setEmail({ ...DEFAULT_EMAIL,    ...s.email,    pass: "" }); // never pre-fill password
        if (s.slack)    setSlack({ ...DEFAULT_SLACK,    ...s.slack });
        if (s.telegram) setTelegram({ ...DEFAULT_TELEGRAM, ...s.telegram });
        if (s.vapi)     setVapi({ ...DEFAULT_VAPI, ...s.vapi, apiKey: "" }); // never pre-fill API key
      } catch {
        // first load — defaults are fine
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      // Only send password if the user actually typed a new one
      const emailPayload: Partial<EmailConfig> = { ...email };
      if (!emailPayload.pass) delete emailPayload.pass;

      const vapiPayload: Partial<VapiConfig> = { ...vapi };
      if (!vapiPayload.apiKey) delete vapiPayload.apiKey;

      await updateSettings({ email: emailPayload, slack, telegram, vapi: vapiPayload });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: "email",    label: "Email (SMTP)", icon: Mail },
    { id: "slack",    label: "Slack",        icon: MessageSquare },
    { id: "telegram", label: "Telegram",     icon: Send },
    { id: "vapi",     label: "VAPI",         icon: Phone },
  ];

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-heading">Settings</h1>
        <p className="mt-1 text-sm text-body-light">
          Configure credentials for messaging, calls, and integrations.
        </p>
      </div>

      {/* Tab bar */}
      <div className="mb-6 flex gap-1 rounded-xl border border-gray-200 bg-white p-1 shadow-sm">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-medium transition-all duration-150 ${
              activeTab === id
                ? "bg-indigo-600 shadow-sm text-white"
                : "text-gray-500 hover:text-gray-800 hover:bg-gray-50"
            }`}
          >
            <Icon className="h-4 w-4" />
            {label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex h-48 items-center justify-center rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="flex flex-col items-center gap-3">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
            <p className="text-sm text-body-light">Loading settings…</p>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm animate-fade-up">
          {/* ── EMAIL ── */}
          {activeTab === "email" && (
            <div className="space-y-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                SMTP Configuration
              </p>

              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 sm:col-span-1">
                  <label className="mb-1 block text-xs font-medium text-gray-600">SMTP Host</label>
                  <input
                    type="text"
                    value={email.host}
                    onChange={(e) => setEmail({ ...email, host: e.target.value })}
                    placeholder="smtp.gmail.com"
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-600">Port</label>
                  <input
                    type="number"
                    value={email.port}
                    onChange={(e) => setEmail({ ...email, port: Number(e.target.value) })}
                    placeholder="587"
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-400 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-gray-600">
                  From / Sender Address
                </label>
                <input
                  type="email"
                  value={email.from}
                  onChange={(e) => setEmail({ ...email, from: e.target.value })}
                  placeholder="you@gmail.com"
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-gray-600">
                  SMTP Username
                </label>
                <input
                  type="email"
                  value={email.user}
                  onChange={(e) => setEmail({ ...email, user: e.target.value })}
                  placeholder="you@gmail.com"
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-gray-600">
                  App Password / SMTP Password
                </label>
                <div className="relative">
                  <input
                    type={showPass ? "text" : "password"}
                    value={email.pass}
                    onChange={(e) => setEmail({ ...email, pass: e.target.value })}
                    placeholder="Leave blank to keep existing password"
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 pr-10 text-sm focus:border-blue-400 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass((v) => !v)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <p className="mt-1 text-[11px] text-gray-400">
                  For Gmail, use an{" "}
                  <a
                    href="https://myaccount.google.com/apppasswords"
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-500 underline"
                  >
                    App Password
                  </a>
                  , not your regular password.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <input
                  id="smtp-secure"
                  type="checkbox"
                  checked={email.secure}
                  onChange={(e) => setEmail({ ...email, secure: e.target.checked })}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600"
                />
                <label htmlFor="smtp-secure" className="text-sm text-gray-600">
                  Use SSL/TLS (port 465)
                </label>
              </div>
            </div>
          )}

          {/* ── SLACK ── */}
          {activeTab === "slack" && (
            <div className="space-y-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                Slack Incoming Webhook
              </p>
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-600">
                  Webhook URL
                </label>
                <input
                  type="url"
                  value={slack.webhookUrl}
                  onChange={(e) => setSlack({ webhookUrl: e.target.value })}
                  placeholder="https://hooks.slack.com/services/T…/B…/…"
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-indigo-400 focus:outline-none"
                />
                <p className="mt-1 text-[11px] text-gray-400">
                  Create one at{" "}
                  <a
                    href="https://api.slack.com/apps"
                    target="_blank"
                    rel="noreferrer"
                    className="text-indigo-500 underline"
                  >
                    api.slack.com/apps
                  </a>{" "}
                  → Incoming Webhooks.
                </p>
              </div>
            </div>
          )}

          {/* ── TELEGRAM ── */}
          {activeTab === "telegram" && (
            <div className="space-y-4">

              {/* ── User API section (send by phone) ── */}
              <div className="rounded-xl border border-sky-100 bg-sky-50 p-4 space-y-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-sky-700">User API — Send by Phone Number</p>
                  <p className="mt-0.5 text-[11px] text-sky-600">
                    Fill these to send messages directly to leads' phone numbers.{" "}
                    Run <code className="rounded bg-sky-100 px-1 font-mono text-[10px]">node scripts/gen-telegram-session.js</code>{" "}
                    in the backend folder once to get your Session String.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1 block text-xs font-medium text-gray-600">API ID</label>
                    <input
                      type="number"
                      value={telegram.apiId || ""}
                      onChange={(e) => setTelegram({ ...telegram, apiId: Number(e.target.value) })}
                      placeholder="12345678"
                      className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-sky-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-gray-600">API Hash</label>
                    <input
                      type="text"
                      value={telegram.apiHash}
                      onChange={(e) => setTelegram({ ...telegram, apiHash: e.target.value })}
                      placeholder="a1b2c3d4e5f6…"
                      className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-sky-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-600">Session String</label>
                  <textarea
                    rows={3}
                    value={telegram.sessionString}
                    onChange={(e) => setTelegram({ ...telegram, sessionString: e.target.value })}
                    placeholder="Paste the output of gen-telegram-session.js here…"
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 font-mono text-xs focus:border-sky-400 focus:outline-none"
                  />
                  <p className="mt-1 text-[11px] text-gray-400">
                    Get API ID &amp; Hash from{" "}
                    <a href="https://my.telegram.org/apps" target="_blank" rel="noreferrer" className="text-sky-500 underline">my.telegram.org/apps</a>.
                    Keep the Session String secret.
                  </p>
                </div>
              </div>

              {/* ── Bot API section (fallback) ── */}
              <div className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Bot API — Fallback (requires users to start the bot first)</p>
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-600">Bot Token</label>
                  <input
                    type="text"
                    value={telegram.botToken}
                    onChange={(e) => setTelegram({ ...telegram, botToken: e.target.value })}
                    placeholder="123456789:AAAAAAAAAA…"
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-sky-400 focus:outline-none"
                  />
                  <p className="mt-1 text-[11px] text-gray-400">
                    Get a token from{" "}
                    <a href="https://t.me/BotFather" target="_blank" rel="noreferrer" className="text-sky-500 underline">@BotFather</a>.
                  </p>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-600">Fallback Chat ID</label>
                  <input
                    type="text"
                    value={telegram.chatId}
                    onChange={(e) => setTelegram({ ...telegram, chatId: e.target.value })}
                    placeholder="-1001234567890 or @yourchannel"
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-sky-400 focus:outline-none"
                  />
                  <p className="mt-1 text-[11px] text-gray-400">
                    Forward a message from the target chat to{" "}
                    <a href="https://t.me/userinfobot" target="_blank" rel="noreferrer" className="text-sky-500 underline">@userinfobot</a>{" "}
                    to find the ID.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ── VAPI ── */}
          {activeTab === "vapi" && (
            <div className="space-y-5">
              <div className="rounded-xl border border-sky-100 bg-sky-50 px-4 py-3 text-xs text-sky-700">
                Configure your{" "}
                <a href="https://dashboard.vapi.ai" target="_blank" rel="noreferrer" className="underline font-semibold">
                  VAPI
                </a>{" "}
                credentials here. Workflows with a <strong>VAPI Call</strong> node will use these by
                default, so you don’t have to enter them per-node.
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-gray-600">
                  API Key
                </label>
                <input
                  type="password"
                  value={vapi.apiKey}
                  onChange={(e) => setVapi({ ...vapi, apiKey: e.target.value })}
                  placeholder="Leave blank to keep existing key"
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-sky-400 focus:outline-none"
                />
                <p className="mt-1 text-[11px] text-gray-400">
                  Copy from{" "}
                  <a href="https://dashboard.vapi.ai" target="_blank" rel="noreferrer" className="text-sky-500 underline">
                    dashboard.vapi.ai
                  </a>{" "}
                  → Account → API Keys.
                </p>
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-gray-600">
                  Assistant ID <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={vapi.assistantId}
                  onChange={(e) => setVapi({ ...vapi, assistantId: e.target.value })}
                  placeholder="e.g. asst_xxxxxxxxxxxxxxxx"
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm font-mono focus:border-sky-400 focus:outline-none"
                />
                <p className="mt-1 text-[11px] text-gray-400">
                  VAPI dashboard → Assistants → copy the ID.
                </p>
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-gray-600">
                  Follow-up Opening Line{" "}
                  <span className="text-gray-400 font-normal">(first thing caller hears)</span>
                </label>
                <input
                  type="text"
                  value={vapi.followUpFirstMessage}
                  onChange={(e) => setVapi({ ...vapi, followUpFirstMessage: e.target.value })}
                  placeholder='e.g. "Hi {{customerName}}! This is Alex, I called you recently about our service — just following up!"'
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-800 placeholder-gray-400 focus:border-violet-400 focus:outline-none"
                />
                <p className="mt-1 text-[11px] text-gray-400">
                  Overrides the "Hello." first message on Alex2. Use{" "}
                  <code className="rounded bg-gray-100 px-0.5">{"{{customerName}}"}</code> to
                  personalise. Leave blank for a sensible default.
                </p>
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-gray-600">
                  Follow-up System Prompt{" "}
                  <span className="text-gray-400 font-normal">(injected for follow-up calls)</span>
                </label>
                <textarea
                  rows={8}
                  value={vapi.followUpSystemPrompt}
                  onChange={(e) => setVapi({ ...vapi, followUpSystemPrompt: e.target.value })}
                  placeholder="Leave blank to use the default follow-up prompt. Use {{customerName}}, {{customerCompany}}, {{customerEmail}} as variables."
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 font-mono text-xs text-gray-800 placeholder-gray-400 focus:border-violet-400 focus:outline-none"
                />
                <p className="mt-1 text-[11px] text-gray-400">
                  This prompt overrides Alex2's configured script for every follow-up call.
                  Variables <code className="rounded bg-gray-100 px-0.5">{"{{customerName}}"}</code>,{" "}
                  <code className="rounded bg-gray-100 px-0.5">{"{{customerCompany}}"}</code> are
                  substituted with each lead's actual data.
                </p>
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-gray-600">
                  Phone Number ID <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={vapi.phoneNumberId}
                  onChange={(e) => setVapi({ ...vapi, phoneNumberId: e.target.value })}
                  placeholder="e.g. pn_xxxxxxxxxxxxxxxx"
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm font-mono focus:border-sky-400 focus:outline-none"
                />
                <p className="mt-1 text-[11px] text-gray-400">
                  VAPI dashboard → Phone Numbers → copy the ID.
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Error */}
      {error && (
        <p className="mt-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>
      )}

      {/* Save button */}
      <div className="mt-6 flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving || loading}
          className={`flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-semibold text-white disabled:opacity-50 active:scale-95 transition-all duration-150 shadow-sm ${
            saved ? "bg-emerald-600 hover:bg-emerald-700" : "bg-indigo-600 hover:bg-indigo-700"
          }`}
        >
          {saved ? (
            <>
              <CheckCircle className="h-4 w-4" />
              Saved!
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              {saving ? "Saving…" : "Save Settings"}
            </>
          )}
        </button>
      </div>
    </div>
  );
}
