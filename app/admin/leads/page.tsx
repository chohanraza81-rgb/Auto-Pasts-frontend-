'use client';
import { useState, useEffect } from 'react';

export default function AdminLeads() {
  const [leads, setLeads] = useState([]);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/leads`)
      .then(res => res.json())
      .then(setLeads);
  }, []);

  const exportCSV = () => {
    window.open(`${process.env.NEXT_PUBLIC_API_URL}/api/leads/export`, '_blank');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between">
        <h1 className="text-3xl font-bold">Leads</h1>
        <button onClick={exportCSV} className="bg-primary text-white px-4 py-2 rounded">Export CSV</button>
      </div>
      <table className="w-full mt-6 border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2">Name</th>
            <th className="p-2">Email</th>
            <th className="p-2">Company</th>
            <th className="p-2">Phone</th>
            <th className="p-2">Source</th>
            <th className="p-2">Date</th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead: any) => (
            <tr key={lead.id} className="border-b">
              <td className="p-2">{lead.name}</td>
              <td className="p-2">{lead.email}</td>
              <td className="p-2">{lead.company || '-'}</td>
              <td className="p-2">{lead.phone || '-'}</td>
              <td className="p-2">{lead.source}</td>
              <td className="p-2">{new Date(lead.createdAt).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
