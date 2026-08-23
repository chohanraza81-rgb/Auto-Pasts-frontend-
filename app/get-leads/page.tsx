import LeadForm from '@/components/LeadForm';

export default function GetLeadsPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold">Get 50 Local Leads</h1>
      <p className="mt-2 text-gray-600">Fill out the form and I'll send you leads from drivers in your area.</p>
      <div className="mt-8 bg-white border rounded-lg p-6">
        <LeadForm />
      </div>
    </main>
  );
}
