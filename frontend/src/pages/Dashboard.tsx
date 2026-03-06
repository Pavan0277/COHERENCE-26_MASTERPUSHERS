import { useState, useEffect, useMemo } from "react";

function getUserName(): string {
  try {
    const raw = localStorage.getItem("user");
    if (!raw) return "";
    const user = JSON.parse(raw);
    return user?.fullName || user?.email?.split("@")[0] || "";
  } catch {
    return "";
  }
}
import {
  Users,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  GitBranch,
  BarChart3,
  Clock,
  MoreHorizontal,
  ChevronDown,
  MessageSquare,
  Phone,
  Mail,
  Hash,
  Send,
  CheckCircle2,
  XCircle,
  Inbox,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { getAnalytics, getWorkflows } from "../services/api";

const channels = [
  { id: "slack", label: "Slack", icon: MessageSquare, color: "text-[#E01E5A]" },
  { id: "call", label: "Call", icon: Phone, color: "text-emerald-500" },
  { id: "email", label: "Email", icon: Mail, color: "text-brand-600" },
  { id: "discord", label: "Discord", icon: Hash, color: "text-[#5865F2]" },
  { id: "telegram", label: "Telegram", icon: Send, color: "text-[#229ED9]" },
];

export default function Dashboard() {
  const [selectedChannel, setSelectedChannel] = useState(channels[0]);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  type Analytics = {
    totalSent: number;
    totalFailed: number;
    totalReplied: number;
    successRate: number;
    byPlatform: Record<string, { sent: number; failed: number; replied: number }>;
    recentLogs: Array<{ leadName: string; platform: string; status: string; error: string | null; sentAt: string }>;
  };
  const [analytics, setAnalytics] = useState<Analytics | null>(null);

  type Workflow = { _id: string; name: string; nodes: unknown[]; edges: unknown[]; createdAt: string; updatedAt: string };
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getAnalytics().then((res) => setAnalytics(res.data)).catch(() => {}),
      getWorkflows().then((res) => setWorkflows(res.data.workflows ?? [])).catch(() => {}),
    ]).finally(() => setLoading(false));
  }, []);

  // Sends-per-day from analytics logs
  const sendsPerDay = useMemo(() => {
    if (!analytics?.recentLogs.length) return [];
    const groups: Record<string, number> = {};
    for (const log of analytics.recentLogs) {
      const key = new Date(log.sentAt).toLocaleDateString("en-US", { month: "short", day: "numeric" });
      groups[key] = (groups[key] || 0) + 1;
    }
    return Object.entries(groups).map(([day, sends]) => ({ day, sends }));
  }, [analytics]);

  const platformChartData = useMemo(() => [
    { name: "Email",    sent: analytics?.byPlatform?.email?.sent    ?? 0, failed: analytics?.byPlatform?.email?.failed    ?? 0 },
    { name: "Slack",    sent: analytics?.byPlatform?.slack?.sent    ?? 0, failed: analytics?.byPlatform?.slack?.failed    ?? 0 },
    { name: "Telegram", sent: analytics?.byPlatform?.telegram?.sent ?? 0, failed: analytics?.byPlatform?.telegram?.failed ?? 0 },
  ], [analytics]);

  const dynamicStats = [
    { label: "Total Workflows", value: loading ? "…" : String(workflows.length),              change: "", up: true, icon: GitBranch,  color: "bg-brand-50 text-brand-600"   },
    { label: "Messages Sent",   value: loading ? "…" : String(analytics?.totalSent   ?? 0),   change: "", up: true, icon: Send,       color: "bg-emerald-50 text-emerald-600" },
    { label: "Success Rate",    value: loading ? "…" : `${analytics?.successRate    ?? 0}%`,  change: "", up: (analytics?.successRate ?? 0) >= 50, icon: TrendingUp, color: "bg-violet-50 text-violet-600" },
    { label: "Replies",         value: loading ? "…" : String(analytics?.totalReplied ?? 0),  change: "", up: true, icon: Users,      color: "bg-amber-50 text-amber-600"   },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-heading">
            {getUserName() ? `Welcome back, ${getUserName()}!` : "Dashboard"}
          </h1>
          <p className="text-sm text-body-light">Here's what's happening today.</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Channel Selector */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-100 px-3.5 py-2 text-sm font-medium text-heading shadow-card transition hover:border-brand-300 hover:shadow-card-hover"
            >
              <selectedChannel.icon className={`h-4 w-4 ${selectedChannel.color}`} />
              {selectedChannel.label}
              <ChevronDown className={`h-4 w-4 text-body-light transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
            </button>
            {dropdownOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)} />
                <div className="absolute right-0 z-20 mt-1.5 w-48 rounded-xl border border-gray-200 bg-gray-100 py-1 shadow-elevated">
                  {channels.map((ch) => (
                    <button
                      key={ch.id}
                      onClick={() => {
                        setSelectedChannel(ch);
                        setDropdownOpen(false);
                      }}
                      className={`flex w-full items-center gap-2.5 px-3.5 py-2.5 text-sm transition ${
                        selectedChannel.id === ch.id
                          ? "bg-brand-50 font-medium text-brand-700"
                          : "text-body hover:bg-surface-subtle hover:text-heading"
                      }`}
                    >
                      <ch.icon className={`h-4 w-4 ${ch.color}`} />
                      {ch.label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          <span className="flex items-center gap-1.5 rounded-lg bg-brand-50 px-3 py-1.5 text-xs font-medium text-brand-700">
            <Clock className="h-3.5 w-3.5" />
            Last updated: just now
          </span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {dynamicStats.map((stat) => (
          <div
            key={stat.label}
            className="group rounded-xl border border-gray-200 bg-gray-100 p-5 shadow-card transition-all duration-300 hover:shadow-card-hover"
          >
            <div className="flex items-center justify-between">
              <div className={`rounded-lg p-2.5 ${stat.color}`}>
                <stat.icon className="h-5 w-5" />
              </div>
              {stat.change ? (
                <span className={`flex items-center gap-0.5 text-xs font-semibold ${
                  stat.up ? "text-emerald-600" : "text-red-500"
                }`}>
                  {stat.up ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
                  {stat.change}
                </span>
              ) : (
                <span className="text-[10px] font-medium text-body-light">live</span>
              )}
            </div>
            <p className="mt-3 text-2xl font-bold text-heading">{stat.value}</p>
            <p className="text-sm text-body-light">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid gap-5 lg:grid-cols-3">
        {/* Sends Over Time Chart */}
        <div className="rounded-xl border border-gray-200 bg-gray-100 p-5 shadow-card lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-heading">Sends Over Time</h2>
              <p className="text-xs text-body-light">Messages sent per day (last 20 sends)</p>
            </div>
            <button className="rounded-lg p-1.5 text-body-light transition hover:bg-surface-subtle hover:text-body">
              <MoreHorizontal className="h-4 w-4" />
            </button>
          </div>
          {sendsPerDay.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={sendsPerDay}>
                <defs>
                  <linearGradient id="sendsGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10B981" stopOpacity={0.2} />
                    <stop offset="100%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                <XAxis dataKey="day" tick={{ fontSize: 12, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: "#9CA3AF" }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip contentStyle={{ backgroundColor: "#fff", border: "1px solid #E5E7EB", borderRadius: "0.75rem", fontSize: "0.8rem", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }} />
                <Area type="monotone" dataKey="sends" name="Sends" stroke="#10B981" strokeWidth={2.5} fill="url(#sendsGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-[280px] items-center justify-center text-sm text-body-light">
              No send data yet — run a workflow to see activity.
            </div>
          )}
        </div>

        {/* By Platform Chart */}
        <div className="rounded-xl border border-gray-200 bg-gray-100 p-5 shadow-card">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-heading">By Platform</h2>
              <p className="text-xs text-body-light">Sent vs failed per channel</p>
            </div>
            <div className="rounded-lg bg-brand-50 p-1.5 text-brand-600">
              <BarChart3 className="h-4 w-4" />
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={platformChartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: "#9CA3AF" }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip contentStyle={{ backgroundColor: "#fff", border: "1px solid #E5E7EB", borderRadius: "0.75rem", fontSize: "0.8rem", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }} />
              <Bar dataKey="sent"   name="Sent"   fill="#10B981" radius={[6, 6, 0, 0]} />
              <Bar dataKey="failed" name="Failed" fill="#EF4444" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid gap-5 lg:grid-cols-3">
        {/* Recent Workflows */}
        <div className="rounded-xl border border-gray-200 bg-gray-100 shadow-card lg:col-span-2">
          <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
            <div className="flex items-center gap-2">
              <GitBranch className="h-4 w-4 text-brand-600" />
              <h2 className="text-base font-semibold text-heading">Recent Workflows</h2>
            </div>
            <button onClick={() => window.location.href = "/workflows/new"} className="text-xs font-medium text-brand-600 transition hover:text-brand-700">
              + New
            </button>
          </div>
          {workflows.length === 0 ? (
            <div className="flex h-36 items-center justify-center text-sm text-body-light">
              {loading ? "Loading…" : "No workflows yet. Create your first one!"}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-50 text-left text-xs font-medium uppercase tracking-wider text-body-light">
                    <th className="px-5 py-3">Workflow</th>
                    <th className="px-5 py-3">Nodes</th>
                    <th className="px-5 py-3">Edges</th>
                    <th className="px-5 py-3">Created</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {workflows.slice(0, 5).map((wf) => (
                    <tr
                      key={wf._id}
                      className="cursor-pointer transition hover:bg-surface-muted"
                      onClick={() => window.location.href = `/workflows/${wf._id}`}
                    >
                      <td className="whitespace-nowrap px-5 py-3 font-medium text-heading">{wf.name}</td>
                      <td className="whitespace-nowrap px-5 py-3 text-body">{(wf.nodes as unknown[]).length} nodes</td>
                      <td className="whitespace-nowrap px-5 py-3 text-body">{(wf.edges as unknown[]).length} edges</td>
                      <td className="whitespace-nowrap px-5 py-3 text-body-light">
                        {new Date(wf.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Recent Outreach Leads */}
        <div className="rounded-xl border border-gray-200 bg-gray-100 shadow-card">
          <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-brand-600" />
              <h2 className="text-base font-semibold text-heading">Recent Leads Reached</h2>
            </div>
          </div>
          <div className="divide-y divide-gray-50 px-5">
            {!analytics?.recentLogs.length ? (
              <p className="py-8 text-center text-sm text-body-light">
                {loading ? "Loading…" : "No outreach sent yet."}
              </p>
            ) : (
              analytics.recentLogs.slice(0, 5).map((log, i) => (
                <div key={i} className="flex items-center gap-3 py-3.5">
                  <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${
                    log.platform === "email" ? "bg-blue-500" : log.platform === "slack" ? "bg-pink-500" : "bg-sky-500"
                  }`}>
                    {(log.leadName || "?").slice(0, 2).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-heading">{log.leadName || "Unknown"}</p>
                    <p className="truncate text-xs text-body-light capitalize">{log.platform}</p>
                  </div>
                  <span className={`shrink-0 inline-flex items-center gap-1 text-xs font-medium ${
                    log.status === "sent" ? "text-emerald-600" : log.status === "replied" ? "text-brand-600" : "text-red-500"
                  }`}>
                    {log.status === "sent" ? <CheckCircle2 className="h-3.5 w-3.5" /> : log.status === "replied" ? <CheckCircle2 className="h-3.5 w-3.5" /> : <XCircle className="h-3.5 w-3.5" />}
                    {log.status}
                  </span>
                </div>
              ))
            )}
          </div>

          {/* Summary footer */}
          <div className="border-t border-gray-100 px-5 py-4">
            <div className="flex items-center justify-between">
              <span className="text-xs text-body-light">Total messages sent</span>
              <span className="text-sm font-semibold text-brand-600">{analytics?.totalSent ?? 0}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Outreach Analytics ───────────────────────────────── */}
      <div className="grid gap-5 lg:grid-cols-3">

        {/* Recent send activity */}
        <div className="rounded-xl border border-gray-200 bg-gray-100 shadow-card lg:col-span-2">
          <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
            <div className="flex items-center gap-2">
              <Inbox className="h-4 w-4 text-brand-600" />
              <h2 className="text-base font-semibold text-heading">Outreach Activity</h2>
            </div>
            <span className="text-xs text-body-light">Last 20 sends</span>
          </div>
          {!analytics || analytics.recentLogs.length === 0 ? (
            <div className="flex h-36 items-center justify-center text-sm text-body-light">
              No messages sent yet. Run a workflow to see activity.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-50 text-left text-xs font-medium uppercase tracking-wider text-body-light">
                    <th className="px-5 py-3">Lead</th>
                    <th className="px-5 py-3">Platform</th>
                    <th className="px-5 py-3">Status</th>
                    <th className="px-5 py-3">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {analytics.recentLogs.map((log, i) => (
                    <tr key={i} className="transition hover:bg-surface-muted">
                      <td className="whitespace-nowrap px-5 py-3 font-medium text-heading">{log.leadName || "—"}</td>
                      <td className="whitespace-nowrap px-5 py-3">
                        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          log.platform === "email"    ? "bg-blue-50 text-blue-700" :
                          log.platform === "slack"    ? "bg-pink-50 text-pink-700" :
                          "bg-sky-50 text-sky-700"
                        }`}>
                          {log.platform === "email" && <Mail className="h-3 w-3" />}
                          {log.platform === "slack" && <MessageSquare className="h-3 w-3" />}
                          {log.platform === "telegram" && <Send className="h-3 w-3" />}
                          {log.platform}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-5 py-3">
                        {log.status === "sent" ? (
                          <span className="inline-flex items-center gap-1 text-emerald-600 text-xs font-medium">
                            <CheckCircle2 className="h-3.5 w-3.5" /> Sent
                          </span>
                        ) : log.status === "replied" ? (
                          <span className="inline-flex items-center gap-1 text-brand-600 text-xs font-medium">
                            <CheckCircle2 className="h-3.5 w-3.5" /> Replied
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-red-500 text-xs font-medium" title={log.error || ""}>
                            <XCircle className="h-3.5 w-3.5" /> Failed
                          </span>
                        )}
                      </td>
                      <td className="whitespace-nowrap px-5 py-3 text-body-light text-xs">
                        {new Date(log.sentAt).toLocaleString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Platform summary + totals */}
        <div className="flex flex-col gap-4">

          {/* Totals */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Sent",        value: analytics?.totalSent   ?? 0, color: "text-emerald-600", bg: "bg-emerald-50" },
              { label: "Failed",      value: analytics?.totalFailed ?? 0, color: "text-red-500",     bg: "bg-red-50" },
              { label: "Success Rate",value: `${analytics?.successRate ?? 0}%`, color: "text-brand-700", bg: "bg-brand-50" },
              { label: "Replies",     value: analytics?.totalReplied ?? 0, color: "text-violet-600", bg: "bg-violet-50" },
            ].map((s) => (
              <div key={s.label} className={`rounded-xl border border-gray-200 ${s.bg} p-3.5`}>
                <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
                <p className="text-xs text-body-light">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Per-platform bar */}
          <div className="flex-1 rounded-xl border border-gray-200 bg-gray-100 p-5 shadow-card">
            <h3 className="mb-4 text-sm font-semibold text-heading">By Platform</h3>
            {analytics ? (
              <ResponsiveContainer width="100%" height={160}>
                <BarChart
                  data={[
                    { name: "Email",    sent: analytics.byPlatform.email?.sent    ?? 0, failed: analytics.byPlatform.email?.failed    ?? 0 },
                    { name: "Slack",    sent: analytics.byPlatform.slack?.sent    ?? 0, failed: analytics.byPlatform.slack?.failed    ?? 0 },
                    { name: "Telegram", sent: analytics.byPlatform.telegram?.sent ?? 0, failed: analytics.byPlatform.telegram?.failed ?? 0 },
                  ]}
                  margin={{ top: 0, right: 0, left: -20, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#fff", border: "1px solid #E5E7EB", borderRadius: "0.75rem", fontSize: "0.75rem" }}
                  />
                  <Bar dataKey="sent"   name="Sent"   fill="#10B981" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="failed" name="Failed" fill="#EF4444" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-32 items-center justify-center text-xs text-body-light">No data yet</div>
            )}
            <div className="mt-2 flex items-center gap-4">
              <span className="flex items-center gap-1.5 text-[11px] text-body-light"><span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />Sent</span>
              <span className="flex items-center gap-1.5 text-[11px] text-body-light"><span className="h-2.5 w-2.5 rounded-full bg-red-400" />Failed</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
