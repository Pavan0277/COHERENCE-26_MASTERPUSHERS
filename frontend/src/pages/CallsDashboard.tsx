import { useEffect, useState, useCallback } from "react";
import { Phone, ChevronDown, ChevronUp, RefreshCw, Clock, User, PhoneCall } from "lucide-react";
import { getCallTranscripts, getCallTranscript } from "../services/api";

interface TranscriptEntry {
  role: "caller" | "ai" | "system";
  content: string;
  timestamp: string;
}

interface CallRecord {
  _id: string;
  callId: string;
  vapiId?: string;
  phoneNumber?: string;
  status: string;
  duration?: number;
  transcript: TranscriptEntry[];
  summary?: string;
  createdAt: string;
  leadId?: { name?: string; phone?: string; email?: string };
}

const STATUS_COLORS: Record<string, string> = {
  initiated:   "bg-gray-100 text-gray-600",
  ringing:     "bg-yellow-100 text-yellow-700",
  "in-progress": "bg-blue-100 text-blue-700",
  completed:   "bg-green-100 text-green-700",
  failed:      "bg-red-100 text-red-700",
  "no-answer": "bg-orange-100 text-orange-700",
};

function formatDuration(sec?: number) {
  if (!sec) return "—";
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}m ${s}s`;
}

function TranscriptDrawer({ callId, onClose }: { callId: string; onClose: () => void }) {
  const [data, setData] = useState<CallRecord | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCallTranscript(callId)
      .then((r) => setData(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [callId]);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center">
      <div className="flex w-full max-w-lg flex-col rounded-2xl bg-white shadow-2xl max-h-[80vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 bg-sky-500 px-5 py-4 rounded-t-2xl">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-white/70">Transcript</p>
            <p className="text-sm font-semibold text-white">
              {data?.leadId?.name || data?.phoneNumber || callId}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg px-3 py-1.5 text-xs font-semibold text-white/80 hover:bg-white/20"
          >
            Close
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {loading && (
            <div className="flex justify-center py-10">
              <RefreshCw className="h-5 w-5 animate-spin text-sky-400" />
            </div>
          )}

          {!loading && (!data?.transcript || data.transcript.length === 0) && (
            <p className="py-8 text-center text-sm text-gray-400">
              No transcript entries yet — the call may still be in progress or ended with no speech.
            </p>
          )}

          {!loading &&
            data?.transcript.map((entry, idx) => (
              <div
                key={idx}
                className={`flex gap-3 ${entry.role === "ai" ? "flex-row-reverse" : ""}`}
              >
                <div
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                    entry.role === "ai"
                      ? "bg-sky-500 text-white"
                      : entry.role === "caller"
                      ? "bg-gray-200 text-gray-600"
                      : "bg-amber-100 text-amber-600"
                  }`}
                >
                  {entry.role === "ai" ? "AI" : entry.role === "caller" ? <User className="h-3.5 w-3.5" /> : "S"}
                </div>
                <div
                  className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${
                    entry.role === "ai"
                      ? "bg-sky-50 text-sky-900"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {entry.content}
                  <p className="mt-1 text-[10px] text-gray-400">
                    {new Date(entry.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
        </div>

        {data?.summary && (
          <div className="border-t border-gray-100 px-5 py-3 bg-gray-50 rounded-b-2xl">
            <p className="text-xs font-medium text-gray-500 mb-1">Summary</p>
            <p className="text-sm text-gray-700">{data.summary}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function CallsDashboard() {
  const [records, setRecords]   = useState<CallRecord[]>([]);
  const [total, setTotal]       = useState(0);
  const [page, setPage]         = useState(1);
  const [loading, setLoading]   = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const LIMIT = 20;

  const load = useCallback(async (p: number) => {
    setLoading(true);
    try {
      const res = await getCallTranscripts({ page: p, limit: LIMIT });
      setRecords(res.data.records);
      setTotal(res.data.total);
      setPage(p);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(1); }, [load]);

  const totalPages = Math.ceil(total / LIMIT);

  return (
    <div className="min-h-full bg-gray-50 p-6">
      {/* Selected transcript drawer */}
      {selected && (
        <TranscriptDrawer callId={selected} onClose={() => setSelected(null)} />
      )}

      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Calls Dashboard</h1>
          <p className="mt-0.5 text-sm text-gray-500">
            All outbound VAPI calls and their transcripts
          </p>
        </div>
        <button
          onClick={() => load(page)}
          className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-600 shadow-sm hover:bg-gray-50"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* Stats bar */}
      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: "Total Calls",  value: total,                                                                       icon: PhoneCall, color: "text-sky-600 bg-sky-50" },
          { label: "Completed",    value: records.filter((r) => r.status === "completed").length,                      icon: Phone,     color: "text-green-600 bg-green-50" },
          { label: "Failed",       value: records.filter((r) => r.status === "failed" || r.status === "no-answer").length, icon: Phone, color: "text-red-600 bg-red-50" },
          { label: "In Progress",  value: records.filter((r) => r.status === "in-progress" || r.status === "ringing").length, icon: Phone, color: "text-blue-600 bg-blue-50" },
        ].map((stat) => (
          <div key={stat.label} className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <div className={`mb-2 inline-flex rounded-lg p-2 ${stat.color}`}>
              <stat.icon className="h-4 w-4" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-xs text-gray-500">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        {loading && records.length === 0 ? (
          <div className="flex items-center justify-center py-16">
            <RefreshCw className="h-6 w-6 animate-spin text-sky-400" />
          </div>
        ) : records.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <Phone className="mb-3 h-10 w-10 opacity-30" />
            <p className="text-sm font-medium">No calls yet</p>
            <p className="mt-1 text-xs">
              Add a <strong>VAPI Call</strong> node to a workflow and run it.
            </p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                <th className="px-5 py-3">Lead</th>
                <th className="px-5 py-3">Phone</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Duration</th>
                <th className="px-5 py-3">Entries</th>
                <th className="px-5 py-3">Date</th>
                <th className="px-5 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {records.map((rec) => (
                <tr key={rec._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3.5 font-medium text-gray-800">
                    {rec.leadId?.name || "—"}
                  </td>
                  <td className="px-5 py-3.5 text-gray-600 font-mono text-xs">
                    {rec.phoneNumber || rec.leadId?.phone || "—"}
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${STATUS_COLORS[rec.status] || "bg-gray-100 text-gray-600"}`}>
                      {rec.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-gray-500">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatDuration(rec.duration)}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-gray-500">
                    {rec.transcript.length} msg{rec.transcript.length !== 1 ? "s" : ""}
                  </td>
                  <td className="px-5 py-3.5 text-gray-400 text-xs">
                    {new Date(rec.createdAt).toLocaleString()}
                  </td>
                  <td className="px-5 py-3.5">
                    <button
                      onClick={() => setSelected(rec.callId)}
                      className="rounded-lg border border-sky-200 bg-sky-50 px-3 py-1.5 text-xs font-semibold text-sky-700 hover:bg-sky-100 transition"
                    >
                      View Transcript
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-gray-100 px-5 py-3">
            <p className="text-xs text-gray-500">
              Showing {(page - 1) * LIMIT + 1}–{Math.min(page * LIMIT, total)} of {total}
            </p>
            <div className="flex gap-2">
              <button
                disabled={page <= 1}
                onClick={() => load(page - 1)}
                className="flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-40"
              >
                <ChevronUp className="h-3.5 w-3.5 -rotate-90" /> Prev
              </button>
              <button
                disabled={page >= totalPages}
                onClick={() => load(page + 1)}
                className="flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-40"
              >
                Next <ChevronDown className="h-3.5 w-3.5 -rotate-90" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
