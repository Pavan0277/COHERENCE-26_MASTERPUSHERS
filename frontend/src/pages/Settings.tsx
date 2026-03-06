import { useEffect, useState } from "react";
import { Mail, MessageSquare, Send, Save, CheckCircle, Eye, EyeOff } from "lucide-react";
import { getSettings, updateSettings } from "../services/api";

type Tab = "email" | "slack" | "telegram";

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

const DEFAULT_EMAIL: EmailConfig = { host: "smtp.gmail.com", port: 587, secure: false, user: "", pass: "", from: "" };
const DEFAULT_SLACK: SlackConfig = { webhookUrl: "" };
const DEFAULT_TELEGRAM: TelegramConfig = { botToken: "", chatId: "", apiId: 0, apiHash: "", sessionString: "" };

export default function Settings() {
  const [activeTab, setActiveTab] = useState<Tab>("email");

  const [email, setEmail]       = useState<EmailConfig>(DEFAULT_EMAIL);
  const [slack, setSlack]       = useState<SlackConfig>(DEFAULT_SLACK);
  const [telegram, setTelegram] = useState<TelegramConfig>(DEFAULT_TELEGRAM);

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

      await updateSettings({ email: emailPayload, slack, telegram });
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
  ];

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Messaging Settings</h1>
        <p className="mt-1 text-sm text-gray-500">
          Configure the credentials used when your workflows send messages to leads.
        </p>
      </div>

      {/* Tab bar */}
      <div className="mb-6 flex gap-1 rounded-xl border border-gray-200 bg-gray-50 p-1">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-medium transition-all ${
              activeTab === id
                ? "bg-white shadow-sm text-gray-900"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <Icon className="h-4 w-4" />
            {label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex h-40 items-center justify-center text-sm text-gray-400">
          Loading settings…
        </div>
      ) : (
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
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
        </div>
      )}

      {/* Error */}
      {error && (
        <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
      )}

      {/* Save button */}
      <div className="mt-6 flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving || loading}
          className="flex items-center gap-2 rounded-xl bg-gray-900 px-6 py-2.5 text-sm font-medium text-white hover:bg-gray-700 disabled:opacity-50 transition"
        >
          {saved ? (
            <>
              <CheckCircle className="h-4 w-4 text-green-400" />
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
