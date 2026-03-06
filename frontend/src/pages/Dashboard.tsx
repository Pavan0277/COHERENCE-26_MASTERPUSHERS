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
    </div>
  );
}
