import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-white border-b sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        <Link href="/" className="font-bold text-xl">🔧 Mike's Auto Garage</Link>
        <div className="hidden md:flex gap-6">
          <Link href="/" className="hover:text-primary">Home</Link>
          <Link href="/about-mike" className="hover:text-primary">About</Link>
          <Link href="/contact" className="hover:text-primary">Contact</Link>
          <Link href="/get-leads" className="bg-primary text-white px-4 py-2 rounded-md">Get Leads</Link>
        </div>
      </nav>
    </header>
  );
}
