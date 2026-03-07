import { Search, Filter, MoreHorizontal, Package, Eye } from "lucide-react";
import { useState } from "react";

const orders = [
  { id: "#ORD-7291", customer: "Sarah Johnson", items: 3, amount: "$249.00", status: "Completed", date: "Mar 5, 2026", method: "Credit Card" },
  { id: "#ORD-7290", customer: "Mike Chen", items: 1, amount: "$129.00", status: "Processing", date: "Mar 5, 2026", method: "PayPal" },
  { id: "#ORD-7289", customer: "Emily Davis", items: 5, amount: "$549.00", status: "Completed", date: "Mar 4, 2026", method: "Credit Card" },
  { id: "#ORD-7288", customer: "James Wilson", items: 2, amount: "$89.00", status: "Pending", date: "Mar 4, 2026", method: "Stripe" },
  { id: "#ORD-7287", customer: "Lisa Park", items: 4, amount: "$349.00", status: "Completed", date: "Mar 3, 2026", method: "Credit Card" },
  { id: "#ORD-7286", customer: "Dev Patel", items: 1, amount: "$79.00", status: "Refunded", date: "Mar 3, 2026", method: "PayPal" },
  { id: "#ORD-7285", customer: "Chloe Martin", items: 2, amount: "$199.00", status: "Completed", date: "Mar 2, 2026", method: "Stripe" },
  { id: "#ORD-7284", customer: "Omar Hassan", items: 6, amount: "$720.00", status: "Processing", date: "Mar 2, 2026", method: "Credit Card" },
];

const statusColor: Record<string, string> = {
  Completed: "bg-emerald-50 text-emerald-700",
  Processing: "bg-brand-50 text-brand-700",
  Pending: "bg-amber-50 text-amber-700",
  Refunded: "bg-red-50 text-red-600",
};

const summaryCards = [
  { label: "Total Orders", value: "1,847", color: "bg-brand-50 text-brand-600" },
  { label: "Completed", value: "1,592", color: "bg-emerald-50 text-emerald-600" },
  { label: "Processing", value: "183", color: "bg-amber-50 text-amber-600" },
  { label: "Refunded", value: "72", color: "bg-red-50 text-red-600" },
];

export default function AdminOrders() {
  const [search, setSearch] = useState("");
  const filtered = orders.filter(
    (o) =>
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.customer.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-heading">Orders</h1>
        <p className="text-sm text-body-light">Manage and track all orders</p>
      </div>

      {/* Summary */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {summaryCards.map((card) => (
          <div key={card.label} className="rounded-xl border border-gray-200 bg-gray-100 p-4 shadow-card">
            <p className="text-xs font-medium text-body-light">{card.label}</p>
            <p className="mt-1 text-xl font-bold text-heading">{card.value}</p>
            <div className={`mt-2 inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold ${card.color}`}>
              {card.label}
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-body-light" />
          <input
            type="text"
            placeholder="Search orders..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-gray-200 bg-gray-100 py-2.5 pl-10 pr-4 text-sm text-heading placeholder:text-body-light focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
          />
        </div>
        <button className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-100 px-4 py-2.5 text-sm font-medium text-body transition hover:border-brand-300 hover:text-heading">
          <Filter className="h-4 w-4" />
          Filter
        </button>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-gray-100 shadow-card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-left text-xs font-medium uppercase tracking-wider text-body-light">
                <th className="px-5 py-3.5">Order</th>
                <th className="px-5 py-3.5">Customer</th>
                <th className="px-5 py-3.5">Items</th>
                <th className="px-5 py-3.5">Amount</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5">Payment</th>
                <th className="px-5 py-3.5">Date</th>
                <th className="px-5 py-3.5"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((order) => (
                <tr key={order.id} className="transition hover:bg-surface-muted">
                  <td className="whitespace-nowrap px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4 text-brand-400" />
                      <span className="font-medium text-heading">{order.id}</span>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-5 py-3.5 text-body">{order.customer}</td>
                  <td className="whitespace-nowrap px-5 py-3.5 text-body">{order.items}</td>
                  <td className="whitespace-nowrap px-5 py-3.5 font-medium text-heading">{order.amount}</td>
                  <td className="whitespace-nowrap px-5 py-3.5">
                    <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColor[order.status]}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-5 py-3.5 text-body-light">{order.method}</td>
                  <td className="whitespace-nowrap px-5 py-3.5 text-body-light">{order.date}</td>
                  <td className="whitespace-nowrap px-5 py-3.5">
                    <div className="flex items-center gap-1">
                      <button className="rounded-lg p-1.5 text-body-light transition hover:bg-brand-50 hover:text-brand-600">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="rounded-lg p-1.5 text-body-light transition hover:bg-surface-subtle hover:text-body">
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
