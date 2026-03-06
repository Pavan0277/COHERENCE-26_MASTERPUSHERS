import { useState } from "react";

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
  DollarSign,
  Activity,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  ShoppingCart,
  Eye,
  UserPlus,
  BarChart3,
  Clock,
  MoreHorizontal,
  ChevronDown,
  MessageSquare,
  Phone,
  Mail,
  Hash,
  Send,
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

const revenueData = [
  { month: "Jan", revenue: 4200, users: 180 },
  { month: "Feb", revenue: 5800, users: 240 },
  { month: "Mar", revenue: 4900, users: 210 },
  { month: "Apr", revenue: 7200, users: 320 },
  { month: "May", revenue: 6800, users: 290 },
  { month: "Jun", revenue: 8400, users: 380 },
  { month: "Jul", revenue: 9200, users: 420 },
];

const trafficData = [
  { day: "Mon", visits: 1200 },
  { day: "Tue", visits: 1800 },
  { day: "Wed", visits: 1400 },
  { day: "Thu", visits: 2200 },
  { day: "Fri", visits: 1900 },
  { day: "Sat", visits: 800 },
  { day: "Sun", visits: 600 },
];

const recentOrders = [
  { id: "#ORD-7291", customer: "Sarah Johnson", amount: "$249.00", status: "Completed", date: "Mar 5, 2026" },
  { id: "#ORD-7290", customer: "Mike Chen", amount: "$129.00", status: "Processing", date: "Mar 5, 2026" },
  { id: "#ORD-7289", customer: "Emily Davis", amount: "$549.00", status: "Completed", date: "Mar 4, 2026" },
  { id: "#ORD-7288", customer: "James Wilson", amount: "$89.00", status: "Pending", date: "Mar 4, 2026" },
  { id: "#ORD-7287", customer: "Lisa Park", amount: "$349.00", status: "Completed", date: "Mar 3, 2026" },
];

const recentUsers = [
  { name: "Aria Thompson", email: "aria@example.com", joined: "2 hours ago", avatar: "AT" },
  { name: "Dev Patel", email: "dev@example.com", joined: "5 hours ago", avatar: "DP" },
  { name: "Chloe Martin", email: "chloe@example.com", joined: "1 day ago", avatar: "CM" },
  { name: "Omar Hassan", email: "omar@example.com", joined: "2 days ago", avatar: "OH" },
];

const statusColor: Record<string, string> = {
  Completed: "bg-emerald-50 text-emerald-700",
  Processing: "bg-brand-50 text-brand-700",
  Pending: "bg-amber-50 text-amber-700",
};

