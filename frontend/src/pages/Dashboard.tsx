import { Link } from "react-router-dom";

export default function Dashboard() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
      <p className="mt-2 text-gray-500">Welcome back! Here's your overview.</p>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-xl bg-white p-6 shadow">
          <p className="text-sm font-medium text-gray-500">Total Users</p>
          <p className="mt-1 text-2xl font-bold text-gray-800">1,240</p>
        </div>
        <div className="rounded-xl bg-white p-6 shadow">
          <p className="text-sm font-medium text-gray-500">Active Sessions</p>
          <p className="mt-1 text-2xl font-bold text-gray-800">342</p>
        </div>
        <div className="rounded-xl bg-white p-6 shadow">
          <p className="text-sm font-medium text-gray-500">Revenue</p>
          <p className="mt-1 text-2xl font-bold text-gray-800">$12,480</p>
        </div>
      </div>

      {/* Voice Automation Card */}
      <div className="mt-8">
        <Link
          to="/voice"
          className="block rounded-xl border-2 border-dashed border-indigo-200 bg-indigo-50/50 p-6 transition hover:border-indigo-400 hover:bg-indigo-50"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-600 text-white">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">AI Voice Automation</h3>
              <p className="text-sm text-gray-600">
                Initiate AI-controlled outbound calls with VAPI (free tier). Speech recognition, AI conversation, and real-time transcripts.
              </p>
            </div>
            <span className="ml-auto text-indigo-600">→</span>
          </div>
        </Link>
      </div>
    </div>
  );
}
