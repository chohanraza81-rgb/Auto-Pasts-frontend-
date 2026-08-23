import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-12">
      <div className="max-w-7xl mx-auto px-4 py-8 grid md:grid-cols-3 gap-8">
        <div>
          <h3 className="font-semibold text-lg">Mike's Auto Garage</h3>
          <p className="text-sm text-gray-400">20 years of honest auto repair advice from Toronto.</p>
        </div>
        <div>
          <h4 className="font-semibold">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/about-mike">About Mike</Link></li>
            <li><Link href="/contact">Contact</Link></li>
            <li><Link href="/get-leads">Get Leads</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold">Legal</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/legal/privacy">Privacy Policy</Link></li>
            <li><Link href="/legal/terms">Terms of Service</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-gray-800 text-center py-4 text-sm text-gray-500">
        © {new Date().getFullYear()} Mike's Auto Garage. All rights reserved.
      </div>
    </footer>
  );
}
