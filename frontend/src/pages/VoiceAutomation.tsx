import { useState, useEffect, useRef } from "react";
import {
  initiateCall,
  listTranscripts,
  getTranscript,
} from "../services/voiceService";

type TranscriptEntry = {
  role: "caller" | "ai";
  content: string;
  timestamp: string;
};

type CallTranscript = {
  callId: string;
  vonageUuid?: string;
  phoneNumber: string;
  status: string;
  transcript: TranscriptEntry[];
  createdAt: string;
  metadata?: { duration?: number; endedAt?: string };
};

export default function VoiceAutomation() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [transcripts, setTranscripts] = useState<CallTranscript[]>([]);
  const [selectedTranscript, setSelectedTranscript] =
    useState<CallTranscript | null>(null);
  const [loadingTranscripts, setLoadingTranscripts] = useState(true);
  const lastFetchRef = useRef<number>(0);
  const minFetchIntervalMs = 30_000; // Don't refetch more than once per 30 seconds

  const fetchTranscripts = async (force = false) => {
    const now = Date.now();
    if (!force && now - lastFetchRef.current < minFetchIntervalMs) return;
    lastFetchRef.current = now;
    try {
      setLoadingTranscripts(true);
      const res = await listTranscripts(1, 20);
      setTranscripts(res.data?.data || []);
    } catch {
      setTranscripts([]);
    } finally {
      setLoadingTranscripts(false);
    }
  };

  useEffect(() => {
    fetchTranscripts(true); // Initial load
    const interval = setInterval(() => fetchTranscripts(false), 60_000); // Poll every 60 seconds
    return () => clearInterval(interval);
  }, []);

  const handleInitiateCall = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    if (!phoneNumber.trim()) {
      setError("Please enter a phone number");
      return;
    }
    try {
      setLoading(true);
      const res = await initiateCall(phoneNumber.trim());
      setSuccess(
        `Call initiated to ${phoneNumber}. Call ID: ${res.data?.data?.callId ?? "N/A"}`
      );
      setPhoneNumber("");
      fetchTranscripts(true); // Force refresh after new call
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Failed to initiate call";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleViewTranscript = async (callId: string) => {
    try {
      const res = await getTranscript(callId);
      setSelectedTranscript(res.data?.data || null);
    } catch {
      setSelectedTranscript(null);
    }
  };

  const statusColors: Record<string, string> = {
    initiated: "bg-blue-100 text-blue-800",
    ringing: "bg-amber-100 text-amber-800",
    answered: "bg-green-100 text-green-800",
    in_progress: "bg-indigo-100 text-indigo-800",
    ended: "bg-gray-100 text-gray-800",
    failed: "bg-red-100 text-red-800",
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">
          AI Voice Automation
        </h1>
        <p className="mt-2 text-gray-500">
          Initiate AI-controlled outbound calls with Vonage Voice API. The system
          uses speech recognition, workflow logic, and text-to-speech for
          real-time conversation.
        </p>
      </div>

      {/* Initiate Call Card */}
      <div className="rounded-xl bg-white p-6 shadow">
        <h2 className="text-lg font-semibold text-gray-800">
          Initiate Outbound Call
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Enter number with country code. India: 91 + 10 digits (e.g. 918208061528 or 8208061528)
        </p>
        <form onSubmit={handleInitiateCall} className="mt-4 flex gap-3">
          <input
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="15551234567"
            className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 text-gray-800 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-indigo-600 px-6 py-2.5 font-medium text-white transition hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? "Calling..." : "Start Call"}
          </button>
        </form>
        {error && (
          <p className="mt-3 text-sm text-red-600">{error}</p>
        )}
        {success && (
          <p className="mt-3 text-sm text-green-600">{success}</p>
        )}
      </div>

      {/* Recent Transcripts */}
      <div className="rounded-xl bg-white p-6 shadow">
        <h2 className="text-lg font-semibold text-gray-800">
          Recent Call Transcripts
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Full conversation history with timestamps
        </p>

        {loadingTranscripts ? (
          <p className="mt-4 text-gray-500">Loading transcripts...</p>
        ) : transcripts.length === 0 ? (
          <p className="mt-4 text-gray-500">No calls yet. Initiate a call above.</p>
        ) : (
          <div className="mt-4 space-y-3">
            {transcripts.map((t) => (
              <div
                key={t.callId}
                className="flex items-center justify-between rounded-lg border border-gray-200 p-4 hover:bg-gray-50"
              >
                <div>
                  <p className="font-medium text-gray-800">{t.phoneNumber}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(t.createdAt).toLocaleString()} • {t.transcript?.length || 0} messages
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      statusColors[t.status] ?? "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {t.status}
                  </span>
                  <button
                    onClick={() => handleViewTranscript(t.callId)}
                    className="rounded-lg bg-indigo-100 px-3 py-1.5 text-sm font-medium text-indigo-700 hover:bg-indigo-200"
                  >
                    View
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Transcript Modal */}
      {selectedTranscript && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Call transcript"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={() => setSelectedTranscript(null)}
          onKeyDown={(e) => e.key === "Escape" && setSelectedTranscript(null)}
          tabIndex={0}
        >
          <div
            role="document"
            className="max-h-[80vh] w-full max-w-2xl overflow-auto rounded-xl bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-800">
                Transcript: {selectedTranscript.phoneNumber}
              </h3>
              <button
                onClick={() => setSelectedTranscript(null)}
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
              >
                ✕
              </button>
            </div>
            <p className="mt-1 text-sm text-gray-500">
              {new Date(selectedTranscript.createdAt).toLocaleString()} •{" "}
              {selectedTranscript.status}
            </p>
            <div className="mt-4 space-y-3">
              {selectedTranscript.transcript?.map((entry) => (
                <div
                  key={`${entry.role}-${entry.timestamp}-${entry.content.slice(0, 20)}`}
                  className={`rounded-lg p-3 ${
                    entry.role === "caller"
                      ? "bg-blue-50 text-blue-900"
                      : "bg-indigo-50 text-indigo-900"
                  }`}
                >
                  <p className="text-xs font-medium uppercase opacity-75">
                    {entry.role}
                  </p>
                  <p className="mt-1">{entry.content}</p>
                  <p className="mt-1 text-xs opacity-75">
                    {new Date(entry.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
