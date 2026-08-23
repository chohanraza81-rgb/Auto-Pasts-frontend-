import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);
  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <p>Welcome, {session?.user?.name}</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <div className="p-6 bg-white border rounded-lg">Revenue: $0</div>
        <div className="p-6 bg-white border rounded-lg">Traffic: 0</div>
        <div className="p-6 bg-white border rounded-lg">Posts: 0</div>
      </div>
    </main>
  );
}