const stats = [
  {
    label: "Total Users",
    value: "12,486",
    change: "+12.5%",
    up: true,
    icon: Users,
    color: "bg-brand-50 text-brand-600",
  },
  {
    label: "Revenue",
    value: "$48,290",
    change: "+8.2%",
    up: true,
    icon: DollarSign,
    color: "bg-emerald-50 text-emerald-600",
  },
  {
    label: "Active Sessions",
    value: "1,342",
    change: "-3.1%",
    up: false,
    icon: Activity,
    color: "bg-violet-50 text-violet-600",
  },
  {
    label: "Conversion Rate",
    value: "3.24%",
    change: "+1.8%",
    up: true,
    icon: TrendingUp,
    color: "bg-amber-50 text-amber-600",
  },
];

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
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="group rounded-xl border border-gray-200 bg-gray-100 p-5 shadow-card transition-all duration-300 hover:shadow-card-hover"
          >
            <div className="flex items-center justify-between">
              <div className={`rounded-lg p-2.5 ${stat.color}`}>
                <stat.icon className="h-5 w-5" />
              </div>
              <span
                className={`flex items-center gap-0.5 text-xs font-semibold ${
                  stat.up ? "text-emerald-600" : "text-red-500"
                }`}
              >
                {stat.up ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
                {stat.change}
              </span>
            </div>
            <p className="mt-3 text-2xl font-bold text-heading">{stat.value}</p>
            <p className="text-sm text-body-light">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid gap-5 lg:grid-cols-3">
        {/* Revenue Chart */}
        <div className="rounded-xl border border-gray-200 bg-gray-100 p-5 shadow-card lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-heading">Revenue Overview</h2>
              <p className="text-xs text-body-light">Monthly revenue & user growth</p>
            </div>
            <button className="rounded-lg p-1.5 text-body-light transition hover:bg-surface-subtle hover:text-body">
              <MoreHorizontal className="h-4 w-4" />
            </button>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2563EB" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="#2563EB" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #E5E7EB",
                  borderRadius: "0.75rem",
                  fontSize: "0.8rem",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                }}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#2563EB"
                strokeWidth={2.5}
                fill="url(#revenueGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Traffic Chart */}
        <div className="rounded-xl border border-gray-200 bg-gray-100 p-5 shadow-card">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-heading">Weekly Traffic</h2>
              <p className="text-xs text-body-light">Site visits this week</p>
            </div>
            <div className="rounded-lg bg-brand-50 p-1.5 text-brand-600">
              <BarChart3 className="h-4 w-4" />
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={trafficData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
              <XAxis dataKey="day" tick={{ fontSize: 12, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #E5E7EB",
                  borderRadius: "0.75rem",
                  fontSize: "0.8rem",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                }}
              />
              <Bar dataKey="visits" fill="#3B82F6" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid gap-5 lg:grid-cols-3">
        {/* Recent Orders */}
        <div className="rounded-xl border border-gray-200 bg-gray-100 shadow-card lg:col-span-2">
          <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
            <div className="flex items-center gap-2">
              <ShoppingCart className="h-4 w-4 text-brand-600" />
              <h2 className="text-base font-semibold text-heading">Recent Orders</h2>
            </div>
            <button className="text-xs font-medium text-brand-600 transition hover:text-brand-700">
              View All
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-50 text-left text-xs font-medium uppercase tracking-wider text-body-light">
                  <th className="px-5 py-3">Order</th>
                  <th className="px-5 py-3">Customer</th>
                  <th className="px-5 py-3">Amount</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="transition hover:bg-surface-muted">
                    <td className="whitespace-nowrap px-5 py-3 font-medium text-heading">{order.id}</td>
                    <td className="whitespace-nowrap px-5 py-3 text-body">{order.customer}</td>
                    <td className="whitespace-nowrap px-5 py-3 font-medium text-heading">{order.amount}</td>
                    <td className="whitespace-nowrap px-5 py-3">
                      <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColor[order.status]}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-5 py-3 text-body-light">{order.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* New Users */}
        <div className="rounded-xl border border-gray-200 bg-gray-100 shadow-card">
          <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
            <div className="flex items-center gap-2">
              <UserPlus className="h-4 w-4 text-brand-600" />
              <h2 className="text-base font-semibold text-heading">New Users</h2>
            </div>
            <button className="text-xs font-medium text-brand-600 transition hover:text-brand-700">
              View All
            </button>
          </div>
          <div className="divide-y divide-gray-50 px-5">
            {recentUsers.map((user) => (
              <div key={user.email} className="flex items-center gap-3 py-3.5">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-brand-700 text-xs font-bold text-white">
                  {user.avatar}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-heading">{user.name}</p>
                  <p className="truncate text-xs text-body-light">{user.email}</p>
                </div>
                <span className="shrink-0 text-xs text-body-light">{user.joined}</span>
              </div>
            ))}
          </div>

          {/* Quick Stats */}
          <div className="border-t border-gray-100 px-5 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Eye className="h-3.5 w-3.5 text-body-light" />
                <span className="text-xs text-body-light">Total signups today</span>
              </div>
              <span className="text-sm font-semibold text-brand-600">+28</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
