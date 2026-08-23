export default function AdminDashboard() {
  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <p>Welcome to the Admin Panel</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <div className="p-6 bg-white border rounded-lg">Revenue: $0</div>
        <div className="p-6 bg-white border rounded-lg">Traffic: 0</div>
        <div className="p-6 bg-white border rounded-lg">Posts: 0</div>
      </div>
    </main>
  );
}
