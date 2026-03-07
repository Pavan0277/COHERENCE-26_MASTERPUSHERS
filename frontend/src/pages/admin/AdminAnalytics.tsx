import { TrendingUp, Users, DollarSign, Eye, Globe, Monitor, Smartphone, Tablet } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";

const monthlyData = [
  { month: "Aug", revenue: 3200, users: 120 },
  { month: "Sep", revenue: 4100, users: 160 },
  { month: "Oct", revenue: 3800, users: 145 },
  { month: "Nov", revenue: 5200, users: 210 },
  { month: "Dec", revenue: 6100, users: 280 },
  { month: "Jan", revenue: 7400, users: 340 },
  { month: "Feb", revenue: 8200, users: 390 },
  { month: "Mar", revenue: 9100, users: 420 },
];

const deviceData = [
  { name: "Desktop", value: 58, color: "#2563EB" },
  { name: "Mobile", value: 32, color: "#3B82F6" },
  { name: "Tablet", value: 10, color: "#93C5FD" },
];

const pageData = [
  { page: "/home", views: 4280 },
  { page: "/products", views: 3120 },
  { page: "/pricing", views: 2540 },
  { page: "/about", views: 1890 },
  { page: "/blog", views: 1420 },
];

const trafficSources = [
  { source: "Organic Search", percent: 42, color: "bg-brand-500" },
  { source: "Direct", percent: 28, color: "bg-brand-400" },
  { source: "Social Media", percent: 18, color: "bg-brand-300" },
  { source: "Referral", percent: 12, color: "bg-brand-200" },
];

const deviceIcon: Record<string, typeof Monitor> = {
  Desktop: Monitor,
  Mobile: Smartphone,
  Tablet: Tablet,
};

const stats = [
  { label: "Page Views", value: "284K", change: "+14.2%", icon: Eye, color: "bg-brand-50 text-brand-600" },
  { label: "Unique Visitors", value: "52.4K", change: "+9.1%", icon: Users, color: "bg-violet-50 text-violet-600" },
  { label: "Avg. Revenue/User", value: "$24.80", change: "+5.3%", icon: DollarSign, color: "bg-emerald-50 text-emerald-600" },
  { label: "Bounce Rate", value: "32.1%", change: "-2.4%", icon: TrendingUp, color: "bg-amber-50 text-amber-600" },
];

const tooltipStyle = {
  backgroundColor: "#fff",
  border: "1px solid #E5E7EB",
  borderRadius: "0.75rem",
  fontSize: "0.8rem",
  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
};

export default function AdminAnalytics() {
  return (
    <div className="space-y-6">
      <div>
        <div className="mb-1 h-1 w-10 rounded-full bg-gradient-to-r from-brand-500 to-brand-300" />
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">Analytics</h1>
        <p className="mt-1 text-sm font-medium text-gray-400">Track performance and engagement metrics</p>
      </div>

      {/* Stat Cards */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl border border-gray-200 bg-gray-100 p-5 shadow-card">
            <div className="flex items-center justify-between">
              <div className={`rounded-lg p-2.5 ${s.color}`}>
                <s.icon className="h-5 w-5" />
              </div>
              <span className="text-xs font-semibold text-emerald-600">{s.change}</span>
            </div>
            <p className="mt-3 text-2xl font-bold text-heading">{s.value}</p>
            <p className="text-sm text-body-light">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid gap-5 lg:grid-cols-3">
        {/* Revenue & Users */}
        <div className="rounded-xl border border-gray-200 bg-gray-100 p-5 shadow-card lg:col-span-2">
          <h2 className="text-base font-semibold text-heading">Revenue & User Growth</h2>
          <p className="mb-4 text-xs text-body-light">Last 8 months</p>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={monthlyData}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2563EB" stopOpacity={0.15} />
                  <stop offset="100%" stopColor="#2563EB" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="userGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8B5CF6" stopOpacity={0.15} />
                  <stop offset="100%" stopColor="#8B5CF6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Area type="monotone" dataKey="revenue" stroke="#2563EB" strokeWidth={2} fill="url(#revGrad)" />
              <Area type="monotone" dataKey="users" stroke="#8B5CF6" strokeWidth={2} fill="url(#userGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Device Breakdown */}
        <div className="rounded-xl border border-gray-200 bg-gray-100 p-5 shadow-card">
          <div className="mb-2 flex items-center gap-2">
            <Globe className="h-4 w-4 text-brand-600" />
            <h2 className="text-base font-semibold text-heading">Device Breakdown</h2>
          </div>
          <p className="mb-4 text-xs text-body-light">User sessions by device</p>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={deviceData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} dataKey="value" strokeWidth={2} stroke="#fff">
                {deviceData.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-2 space-y-2.5">
            {deviceData.map((d) => {
              const Icon = deviceIcon[d.name] || Monitor;
              return (
                <div key={d.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4" style={{ color: d.color }} />
                    <span className="text-sm text-body">{d.name}</span>
                  </div>
                  <span className="text-sm font-semibold text-heading">{d.value}%</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid gap-5 lg:grid-cols-2">
        {/* Top Pages */}
        <div className="rounded-xl border border-gray-200 bg-gray-100 p-5 shadow-card">
          <h2 className="text-base font-semibold text-heading">Top Pages</h2>
          <p className="mb-4 text-xs text-body-light">Most visited pages this month</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={pageData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
              <XAxis type="number" tick={{ fontSize: 12, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="page" tick={{ fontSize: 12, fill: "#6B7280" }} axisLine={false} tickLine={false} width={80} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="views" fill="#3B82F6" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Traffic Sources */}
        <div className="rounded-xl border border-gray-200 bg-gray-100 p-5 shadow-card">
          <h2 className="text-base font-semibold text-heading">Traffic Sources</h2>
          <p className="mb-5 text-xs text-body-light">Where visitors are coming from</p>
          <div className="space-y-5">
            {trafficSources.map((t) => (
              <div key={t.source}>
                <div className="mb-1.5 flex items-center justify-between">
                  <span className="text-sm font-medium text-heading">{t.source}</span>
                  <span className="text-sm font-semibold text-heading">{t.percent}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-gray-200">
                  <div className={`h-full rounded-full ${t.color}`} style={{ width: `${t.percent}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
