import { Search, Filter, UserPlus, MoreHorizontal, Mail, Shield, ShieldCheck } from "lucide-react";
import { useState } from "react";

const users = [
  { id: 1, name: "Sarah Johnson", email: "sarah@example.com", role: "Admin", status: "Active", joined: "Jan 12, 2026", avatar: "SJ" },
  { id: 2, name: "Mike Chen", email: "mike@example.com", role: "Editor", status: "Active", joined: "Feb 3, 2026", avatar: "MC" },
  { id: 3, name: "Emily Davis", email: "emily@example.com", role: "Viewer", status: "Active", joined: "Feb 18, 2026", avatar: "ED" },
  { id: 4, name: "James Wilson", email: "james@example.com", role: "Editor", status: "Inactive", joined: "Dec 5, 2025", avatar: "JW" },
  { id: 5, name: "Lisa Park", email: "lisa@example.com", role: "Admin", status: "Active", joined: "Nov 20, 2025", avatar: "LP" },
  { id: 6, name: "Dev Patel", email: "dev@example.com", role: "Viewer", status: "Active", joined: "Mar 1, 2026", avatar: "DP" },
  { id: 7, name: "Chloe Martin", email: "chloe@example.com", role: "Editor", status: "Inactive", joined: "Jan 25, 2026", avatar: "CM" },
  { id: 8, name: "Omar Hassan", email: "omar@example.com", role: "Viewer", status: "Active", joined: "Feb 27, 2026", avatar: "OH" },
];

const roleIcon: Record<string, typeof Shield> = {
  Admin: ShieldCheck,
  Editor: Shield,
  Viewer: Mail,
};

const roleColor: Record<string, string> = {
  Admin: "bg-brand-50 text-brand-700",
  Editor: "bg-violet-50 text-violet-700",
  Viewer: "bg-gray-100 text-gray-600",
};

const statusColor: Record<string, string> = {
  Active: "bg-emerald-50 text-emerald-700",
  Inactive: "bg-red-50 text-red-600",
};

export default function AdminUsers() {
  const [search, setSearch] = useState("");
  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-heading">User Management</h1>
          <p className="text-sm text-body-light">{users.length} total users</p>
        </div>
        <button className="btn-primary gap-2 text-xs">
          <UserPlus className="h-4 w-4" />
          Add User
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-body-light" />
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm text-heading placeholder:text-body-light focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
          />
        </div>
        <button className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-body transition hover:border-brand-300 hover:text-heading">
          <Filter className="h-4 w-4" />
          Filter
        </button>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-left text-xs font-medium uppercase tracking-wider text-body-light">
                <th className="px-5 py-3.5">User</th>
                <th className="px-5 py-3.5">Role</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5">Joined</th>
                <th className="px-5 py-3.5"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((user) => {
                const Icon = roleIcon[user.role] || Mail;
                return (
                  <tr key={user.id} className="transition hover:bg-surface-muted">
                    <td className="whitespace-nowrap px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-brand-700 text-xs font-bold text-white">
                          {user.avatar}
                        </div>
                        <div>
                          <p className="font-medium text-heading">{user.name}</p>
                          <p className="text-xs text-body-light">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-5 py-3.5">
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${roleColor[user.role]}`}>
                        <Icon className="h-3 w-3" />
                        {user.role}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-5 py-3.5">
                      <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColor[user.status]}`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-5 py-3.5 text-body-light">{user.joined}</td>
                    <td className="whitespace-nowrap px-5 py-3.5">
                      <button className="rounded-lg p-1.5 text-body-light transition hover:bg-surface-subtle hover:text-body">
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
